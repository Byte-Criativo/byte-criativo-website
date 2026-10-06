import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LINHAS_DE_CODIGO } from "./codigo"
import { GLOBO as CONFIG, type GloboVariante } from "./config"
import type { HeroCanvasEstado } from "./use-hero-canvas"

/**
 * Motor do hero "Ponto e vírgula, planeta": um globo feito de paralelos de
 * código real, em Canvas 2D com atlas de glifos, coreografado pelo GSAP
 * (entrada em timeline, laço no ticker, rolagem no ScrollTrigger). Importado
 * de forma tardia pelo hook, depois do `load`, em momento ocioso.
 *
 * Tridimensionalidade: cada glifo vive numa esfera unitária (latitude do
 * paralelo, longitude ao longo do anel). A cada quadro a esfera passa por
 * uma matriz de rotação (giro do anel, inclinação do eixo, precessão e
 * parallax do ponteiro) e por uma projeção em perspectiva. O glifo é
 * desenhado tangente à superfície: a largura e a inclinação na tela vêm da
 * projeção de dois pontos do anel, então o encurtamento perto do horizonte
 * é o da geometria, não um truque. O hemisfério de trás é desenhado
 * primeiro, muito fraco; a frente por cima.
 */

type Glifo = { ch: string; theta: number; dTheta: number; semicolon: boolean }
type Anel = {
  lat: number
  /** Raio do paralelo na esfera unitária. */
  r: number
  /** Altura do paralelo na esfera unitária (positivo = sul, para baixo). */
  y: number
  rot: number
  velocidade: number
  fator: number
  glifos: Glifo[]
  pulsos: number[]
  ladoAnterior: Float32Array
}

type Atlas = {
  canvas: HTMLCanvasElement
  altura: number
  mapa: Map<string, { x: number; w: number }>
}

type Preset = (typeof CONFIG.presets)[GloboVariante]

export type GloboOpcoes = {
  variante: GloboVariante
  /** Caixa do `;` do título, para a variação ousada nascer dali. */
  ancora: () => DOMRect | null
  /**
   * Seção do hero: o ScrollTrigger se prende a ela e `data-entrada="curta"`
   * (gravado pela ilha HeroCena) pede a versão curta da entrada.
   */
  secao: HTMLElement
  /** Grava o estado do canvas (crossfade por CSS). */
  marcar: (estado: HeroCanvasEstado) => void
  aoFps?: (fps: number) => void
}

const GRAUS = Math.PI / 180

/** Renderizadores por software: sem aceleração, o globo fica estático. */
const RENDERIZADOR_POR_SOFTWARE = /swiftshader|llvmpipe|softpipe|software/i

/**
 * Pergunta a um contexto WebGL descartável quem está renderizando. Sem
 * WebGL ou com renderizador por software, o Canvas 2D também está em
 * software, e animar 60 vezes por segundo custaria a CPU inteira.
 */
function temAceleracaoGrafica(): boolean {
  const c = document.createElement("canvas")
  const gl = c.getContext("webgl")
  if (!gl) return false
  const info = gl.getExtension("WEBGL_debug_renderer_info")
  const renderizador = info
    ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
    : String(gl.getParameter(gl.RENDERER))
  gl.getExtension("WEBGL_lose_context")?.loseContext()
  return !RENDERIZADOR_POR_SOFTWARE.test(renderizador)
}

/** Agenda num momento ocioso (com teto) e devolve o cancelamento. */
function ocioso(fn: () => void, tetoMs: number): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => fn(), { timeout: tetoMs })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(fn, 0)
  return () => window.clearTimeout(id)
}

