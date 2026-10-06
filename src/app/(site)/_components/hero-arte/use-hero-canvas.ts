"use client"

import { useEffect, type RefObject } from "react"
import { HERO_ARTE, type HeroIntensidade } from "./config"
import { variavelParaOklab, type Oklab } from "./oklab"
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shader"

/** Posição do `;` em frações da caixa do canvas (x da esquerda, y de cima). */
export type HeroAncora = { x: number; y: number }

export type HeroCanvasOpcoes = {
  intensidade: HeroIntensidade
  /** Função para a âncora poder depender da proporção da tela. */
  ancora: (largura: number, altura: number) => HeroAncora
}

/**
 * Estado gravado em `data-estado` no próprio canvas, para o CSS fazer o
 * crossfade sem passar por estado React:
 * - "iniciando": ainda sem primeiro quadro (o gradiente CSS aparece);
 * - "pronto": arte na tela;
 * - "fallback": sem WebGL, com saveData ou aparelho fraco — fica o gradiente.
 */
export type HeroCanvasEstado = "iniciando" | "pronto" | "fallback"

const UNIFORMS = [
  "u_res",
  "u_angulo",
  "u_semente",
  "u_ponteiro",
  "u_ancora",
  "u_revelacao",
  "u_velocidade",
  "u_dobra",
  "u_azul",
  "u_grao",
  "u_forcaPonteiro",
  "u_grade",
  "u_cBase",
  "u_cTinta",
  "u_cPedra",
  "u_cAzul",
  "u_cLaranja",
  "u_cInk",
] as const

type Uniforms = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>

type NavegadorComDicas = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

