import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LINHAS_DE_CODIGO } from "./codigo"

/**
 * Motor do protótipo "Ponto e vírgula, planeta": um globo feito de
 * paralelos de código real, em Canvas 2D com atlas de glifos, coreografado
 * pelo GSAP (entrada em timeline, laço no ticker, rolagem no ScrollTrigger).
 */

export type GloboVariante = "media" | "contida" | "ousada"

type Preset = {
  paralelos: number
  periodoS: number
  lanterna: boolean
  pulsosNoMeridiano: boolean
  alfaTexto: number
  nasceNoTitulo: boolean
  achataNaRolagem: boolean
}

const PRESETS: Record<GloboVariante, Preset> = {
  media: {
    paralelos: 36,
    periodoS: 90,
    lanterna: true,
    pulsosNoMeridiano: true,
    alfaTexto: 0.55,
    nasceNoTitulo: false,
    achataNaRolagem: false,
  },
  contida: {
    paralelos: 24,
    periodoS: 120,
    lanterna: false,
    pulsosNoMeridiano: false,
    alfaTexto: 0.4,
    nasceNoTitulo: false,
    achataNaRolagem: false,
  },
  ousada: {
    paralelos: 36,
    periodoS: 90,
    lanterna: true,
    pulsosNoMeridiano: true,
    alfaTexto: 0.55,
    nasceNoTitulo: true,
    achataNaRolagem: true,
  },
}

const INCLINACAO = (18 * Math.PI) / 180
const LATITUDE_MAX = (78 * Math.PI) / 180
const RAIO_LANTERNA = 180
const PULSO_MS = 400
const PULSOS_SIMULTANEOS = 4
const LARANJA = "#f65606"
const AZUL = "#0b5cad"
const PRETO = "#000000"

type Glifo = { ch: string; theta: number; w: number; semicolon: boolean }
type Anel = {
  lat: number
  raio: number
  y: number
  rot: number
  velocidade: number
  /** Desaceleração local pela lanterna (1 = normal). */
  fator: number
  glifos: Glifo[]
  pulsos: number[] // início (ms) do pulso por índice de glifo `;`, ou 0
  ladoAnterior: Float32Array
}

type Atlas = {
  canvas: HTMLCanvasElement
  altura: number
  mapa: Map<string, { x: number; w: number }>
}

export type GloboOpcoes = {
  variante: GloboVariante
  /** Caixa do `;` do título, para a variação ousada nascer dali. */
  ancora: () => DOMRect | null
  /** Seção a que o ScrollTrigger se prende. */
  secao: HTMLElement
  aoFps?: (fps: number) => void
}

function suave(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function envolve(a: number): number {
  // (-π, π]
  const t = (a + Math.PI) % (2 * Math.PI)
  return (t < 0 ? t + 2 * Math.PI : t) - Math.PI
}

function criarAtlas(
  chars: string,
  tamanhoPx: number,
  dpr: number,
  familia: string,
  cor: string,
): Atlas {
  const medida = document.createElement("canvas")
  const mctx = medida.getContext("2d")
  const altura = Math.ceil(tamanhoPx * 1.4 * dpr)
  const fonte = `300 ${tamanhoPx * dpr}px ${familia}`
  const mapa = new Map<string, { x: number; w: number }>()
  let x = 0
  if (!mctx) return { canvas: medida, altura, mapa }
  mctx.font = fonte
  const larguras: number[] = []
  for (const ch of chars) {
    const w = Math.ceil(mctx.measureText(ch).width) + 2 * dpr
    larguras.push(w)
  }
  const total = larguras.reduce((s, w) => s + w, 0)
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, total)
  canvas.height = altura
  const ctx = canvas.getContext("2d")
  if (!ctx) return { canvas, altura, mapa }
  ctx.font = fonte
  ctx.fillStyle = cor
  ctx.textBaseline = "middle"
  let i = 0
  for (const ch of chars) {
    const w = larguras[i] ?? 0
    ctx.fillText(ch, x + dpr, altura / 2)
    mapa.set(ch, { x, w })
    x += w
    i += 1
  }
  return { canvas, altura, mapa }
}

