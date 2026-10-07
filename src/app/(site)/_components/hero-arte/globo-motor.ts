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
 *
 * Custo: o que pesa no Canvas 2D é o número de chamadas (setTransform e
 * drawImage), não a conta. Por isso o anel não é desenhado glifo a glifo,
 * mas em trechos: pedaços de palavra curtos o bastante para a corda não se
 * afastar do arco (`trechoFlechaPx`), cada um numa chamada só, recortados
 * de um atlas com as linhas de código já compostas. Só o `;` é peça
 * individual, porque acende sozinho.
 *
 * Continuidade: nada aparece ou some de um quadro para o outro. A qualidade
 * adaptativa só define alvos (presença de cada paralelo e do hemisfério de
 * trás) e o laço chega a eles em fade; o texto nasce e morre no contorno em
 * fade; o `;` que acende esfria em crossfade. O texto de cada anel é
 * determinístico (a semente não muda), então resize e troca de DPR não
 * sorteiam o globo de novo.
 */

/**
 * Peça de um paralelo: um trecho de palavra ou um `;`. Espaços não viram
 * peça, só avançam o anel. Seno e cosseno do início (c1, s1) e do fim
 * (c2, s2) são pré-calculados: no quadro, a rotação do anel entra pela soma
 * de ângulos, sem trigonometria por peça.
 */
type Peca = {
  /** Recorte no atlas de linhas (px do atlas). */
  sx: number
  sy: number
  sw: number
  theta: number
  dTheta: number
  c1: number
  s1: number
  c2: number
  s2: number
  semicolon: boolean
}
type Anel = {
  lat: number
  /** Raio do paralelo na esfera unitária. */
  r: number
  /** Altura do paralelo na esfera unitária (positivo = sul, para baixo). */
  y: number
  rot: number
  velocidade: number
  fator: number
  /** Presença 0..1 pedida pela qualidade adaptativa, alcançada em fade. */
  presenca: number
  alvo: number
  /** Fora da tela por presença zero: o estado do meridiano foi zerado. */
  dormindo: boolean
  pecas: Peca[]
  /** Início da brasa de cada `;` (ms, pelo índice da peça), 0 se apagado. */
  pulsos: Float64Array
  ladoAnterior: Int8Array
}

/**
 * Atlas com as linhas de código já compostas, uma por faixa, caractere a
 * caractere na mesma grade espaçada de sempre (aspas já em azul, `;` em
 * branco), mais uma faixa final com o `;` em tinta e em laranja.
 */
