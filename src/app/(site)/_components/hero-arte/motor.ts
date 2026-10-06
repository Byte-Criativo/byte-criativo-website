import { HERO_ARTE, type HeroIntensidade } from "./config"
import { variavelParaOklab, type Oklab } from "./oklab"
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shader"
import type { HeroCanvasEstado } from "./use-hero-canvas"

/**
 * Motor da arte: tudo que toca WebGL vive aqui e só é importado no início
 * ocioso (ver use-hero-canvas.ts), para o código do shader e do laço não
 * entrar na tarefa de hidratação da página.
 */

export type MotorOpcoes = {
  intensidade: HeroIntensidade
  ancoraSeletor: string
  marcar: (estado: HeroCanvasEstado) => void
}

const UNIFORMS = [
  "u_res",
  "u_angulo",
  "u_semente",
  "u_ponteiro",
  "u_ancora",
  "u_revelacao",
  "u_rolagem",
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

type CompilacaoParalela = { COMPLETION_STATUS_KHR: number } | null

type Programa = {
  programa: WebGLProgram
  vs: WebGLShader
  fs: WebGLShader
}

/**
 * Dispara compilação e link SEM consultar o resultado: consultar
 * COMPILE_STATUS/LINK_STATUS obriga a thread principal a esperar o driver,
 * e a compilação de um fragment shader pode levar centenas de ms em GPU
 * integrada ou celular. Com KHR_parallel_shader_compile o driver compila
 * em paralelo e `programaPronto` só pergunta se já terminou.
 */
function iniciarPrograma(gl: WebGLRenderingContext): Programa | null {
  const vs = gl.createShader(gl.VERTEX_SHADER)
  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  const programa = gl.createProgram()
  if (!vs || !fs || !programa) return null
  gl.shaderSource(vs, VERTEX_SHADER)
  gl.shaderSource(fs, FRAGMENT_SHADER)
  gl.compileShader(vs)
  gl.compileShader(fs)
  gl.attachShader(programa, vs)
  gl.attachShader(programa, fs)
  gl.linkProgram(programa)
  return { programa, vs, fs }
}

function programaPronto(
  gl: WebGLRenderingContext,
  { programa, vs, fs }: Programa,
  paralelo: CompilacaoParalela,
): "pendente" | "ok" | "erro" {
  if (
    paralelo &&
    !gl.getProgramParameter(programa, paralelo.COMPLETION_STATUS_KHR)
  ) {
    return "pendente"
  }
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    console.error(
      "hero-arte: programa",
      gl.getProgramInfoLog(programa),
      gl.getShaderInfoLog(vs),
      gl.getShaderInfoLog(fs),
    )
    return "erro"
  }
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  return "ok"
}

/** Renderizadores por software: sem aceleração, a arte custaria a CPU toda. */
const RENDERIZADOR_POR_SOFTWARE = /swiftshader|llvmpipe|softpipe|software/i

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
 * Monta a arte num canvas que JÁ está no DOM e devolve a função de
 * desmontagem. Chamado uma vez, no início ocioso.
 */