export function montarGlobo(
  canvas: HTMLCanvasElement,
  { variante, ancora, secao, aoFps }: GloboOpcoes,
): () => void {
  const ctx = canvas.getContext("2d", { alpha: true })
  if (!ctx) return () => {}
  gsap.registerPlugin(ScrollTrigger)

  const preset = PRESETS[variante]
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
  const toque = window.matchMedia("(pointer: coarse)").matches
  const dprMax = toque ? 1.5 : 2
  const familia =
    getComputedStyle(document.body).fontFamily || "system-ui, sans-serif"

  let dpr = 1
  let W = 1
  let H = 1
  let R = 100
  let cx = 0
  let cy = 0
  let tamanhoFonte = 12
  let atlasPreto: Atlas | null = null
  let atlasLaranja: Atlas | null = null
  let atlasAzul: Atlas | null = null
  let aneis: Anel[] = []
  let grao: HTMLCanvasElement | null = null

  // Estado animado pelo GSAP.
  const estado = {
    revelacao: 0, // 0..1: paralelos do equador aos polos
    polos: 0, // alfa dos `;` dos polos
    escala: 1, // ousada: nasce pequeno no `;` do título
    deslocX: 0,
    deslocY: 0,
    rolagem: 0, // 0..1 progresso do hero saindo
  }
  const lanterna = { x: -9999, y: -9999, alvoX: -9999, alvoY: -9999 }

  const semente = Math.random()
  const aleatorio = (() => {
    let s = Math.floor(semente * 2147483647) || 1
    return () => {
      s = (s * 48271) % 2147483647
      return s / 2147483647
    }
  })()

  const montarAneis = () => {
    aneis = []
    const n = preset.paralelos
    const chars = new Set<string>()
    for (const linha of LINHAS_DE_CODIGO) for (const ch of linha) chars.add(ch)
    chars.add(" ")
    const todos = [...chars].join("")
    tamanhoFonte = Math.min(13, Math.max(11, R / 24))
    atlasPreto = criarAtlas(todos, tamanhoFonte, dpr, familia, PRETO)
    atlasLaranja = criarAtlas(todos, tamanhoFonte, dpr, familia, LARANJA)
    atlasAzul = criarAtlas(todos, tamanhoFonte, dpr, familia, AZUL)
    const mapa = atlasPreto.mapa
    for (let i = 0; i < n; i += 1) {
      const lat = (i / (n - 1) - 0.5) * 2 * LATITUDE_MAX
      const raio = R * Math.cos(lat)
      const circunferencia = 2 * Math.PI * raio
      const glifos: Glifo[] = []
      let percorrido = 0
      let k = Math.floor(aleatorio() * LINHAS_DE_CODIGO.length)
      // Preenche a circunferência com linhas inteiras separadas por espaço.
      let guarda = 0
      while (percorrido < circunferencia && guarda < 40) {
        const linha = `${LINHAS_DE_CODIGO[k % LINHAS_DE_CODIGO.length] ?? ""}    `
        for (const ch of linha) {
          const w = (mapa.get(ch)?.w ?? 6 * dpr) / dpr
          glifos.push({
            ch,
            theta: percorrido / raio,
            w,
            semicolon: ch === ";",
          })
          percorrido += w
          if (percorrido >= circunferencia) break
        }
        k += 1
        guarda += 1
      }
      // Fecha o anel: o último glifo deve se encaixar no primeiro sem salto.
      const fator = (2 * Math.PI) / Math.max(percorrido / raio, 0.001)
      for (const g of glifos) g.theta *= fator
      aneis.push({
        lat,
        raio,
        y: R * Math.sin(lat),
        rot: aleatorio() * Math.PI * 2,
        velocidade:
          ((2 * Math.PI) / preset.periodoS) * (0.92 + 0.16 * aleatorio()),
        fator: 1,
        glifos,
        pulsos: glifos.map(() => 0),
        ladoAnterior: new Float32Array(glifos.length),
      })
    }
  }

  const montarGrao = () => {
    const tamanho = 96
    const c = document.createElement("canvas")
    c.width = tamanho
    c.height = tamanho
    const g = c.getContext("2d")
    if (!g) return
    const img = g.createImageData(tamanho, tamanho)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 255
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 18
    }
    g.putImageData(img, 0, 0)
    grao = c
  }

  const geometria = () => {
    const caixa = canvas.getBoundingClientRect()
    W = Math.max(1, caixa.width)
    H = Math.max(1, caixa.height)
    dpr = Math.min(window.devicePixelRatio || 1, dprMax)
    const w = Math.round(W * dpr)
    const h = Math.round(H * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    if (W >= 1024) {
      R = 0.31 * H
      cx = W - 0.85 * R
      cy = 0.5 * H
    } else if (W >= 640) {
      R = 0.27 * H
      cx = W - 0.7 * R
      cy = 0.52 * H
    } else {
      R = 0.21 * H
      cx = 0.78 * W
      cy = 0.98 * H
    }
  }

  const redimensionar = () => {
    geometria()
    montarAneis()
  }

  // --- desenho ---------------------------------------------------------------
  const desenharGlifo = (
    atlas: Atlas,
    g: Glifo,
    x: number,
    y: number,
    escala: number,
    alfa: number,
  ) => {
    const m = atlas.mapa.get(g.ch)
    if (!m || g.ch === " ") return
    const w = (m.w / dpr) * escala
    const h = (atlas.altura / dpr) * escala
    ctx.globalAlpha = alfa
    ctx.drawImage(atlas.canvas, m.x, 0, m.w, atlas.altura, x, y - h / 2, w, h)
  }

  const desenhar = (agora: number) => {
    if (!atlasPreto || !atlasLaranja || !atlasAzul) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const esc = estado.escala
    const Rv = R * esc
    const centroX = cx + estado.deslocX
    const centroY = cy + estado.deslocY - estado.rolagem * 0.2 * H
    const curva = 1
    const rotExtra =
      estado.rolagem * Math.PI * (preset.achataNaRolagem ? 1.5 : 0.5)

    // Sombra interna azul no quadrante inferior esquerdo: volume sem luz dura.
    ctx.save()
    ctx.translate(centroX, centroY)
    ctx.rotate(INCLINACAO)
    if (curva > 0.01) {
      ctx.globalAlpha = curva
      const grad = ctx.createRadialGradient(
        -0.35 * Rv,
        0.35 * Rv,
        0,
        -0.1 * Rv,
        0.1 * Rv,
        Rv,
      )
      grad.addColorStop(0, "rgba(11, 92, 173, 0.09)")
      grad.addColorStop(1, "rgba(11, 92, 173, 0)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, Rv, 0, Math.PI * 2)
      ctx.fill()
    }

    // Lanterna em coordenadas do globo (desfaz a inclinação).
    const lx0 = lanterna.x - centroX
    const ly0 = lanterna.y - centroY
    const cosI = Math.cos(-INCLINACAO)
    const sinI = Math.sin(-INCLINACAO)
    const lx = lx0 * cosI - ly0 * sinI
    const ly = lx0 * sinI + ly0 * cosI
    const lanternaAtiva = preset.lanterna && lanterna.x > -9000

    const n = aneis.length
    let pulsosAtivos = 0
    for (const anel of aneis) {
      for (const p of anel.pulsos)
        if (p && agora - p < PULSO_MS) pulsosAtivos += 1
    }

    for (let i = 0; i < n; i += 1) {
      const anel = aneis[i]
      if (!anel) continue
      // Revelação do equador para os polos.
      const fracaoLat = Math.abs(anel.lat) / LATITUDE_MAX
      let alfaAnel = suave((estado.revelacao - fracaoLat) / 0.12)
      // Ousada: ao rolar, os paralelos somem dos polos para o equador.
      if (preset.achataNaRolagem) {
        alfaAnel *= 1 - suave((estado.rolagem * 1.2 - (1 - fracaoLat)) / 0.25)
      }
      if (alfaAnel <= 0) continue

      const raio = anel.raio * esc
      const y = anel.y * esc
      // Frente do anel (λ = π/2) em coordenadas do globo, para a lanterna.
      let fatorVelocidade = 1
      if (lanternaAtiva) {
        const d = Math.hypot(lx - 0, ly - y)
        fatorVelocidade = 1 - 0.4 * (1 - suave((d - 60) / RAIO_LANTERNA))
      }

      for (let k = 0; k < anel.glifos.length; k += 1) {
        const g = anel.glifos[k]
        if (!g) continue
        const lambda = g.theta + anel.rot + rotExtra
        const lf = envolve(lambda - Math.PI / 2)
        const xCurvo = -raio * Math.cos(lambda)
        const z = raio * Math.sin(lambda)
        // Achatamento (ousada): o anel vira uma linha reta pelo comprimento do arco.
        const xReto = -lf * raio
        const x = xCurvo * curva + xReto * (1 - curva)
        const profundidade = z / Math.max(raio, 1)
        const alfaCurvo = suave((profundidade + 0.02) / 0.6)
        const alfaReto = suave(1 - Math.abs(xReto) / (1.7 * Rv))
        const alfa = (alfaCurvo * curva + alfaReto * (1 - curva)) * alfaAnel
        if (alfa <= 0.01) continue
        const escalaGlifo = 0.72 + 0.33 * (profundidade * curva + (1 - curva))

        // Cruzamento do meridiano pelo `;`: acende em laranja por 400 ms.
        if (g.semicolon) {
          const lado = lf >= 0 ? 1 : -1
          const anterior = anel.ladoAnterior[k] ?? 0
          if (
            preset.pulsosNoMeridiano &&
            anterior < 0 &&
            lado > 0 &&
            Math.abs(lf) < 0.3 &&
            pulsosAtivos < PULSOS_SIMULTANEOS
          ) {
            anel.pulsos[k] = agora
            pulsosAtivos += 1
          }
          anel.ladoAnterior[k] = lado
        }

        let atlas = atlasPreto
        let alfaFinal = alfa * preset.alfaTexto
        if (g.semicolon) {
          const inicio = anel.pulsos[k] ?? 0
          const decorrido = agora - inicio
          if (inicio && decorrido < PULSO_MS) {
            atlas = atlasLaranja
            alfaFinal = alfa * (1 - (decorrido / PULSO_MS) * 0.3)
          }
        } else if (g.ch === '"' || g.ch === "'" || g.ch === "`") {
          atlas = atlasAzul
        }

        // Lanterna: perto do cursor o código fica legível.
        if (lanternaAtiva) {
          const d = Math.hypot(lx - x, ly - y)
          const foco = 1 - suave((d - 40) / RAIO_LANTERNA)
          if (foco > 0) alfaFinal = alfaFinal + (alfa - alfaFinal) * foco
        }

        desenharGlifo(
          atlas,
          g,
          x - (g.w * escalaGlifo) / 2,
          y,
          escalaGlifo,
          alfaFinal,
        )
      }

      anel.fator = fatorVelocidade
    }

    // Polos: dois `;` grandes, laranja, respirando.
    if (estado.polos > 0.01) {
      const respira = 1 + 0.03 * (1 + Math.sin((agora / 6000) * Math.PI * 2))
      const tamanho = Rv * 0.2 * respira
      ctx.font = `700 ${tamanho}px ${familia}`
      ctx.fillStyle = LARANJA
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.globalAlpha = estado.polos * curva
      ctx.fillText(";", 0, -Rv * 1.04)
      ctx.fillText(";", 0, Rv * 1.04)
    }
    ctx.restore()

    // Grão leve só na área do globo.
    if (grao && curva > 0.01) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(centroX, centroY, Rv * 1.08, 0, Math.PI * 2)
      ctx.clip()
      ctx.globalAlpha = 0.22 * curva
      ctx.globalCompositeOperation = "multiply"
      const dx = (agora / 50) % 96
      const dy = (agora / 37) % 96
      const x0 = centroX - Rv * 1.3
      const y0 = centroY - Rv * 1.3
      for (let yy = -96; yy < Rv * 2.6 + 96; yy += 96) {
        for (let xx = -96; xx < Rv * 2.6 + 96; xx += 96) {
          ctx.drawImage(grao, x0 + xx - dx, y0 + yy - dy)
        }
      }
      ctx.globalCompositeOperation = "source-over"
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  // --- laço ------------------------------------------------------------------
  let ultimo = 0
  let quadros = 0
  let marcaFps = 0
  let ativo = true
  let naTela = true
  let laco: ((tempo: number, dt: number) => void) | null = null

  const passo = () => {
    const agora = performance.now()
    const dt = ultimo ? Math.min(0.1, (agora - ultimo) / 1000) : 0
    ultimo = agora
    for (const anel of aneis) anel.rot += anel.velocidade * anel.fator * dt
    const k = 1 - Math.pow(0.001, dt) // ~300 ms de inércia
    lanterna.x += (lanterna.alvoX - lanterna.x) * k
    lanterna.y += (lanterna.alvoY - lanterna.y) * k
    desenhar(agora)
    quadros += 1
    if (agora - marcaFps >= 1000) {
      aoFps?.(quadros)
      quadros = 0
      marcaFps = agora
    }
  }

  const acordar = () => {
    if (laco || !ativo || !naTela || reduzido.matches) return
    ultimo = 0
    laco = passo
    gsap.ticker.add(laco)
  }
  const dormir = () => {
    if (laco) gsap.ticker.remove(laco)
    laco = null
  }

  // --- entrada ---------------------------------------------------------------
  const linha = gsap.timeline({ paused: true })
  if (preset.nasceNoTitulo) {
    const caixa = ancora()
    if (caixa) {
      const c = canvas.getBoundingClientRect()
      estado.escala = 0.04
      estado.deslocX = caixa.left + caixa.width / 2 - c.left - cx
      estado.deslocY = caixa.top + caixa.height / 2 - c.top - cy
      linha.to(
        estado,
        {
          escala: 1,
          deslocX: 0,
          deslocY: 0,
          duration: 0.9,
          ease: "expo.out",
        },
        0.25,
      )
    }
  }
  linha.to(estado, { revelacao: 1, duration: 1.3, ease: "power2.out" }, 0)
  linha.to(estado, { polos: 1, duration: 0.3, ease: "power1.out" }, 1.3)

  const gatilho = ScrollTrigger.create({
    trigger: secao,
    start: "top top",
    end: "bottom top",
    scrub: 0.6,
    onUpdate: (self) => {
      estado.rolagem = self.progress
      if (reduzido.matches) desenhar(performance.now())
    },
  })

  // --- eventos ---------------------------------------------------------------
  const aoMover = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const c = canvas.getBoundingClientRect()
    lanterna.alvoX = e.clientX - c.left
    lanterna.alvoY = e.clientY - c.top
  }
  const aoSair = () => {
    lanterna.alvoX = -9999
    lanterna.alvoY = -9999
  }
  const aoVisibilidade = () => {
    ativo = document.visibilityState === "visible"
    if (ativo) acordar()
    else dormir()
  }
  const observadorTela = new IntersectionObserver(
    (entradas) => {
      naTela = entradas.some((en) => en.isIntersecting)
      if (naTela) acordar()
      else dormir()
    },
    { threshold: 0 },
  )
  let esperaResize = 0
  const observadorTamanho = new ResizeObserver(() => {
    window.clearTimeout(esperaResize)
    esperaResize = window.setTimeout(() => {
      redimensionar()
      if (reduzido.matches) desenhar(performance.now())
    }, 120)
  })
  const aoMudarMovimento = () => {
    if (reduzido.matches) {
      dormir()
      estado.revelacao = 1
      estado.polos = 1
      estado.escala = 1
      estado.deslocX = 0
      estado.deslocY = 0
      desenhar(performance.now())
    } else {
      acordar()
    }
  }

  // --- início ----------------------------------------------------------------
  redimensionar()
  montarGrao()
  if (toque) {
    lanterna.alvoX = cx
    lanterna.alvoY = cy
    lanterna.x = cx
    lanterna.y = cy
  }
  if (reduzido.matches) {
    aoMudarMovimento()
  } else {
    linha.play()
    acordar()
  }

  window.addEventListener("pointermove", aoMover, { passive: true })
  document.addEventListener("pointerleave", aoSair)
  document.addEventListener("visibilitychange", aoVisibilidade)
  reduzido.addEventListener("change", aoMudarMovimento)
  observadorTela.observe(canvas)
  observadorTamanho.observe(canvas)

  return () => {
    dormir()
    linha.kill()
    gatilho.kill()
    window.clearTimeout(esperaResize)
    window.removeEventListener("pointermove", aoMover)
    document.removeEventListener("pointerleave", aoSair)
    document.removeEventListener("visibilitychange", aoVisibilidade)
    reduzido.removeEventListener("change", aoMudarMovimento)
    observadorTela.disconnect()
    observadorTamanho.disconnect()
  }
}