type AtlasDeLinhas = {
  canvas: HTMLCanvasElement
  /** Altura de uma faixa (px do atlas). */
  altura: number
  /** Largura do espaço (px do atlas). */
  espaco: number
  faixas: { y: number; recortes: { x: number; w: number }[] }[]
  ponto: { y: number; w: number; xTinta: number; xLaranja: number }
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

/** Anda de `de` até `para` no máximo `passo`, sem passar. */
function aproximar(de: number, para: number, passo: number): number {
  return de < para ? Math.min(para, de + passo) : Math.max(para, de - passo)
}

function mediana(valores: readonly number[]): number {
  const ordenados = [...valores].sort((a, b) => a - b)
  return ordenados[Math.floor(ordenados.length / 2)] ?? 0
}

/** Gerador congruente (Park–Miller): a mesma semente dá o mesmo globo. */
function criarAleatorio(semente: number): () => number {
  let s = Math.floor(semente * 2147483647) || 1
  return () => {
    s = (s * 48271) % 2147483647
    return s / 2147483647
  }
}

/**
 * Paralelos desenhados em cada densidade da qualidade adaptativa. O equador
 * fica sempre; os outros saem em padrão regular, para o globo continuar
 * inteiro e só mais ralo.
 */
function anelVisivel(i: number, n: number, densidade: number): boolean {
  if (densidade >= 1 || i === Math.floor(n / 2)) return true
  if (densidade <= 0.34) return i % 3 === 0
  if (densidade <= 0.51) return i % 2 === 0
  return i % 3 !== 2
}

function rgba(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/** Sprite do brilho da brasa: disco laranja radial, desenhado uma vez. */
function criarBrilho(cor: string): HTMLCanvasElement {
  const tamanho = 64
  const c = document.createElement("canvas")
  c.width = tamanho
  c.height = tamanho
  const g = c.getContext("2d")
  if (!g) return c
  const meio = tamanho / 2
  const grad = g.createRadialGradient(meio, meio, 0, meio, meio, meio)
  grad.addColorStop(0, rgba(cor, 1))
  grad.addColorStop(0.35, rgba(cor, 0.45))
  grad.addColorStop(1, rgba(cor, 0))
  g.fillStyle = grad
  g.fillRect(0, 0, tamanho, tamanho)
  return c
}

function ehAspas(ch: string): boolean {
  return ch === '"' || ch === "'" || ch === "`"
}

function criarAtlasDeLinhas(
  linhas: readonly string[],
  tamanhoPx: number,
  dpr: number,
  familia: string,
): AtlasDeLinhas | null {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const altura = Math.ceil(tamanhoPx * 1.4 * dpr)
  const fonte = `300 ${tamanhoPx * dpr}px ${familia}`
  // Cada caractere ocupa a própria largura mais 1 px de folga de cada lado
  // (a grade espaçada do globo), medida uma vez por caractere.
  ctx.font = fonte
  const larguras = new Map<string, number>()
  const largura = (ch: string) => {
    let w = larguras.get(ch)
    if (w === undefined) {
      w = Math.ceil(ctx.measureText(ch).width) + 2 * dpr
      larguras.set(ch, w)
    }
    return w
  }
  let maisLarga = 0
  const faixas = linhas.map((linha, i) => {
    let x = 0
    const recortes = [...linha].map((ch) => {
      const w = largura(ch)
      const recorte = { x, w }
      x += w
      return recorte
    })
    maisLarga = Math.max(maisLarga, x)
    return { y: i * altura, recortes }
  })
  const wPonto = largura(";")
  const espaco = largura(" ")
  // Mudar o tamanho do canvas zera o contexto: a fonte vem de novo depois.
  canvas.width = Math.max(1, maisLarga, 2 * wPonto)
  canvas.height = altura * (linhas.length + 1)
  ctx.font = fonte
  ctx.textBaseline = "middle"
  faixas.forEach((faixa, i) => {
    ;[...(linhas[i] ?? "")].forEach((ch, j) => {
      const recorte = faixa.recortes[j]
      if (!recorte || ch === " " || ch === ";") return
      ctx.fillStyle = ehAspas(ch) ? CONFIG.cores.azul : CONFIG.cores.preto
      ctx.fillText(ch, recorte.x + dpr, faixa.y + altura / 2)
    })
  })
  const yPonto = linhas.length * altura
  ctx.fillStyle = CONFIG.cores.preto
  ctx.fillText(";", dpr, yPonto + altura / 2)
  ctx.fillStyle = CONFIG.cores.laranja
  ctx.fillText(";", wPonto + dpr, yPonto + altura / 2)
  return {
    canvas,
    altura,
    espaco,
    faixas,
    ponto: { y: yPonto, w: wPonto, xTinta: 0, xLaranja: wPonto },
  }
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
  let atlas: AtlasDeLinhas | null = null
  let aneis: Anel[] = []
  let padraoGrao: CanvasPattern | null = null
  const brilho = criarBrilho(CONFIG.cores.laranja)
  // Tamanho e DPR da última montagem: resize sem mudança real não remonta.
  let medidaMontada = ""
  // Fim de cada brasa acesa (ms), em ordem: conta as simultâneas.
  const fimDasBrasas: number[] = []
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
  let trasNoDegrau: boolean = DESEMPENHO.degraus[degrau]?.tras ?? false
  let dprMax: number = Math.min(
    dprToque,
    DESEMPENHO.degraus[degrau]?.dprMax ?? 2,
  )
  // Presença do hemisfério de trás (0..1), alcançada em fade como a dos anéis.
  const tras = { presenca: 0 }
  const janela: number[] = []
  let janelasCaras = 0
  let ultimaTroca = 0
  let desdeQuandoBarato = 0
  let inicioDoMotor = 0
  let quadrosMedidos = 0
  // Falhas de cada degrau (custo alto nele) e quando foi a última.
  const falhas = DESEMPENHO.degraus.map(() => 0)
  const ultimaFalha = DESEMPENHO.degraus.map(() => 0)

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

  const definirAlvos = () => {
    const n = aneis.length
    aneis.forEach((anel, i) => {
      anel.alvo = anelVisivel(i, n, densidade) ? 1 : 0
    })
  }
  const alvoTras = () =>
    trasNoDegrau && !toque && estado.revelacao >= 1 ? 1 : 0
  /** Leva todas as presenças ao alvo de uma vez (quadro estático). */
  const assentar = () => {
    for (const anel of aneis) anel.presenca = anel.alvo
    tras.presenca = alvoTras()
  }

  /**
   * Monta atlas e anéis. O gerador volta à semente a cada montagem e a
   * rotação e a presença de cada anel passam para a montagem nova: resize e
   * troca de DPR redesenham o mesmo globo, nunca outro.
   */
  const montarAneis = () => {
    medidaMontada = `${W}x${H}@${dpr}`
    const aleatorio = criarAleatorio(semente)
    const anteriores = aneis
    const novos: Anel[] = []
    const n =
      W < 768
        ? Math.min(preset.paralelos, CONFIG.paralelosCelular)
        : preset.paralelos
    tamanhoFonte = Math.min(
      CONFIG.layout.fonteMaxPx,
      Math.max(CONFIG.layout.fonteMinPx, R / 30),
    )
    atlas = criarAtlasDeLinhas(LINHAS_DE_CODIGO, tamanhoFonte, dpr, familia)
    if (!atlas) return
    const { faixas, ponto: pontoAtlas } = atlas
    const espaco = atlas.espaco / dpr
    const latMax = CONFIG.latitudeMax * GRAUS
    for (let i = 0; i < n; i += 1) {
      const lat = (i / (n - 1) - 0.5) * 2 * latMax
      const r = Math.cos(lat)
      const raioPx = R * r
      const circunferencia = 2 * Math.PI * raioPx
      // Maior arco de um trecho: a corda não se afasta do arco mais que
      // `trechoFlechaPx` (flecha = raio · ângulo² / 8).
      const arcoMax = Math.sqrt((8 * CONFIG.trechoFlechaPx) / raioPx)
      const pecas: Peca[] = []
      const nova = (sx: number, sy: number, sw: number, theta: number) => ({
        sx,
        sy,
        sw,
        theta,
        dTheta: 0,
        c1: 1,
        s1: 0,
        c2: 1,
        s2: 0,
        semicolon: false,
      })
      let percorrido = 0
      let k = Math.floor(aleatorio() * LINHAS_DE_CODIGO.length)
      let guarda = 0
      while (percorrido < circunferencia && guarda < 40) {
        const indice = k % LINHAS_DE_CODIGO.length
        const caracteres = [...(LINHAS_DE_CODIGO[indice] ?? "")]
        const faixa = faixas[indice]
        // Trecho em composição: cresce até um espaço, um `;`, o fim da
        // linha ou o arco máximo.
        let trecho: Peca | null = null
        for (let j = 0; j < caracteres.length && faixa; j += 1) {
          const ch = caracteres[j]
          const recorte = faixa.recortes[j]
          if (!recorte) continue
          const w = recorte.w / dpr
          const theta = percorrido / raioPx
          if (ch === " " || ch === ";") {
            if (trecho) pecas.push(trecho)
            trecho = null
            if (ch === ";") {
              const p = nova(
                pontoAtlas.xTinta,
                pontoAtlas.y,
                pontoAtlas.w,
                theta,
              )
              p.dTheta = w / raioPx
              p.semicolon = true
              pecas.push(p)
            }
          } else {
            if (trecho && theta + w / raioPx - trecho.theta > arcoMax) {
              pecas.push(trecho)
              trecho = null
            }
            trecho ??= nova(recorte.x, faixa.y, 0, theta)
            trecho.sw = recorte.x + recorte.w - trecho.sx
            trecho.dTheta = (percorrido + w) / raioPx - trecho.theta
          }
          percorrido += w
          if (percorrido >= circunferencia) break
        }
        if (trecho) pecas.push(trecho)
        // Quatro espaços entre uma linha e a próxima.
        percorrido += 4 * espaco
        k += 1
        guarda += 1
      }
      // Fecha o anel sem salto: a última peça encaixa na primeira.
      const fator = (2 * Math.PI) / Math.max(percorrido / raioPx, 0.001)
      for (const p of pecas) {
        p.theta *= fator
        p.dTheta *= fator
        p.c1 = Math.cos(p.theta)
        p.s1 = Math.sin(p.theta)
        p.c2 = Math.cos(p.theta + p.dTheta)
        p.s2 = Math.sin(p.theta + p.dTheta)
      }
      // Os sorteios acontecem sempre, na mesma ordem, para a sequência do
      // gerador não depender de haver montagem anterior.
      const rot = aleatorio() * Math.PI * 2
      const velocidade =
        ((2 * Math.PI) / preset.periodoS) *
        (1 - CONFIG.deriva + 2 * CONFIG.deriva * aleatorio())
      const anterior = anteriores.length === n ? anteriores[i] : undefined
      const alvo = anelVisivel(i, n, densidade) ? 1 : 0
      novos.push({
        lat,
        r,
        y: Math.sin(lat),
        rot: anterior?.rot ?? rot,
        velocidade,
        fator: anterior?.fator ?? 1,
        presenca: anterior?.presenca ?? alvo,
        alvo,
        dormindo: false,
        pecas,
        pulsos: new Float64Array(pecas.length),
        ladoAnterior: new Int8Array(pecas.length),
      })
    }
    aneis = novos
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
    padraoGrao = ctx.createPattern(c, "repeat")
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
    if (`${W}x${H}@${dpr}` !== medidaMontada) montarAneis()
  }

  // Projeção em perspectiva: um ponto da esfera unitária já rotacionado
  // (qx, qy, qz) vai para a tela em centro + q · R · s, com s = F / (F − qz).
  // Feita inline no laço quente, sem alocar objeto por glifo.
  const F = CONFIG.foco

  let pronto = false
  const desenhar = (agora: number) => {
    const atlasDeLinhas = atlas
    if (!atlasDeLinhas) return
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
    const inclinacao = mul(rotZ(tiltZ * curva), rotX(tiltX * curva))
    const M = mul(
      mul(rotY(parallax.x * GRAUS), rotX(parallax.y * GRAUS)),
      inclinacao,
    )
    // Profundidade na esfera só inclinada (sem paralaxe nem fita): decide o
    // hemisfério e o fade do contorno. Com a paralaxe, a fita perdia pedaços.
    const t6 = inclinacao[6],
      t7 = inclinacao[7],
      t8 = inclinacao[8]
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
    // Brasas ainda acesas (a lista está em ordem de fim).
    while (fimDasBrasas.length > 0 && (fimDasBrasas[0] ?? 0) <= agora) {
      fimDasBrasas.shift()
    }
    let brasasAcesas = fimDasBrasas.length
    const PULSO = CONFIG.pulso
    const duracaoBrasa = PULSO.subidaMs + PULSO.esfriaMs

    const alturaGlifo = atlasDeLinhas.altura / dpr
    const alturaAtlas = atlasDeLinhas.altura
    const imagem = atlasDeLinhas.canvas
    const xLaranja = atlasDeLinhas.ponto.xLaranja
    const zonaTransicao = CONFIG.layout.zonaCalma.transicaoPx
    const calmaMin = Math.min(
      1,
      CONFIG.layout.zonaCalma.alfaMax / preset.alfaFrente,
    )
    const curvo = curva > 0.999
    const meiaVolta = Math.PI / 2
    // `globalAlpha` só muda quando o valor (em 1/255) muda: na frente do
    // globo, peças vizinhas repetem o mesmo alfa.
    let alfaAtual = -1
    const definirAlfa = (alfa: number) => {
      const q = Math.round(alfa * 255) / 255
      if (q !== alfaAtual) {
        ctx.globalAlpha = q
        alfaAtual = q
      }
    }
    const pintar = (
      sx: number,
      p: Peca,
      x: number,
      y: number,
      c: number,
      s: number,
      largura: number,
      altura: number,
      alfa: number,
    ) => {
      ctx.setTransform(dpr * c, dpr * s, -dpr * s, dpr * c, x * dpr, y * dpr)
      definirAlfa(alfa)
      ctx.drawImage(
        imagem,
        sx,
        p.sy,
        p.sw,
        alturaAtlas,
        0,
        -altura / 2,
        largura,
        altura,
      )
    }

    // Hemisfério de trás: presença em fade (degrau, fim da entrada) e
    // acompanhando a curvatura, para não sumir de uma vez ao achatar.
    const presencaTras = suave(tras.presenca) * suave((curva - 0.5) / 0.3)

    // Dois passes: hemisfério de trás (fraco) e frente.
    for (let passe = 0; passe < 2; passe += 1) {
      const atras = passe === 0
      if (atras && presencaTras <= 0.001) continue
      for (let ia = 0; ia < aneis.length; ia += 1) {
        const anel = aneis[ia]
        if (!anel) continue
        // Qualidade adaptativa: o anel entra e sai em fade, com o texto
        // íntegro; com presença zero não custa nada.
        const presenca = suave(anel.presenca)
        if (presenca <= 0.001) {
          if (!anel.dormindo) {
            // Volta sem pulsos falsos: o meridiano recomeça do zero.
            anel.ladoAnterior.fill(0)
            anel.dormindo = true
          }
          continue
        }
        anel.dormindo = false
        const fracaoLat = Math.abs(anel.lat) / (CONFIG.latitudeMax * GRAUS)
        let alfaAnel = suave((estado.revelacao - fracaoLat) / 0.12) * presenca
        if (preset.achataNaRolagem) {
          alfaAnel *= 1 - suave((estado.rolagem - 0.75) / 0.25)
        }
        if (atras) alfaAnel *= presencaTras
        if (alfaAnel <= 0) continue

        const r = anel.r
        const y = anel.y
        const rotacao = anel.rot + rotExtra
        const cr = Math.cos(rotacao)
        const sr = Math.sin(rotacao)
        // Uma peça nunca projeta mais que o próprio arco vezes a perspectiva
        // máxima: mais que isso é a costura da fita aberta.
        const larguraMax = 3 * r * Rv
        let fatorVelocidade = 1
        if (lanternaAtiva && !atras) {
          // Ponto da frente do anel, para a desaceleração local.
          const fz = m7 * y + m8 * r
          const sf = F / (F - fz)
          const ddx = lanterna.x - (centroX + (m1 * y + m2 * r) * Rv * sf)
          const ddy = lanterna.y - (centroY + (m4 * y + m5 * r) * Rv * sf)
          const d = Math.sqrt(ddx * ddx + ddy * ddy)
          fatorVelocidade =
            1 -
            CONFIG.desaceleracaoLanterna *
              (1 - suave((d - 60) / CONFIG.raioLanterna))
        }

        const pecas = anel.pecas
        for (let k = 0; k < pecas.length; k += 1) {
          if (atras && (k & 1) === 1) continue
          const p = pecas[k]
          if (!p) continue
          // Início e fim da peça no anel pela soma de ângulos.
          const cl = p.c1 * cr - p.s1 * sr
          const sl = p.s1 * cr + p.c1 * sr
          const cl2 = p.c2 * cr - p.s2 * sr
          const sl2 = p.s2 * cr + p.c2 * sr
          // Hemisfério e contorno pelo meio da peça.
          const zi = t7 * y + 0.5 * r * (-t6 * (cl + cl2) + t8 * (sl + sl2))
          if (atras !== zi < 0) continue

          // Ponto na esfera unitária (curvo) e na "fita" aberta (reto), misturados.
          const lf =
            curvo && !p.semicolon ? 0 : envolve(p.theta + rotacao - meiaVolta)
          const px = curvo ? -r * cl : -r * cl * curva + lf * r * (1 - curva)
          const pz = r * sl * curva
          const qz = m6 * px + m7 * y + m8 * pz
          const sa = F / (F - qz)
          const ax = centroX + (m0 * px + m1 * y + m2 * pz) * Rv * sa
          const ay = centroY + (m3 * px + m4 * y + m5 * pz) * Rv * sa

          // Fim da peça: tangente, comprimento e encurtamento.
          const px2 = curvo
            ? -r * cl2
            : -r * cl2 * curva +
              envolve(p.theta + p.dTheta + rotacao - meiaVolta) *
                r *
                (1 - curva)
          const pz2 = r * sl2 * curva
          const qz2 = m6 * px2 + m7 * y + m8 * pz2
          const sb = F / (F - qz2)
          const dx = centroX + (m0 * px2 + m1 * y + m2 * pz2) * Rv * sb - ax
          const dy = centroY + (m3 * px2 + m4 * y + m5 * pz2) * Rv * sb - ay
          const largura = Math.sqrt(dx * dx + dy * dy)
          if (largura < 0.4 || largura > larguraMax * p.dTheta + 4) continue
          const c = dx / largura
          const s = dy / largura
          const altura = alturaGlifo * esc * 0.5 * (sa + sb)
          const meioX = ax + dx / 2
          const meioY = ay + dy / 2

          // Opacidade por profundidade, no meio da peça.
          const qzMeio = 0.5 * (qz + qz2)
          let alfa: number
          if (atras) {
            alfa = CONFIG.alfaTras * suave(-qzMeio / 0.6)
          } else {
            const prof = curvo
              ? qzMeio
              : Math.max(qzMeio, 1 - Math.abs(0.5 * (px + px2)) / 2.2)
            alfa =
              (CONFIG.alfaHorizonte +
                (preset.alfaFrente - CONFIG.alfaHorizonte) *
                  suave(prof / 0.85)) *
              suave(zi / CONFIG.horizonte)
          }
          alfa *= alfaAnel
          // Zona calma: atrás do bloco de texto o globo é só sugestão. O
          // fator vale também para brasas e lanterna (aplicado no fim).
          let fatorCalma = 1
          if (calma.ativa && !atras) {
            const fx = Math.max(calma.l - meioX, meioX - calma.r, 0)
            const fy = Math.max(calma.t - meioY, meioY - calma.b, 0)
            const fora = suave(Math.sqrt(fx * fx + fy * fy) / zonaTransicao)
            fatorCalma = calmaMin + (1 - calmaMin) * fora
            alfa *= fatorCalma
          }
          if (alfa <= 0.01) continue

          // Cruzamento do meridiano pelo `;`: acende a brasa.
          let brasa = 0
          if (p.semicolon && !atras) {
            const lado = lf >= 0 ? 1 : -1
            const anterior = anel.ladoAnterior[k] ?? 0
            if (
              preset.pulsosNoMeridiano &&
              anterior < 0 &&
              lado > 0 &&
              Math.abs(lf) < 0.3 &&
              brasasAcesas < CONFIG.pulsosSimultaneos
            ) {
              anel.pulsos[k] = agora
              fimDasBrasas.push(agora + duracaoBrasa)
              brasasAcesas += 1
            }
            anel.ladoAnterior[k] = lado
            const inicio = anel.pulsos[k] ?? 0
            const decorrido = agora - inicio
            if (inicio > 0 && decorrido < duracaoBrasa) {
              // Acende rápido e esfria devagar (curva de brasa).
              const esfriou = (decorrido - PULSO.subidaMs) / PULSO.esfriaMs
              brasa =
                decorrido < PULSO.subidaMs
                  ? suave(decorrido / PULSO.subidaMs)
                  : (1 - esfriou) * (1 - esfriou)
            }
          }

          let alfaTinta = alfa
          if (lanternaAtiva && !atras) {
            const lx = lanterna.x - meioX
            const ly = lanterna.y - meioY
            const d = Math.sqrt(lx * lx + ly * ly)
            const foco = 1 - suave((d - 40) / CONFIG.raioLanterna)
            if (foco > 0)
              alfaTinta = alfa + (0.95 * alfaAnel - alfa) * foco * fatorCalma
          }

          if (brasa > 0) {
            // Brilho laranja atrás, tinta saindo e laranja entrando.
            const raio = altura * PULSO.brilhoRaio
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            definirAlfa(PULSO.brilhoAlfa * brasa * fatorCalma * alfaAnel)
            ctx.drawImage(
              brilho,
              meioX - raio,
              meioY - raio,
              raio * 2,
              raio * 2,
            )
            const tinta = alfaTinta * (1 - brasa)
            if (tinta > 0.01) {
              pintar(p.sx, p, ax, ay, c, s, largura, altura, tinta)
            }
            const acesa = alfa + (0.95 * alfaAnel - alfa) * fatorCalma
            pintar(xLaranja, p, ax, ay, c, s, largura, altura, acesa * brasa)
          } else {
            pintar(p.sx, p, ax, ay, c, s, largura, altura, alfaTinta)
          }
        }
        if (!atras) anel.fator = fatorVelocidade
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
        const sp = F / (F - qz)
        const tamanho = Rv * 0.17 * respira * sp
        ctx.font = `700 ${tamanho}px ${familia}`
        ctx.fillStyle = CONFIG.cores.laranja
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.globalAlpha =
          estado.polos * curva * (0.55 + 0.45 * suave((qz + 0.3) / 0.6))
        ctx.save()
        ctx.translate(centroX + qx * Rv * sp, centroY + qy * Rv * sp)
        ctx.rotate(tiltZ * curva)
        ctx.fillText(";", 0, 0)
        ctx.restore()
      }
    }

    // Grão leve só na área do globo: um preenchimento com padrão (antes,
    // ~200 drawImage por quadro), deslizando devagar.
    if (padraoGrao && curva > 0.01) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(centroX, centroY, Rv * 1.08, 0, Math.PI * 2)
      ctx.clip()
      ctx.globalAlpha = 0.2 * curva
      ctx.globalCompositeOperation = "multiply"
      const dx = (agora / 50) % 96
      const dy = (agora / 37) % 96
      ctx.translate(-dx, -dy)
      ctx.fillStyle = padraoGrao
      ctx.fillRect(
        centroX - Rv * 1.1 + dx,
        centroY - Rv * 1.1 + dy,
        Rv * 2.2,
        Rv * 2.2,
      )
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
    // Presenças andam até o alvo em `transicaoS`: nenhum degrau corta.
    const fade = dt / DESEMPENHO.transicaoS
    for (const anel of aneis) {
      anel.rot = (anel.rot + anel.velocidade * anel.fator * dt) % (Math.PI * 2)
      if (anel.presenca !== anel.alvo) {
        anel.presenca = aproximar(anel.presenca, anel.alvo, fade)
      }
    }
    tras.presenca = aproximar(tras.presenca, alvoTras(), fade)
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

  /**
   * Sobe ou desce um degrau de qualidade. Só muda alvos: paralelos e
   * hemisfério de trás chegam lá em fade (ver `passo`).
   */
  const aplicarDegrau = (novo: number, agora: number) => {
    const d = DESEMPENHO.degraus[novo]
    if (!d) return
    degrau = novo
    densidade = d.densidade
    trasNoDegrau = d.tras
    definirAlvos()
    canvas.dataset.degrau = String(novo)
    const dprNovo = Math.min(dprToque, d.dprMax)
    gsap.ticker.fps(d.fps)
    ultimaTroca = agora
    desdeQuandoBarato = 0
    janela.length = 0
    janelasCaras = 0
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
      const inicial = mediana(amostrasIniciais)
      canvas.dataset.custoInicial = inicial.toFixed(1)
      if (inicial > DESEMPENHO.custoEstaticoMs) {
        cairParaEstatico()
        return
      }
    }
    // Janelas fechadas de `janelaQuadros` quadros, resumidas pela mediana:
    // um pico isolado (GC, outra aba) não move o degrau.
    janela.push(custo)
    if (janela.length < DESEMPENHO.janelaQuadros) return
    const custoJanela = mediana(janela)
    janela.length = 0
    canvas.dataset.custo = custoJanela.toFixed(1)
    // Descer é urgente (o quadro já está pesando), mas pede janelas caras
    // seguidas; subir é cauteloso.
    janelasCaras = custoJanela > DESEMPENHO.custoAltoMs ? janelasCaras + 1 : 0
    if (janelasCaras >= DESEMPENHO.janelasParaDescer) {
      if (agora - ultimaTroca < DESEMPENHO.intervaloDescidaS * 1000) return
      if (degrau < DESEMPENHO.degraus.length - 1) {
        falhas[degrau] = (falhas[degrau] ?? 0) + 1
        ultimaFalha[degrau] = agora
        aplicarDegrau(degrau + 1, agora)
      } else {
        // Já no degrau mais barato e ainda caro: não vale animar.
        cairParaEstatico()
      }
      return
    }
    if (custoJanela >= DESEMPENHO.custoBaixoMs) {
      desdeQuandoBarato = 0
      return
    }
    if (!desdeQuandoBarato) desdeQuandoBarato = agora
    const segurando = agora - inicioDoMotor < DESEMPENHO.segurarInicialS * 1000
    const piso = segurando ? DESEMPENHO.degrauInicial : 0
    const acima = degrau - 1
    if (acima < piso) return
    const intervalo = DESEMPENHO.intervaloDegrauS * 1000
    // Um degrau que já pesou só volta depois do resfriamento, que dobra a
    // cada falha: é o que impede o vaivém entre dois degraus.
    const falhasAcima = falhas[acima] ?? 0
    const resfriamento =
      falhasAcima > 0
        ? DESEMPENHO.resfriamentoS * 1000 * 2 ** (falhasAcima - 1)
        : 0
    if (
      agora - desdeQuandoBarato >= intervalo &&
      agora - ultimaTroca >= intervalo &&
      agora - (ultimaFalha[acima] ?? 0) >= resfriamento
    ) {
      aplicarDegrau(acima, agora)
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
    assentar()
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
      densidade = DESEMPENHO.estatico.densidade
      trasNoDegrau = DESEMPENHO.estatico.tras
      definirAlvos()
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