function compilar(
  gl: WebGLRenderingContext,
  tipo: number,
  fonte: string,
): WebGLShader | null {
  const shader = gl.createShader(tipo)
  if (!shader) return null
  gl.shaderSource(shader, fonte)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("hero-arte: shader", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function montarPrograma(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compilar(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vs || !fs) return null
  const programa = gl.createProgram()
  if (!programa) return null
  gl.attachShader(programa, vs)
  gl.attachShader(programa, fs)
  gl.linkProgram(programa)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    console.error("hero-arte: programa", gl.getProgramInfoLog(programa))
    gl.deleteProgram(programa)
    return null
  }
  return programa
}

function lerCores(): Record<keyof typeof HERO_ARTE.cores, Oklab> {
  const c = HERO_ARTE.cores
  return {
    base: variavelParaOklab(c.base, "#ffffff"),
    tinta: variavelParaOklab(c.tinta, "#eef5fc"),
    pedra: variavelParaOklab(c.pedra, "#ededea"),
    azul: variavelParaOklab(c.azul, "#0b5cad"),
    laranja: variavelParaOklab(c.laranja, "#f65606"),
    ink: variavelParaOklab(c.ink, "#000000"),
  }
}

function suavizar(t: number): number {
  // ease-out expo: começa rápido e assenta devagar, como a curva da marca.
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Anima a arte generativa num canvas WebGL. Tudo imperativo, dentro de um
 * único efeito: o React não participa de nenhum quadro.
 *
 * - Resolução interna reduzida (HERO_ARTE.escala) e DPR limitado.
 * - Laço pausado fora da tela (IntersectionObserver) e com a aba oculta.
 * - Qualidade adaptativa: reduz a escala interna se os quadros ficarem lentos.
 * - prefers-reduced-motion: um único quadro estático, já revelado.
 * - Fallback para o gradiente CSS sem WebGL, com saveData ou aparelho fraco.
 * - Perda de contexto e resize (ResizeObserver com espera) tratados.
 * - Recursos liberados ao desmontar.
 */
export function useHeroCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  { intensidade, ancora }: HeroCanvasOpcoes,
): void {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const marcar = (estado: HeroCanvasEstado) => {
      canvas.dataset.estado = estado
    }

    const navegador = navigator as NavegadorComDicas
    const fraco =
      navegador.deviceMemory !== undefined && navegador.deviceMemory <= 1
    if (navegador.connection?.saveData || fraco) {
      marcar("fallback")
      return
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    })
    if (!gl) {
      marcar("fallback")
      return
    }

    const preset = HERO_ARTE.presets[intensidade]
    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )
    const toque = window.matchMedia("(pointer: coarse)").matches
    const dprMax = toque ? HERO_ARTE.dprMaxToque : HERO_ARTE.dprMax

    // Semente só no cliente: cada visita parte de uma composição diferente,
    // e o servidor nunca a vê (sem erro de hidratação).
    const semente = Math.random()

    let programa: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let uniforms: Uniforms | null = null
    let cores = lerCores()

    let escala: number = HERO_ARTE.escala
    let largura = 1
    let altura = 1
    let raf = 0
    let visivel = true
    let naTela = true
    let perdido = false
    let lentos = 0
    let ultimo = 0
    const inicio = performance.now()

    const ponteiro = { x: -10, y: -10, alvoX: -10, alvoY: -10 }

    const preparar = (): boolean => {
      programa = montarPrograma(gl)
      if (!programa) return false
      buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      // Um triângulo que cobre o clip space inteiro.
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      )
      gl.useProgram(programa)
      const pos = gl.getAttribLocation(programa, "a_pos")
      gl.enableVertexAttribArray(pos)
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
      const prog = programa
      uniforms = Object.fromEntries(
        UNIFORMS.map((nome) => [nome, gl.getUniformLocation(prog, nome)]),
      ) as Uniforms

      const u = uniforms
      gl.uniform1f(u.u_semente, semente)
      gl.uniform1f(u.u_velocidade, preset.velocidade)
      gl.uniform1f(u.u_dobra, preset.dobra)
      gl.uniform1f(u.u_azul, preset.azul)
      gl.uniform1f(u.u_grao, preset.grao)
      gl.uniform1f(u.u_forcaPonteiro, preset.ponteiro)
      gl.uniform1f(u.u_grade, preset.grade)
      aplicarCores()
      return true
    }

    const aplicarCores = () => {
      if (!uniforms) return
      gl.uniform3fv(uniforms.u_cBase, cores.base)
      gl.uniform3fv(uniforms.u_cTinta, cores.tinta)
      gl.uniform3fv(uniforms.u_cPedra, cores.pedra)
      gl.uniform3fv(uniforms.u_cAzul, cores.azul)
      gl.uniform3fv(uniforms.u_cLaranja, cores.laranja)
      gl.uniform3fv(uniforms.u_cInk, cores.ink)
    }

    const redimensionar = () => {
      const caixa = canvas.getBoundingClientRect()
      largura = Math.max(1, caixa.width)
      altura = Math.max(1, caixa.height)
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax)
      const w = Math.max(1, Math.round(largura * dpr * escala))
      const h = Math.max(1, Math.round(altura * dpr * escala))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      if (uniforms) gl.uniform2f(uniforms.u_res, w, h)
    }

    const desenhar = (agora: number) => {
      if (!uniforms) return
      const decorrido = (agora - inicio) / 1000
      const angulo = ((decorrido / HERO_ARTE.periodoS) % 1) * Math.PI * 2
      const revelacao = movimentoReduzido.matches
        ? 1
        : suavizar((agora - inicio) / HERO_ARTE.revelacaoMs)
      const aspecto = largura / altura
      const a = ancora(largura, altura)

      gl.uniform1f(uniforms.u_angulo, angulo)
      gl.uniform1f(uniforms.u_revelacao, revelacao)
      gl.uniform2f(uniforms.u_ancora, a.x * aspecto, 1 - a.y)
      gl.uniform2f(uniforms.u_ponteiro, ponteiro.x, ponteiro.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (canvas.dataset.estado !== "pronto") marcar("pronto")
    }

    const continuar = () => visivel && naTela && !perdido

    const quadro = (agora: number) => {
      raf = 0
      if (!continuar()) return

      // Qualidade adaptativa pelo tempo entre quadros.
      const dt = ultimo ? agora - ultimo : 0
      ultimo = agora
      if (dt > HERO_ARTE.quadroLentoMs && dt < 500) {
        lentos += 1
        if (
          lentos >= HERO_ARTE.framesLentos &&
          escala > HERO_ARTE.escalaMinima
        ) {
          escala = Math.max(HERO_ARTE.escalaMinima, escala * 0.7)
          lentos = 0
          redimensionar()
        }
      } else {
        lentos = 0
      }

      const k = HERO_ARTE.amortecimentoPonteiro
      ponteiro.x += (ponteiro.alvoX - ponteiro.x) * k
      ponteiro.y += (ponteiro.alvoY - ponteiro.y) * k

      desenhar(agora)

      if (movimentoReduzido.matches) return
      raf = requestAnimationFrame(quadro)
    }

    const acordar = () => {
      if (raf || !continuar()) return
      ultimo = 0
      raf = requestAnimationFrame(quadro)
    }

    const dormir = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    // --- ponteiro ------------------------------------------------------------
    const aoMover = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse") return
      const caixa = canvas.getBoundingClientRect()
      ponteiro.alvoX = (evento.clientX - caixa.left) / Math.max(1, caixa.height)
      ponteiro.alvoY =
        1 - (evento.clientY - caixa.top) / Math.max(1, caixa.height)
    }
    const aoSair = () => {
      ponteiro.alvoX = -10
      ponteiro.alvoY = -10
    }

    // --- visibilidade --------------------------------------------------------
    const aoVisibilidade = () => {
      visivel = document.visibilityState === "visible"
      if (visivel) acordar()
      else dormir()
    }
    const observadorTela = new IntersectionObserver(
      (entradas) => {
        naTela = entradas.some((entrada) => entrada.isIntersecting)
        if (naTela) acordar()
        else dormir()
      },
      { threshold: 0 },
    )

    // --- resize --------------------------------------------------------------
    let esperaResize = 0
    const observadorTamanho = new ResizeObserver(() => {
      window.clearTimeout(esperaResize)
      esperaResize = window.setTimeout(() => {
        redimensionar()
        cores = lerCores()
        aplicarCores()
        if (movimentoReduzido.matches) desenhar(performance.now())
      }, HERO_ARTE.esperaResizeMs)
    })

    // --- movimento reduzido: um quadro estático; se mudar, retoma ----------
    const aoMudarMovimento = () => {
      if (movimentoReduzido.matches) {
        dormir()
        desenhar(performance.now())
      } else {
        acordar()
      }
    }

    // --- perda de contexto ---------------------------------------------------
    const aoPerder = (evento: Event) => {
      evento.preventDefault()
      perdido = true
      dormir()
      marcar("iniciando")
    }
    const aoRestaurar = () => {
      perdido = false
      uniforms = null
      if (!preparar()) {
        marcar("fallback")
        return
      }
      redimensionar()
      acordar()
    }

    if (!preparar()) {
      marcar("fallback")
      return
    }
    redimensionar()

    canvas.addEventListener("webglcontextlost", aoPerder)
    canvas.addEventListener("webglcontextrestored", aoRestaurar)
    window.addEventListener("pointermove", aoMover, { passive: true })
    document.addEventListener("pointerleave", aoSair)
    document.addEventListener("visibilitychange", aoVisibilidade)
    movimentoReduzido.addEventListener("change", aoMudarMovimento)
    observadorTela.observe(canvas)
    observadorTamanho.observe(canvas)

    visivel = document.visibilityState === "visible"
    acordar()

    return () => {
      dormir()
      window.clearTimeout(esperaResize)
      canvas.removeEventListener("webglcontextlost", aoPerder)
      canvas.removeEventListener("webglcontextrestored", aoRestaurar)
      window.removeEventListener("pointermove", aoMover)
      document.removeEventListener("pointerleave", aoSair)
      document.removeEventListener("visibilitychange", aoVisibilidade)
      movimentoReduzido.removeEventListener("change", aoMudarMovimento)
      observadorTela.disconnect()
      observadorTamanho.disconnect()
      if (buffer) gl.deleteBuffer(buffer)
      if (programa) gl.deleteProgram(programa)
      // Só libera o contexto quando o canvas saiu do DOM de verdade. No
      // modo estrito do React (dev) o efeito roda duas vezes no mesmo
      // canvas, e um contexto perdido voltaria do getContext já inutilizado.
      if (!canvas.isConnected) {
        gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    }
  }, [ref, intensidade, ancora])
}