export function montarMotor(
  canvas: HTMLCanvasElement,
  { intensidade, ancoraSeletor, marcar }: MotorOpcoes,
): () => void {
  // O contexto só é criado no início ocioso (ver `iniciar`): criar o
  // contexto e o primeiro buffer de desenho é a parte cara, e não deve
  // cair na hidratação.
  // Atribuição definitiva: todo closure abaixo só roda depois de
  // `criarContexto` ter sucesso (a limpeza confere antes de usar).
  let gl!: WebGLRenderingContext
  let paralelo: CompilacaoParalela = null
  const criarContexto = (): boolean => {
    const contexto = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    })
    if (!contexto) return false
    const depuracao = contexto.getExtension("WEBGL_debug_renderer_info")
    const renderizador = depuracao
      ? String(contexto.getParameter(depuracao.UNMASKED_RENDERER_WEBGL))
      : ""
    if (RENDERIZADOR_POR_SOFTWARE.test(renderizador)) return false
    gl = contexto
    paralelo = contexto.getExtension(
      "KHR_parallel_shader_compile",
    ) as CompilacaoParalela
    return true
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

  let programa: Programa | null = null
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
  // Menor intervalo entre quadros visto até agora: aproxima o período do
  // monitor (16,7 ms a 60 Hz, 33 ms a 30 Hz), para um monitor lento não ser
  // confundido com uma GPU lenta.
  let menorDt = Number.POSITIVE_INFINITY
  let inicio = performance.now()
  let caixa = canvas.getBoundingClientRect()
  let elementoAncora: Element | null = null
  let ancoraX = 0.3
  let ancoraY = 0.5
  let quadros = 0

  const ponteiro = { x: -10, y: -10, alvoX: -10, alvoY: -10 }

  /** Dispara a compilação; o programa só entra em uso em `concluir`. */
  const preparar = (): boolean => {
    programa = iniciarPrograma(gl)
    if (!programa) return false
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // Um triângulo que cobre o clip space inteiro.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    return true
  }

  /** Programa linkado: liga atributos e uniforms e zera o relógio da arte. */
  const concluir = (prog: WebGLProgram) => {
    gl.useProgram(prog)
    const pos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    uniforms = Object.fromEntries(
      UNIFORMS.map((nome) => [nome, gl.getUniformLocation(prog, nome)]),
    ) as Uniforms
    inicio = performance.now()

    const u = uniforms
    gl.uniform1f(u.u_semente, semente)
    gl.uniform1f(u.u_velocidade, preset.velocidade)
    gl.uniform1f(u.u_dobra, preset.dobra)
    gl.uniform1f(u.u_azul, preset.azul)
    gl.uniform1f(u.u_grao, preset.grao)
    gl.uniform1f(u.u_forcaPonteiro, preset.ponteiro)
    gl.uniform1f(u.u_grade, preset.grade)
    aplicarCores()
    gl.uniform2f(u.u_res, canvas.width, canvas.height)
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

  const localizarAncora = () => {
    elementoAncora =
      canvas.parentElement?.querySelector(ancoraSeletor) ??
      document.querySelector(ancoraSeletor)
  }

  const redimensionar = () => {
    caixa = canvas.getBoundingClientRect()
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
    // Posição do `;` e quanto do hero já rolou para fora, ambos lidos da
    // geometria atual (sem listener de rolagem: o laço já roda por quadro).
    caixa = canvas.getBoundingClientRect()
    const alturaCaixa = Math.max(1, caixa.height)
    // O `;` só muda de lugar em reflow: medir a cada poucos quadros basta
    // e poupa a thread principal.
    if (quadros % HERO_ARTE.quadrosPorMedidaDaAncora === 0) {
      if (!elementoAncora?.isConnected) localizarAncora()
      if (elementoAncora) {
        const r = elementoAncora.getBoundingClientRect()
        ancoraX = (r.left + r.width / 2 - caixa.left) / alturaCaixa
        ancoraY = 1 - (r.top + r.height / 2 - caixa.top) / alturaCaixa
      } else {
        ancoraX = 0.3 * (largura / altura)
        ancoraY = 0.5
      }
    }
    quadros += 1
    const rolagem = Math.min(1, Math.max(0, -caixa.top / alturaCaixa))

    gl.uniform1f(uniforms.u_angulo, angulo)
    gl.uniform1f(uniforms.u_revelacao, revelacao)
    gl.uniform1f(uniforms.u_rolagem, rolagem)
    gl.uniform2f(uniforms.u_ancora, ancoraX, ancoraY)
    gl.uniform2f(uniforms.u_ponteiro, ponteiro.x, ponteiro.y)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (canvas.dataset.estado !== "pronto") marcar("pronto")
  }

  const continuar = () => visivel && naTela && !perdido

  const quadro = (agora: number) => {
    raf = 0
    if (!continuar()) return

    // Enquanto o driver compila, só espera (um quadro por vez, sem
    // bloquear a thread principal).
    if (!uniforms) {
      if (!programa) return
      const estado = programaPronto(gl, programa, paralelo)
      if (estado === "pendente") {
        raf = requestAnimationFrame(quadro)
        return
      }
      if (estado === "erro") {
        marcar("fallback")
        return
      }
      concluir(programa.programa)
      ultimo = 0
    }

    // Qualidade adaptativa pelo tempo entre quadros, relativo ao período
    // do monitor (ver menorDt).
    const dt = ultimo ? agora - ultimo : 0
    ultimo = agora
    if (dt > 0 && dt < menorDt) menorDt = dt
    // Período do monitor limitado a ~30 Hz: se até os primeiros quadros
    // forem lentos, a culpa é da GPU, não do monitor.
    const limiteLento = Math.max(
      HERO_ARTE.quadroLentoMs,
      Math.min(menorDt, HERO_ARTE.periodoMonitorMaxMs) *
        HERO_ARTE.fatorQuadroLento,
    )
    if (dt > limiteLento && dt < 500) {
      lentos += 1
      if (lentos >= HERO_ARTE.framesLentos && escala > HERO_ARTE.escalaMinima) {
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

  if (!criarContexto() || !preparar()) {
    marcar("fallback")
    return () => {}
  }
  redimensionar()
  localizarAncora()
  canvas.addEventListener("webglcontextlost", aoPerder)
  canvas.addEventListener("webglcontextrestored", aoRestaurar)
  visivel = document.visibilityState === "visible"
  acordar()

  window.addEventListener("pointermove", aoMover, { passive: true })
  document.addEventListener("pointerleave", aoSair)
  document.addEventListener("visibilitychange", aoVisibilidade)
  movimentoReduzido.addEventListener("change", aoMudarMovimento)
  observadorTela.observe(canvas)
  observadorTamanho.observe(canvas)

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
    if (programa) gl.deleteProgram(programa.programa)
    // Só libera o contexto quando o canvas saiu do DOM de verdade. No
    // modo estrito do React (dev) o efeito roda duas vezes no mesmo
    // canvas, e um contexto perdido voltaria do getContext já inutilizado.
    if (!canvas.isConnected) {
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }
}