function suave(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function envolve(a: number): number {
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
    larguras.push(Math.ceil(mctx.measureText(ch).width) + 2 * dpr)
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

/** Matriz 3×3 em linha (row-major). */
type Mat = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

function rotX(a: number): Mat {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [1, 0, 0, 0, c, -s, 0, s, c]
}
function rotY(a: number): Mat {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [c, 0, s, 0, 1, 0, -s, 0, c]
}
function rotZ(a: number): Mat {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [c, -s, 0, s, c, 0, 0, 0, 1]
}
function mul(a: Mat, b: Mat): Mat {
  const o: number[] = []
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1) {
      o.push(
        (a[i * 3] ?? 0) * (b[j] ?? 0) +
          (a[i * 3 + 1] ?? 0) * (b[3 + j] ?? 0) +
          (a[i * 3 + 2] ?? 0) * (b[6 + j] ?? 0),
      )
    }
  return o as Mat
}

export function montarGlobo(
  canvas: HTMLCanvasElement,
  { variante, ancora, secao, marcar, aoFps }: GloboOpcoes,
): () => void {
  const ctx = canvas.getContext("2d", { alpha: true })
  if (!ctx) {
    marcar("fallback")
    return () => {}
  }
  gsap.registerPlugin(ScrollTrigger)

  const preset: Preset = CONFIG.presets[variante]
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)")
  const toque = window.matchMedia("(pointer: coarse)").matches
  const dprToque = toque ? 1.5 : 2
  // Animar ou não. Começa pelo renderizador (por software, fica estático),
  // mas o Firefox mascara o nome do renderizador por privacidade: por isso o
  // custo medido dos primeiros quadros também pode desligar a animação (ver
  // `adaptar`).
  let animar = temAceleracaoGrafica()
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
  // Zona calma do texto, em px do canvas (caixa do bloco de conteúdo).
  const calma = {
    l: 0,
    t: 0,
    r: 0,
    b: 0,
    cx: 0,
    cy: 0,
    rx: 1,
    ry: 1,
    ativa: false,
  }
  // Caixa do `;` do título em px do canvas: ganha um halo branco por trás.
  const ponto = { x: 0, y: 0, r: 0, ativo: false }
  // Qualidade adaptativa (ver CONFIG.desempenho).
  const DESEMPENHO = CONFIG.desempenho
  let degrau: number = DESEMPENHO.degrauInicial
  let densidade: number = DESEMPENHO.degraus[degrau]?.densidade ?? 1
  let dprMax: number = Math.min(
    dprToque,
    DESEMPENHO.degraus[degrau]?.dprMax ?? 2,
  )
  const custos: number[] = []
  let ultimaTroca = 0
  let desdeQuandoBarato = 0
  let inicioDoMotor = 0
  let quadrosMedidos = 0

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
  // Parallax do ponteiro, em graus, amortecido junto com a lanterna.
  const parallax = { x: 0, y: 0, alvoX: 0, alvoY: 0 }

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
    const n =
      W < 768
        ? Math.min(preset.paralelos, CONFIG.paralelosCelular)
        : preset.paralelos
    const chars = new Set<string>()
    for (const linha of LINHAS_DE_CODIGO) for (const ch of linha) chars.add(ch)
    chars.add(" ")
    const todos = [...chars].join("")
    tamanhoFonte = Math.min(
      CONFIG.layout.fonteMaxPx,
      Math.max(CONFIG.layout.fonteMinPx, R / 30),
    )
    atlasPreto = criarAtlas(
      todos,
      tamanhoFonte,
      dpr,
      familia,
      CONFIG.cores.preto,
    )
    atlasLaranja = criarAtlas(
      todos,
      tamanhoFonte,
      dpr,
      familia,
      CONFIG.cores.laranja,
    )
    atlasAzul = criarAtlas(todos, tamanhoFonte, dpr, familia, CONFIG.cores.azul)
    const mapa = atlasPreto.mapa
    const latMax = CONFIG.latitudeMax * GRAUS
    for (let i = 0; i < n; i += 1) {
      const lat = (i / (n - 1) - 0.5) * 2 * latMax
      const r = Math.cos(lat)
      const raioPx = R * r
      const circunferencia = 2 * Math.PI * raioPx
      const glifos: Glifo[] = []
      let percorrido = 0
      let k = Math.floor(aleatorio() * LINHAS_DE_CODIGO.length)
      let guarda = 0
      while (percorrido < circunferencia && guarda < 40) {
        const linha = `${LINHAS_DE_CODIGO[k % LINHAS_DE_CODIGO.length] ?? ""}    `
        for (const ch of linha) {
          const w = (mapa.get(ch)?.w ?? 6 * dpr) / dpr
          glifos.push({
            ch,
            theta: percorrido / raioPx,
            dTheta: w / raioPx,
            semicolon: ch === ";",
          })
          percorrido += w
          if (percorrido >= circunferencia) break
        }
        k += 1
        guarda += 1
      }
      // Fecha o anel sem salto: o último glifo encaixa no primeiro.
      const fator = (2 * Math.PI) / Math.max(percorrido / raioPx, 0.001)
      for (const g of glifos) {
        g.theta *= fator
        g.dTheta *= fator
      }
      aneis.push({
        lat,
        r,
        y: Math.sin(lat),
        rot: aleatorio() * Math.PI * 2,
        velocidade:
          ((2 * Math.PI) / preset.periodoS) *
          (1 - CONFIG.deriva + 2 * CONFIG.deriva * aleatorio()),
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
    const L = CONFIG.layout
    // Caixa do bloco de texto (título, apoio, CTAs) em px do canvas.
    const bloco = secao.querySelector(".home-hero-conteudo > div")
    const cb = bloco?.getBoundingClientRect()
    if (cb && cb.width > 0) {
      const m = L.zonaCalma.margemPx
      calma.l = cb.left - caixa.left - m
      calma.t = cb.top - caixa.top - m
      calma.r = cb.right - caixa.left + m
      calma.b = cb.bottom - caixa.top + m
      calma.cx = (calma.l + calma.r) / 2
      calma.cy = (calma.t + calma.b) / 2
      calma.rx = Math.max(1, (calma.r - calma.l) / 2)
      calma.ry = Math.max(1, (calma.b - calma.t) / 2)
      calma.ativa = true
    } else {
      calma.ativa = false
    }
    const pc = ancora()
    if (pc && pc.width > 0) {
      ponto.x = pc.left + pc.width / 2 - caixa.left
      ponto.y = pc.top + pc.height / 2 - caixa.top
      ponto.r = Math.hypot(pc.width, pc.height) * 1.15
      ponto.ativo = true
    } else {
      ponto.ativo = false
    }
    // O globo nunca sobe para debaixo do header (contraste do logo e dos links).
    const header = document.querySelector("[data-site-header]")
    const alturaHeader = header ? header.getBoundingClientRect().height : 0
    if (W >= 1024) {
      R = (L.desktop.diametroVh / 200) * H
      cx = L.desktop.centroX * W
      cy = Math.max(L.desktop.centroY * H, alturaHeader + 1.12 * R + 8)
    } else if (W >= 768) {
      R = (L.tablet.diametroVh / 200) * H
      cx = L.tablet.centroX * W
      cy = Math.max(L.tablet.centroY * H, alturaHeader + 1.12 * R + 8)
    } else {
      R = (L.celular.diametroVw / 200) * W
      cx = L.celular.centroX * W
      const fundo = calma.ativa ? calma.b - L.zonaCalma.margemPx : 0.6 * H
      cy = fundo + (L.celular.abaixoDoConteudoVh / 100) * H
    }
  }

  const redimensionar = () => {
    geometria()
    montarAneis()
  }

  // --- projeção ---------------------------------------------------------------
  const F = CONFIG.foco
  /** Projeta um ponto da esfera unitária já rotacionado: devolve x, y de tela e o fator s. */
  const projetar = (
    qx: number,
    qy: number,
    qz: number,
    Rv: number,
    ox: number,
    oy: number,
  ) => {
    const s = F / (F - qz)
    return { x: ox + qx * Rv * s, y: oy + qy * Rv * s, s }
  }

  let pronto = false
  const desenhar = (agora: number) => {
    if (!atlasPreto || !atlasLaranja || !atlasAzul) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    if (!pronto) {
      pronto = true
      marcar("pronto")
    }

    const esc = estado.escala
    const Rv = R * esc
    const centroX = cx + estado.deslocX
    // Paralaxe de atraso: o globo demora a sair junto com a seção.
    const centroY = cy + estado.deslocY + estado.rolagem * 0.35 * H
    const curva = preset.achataNaRolagem
      ? 1 - suave((estado.rolagem - 0.05) / 0.75)
      : 1
    const rotExtra =
      estado.rolagem * Math.PI * (preset.achataNaRolagem ? 1.5 : 0.5)

    // Matriz de rotação do quadro: inclinações com precessão e parallax.
    const t = agora / 1000
    const prec = CONFIG.precessaoGraus * GRAUS
    const fase = (t / CONFIG.precessaoS) * Math.PI * 2
    const tiltZ = CONFIG.inclinacaoZ * GRAUS + prec * Math.sin(fase)
    const tiltX = CONFIG.inclinacaoX * GRAUS + prec * Math.cos(fase)
    const M = mul(
      mul(rotY(parallax.x * GRAUS), rotX(parallax.y * GRAUS)),
      mul(rotZ(tiltZ * curva), rotX(tiltX * curva)),
    )
    const m0 = M[0],
      m1 = M[1],
      m2 = M[2]
    const m3 = M[3],
      m4 = M[4],
      m5 = M[5]
    const m6 = M[6],
      m7 = M[7],
      m8 = M[8]

    // Atmosfera: halo da superfície atrás do globo.
    ctx.globalAlpha = 1
    const halo = ctx.createRadialGradient(
      centroX,
      centroY,
      Rv * 0.6,
      centroX,
      centroY,
      Rv * 1.75,
    )
    halo.addColorStop(0, "rgba(238, 245, 252, 0.95)")
    halo.addColorStop(1, "rgba(238, 245, 252, 0)")
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, W, H)

    // Sombra interna azul no quadrante inferior esquerdo, seguindo a curvatura.
    if (curva > 0.01) {
      ctx.globalAlpha = curva
      const grad = ctx.createRadialGradient(
        centroX - 0.3 * Rv,
        centroY + 0.3 * Rv,
        Rv * 0.25,
        centroX - 0.05 * Rv,
        centroY + 0.05 * Rv,
        Rv,
      )
      grad.addColorStop(0, "rgba(11, 92, 173, 0.0)")
      grad.addColorStop(0.55, "rgba(11, 92, 173, 0.035)")
      grad.addColorStop(1, "rgba(11, 92, 173, 0.1)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(centroX, centroY, Rv, 0, Math.PI * 2)
      ctx.fill()
      // Disco levemente mais claro que o fundo: o corpo do planeta.
      ctx.globalAlpha = 0.35 * curva
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      // Semente: enquanto nasce do `;`, o disco é laranja e vai clareando.
      const semeadura = 1 - suave((esc - 0.05) / 0.5)
      if (semeadura > 0.01) {
        ctx.globalAlpha = semeadura
        ctx.fillStyle = CONFIG.cores.laranja
        ctx.fill()
      }
    }

    // Véu suave atrás do bloco de texto (nunca uma caixa): elipse branca que
    // some antes da borda. Garante o AA do título, do apoio e dos CTAs.
    if (calma.ativa) {
      ctx.save()
      ctx.translate(calma.cx, calma.cy)
      ctx.scale(calma.rx / calma.ry, 1)
      const veu = ctx.createRadialGradient(0, 0, 0, 0, 0, calma.ry * 1.35)
      veu.addColorStop(0, "rgba(255, 255, 255, 0.85)")
      veu.addColorStop(0.7, "rgba(255, 255, 255, 0.55)")
      veu.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = veu
      ctx.globalAlpha = 1
      ctx.fillRect(
        -calma.rx * 1.6,
        -calma.ry * 1.4,
        calma.rx * 3.2,
        calma.ry * 2.8,
      )
      ctx.restore()
    }

    const lanternaAtiva = preset.lanterna && lanterna.x > -9000
    let pulsosAtivos = 0
    for (const anel of aneis) {
      for (const p of anel.pulsos)
        if (p && agora - p < CONFIG.pulsoMs) pulsosAtivos += 1
    }

    const alturaGlifo = atlasPreto.altura / dpr
    const zonaTransicao = CONFIG.layout.zonaCalma.transicaoPx
    const calmaMin = Math.min(
      1,
      CONFIG.layout.zonaCalma.alfaMax / preset.alfaFrente,
    )
    const desenharGlifo = (
      atlas: Atlas,
      g: Glifo,
      x: number,
      y: number,
      largura: number,
      altura: number,
      angulo: number,
      alfa: number,
    ) => {
      const m = atlas.mapa.get(g.ch)
      if (!m || g.ch === " ") return
      const c = Math.cos(angulo)
      const s = Math.sin(angulo)
      ctx.setTransform(dpr * c, dpr * s, -dpr * s, dpr * c, x * dpr, y * dpr)
      ctx.globalAlpha = alfa
      ctx.drawImage(
        atlas.canvas,
        m.x,
        0,
        m.w,
        atlas.altura,
        0,
        -altura / 2,
        largura,
        altura,
      )
    }

    // Dois passes: hemisfério de trás (fraco) e frente.
    for (let passe = 0; passe < 2; passe += 1) {
      const tras = passe === 0
      // Sem hemisfério de trás no toque, na fita achatada e durante a entrada
      // (o quadro da entrada já paga o crescimento e a revelação).
      if (tras && (toque || curva < 0.5 || estado.revelacao < 1)) continue
      for (let ia = 0; ia < aneis.length; ia += 1) {
        const anel = aneis[ia]
        if (!anel) continue
        // Qualidade adaptativa: pula anéis inteiros (o texto de cada anel
        // continua íntegro), nunca o equador.
        if (densidade < 1 && ia !== Math.floor(aneis.length / 2)) {
          if (densidade <= 0.34) {
            if (ia % 3 !== 0) continue
          } else if (densidade <= 0.51) {
            if (ia % 2 === 1) continue
          } else if (ia % 3 === 2) continue
        }
        const fracaoLat = Math.abs(anel.lat) / (CONFIG.latitudeMax * GRAUS)
        let alfaAnel = suave((estado.revelacao - fracaoLat) / 0.12)
        if (preset.achataNaRolagem) {
          alfaAnel *= 1 - suave((estado.rolagem - 0.75) / 0.25)
        }
        if (alfaAnel <= 0) continue

        const r = anel.r
        const y = anel.y
        let fatorVelocidade = 1
        if (lanternaAtiva && !tras) {
          // Ponto da frente do anel, para a desaceleração local.
          const fx = m1 * y + m2 * r
          const fy = m4 * y + m5 * r
          const fz = m7 * y + m8 * r
          const pf = projetar(fx, fy, fz, Rv, centroX, centroY)
          const d = Math.hypot(lanterna.x - pf.x, lanterna.y - pf.y)
          fatorVelocidade =
            1 -
            CONFIG.desaceleracaoLanterna *
              (1 - suave((d - 60) / CONFIG.raioLanterna))
        }

        for (let k = 0; k < anel.glifos.length; k += 1) {
          const g = anel.glifos[k]
          if (!g) continue
          if (tras && k % 2 === 1) continue
          const lambda = g.theta + anel.rot + rotExtra
          const lf = envolve(lambda - Math.PI / 2)
          // Ponto na esfera unitária (curvo) e na "fita" aberta (reto), misturados.
          const px = -r * Math.cos(lambda) * curva + lf * r * (1 - curva)
          const pz = r * Math.sin(lambda) * curva
          // Segundo ponto, no fim do glifo, para tangente e encurtamento.
          const lambda2 = lambda + g.dTheta
          const lf2 = envolve(lambda2 - Math.PI / 2)
          const px2 = -r * Math.cos(lambda2) * curva + lf2 * r * (1 - curva)
          const pz2 = r * Math.sin(lambda2) * curva

          const qx = m0 * px + m1 * y + m2 * pz
          const qy = m3 * px + m4 * y + m5 * pz
          const qz = m6 * px + m7 * y + m8 * pz
          if (tras !== qz < 0) continue
          const a = projetar(qx, qy, qz, Rv, centroX, centroY)
          const qx2 = m0 * px2 + m1 * y + m2 * pz2
          const qy2 = m3 * px2 + m4 * y + m5 * pz2
          const qz2 = m6 * px2 + m7 * y + m8 * pz2
          const b = projetar(qx2, qy2, qz2, Rv, centroX, centroY)
          const dx = b.x - a.x
          const dy = b.y - a.y
          const largura = Math.hypot(dx, dy)
          if (largura < 0.4 || largura > alturaGlifo * 3) continue
          const angulo = Math.atan2(dy, dx)
          const altura = alturaGlifo * esc * a.s

          // Opacidade por profundidade.
          let alfa: number
          if (tras) {
            alfa = CONFIG.alfaTras * suave(-qz / 0.6)
          } else {
            const prof =
              curva > 0.99 ? qz : Math.max(qz, 1 - Math.abs(px) / 2.2)
            alfa =
              CONFIG.alfaHorizonte +
              (preset.alfaFrente - CONFIG.alfaHorizonte) * suave(prof / 0.85)
          }
          alfa *= alfaAnel
          // Zona calma: atrás do bloco de texto o globo é só sugestão. O
          // fator vale também para pulsos e lanterna (aplicado no fim).
          let fatorCalma = 1
          if (calma.ativa && !tras) {
            const dx = Math.max(calma.l - a.x, a.x - calma.r, 0)
            const dy = Math.max(calma.t - a.y, a.y - calma.b, 0)
            const fora = suave(Math.hypot(dx, dy) / zonaTransicao)
            fatorCalma = calmaMin + (1 - calmaMin) * fora
            alfa *= fatorCalma
          }
          if (alfa <= 0.01) continue

          // Cruzamento do meridiano pelo `;`: acende em laranja.
          if (g.semicolon && !tras) {
            const lado = lf >= 0 ? 1 : -1
            const anterior = anel.ladoAnterior[k] ?? 0
            if (
              preset.pulsosNoMeridiano &&
              anterior < 0 &&
              lado > 0 &&
              Math.abs(lf) < 0.3 &&
              pulsosAtivos < CONFIG.pulsosSimultaneos
            ) {
              anel.pulsos[k] = agora
              pulsosAtivos += 1
            }
            anel.ladoAnterior[k] = lado
          }

          let atlas = atlasPreto
          let alfaFinal = alfa
          if (g.semicolon) {
            const inicio = anel.pulsos[k] ?? 0
            const decorrido = agora - inicio
            if (inicio && decorrido < CONFIG.pulsoMs) {
              atlas = atlasLaranja
              alfaFinal =
                Math.max(alfa, 0.95 - (decorrido / CONFIG.pulsoMs) * 0.3) *
                alfaAnel
            }
          } else if (g.ch === '"' || g.ch === "'" || g.ch === "`") {
            atlas = atlasAzul
          }

          if (lanternaAtiva && !tras) {
            const d = Math.hypot(lanterna.x - a.x, lanterna.y - a.y)
            const foco = 1 - suave((d - 40) / CONFIG.raioLanterna)
            if (foco > 0)
              alfaFinal = alfaFinal + (0.95 * alfaAnel - alfaFinal) * foco
          }

          if (alfaFinal > alfa)
            alfaFinal = alfa + (alfaFinal - alfa) * fatorCalma
          desenharGlifo(atlas, g, a.x, a.y, largura, altura, angulo, alfaFinal)
        }
        if (!tras) anel.fator = fatorVelocidade
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Aro de luz na borda superior direita.
    if (curva > 0.01) {
      ctx.globalAlpha = 0.9 * curva
      const luz = ctx.createLinearGradient(
        centroX - Rv,
        centroY + Rv,
        centroX + Rv,
        centroY - Rv,
      )
      luz.addColorStop(0.35, "rgba(255, 255, 255, 0)")
      luz.addColorStop(0.75, "rgba(255, 255, 255, 0.9)")
      luz.addColorStop(1, "rgba(255, 255, 255, 0.2)")
      ctx.strokeStyle = luz
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(centroX, centroY, Rv - 0.75, -110 * GRAUS, 20 * GRAUS)
      ctx.stroke()
    }

    // Polos: dois `;` grandes, laranja, projetados com a esfera.
    if (estado.polos > 0.01) {
      const respira =
        1 +
        CONFIG.respiracaoPolos *
          0.5 *
          (1 + Math.sin((t / CONFIG.respiracaoS) * Math.PI * 2))
      for (const sinal of [-1, 1]) {
        const py = sinal * 1.06
        const qx = m1 * py
        const qy = m4 * py
        const qz = m7 * py
        const p = projetar(qx, qy, qz, Rv, centroX, centroY)
        const tamanho = Rv * 0.17 * respira * p.s
        ctx.font = `700 ${tamanho}px ${familia}`
        ctx.fillStyle = CONFIG.cores.laranja
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.globalAlpha =
          estado.polos * curva * (0.55 + 0.45 * suave((qz + 0.3) / 0.6))
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(tiltZ * curva)
        ctx.fillText(";", 0, 0)
        ctx.restore()
      }
    }

    // Grão leve só na área do globo.
    if (grao && curva > 0.01) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(centroX, centroY, Rv * 1.08, 0, Math.PI * 2)
      ctx.clip()
      ctx.globalAlpha = 0.2 * curva
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

    // Halo branco atrás do `;` do título, por último: pintado antes, os
    // glifos da zona calma (alfa até 0,1) e o grão passavam por cima e
    // derrubavam o laranja para menos de 3:1.
    if (ponto.ativo) {
      const haloPonto = ctx.createRadialGradient(
        ponto.x,
        ponto.y,
        0,
        ponto.x,
        ponto.y,
        ponto.r,
      )
      haloPonto.addColorStop(0, "rgba(255, 255, 255, 1)")
      haloPonto.addColorStop(0.72, "rgba(255, 255, 255, 0.98)")
      haloPonto.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = haloPonto
      ctx.globalAlpha = 1
      ctx.fillRect(
        ponto.x - ponto.r,
        ponto.y - ponto.r,
        ponto.r * 2,
        ponto.r * 2,
      )
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
    const kp = 1 - Math.pow(0.02, dt) // parallax mais lento (~1 s)
    parallax.x += (parallax.alvoX - parallax.x) * kp
    parallax.y += (parallax.alvoY - parallax.y) * kp
    const antes = performance.now()
    desenhar(agora)
    adaptar(performance.now() - antes, agora)
    quadros += 1
    if (agora - marcaFps >= 1000) {
      aoFps?.(quadros)
      quadros = 0
      marcaFps = agora
    }
  }

  /** Sobe ou desce um degrau de qualidade conforme o custo medido do quadro. */
  const aplicarDegrau = (novo: number, agora: number) => {
    const d = DESEMPENHO.degraus[novo]
    if (!d) return
    degrau = novo
    densidade = d.densidade
    canvas.dataset.degrau = String(novo)
    const dprNovo = Math.min(dprToque, d.dprMax)
    gsap.ticker.fps(d.fps)
    ultimaTroca = agora
    desdeQuandoBarato = 0
    custos.length = 0
    if (dprNovo !== dprMax) {
      dprMax = dprNovo
      redimensionar()
    }
  }
  /**
   * Desiste de animar: um quadro final, redesenhado só na rolagem e no
   * resize, como no modo sem aceleração. Sem volta nesta visita.
   */
  const cairParaEstatico = () => {
    if (!animar) return
    animar = false
    dormir()
    linha.progress(1).pause()
    canvas.dataset.modo = "estatico"
    quadroEstatico()
  }

  const amostrasIniciais: number[] = []
  const adaptar = (custo: number, agora: number) => {
    // Durante a entrada o globo ainda é pequeno e tem poucos glifos: esses
    // quadros baratos não dizem nada sobre o custo em regime.
    if (estado.escala < 0.999 || estado.revelacao < 0.999) return
    // Decisão rápida: mediana dos primeiros quadros com o globo completo
    // (depois do aquecimento). Caro demais logo de cara é renderização por
    // software que o navegador não admitiu, ou aparelho lento: fica estático.
    if (amostrasIniciais.length < DESEMPENHO.amostrasParaDecidir) {
      quadrosMedidos += 1
      if (quadrosMedidos <= DESEMPENHO.quadrosDeAquecimento) return
      amostrasIniciais.push(custo)
      if (amostrasIniciais.length < DESEMPENHO.amostrasParaDecidir) return
      const ordenadas = [...amostrasIniciais].sort((a, b) => a - b)
      const mediana = ordenadas[Math.floor(ordenadas.length / 2)] ?? 0
      canvas.dataset.custoInicial = mediana.toFixed(1)
      if (mediana > DESEMPENHO.custoEstaticoMs) {
        cairParaEstatico()
        return
      }
    }
    custos.push(custo)
    if (custos.length < DESEMPENHO.janelaQuadros) return
    custos.shift()
    const media = custos.reduce((a, b) => a + b, 0) / custos.length
    canvas.dataset.custo = media.toFixed(1)
    // Descer é urgente (o quadro já está pesando); subir é cauteloso.
    const caro = media > DESEMPENHO.custoAltoMs
    const intervalo =
      (caro ? DESEMPENHO.intervaloDescidaS : DESEMPENHO.intervaloDegrauS) * 1000
    if (agora - ultimaTroca < intervalo) return
    const segurando = agora - inicioDoMotor < DESEMPENHO.segurarInicialS * 1000
    if (caro) {
      if (degrau < DESEMPENHO.degraus.length - 1) {
        aplicarDegrau(degrau + 1, agora)
      } else {
        // Já no degrau mais barato e ainda caro: não vale animar.
        cairParaEstatico()
      }
      return
    }
    if (media < DESEMPENHO.custoBaixoMs) {
      if (!desdeQuandoBarato) desdeQuandoBarato = agora
      const piso = segurando ? DESEMPENHO.degrauInicial : 0
      if (agora - desdeQuandoBarato >= intervalo && degrau > piso) {
        aplicarDegrau(degrau - 1, agora)
      }
    } else {
      desdeQuandoBarato = 0
    }
  }

  const acordar = () => {
    if (laco || !ativo || !naTela || reduzido.matches || !animar) return
    ultimo = 0
    laco = passo
    gsap.ticker.add(laco)
  }
  const dormir = () => {
    if (laco) gsap.ticker.remove(laco)
    laco = null
  }

  // --- entrada ---------------------------------------------------------------
  // Montada depois da geometria (ver `montarEntrada`): o deslocamento até o
  // ';' do título é medido a partir do centro final do globo.
  const fatorEntrada =
    secao.dataset.entrada === "curta" ? CONFIG.entradaCurta : 1
  const linha = gsap.timeline({ paused: true })
  const montarEntrada = () => {
    if (preset.nasceNoTitulo) {
      const caixa = ancora()
      if (caixa) {
        const c = canvas.getBoundingClientRect()
        estado.escala = 0.05
        estado.deslocX = caixa.left + caixa.width / 2 - c.left - cx
        estado.deslocY = caixa.top + caixa.height * 0.62 - c.top - cy
        // O `;` do título acende a 0,3 s; o planeta sai dele a partir de 0,45 s
        // e chega ao centro em 1,3 s, crescendo mais do que anda.
        linha.to(
          estado,
          {
            escala: 1,
            deslocX: 0,
            deslocY: 0,
            duration: 0.85 * fatorEntrada,
            ease: "power3.inOut",
          },
          0.45 * fatorEntrada,
        )
      }
    }
    const inicioRevelacao = preset.nasceNoTitulo ? 0.45 : 0
    linha.to(
      estado,
      { revelacao: 1, duration: 0.85 * fatorEntrada, ease: "power2.out" },
      (inicioRevelacao + 0.1) * fatorEntrada,
    )
    linha.to(
      estado,
      { polos: 1, duration: 0.3 * fatorEntrada, ease: "power1.out" },
      (inicioRevelacao + 0.75) * fatorEntrada,
    )
  }

  /** Modo estático: um quadro final, redesenhado só na rolagem e no resize. */
  const quadroEstatico = () => {
    estado.revelacao = 1
    estado.polos = 1
    estado.escala = 1
    estado.deslocX = 0
    estado.deslocY = 0
    desenhar(performance.now())
  }

  const gatilho = ScrollTrigger.create({
    trigger: secao,
    start: "top top",
    end: "bottom top",
    scrub: 0.6,
    onUpdate: (self) => {
      estado.rolagem = self.progress
      if (reduzido.matches || !animar) desenhar(performance.now())
    },
  })

  // --- eventos ---------------------------------------------------------------
  const aoMover = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const c = canvas.getBoundingClientRect()
    lanterna.alvoX = e.clientX - c.left
    lanterna.alvoY = e.clientY - c.top
    parallax.alvoX =
      ((e.clientX - c.left) / Math.max(1, c.width) - 0.5) *
      2 *
      CONFIG.parallaxGraus
    parallax.alvoY =
      ((e.clientY - c.top) / Math.max(1, c.height) - 0.5) *
      2 *
      CONFIG.parallaxGraus
  }
  const aoSair = () => {
    lanterna.alvoX = -9999
    lanterna.alvoY = -9999
    parallax.alvoX = 0
    parallax.alvoY = 0
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
  let montado = false
  const observadorTamanho = new ResizeObserver(() => {
    if (!montado) return
    window.clearTimeout(esperaResize)
    esperaResize = window.setTimeout(() => {
      redimensionar()
      if (reduzido.matches || !animar) quadroEstatico()
    }, 120)
  })
  const aoMudarMovimento = () => {
    if (!montado) return
    if (reduzido.matches) {
      dormir()
      quadroEstatico()
    } else {
      acordar()
    }
  }

  // --- início ----------------------------------------------------------------
  // Montagem em dois ciclos ociosos (geometria e atlas; depois anéis e grão)
  // para nenhuma tarefa passar de ~20 ms; o primeiro quadro vem no quadro
  // seguinte, nunca na mesma tarefa.
  let cancelarMontagem: (() => void) | null = null
  let rafInicial = 0
  const iniciar = () => {
    montado = true
    // Diagnóstico (lido só por testes e capturas): modo e degrau atual.
    canvas.dataset.modo = reduzido.matches || !animar ? "estatico" : "animado"
    canvas.dataset.degrau = String(degrau)
    if (toque) {
      lanterna.alvoX = cx
      lanterna.alvoY = cy
      lanterna.x = cx
      lanterna.y = cy
    }
    montarEntrada()
    inicioDoMotor = performance.now()
    if (reduzido.matches || !animar) {
      rafInicial = requestAnimationFrame(quadroEstatico)
      return
    }
    gsap.ticker.fps(DESEMPENHO.degraus[degrau]?.fps ?? 60)
    rafInicial = requestAnimationFrame(() => {
      linha.play()
      acordar()
    })
  }
  const etapaAneis = () => {
    cancelarMontagem = null
    const t0 = performance.now()
    montarAneis()
    montarGrao()
    if (performance.now() - t0 > DESEMPENHO.montagemMaxMs) {
      // Custou mais que o teto: deixa o primeiro quadro para outro ciclo.
      cancelarMontagem = ocioso(iniciar, 500)
      return
    }
    iniciar()
  }
  cancelarMontagem = ocioso(() => {
    geometria()
    cancelarMontagem = ocioso(etapaAneis, 500)
  }, 500)

  window.addEventListener("pointermove", aoMover, { passive: true })
  document.addEventListener("pointerleave", aoSair)
  document.addEventListener("visibilitychange", aoVisibilidade)
  reduzido.addEventListener("change", aoMudarMovimento)
  observadorTela.observe(canvas)
  observadorTamanho.observe(canvas)

  return () => {
    cancelarMontagem?.()
    if (rafInicial) cancelAnimationFrame(rafInicial)
    dormir()
    gsap.ticker.fps(60)
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
