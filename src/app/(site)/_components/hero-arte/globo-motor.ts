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
 *
 * Brasa (a assinatura): o `;` que cruza o meridiano da frente, ou passa sob
 * a lanterna, acende em laranja negrito com um pulo de escala, um brilho em
 * duas camadas e uma onda geodésica na esfera; a instrução que ele encerra
 * "compila" (uma onda quente corre a linha até ele). Uma porteira dá o
 * ritmo (teto de taxa, intervalo mínimo, teto de simultâneas) e a zona
 * calma do texto só deixa o `;` trocar de cor. O brilho, a onda e o `;`
 * negrito são pintados depois dos anéis, num passe só das brasas: o brilho
 * em `multiply` tinge de laranja o fundo e os glifos por baixo sem lavar a
 * tinta (o `lighter` não funciona sobre fundo claro).
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
  /**
   * Índice, no anel, do `;` que encerra a instrução desta peça (a dele
   * mesmo, se for um `;`); -1 na linha cortada pelo fim do anel.
   */
  ponto: number
  /** Meio da peça ao longo da instrução: 0 no começo da linha, 1 no `;`. */
  fracao: number
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
  /**
   * Início da brasa de cada `;` (ms, pelo índice da peça), 0 se apagado.
   * Pode estar no futuro: a cascata da abertura e o toque agendam.
   */
  pulsos: Float64Array
  /** 1 se a brasa é plena (brilho, pulo, onda); 0 se só troca de cor. */
  plena: Uint8Array
  /** 1 no `;` aceso e parado do quadro estático. */
  fixa: Uint8Array
  /**
   * Cada `;` diante do meridiano de ignição: -1 antes dele; 1 armado (acabou
   * de cruzar e espera a vez na porteira); 2 resolvido nesta volta (acendeu
   * ou desistiu); 0 desconhecido (anel montado ou acordado agora: não
   * acende até cruzar de novo, sem pulsos falsos).
   */
  meridiano: Int8Array
  /** O mesmo diante do segundo meridiano de ignição. */
  meridiano2: Int8Array
}

/**
 * Atlas com as linhas de código já compostas, uma por faixa, caractere a
 * caractere na mesma grade espaçada de sempre (aspas já em azul, `;` em
 * branco); ao lado, a mesma grade toda em laranja (a linha que compila); e
 * uma faixa final com o `;` em tinta, em laranja e em laranja negrito.
 */
type AtlasDeLinhas = {
  canvas: HTMLCanvasElement
  /** Altura de uma faixa (px do atlas). */
  altura: number
  /** Largura do espaço (px do atlas). */
  espaco: number
  faixas: { y: number; recortes: { x: number; w: number }[] }[]
  /** Deslocamento em x da cópia laranja das linhas. */
  deslocLaranja: number
  ponto: {
    y: number
    w: number
    xTinta: number
    xLaranja: number
    xNegrito: number
    wNegrito: number
  }
}

/**
 * Brasa plena desenhada neste quadro: o laço dos anéis grava aqui a
 * geometria do `;` e o passe das brasas desenha brilho, onda e o `;`
 * negrito por cima. Os registros são reaproveitados (sem alocação).
 */
type RegistroBrasa = {
  x: number
  y: number
  c: number
  s: number
  largura: number
  altura: number
  /** Alfa do `;` aceso (com a lanterna e a zona calma já aplicadas). */
  acesa: number
  /** Alfa da tinta que sai em crossfade. */
  tinta: number
  brasa: number
  /** Desde a ignição (ms); negativo na brasa parada do quadro estático. */
  decorrido: number
  fora: number
  alfaAnel: number
  /** Centro do `;` na esfera unitária, antes da matriz do quadro. */
  ex: number
  ey: number
  ez: number
  /** Cosseno e seno do ângulo do `;` no anel (base tangente da onda). */
  cm: number
  sm: number
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

/**
 * Sprite do brilho da brasa: disco laranja radial, desenhado uma vez. O
 * perfil (paradas de alfa) separa o núcleo denso do halo largo e macio.
 */
function criarBrilho(
  cor: string,
  paradas: readonly (readonly [number, number])[],
): HTMLCanvasElement {
  const tamanho = 64
  const c = document.createElement("canvas")
  c.width = tamanho
  c.height = tamanho
  const g = c.getContext("2d")
  if (!g) return c
  const meio = tamanho / 2
  const grad = g.createRadialGradient(meio, meio, 0, meio, meio, meio)
  for (const [posicao, alfa] of paradas) {
    grad.addColorStop(posicao, rgba(cor, alfa))
  }
  g.fillStyle = grad
  g.fillRect(0, 0, tamanho, tamanho)
  return c
}

/**
 * Pulo de escala do `;` aceso, de 0 a 1 no tempo `u` (0..1): sobe com
 * leve overshoot (back-out, pico de ~1,1 perto de 23 % do tempo, junto com
 * a cor) até 40 % e volta macio ao tamanho.
 */
function pulo(u: number): number {
  if (u <= 0 || u >= 1) return 0
  if (u < 0.4) {
    const x = u / 0.4 - 1
    return 1 + 2.70158 * x * x * x + 1.70158 * x * x
  }
  return 1 - suave((u - 0.4) / 0.6)
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
  // O `;` aceso é negrito (peso 700, como o do título): mais largo que o da
  // grade, ganha recorte próprio e é desenhado centrado no lugar do outro.
  const fonteNegrito = `700 ${tamanhoPx * dpr}px ${familia}`
  ctx.font = fonteNegrito
  const wNegrito = Math.ceil(ctx.measureText(";").width) + 2 * dpr
  // A cópia laranja das linhas fica ao lado da de tinta, com folga para o
  // filtro de um recorte não puxar a borda do outro.
  const deslocLaranja = maisLarga + 2 * dpr
  // Mudar o tamanho do canvas zera o contexto: a fonte vem de novo depois.
  canvas.width = Math.max(1, deslocLaranja + maisLarga, 2 * wPonto + wNegrito)
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
  // Linhas em laranja: copia a grade e recolore só onde há tinta
  // (`source-atop`), em duas chamadas em vez de um fillText por caractere.
  const alturaLinhas = linhas.length * altura
  if (maisLarga > 0 && alturaLinhas > 0) {
    ctx.drawImage(
      canvas,
      0,
      0,
      maisLarga,
      alturaLinhas,
      deslocLaranja,
      0,
      maisLarga,
      alturaLinhas,
    )
    ctx.globalCompositeOperation = "source-atop"
    ctx.fillStyle = CONFIG.cores.laranja
    ctx.fillRect(deslocLaranja, 0, maisLarga, alturaLinhas)
    ctx.globalCompositeOperation = "source-over"
  }
  const yPonto = alturaLinhas
  ctx.fillStyle = CONFIG.cores.preto
  ctx.fillText(";", dpr, yPonto + altura / 2)
  ctx.fillStyle = CONFIG.cores.laranja
  ctx.fillText(";", wPonto + dpr, yPonto + altura / 2)
  ctx.font = fonteNegrito
  ctx.fillText(";", 2 * wPonto + dpr, yPonto + altura / 2)
  return {
    canvas,
    altura,
    espaco,
    faixas,
    deslocLaranja,
    ponto: {
      y: yPonto,
      w: wPonto,
      xTinta: 0,
      xLaranja: wPonto,
      xNegrito: 2 * wPonto,
      wNegrito,
    },
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
  const BRASA = CONFIG.brasa
  // Núcleo denso (cai rápido) e halo largo (cai devagar): o "bloom".
  const nucleo = criarBrilho(CONFIG.cores.laranja, [
    [0, 1],
    [0.4, 0.62],
    [1, 0],
  ])
  const haloBrasa = criarBrilho(CONFIG.cores.laranja, [
    [0, 1],
    [0.25, 0.6],
    [0.6, 0.18],
    [1, 0],
  ])
  // Tamanho e DPR da última montagem: resize sem mudança real não remonta.
  let medidaMontada = ""
  // Fim de cada brasa plena acesa ou agendada (ms), em ordem: conta as
  // simultâneas.
  const fimDasBrasas: number[] = []
  // Porteira da cadência: balde de fichas (teto de taxa) e a última ignição
  // plena (intervalo mínimo).
  const porteira: { fichas: number; recarga: number; ultima: number } = {
    fichas: BRASA.cadencia.rajada,
    recarga: 0,
    ultima: -1e9,
  }
  // Contadores gravados no canvas (lidos só por testes e capturas).
  let ignicoes = 0
  let ignicoesVisiveis = 0
  // Brasas plenas deste quadro (ver RegistroBrasa), reaproveitadas.
  const registros: RegistroBrasa[] = Array.from({ length: 16 }, () => ({
    x: 0,
    y: 0,
    c: 1,
    s: 0,
    largura: 0,
    altura: 0,
    acesa: 0,
    tinta: 0,
    brasa: 0,
    decorrido: 0,
    fora: 0,
    alfaAnel: 0,
    ex: 0,
    ey: 0,
    ez: 0,
    cm: 1,
    sm: 0,
  }))
  // Círculo da onda: cosseno e seno de cada ponto, calculados uma vez.
  const pontosOnda = BRASA.onda.pontos
  const ondaCos = new Float64Array(pontosOnda + 1)
  const ondaSen = new Float64Array(pontosOnda + 1)
  for (let i = 0; i <= pontosOnda; i += 1) {
    ondaCos[i] = Math.cos((i / pontosOnda) * Math.PI * 2)
    ondaSen[i] = Math.sin((i / pontosOnda) * Math.PI * 2)
  }
  /**
   * Pedido de ignição perto de um ponto (cascata da abertura, toque): o
   * próximo quadro junta os `;` livres e visíveis e agenda os mais perto.
   */
  const pedido = {
    ativo: false,
    /** A cascata da abertura (fura o balde); o toque não fura. */
    abertura: false,
    x: 0,
    y: 0,
    raio: 0,
    quantos: 0,
    passoMs: 0,
  }
  // A faísca da abertura ainda não saiu: até lá, nada acende sozinho.
  let aberturaPendente = preset.nasceNoTitulo && preset.pulsosNoMeridiano
  const candidatos: {
    anel: Anel
    k: number
    x: number
    y: number
    d: number
  }[] = []
  // O quadro estático escolhe de novo os `;` acesos e parados.
  let escolherFixas = false
  // Passeio da lanterna autônoma (px do canvas): faixa visível fora da
  // zona calma (x0..x1, y0..y1, com centro e amplitude da curva) e o disco
  // do globo (centro gx, gy e raio gr) que prende o alvo.
  const passeio = {
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 0,
    cx: 0,
    cy: 0,
    ax: 0,
    ay: 0,
    gx: 0,
    gy: 0,
    gr: 0,
  }
  // Topo do canvas na página, altura da janela e do header, e o véu de saída
  // (topo e limite do que ainda se vê nele), em px do canvas: o que está na
  // tela.
  let topoNaPagina = 0
  let alturaJanela = 1
  let alturaHeader = 0
  let topoDoVeu = 1e9
  let limiteDoVeu = 1e9
  // Meridianos de ignição (rad): no desktop, 0 e o segundo da configuração;
  // no celular, os da faixa livre (o segundo é NaN quando não há).
  let meridianoIgnicao = 0
  let meridianoIgnicao2 = Number.NaN
  // Último movimento do mouse (aparelho híbrido: o mouse manda na lanterna).
  let ultimoMouse = -1e9
  let ultimoToque = -1e9
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
  // Caixa do rótulo "Rolar" (com a mesma margem): segunda zona calma. No
  // celular, com o véu curto, o globo passa atrás dele, e o rótulo também é
  // texto visível que precisa de AA.
  const rotulo = { l: 0, t: 0, r: 0, b: 0, ativo: false }
  /** Distância (px) do ponto até a zona calma mais próxima; 0 dentro dela. */
  const distanciaCalma = (x: number, y: number) => {
    let d = Number.POSITIVE_INFINITY
    if (calma.ativa) {
      const fx = Math.max(calma.l - x, x - calma.r, 0)
      const fy = Math.max(calma.t - y, y - calma.b, 0)
      d = Math.sqrt(fx * fx + fy * fy)
    }
    if (rotulo.ativo) {
      const fx = Math.max(rotulo.l - x, x - rotulo.r, 0)
      const fy = Math.max(rotulo.t - y, y - rotulo.b, 0)
      d = Math.min(d, Math.sqrt(fx * fx + fy * fy))
    }
    return d
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
    // Algum anel ganhou peças novas (os arrays de brasa não foram reaproveitados).
    let recomecou = false
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
      const nova = (
        sx: number,
        sy: number,
        sw: number,
        theta: number,
      ): Peca => ({
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
        ponto: -1,
        fracao: 0,
      })
      let percorrido = 0
      let k = Math.floor(aleatorio() * LINHAS_DE_CODIGO.length)
      let guarda = 0
      while (percorrido < circunferencia && guarda < 40) {
        const indice = k % LINHAS_DE_CODIGO.length
        const caracteres = [...(LINHAS_DE_CODIGO[indice] ?? "")]
        const faixa = faixas[indice]
        // Primeira peça da instrução em composição (a linha que compila).
        let inicioInstrucao = pecas.length
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
              const kp = pecas.length
              p.ponto = kp
              p.fracao = 1
              pecas.push(p)
              // As peças da instrução apontam para o `;` que a encerra,
              // com a posição ao longo dela (a onda quente corre de 0 a 1).
              const inicio = pecas[inicioInstrucao]?.theta ?? theta
              const extensao = Math.max(theta - inicio, 1e-6)
              for (let q = inicioInstrucao; q < kp; q += 1) {
                const peca = pecas[q]
                if (!peca) continue
                peca.ponto = kp
                peca.fracao = Math.min(
                  1,
                  (peca.theta + peca.dTheta / 2 - inicio) / extensao,
                )
              }
              inicioInstrucao = kp + 1
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
      // Com as mesmas peças (troca de DPR, resize pequeno), as brasas em
      // curso continuam: nenhuma some de um quadro para o outro.
      const mesmas = anterior?.pecas.length === pecas.length
      if (!mesmas) recomecou = true
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
        pulsos:
          mesmas && anterior ? anterior.pulsos : new Float64Array(pecas.length),
        plena:
          mesmas && anterior ? anterior.plena : new Uint8Array(pecas.length),
        fixa: new Uint8Array(pecas.length),
        meridiano:
          mesmas && anterior ? anterior.meridiano : new Int8Array(pecas.length),
        meridiano2:
          mesmas && anterior
            ? anterior.meridiano2
            : new Int8Array(pecas.length),
      })
    }
    aneis = novos
    // Brasas de peças que deixaram de existir não contam mais como acesas.
    if (recomecou) fimDasBrasas.length = 0
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
    const cr = secao.querySelector(".hero-rolar")?.getBoundingClientRect()
    if (cr && cr.width > 0) {
      const m = L.zonaCalma.margemPx
      rotulo.l = cr.left - caixa.left - m
      rotulo.t = cr.top - caixa.top - m
      rotulo.r = cr.right - caixa.left + m
      rotulo.b = cr.bottom - caixa.top + m
      rotulo.ativo = true
    } else {
      rotulo.ativo = false
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
    alturaHeader = header ? header.getBoundingClientRect().height : 0
    topoNaPagina = caixa.top + window.scrollY
    alturaJanela = Math.max(1, window.innerHeight)
    // Véu de saída (gradiente no rodapé do hero, por cima do canvas): o que
    // cai nele não conta como visível; só o começo dele (`veuVisivel`) ainda
    // deixa ver uma brasa.
    const veu = secao.querySelector(".hero-veu")?.getBoundingClientRect()
    const alturaVeu = veu ? veu.height : 0
    topoDoVeu = veu && alturaVeu > 0 ? veu.top - caixa.top : H
    limiteDoVeu = topoDoVeu + CONFIG.brasa.veuVisivel * alturaVeu
    // Fundo do que se vê no topo da página: a janela ou o véu, o que vier antes.
    const fundoDaJanela = Math.min(H, alturaJanela - topoNaPagina)
    const fundoVisivel = Math.min(fundoDaJanela, limiteDoVeu)
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
      // O limbo de baixo do globo nunca fica acima da dobra: em telas altas
      // os glifos se amontoavam no horizonte e sobrava uma faixa vazia.
      cy = Math.max(cy, fundoDaJanela - 0.9 * R)
    }
    // Meridianos de ignição: no desktop, o da frente e um segundo um pouco à
    // direita (só o da frente cruza poucos paralelos acima do véu); no
    // celular, os da faixa livre entre o texto e o véu.
    const MD = CONFIG.brasa.meridianoDesktop
    meridianoIgnicao = 0
    meridianoIgnicao2 = MD.segundo ? MD.segundoRad : Number.NaN
    if (W < 768) {
      meridianoIgnicao2 = Number.NaN
      escolherMeridianos(fundoVisivel)
    }
    // Diagnóstico (lido só por testes e capturas), como `degrau` e `custo`.
    canvas.dataset.meridiano = Number.isNaN(meridianoIgnicao2)
      ? meridianoIgnicao.toFixed(2)
      : `${meridianoIgnicao.toFixed(2)},${meridianoIgnicao2.toFixed(2)}`
    // Passeio da lanterna autônoma: a parte do disco do globo que está na
    // tela (no topo da página, acima do véu), fora da zona calma. Entre
    // "abaixo do texto" e "à direita do texto", fica a faixa maior. O alvo é
    // preso à faixa e ao disco a cada quadro (ver `passo`): a lanterna nunca
    // para atrás do texto, mesmo com o centro do globo lá.
    const LA = CONFIG.lanternaAutonoma
    let x0 = Math.max(0, cx - R) + LA.margemPx
    const x1 = Math.min(W, cx + R) - LA.margemPx
    let y0 = Math.max(0, cy - R) + LA.margemPx
    const y1 = Math.min(fundoVisivel, cy + R) - LA.margemPx
    if (calma.ativa) {
      const livre = LA.afastamentoCalmaPx
      const abaixo =
        Math.max(0, x1 - x0) * Math.max(0, y1 - Math.max(y0, calma.b + livre))
      const direita =
        Math.max(0, x1 - Math.max(x0, calma.r + livre)) * Math.max(0, y1 - y0)
      if (abaixo >= direita) y0 = Math.max(y0, calma.b + livre)
      else x0 = Math.max(x0, calma.r + livre)
    }
    passeio.x0 = x0
    passeio.x1 = Math.max(x0, x1)
    passeio.y0 = y0
    passeio.y1 = Math.max(y0, y1)
    passeio.cx = (passeio.x0 + passeio.x1) / 2
    passeio.cy = (passeio.y0 + passeio.y1) / 2
    passeio.ax = (passeio.x1 - passeio.x0) / 2
    passeio.ay = (passeio.y1 - passeio.y0) / 2
    passeio.gx = cx
    passeio.gy = cy
    passeio.gr = LA.discoR * R
  }

  /**
   * Meridianos de ignição do celular (rad ao longo dos paralelos). Com o
   * texto ocupando a largura toda, só sobra uma faixa livre entre a zona
   * calma (mais `afastamentoCalmaPx`) e o véu, e um meridiano só cruza
   * poucos paralelos ali. Entre -`limiteRad` e +`limiteRad`, cada
   * deslocamento ganha uma nota: os cruzamentos de paralelo na faixa,
   * pesados pela frente da esfera e pela distância ao texto (as duas fazem
   * a brasa brilhar mais). Fica o de nota maior (no empate, o mais perto do
   * preferido, `rad`) ou, com `segundo`, o par afastado de pelo menos
   * `separacaoRad` com a maior soma, se o mais fraco valer `segundoMinimo`
   * do outro: duas linhas de ignição dobram as brasas numa faixa estreita.
   * Só conta (sem desenhar), uma vez por geometria.
   */
  const escolherMeridianos = (fundo: number) => {
    const MC = CONFIG.brasa.meridianoCelular
    meridianoIgnicao = MC.rad
    if (!MC.adaptativo) return
    const topo = calma.ativa ? calma.b + MC.afastamentoCalmaPx : 0
    if (fundo - topo < 8) return
    const incl = mul(
      rotZ(CONFIG.inclinacaoZ * GRAUS),
      rotX(CONFIG.inclinacaoX * GRAUS),
    )
    const n = Math.min(preset.paralelos, CONFIG.paralelosCelular)
    const latMax = CONFIG.latitudeMax * GRAUS
    const deslocamentos: number[] = []
    const notas: number[] = []
    for (let d = -MC.limiteRad; d <= MC.limiteRad + 1e-9; d += 0.05) {
      const sd = Math.sin(d)
      const cd = Math.cos(d)
      let nota = 0
      for (let i = 0; i < n; i += 1) {
        const lat = (i / (n - 1) - 0.5) * 2 * latMax
        const r = Math.cos(lat)
        const y = Math.sin(lat)
        const px = r * sd
        const pz = r * cd
        const frente = incl[6] * px + incl[7] * y + incl[8] * pz
        if (frente < 0.2) continue
        const sp = CONFIG.foco / (CONFIG.foco - frente)
        const x = cx + (incl[0] * px + incl[1] * y + incl[2] * pz) * R * sp
        const yy = cy + (incl[3] * px + incl[4] * y + incl[5] * pz) * R * sp
        if (x < 16 || x > W - 16 || yy < topo || yy > fundo) continue
        const fora = calma.ativa
          ? suave((yy - calma.b) / CONFIG.layout.zonaCalma.transicaoPx)
          : 1
        nota += suave(frente / 0.85) * fora
      }
      deslocamentos.push(d)
      notas.push(nota)
    }
    // Nota com desempate: perto do preferido ganha por pouco.
    const nota = (i: number) =>
      (notas[i] ?? 0) - 0.02 * Math.abs((deslocamentos[i] ?? 0) - MC.rad)
    let primeiro = -1
    notas.forEach((n, i) => {
      if (n > 0 && (primeiro < 0 || nota(i) > nota(primeiro))) primeiro = i
    })
    if (primeiro < 0) return
    meridianoIgnicao = deslocamentos[primeiro] ?? MC.rad
    if (!MC.segundo) return
    // O par (afastado de `separacaoRad`) de soma maior; o mais forte dos
    // dois é o primeiro. Só vale se o segundo tiver `segundoMinimo` da nota
    // do primeiro.
    let par: [number, number] | null = null
    let somaPar = Number.NEGATIVE_INFINITY
    for (let a = 0; a < notas.length; a += 1) {
      for (let b = a + 1; b < notas.length; b += 1) {
        const da = deslocamentos[a] ?? 0
        const db = deslocamentos[b] ?? 0
        if (Math.abs(da - db) < MC.separacaoRad - 1e-9) continue
        const [forte, fraco] = nota(a) >= nota(b) ? [a, b] : [b, a]
        if ((notas[fraco] ?? 0) < MC.segundoMinimo * (notas[forte] ?? 0)) {
          continue
        }
        if ((notas[fraco] ?? 0) <= 0) continue
        const soma = nota(a) + nota(b)
        if (soma > somaPar) {
          somaPar = soma
          par = [forte, fraco]
        }
      }
    }
    if (par) {
      meridianoIgnicao = deslocamentos[par[0]] ?? MC.rad
      meridianoIgnicao2 = deslocamentos[par[1]] ?? Number.NaN
    }
  }

  /**
   * Estado de um `;` diante de um meridiano de ignição, a cada quadro (ver
   * Anel.meridiano): ao cruzar (`l` de < 0 para ≥ 0, perto dele) ele se
   * arma e espera a vez na porteira enquanto estiver na janela; a porteira
   * atrasa em vez de descartar.
   */
  const avancarMeridiano = (
    estado: number,
    l: number,
    livre: boolean,
    pode: boolean,
  ): number => {
    let m = estado
    if (l < 0) m = -1
    else if (m === -1) m = l < 0.3 ? 1 : 2
    else if (m === 0) m = 2
    if (m === 1 && (l > BRASA.janelaMeridianoRad || !livre || !pode)) m = 2
    return m
  }

  const redimensionar = () => {
    geometria()
    if (`${W}x${H}@${dpr}` !== medidaMontada) montarAneis()
  }

  // Projeção em perspectiva: um ponto da esfera unitária já rotacionado
  // (qx, qy, qz) vai para a tela em centro + q · R · s, com s = F / (F − qz).
  // Feita inline no laço quente, sem alocar objeto por glifo.
  const F = CONFIG.foco

  /**
   * Registra uma ignição a partir de `inicio` (pode ser no futuro: cascata
   * e toque agendam) e grava os contadores no canvas, só neste momento.
   * Visível = plena: na tela e fora da zona calma.
   */
  const acender = (
    anel: Anel,
    k: number,
    inicio: number,
    plena: boolean,
    x: number,
    y: number,
  ) => {
    anel.pulsos[k] = inicio
    anel.plena[k] = plena ? 1 : 0
    ignicoes += 1
    if (plena) {
      const fim = inicio + BRASA.subidaMs + BRASA.esfriaMs
      let i = fimDasBrasas.length
      while (i > 0 && (fimDasBrasas[i - 1] ?? 0) > fim) i -= 1
      fimDasBrasas.splice(i, 0, fim)
      porteira.ultima = Math.max(porteira.ultima, inicio)
      ignicoesVisiveis += 1
      canvas.dataset.ignicoesVisiveis = String(ignicoesVisiveis)
      canvas.dataset.ignicaoX = x.toFixed(0)
      canvas.dataset.ignicaoY = y.toFixed(0)
      canvas.dataset.ignicaoT = inicio.toFixed(0)
    }
    canvas.dataset.ignicoes = String(ignicoes)
  }
  /**
   * Porteira da cadência. Fora da tela, não acende (não se veria e gastaria
   * a cota); na zona calma só troca de cor e não passa pela porteira; no
   * resto, precisa de ficha no balde, do intervalo mínimo desde a última e
   * de vaga entre as simultâneas. Devolve se acendeu.
   */
  const tentarAcender = (
    anel: Anel,
    k: number,
    x: number,
    y: number,
    fora: number,
    naTela: boolean,
    agora: number,
  ): boolean => {
    if (!naTela) return false
    if (fora < BRASA.foraMinimo) {
      acender(anel, k, agora, false, x, y)
      return true
    }
    const C = BRASA.cadencia
    if (
      porteira.fichas < 1 ||
      agora - porteira.ultima < C.intervaloMinMs ||
      fimDasBrasas.length >= C.simultaneas
    ) {
      return false
    }
    porteira.fichas -= 1
    acender(anel, k, agora, true, x, y)
    return true
  }
  /** Pede ignições perto de (x, y): atendido no próximo quadro animado. */
  const pedir = (
    x: number,
    y: number,
    quantos: number,
    raio: number,
    passoMs: number,
    abertura: boolean,
  ) => {
    if (reduzido.matches || !animar || !preset.pulsosNoMeridiano) return
    pedido.ativo = true
    pedido.abertura = abertura
    pedido.x = x
    pedido.y = y
    pedido.quantos = quantos
    pedido.raio = raio
    pedido.passoMs = passoMs
  }

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
    // Quadro estático (sem aceleração ou com movimento reduzido): nada
    // acende; só os `;` escolhidos ficam acesos e parados.
    const parado = reduzido.matches || !animar
    // Brasas plenas acesas ou agendadas (a lista está em ordem de fim).
    while (fimDasBrasas.length > 0 && (fimDasBrasas[0] ?? 0) <= agora) {
      fimDasBrasas.shift()
    }
    const duracaoBrasa = BRASA.subidaMs + BRASA.esfriaMs
    // Nada acende enquanto o globo nasce: a primeira brasa é a faísca da
    // abertura.
    const podeAcender =
      !parado &&
      preset.pulsosNoMeridiano &&
      estado.escala > 0.999 &&
      estado.revelacao > 0.999
    // O meridiano e a lanterna só acendem depois da faísca da abertura.
    const podeAcenderSozinho = podeAcender && !aberturaPendente
    // Balde de fichas da cadência: enche com o tempo, até a rajada.
    if (!parado) {
      const C = BRASA.cadencia
      if (porteira.recarga > 0) {
        porteira.fichas = Math.min(
          C.rajada,
          porteira.fichas + ((agora - porteira.recarga) / 1000) * C.porSegundo,
        )
      }
      porteira.recarga = agora
    }
    // O que está na tela, em px do canvas: a seção pode ser mais alta que a
    // janela, a página pode ter rolado, o header e o véu cobrem as pontas.
    // Depois de rolar, o header fica opaco e cobre o topo; embaixo, o véu.
    const rolado = window.scrollY - topoNaPagina
    const vistaT = Math.max(
      0,
      rolado +
        (document.documentElement.hasAttribute("data-rolado")
          ? alturaHeader
          : 0),
    )
    const vistaB = Math.min(H, rolado + alturaJanela, limiteDoVeu)
    const deslocMeridiano = meridianoIgnicao
    const deslocMeridiano2 = meridianoIgnicao2
    const doisMeridianos = !Number.isNaN(deslocMeridiano2)
    const lanternaAcende =
      podeAcenderSozinho && lanternaAtiva && (!toque || BRASA.lanterna.autonoma)
    const raioAcende2 = BRASA.lanterna.raioPx * BRASA.lanterna.raioPx
    const juntar = pedido.ativo && podeAcender
    if (juntar) candidatos.length = 0
    let nRegistros = 0

    const alturaGlifo = atlasDeLinhas.altura / dpr
    const alturaAtlas = atlasDeLinhas.altura
    const imagem = atlasDeLinhas.canvas
    const xLaranja = atlasDeLinhas.ponto.xLaranja
    const deslocLaranja = atlasDeLinhas.deslocLaranja
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

    // Quadro estático: escolhe os `;` que ficam acesos e parados. Só a
    // conta da projeção do centro de cada `;` (nenhuma chamada de Canvas):
    // os mais de frente, na tela, longe da zona calma e afastados entre si.
    if (escolherFixas) {
      escolherFixas = false
      const E = BRASA.estatico
      const escolhidos: { x: number; y: number }[] = []
      const minimo = E.distanciaMinR * Rv
      const fundoFixas = Math.min(vistaB, topoDoVeu) - 12
      // Um ponto da esfera (antes da matriz) serve para brasa parada? De
      // frente, longe das bordas, acima do topo do véu, fora da zona calma
      // (com a régua da brasa plena) e afastado das já escolhidas.
      const naFaixa = (px: number, y: number, pz: number) => {
        const frente = t6 * px + t7 * y + t8 * pz
        if (frente < 0.35) return null
        const qz = m6 * px + m7 * y + m8 * pz
        const sp = F / (F - qz)
        const x = centroX + (m0 * px + m1 * y + m2 * pz) * Rv * sp
        const yy = centroY + (m3 * px + m4 * y + m5 * pz) * Rv * sp
        if (x < 24 || x > W - 24 || yy < vistaT + 24 || yy > fundoFixas) {
          return null
        }
        const fora = suave(distanciaCalma(x, yy) / zonaTransicao)
        if (fora < BRASA.foraMinimo) return null
        if (escolhidos.some((o) => Math.hypot(o.x - x, o.y - yy) < minimo)) {
          return null
        }
        return { x, y: yy, frente }
      }
      candidatos.length = 0
      for (const anel of aneis) {
        anel.fixa.fill(0)
        if (anel.alvo < 1) continue
        const rotacao = anel.rot + rotExtra
        const cr = Math.cos(rotacao)
        const sr = Math.sin(rotacao)
        anel.pecas.forEach((p, k) => {
          if (!p.semicolon) return
          let cm = (p.c1 + p.c2) * cr - (p.s1 + p.s2) * sr
          let sm = (p.s1 + p.s2) * cr + (p.c1 + p.c2) * sr
          const norma = Math.sqrt(cm * cm + sm * sm) || 1
          cm /= norma
          sm /= norma
          const ponto = naFaixa(-anel.r * cm, anel.y, anel.r * sm)
          if (ponto) {
            candidatos.push({
              anel,
              k,
              x: ponto.x,
              y: ponto.y,
              d: -ponto.frente,
            })
          }
        })
      }
      candidatos.sort((a, b) => a.d - b.d)
      for (const cand of candidatos) {
        if (escolhidos.length >= E.quantos) break
        if (
          escolhidos.some(
            (o) => Math.hypot(o.x - cand.x, o.y - cand.y) < minimo,
          )
        ) {
          continue
        }
        cand.anel.fixa[cand.k] = 1
        escolhidos.push(cand)
      }
      candidatos.length = 0
      // Faixa estreita (celular) sem `;` suficientes nela: gira o anel até
      // um `;` cair num meridiano de ignição dentro da faixa. No quadro
      // parado ninguém vê o anel girar, e ele segue preso aos glifos.
      const longitudes = [meridianoIgnicao, meridianoIgnicao2, 0, 0.3, -0.3]
      for (const anel of aneis) {
        if (escolhidos.length >= E.quantos) break
        if (anel.alvo < 1 || anel.fixa.includes(1)) continue
        for (const lambda of longitudes) {
          if (Number.isNaN(lambda)) continue
          const ponto = naFaixa(
            anel.r * Math.sin(lambda),
            anel.y,
            anel.r * Math.cos(lambda),
          )
          if (!ponto) continue
          // O `;` mais perto dessa longitude (ângulo no anel = lf + 90°).
          const alvo = lambda + Math.PI / 2 - anel.rot - rotExtra
          let melhor = -1
          let menor = Number.POSITIVE_INFINITY
          anel.pecas.forEach((p, k) => {
            if (!p.semicolon) return
            const desvio = Math.abs(envolve(p.theta + p.dTheta / 2 - alvo))
            if (desvio < menor) {
              menor = desvio
              melhor = k
            }
          })
          const p = anel.pecas[melhor]
          if (!p) break
          anel.rot += envolve(alvo - (p.theta + p.dTheta / 2))
          anel.fixa[melhor] = 1
          escolhidos.push(ponto)
          break
        }
      }
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
            anel.meridiano.fill(0)
            anel.meridiano2.fill(0)
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
          // `fora` (0 na caixa do texto, 1 a `transicaoPx` dela) é o que
          // libera os efeitos da brasa: dentro, só a troca de cor.
          let fatorCalma = 1
          let fora = 1
          if (!atras) {
            const d = distanciaCalma(meioX, meioY)
            if (d < zonaTransicao) {
              fora = suave(d / zonaTransicao)
              fatorCalma = calmaMin + (1 - calmaMin) * fora
              alfa *= fatorCalma
            }
          }
          if (alfa <= 0.01) continue

          let alfaTinta = alfa
          if (lanternaAtiva && !atras) {
            const lx = lanterna.x - meioX
            const ly = lanterna.y - meioY
            const d = Math.sqrt(lx * lx + ly * ly)
            const foco = 1 - suave((d - 40) / CONFIG.raioLanterna)
            if (foco > 0)
              alfaTinta = alfa + (0.95 * alfaAnel - alfa) * foco * fora
          }

          if (atras) {
            pintar(p.sx, p, ax, ay, c, s, largura, altura, alfaTinta)
            continue
          }

          if (p.semicolon) {
            // Brasa do `;`: parada (quadro estático) ou pelo tempo.
            let brasa = 0
            let plena = false
            let decorrido = -1
            if (parado) {
              if (anel.fixa[k] === 1) {
                brasa = BRASA.estatico.nivel
                plena = true
              }
            } else {
              // Cruzamento do(s) meridiano(s) de ignição. O deslocamento do
              // celular vale só para a ignição: `lf` também desenha a fita.
              const lfIg =
                deslocMeridiano === 0 ? lf : envolve(lf - deslocMeridiano)
              const inicio = anel.pulsos[k] ?? 0
              const livre = inicio <= 0 || agora - inicio >= duracaoBrasa
              let meridiano = avancarMeridiano(
                anel.meridiano[k] ?? 0,
                lfIg,
                livre,
                podeAcenderSozinho,
              )
              let meridiano2 = 2
              if (doisMeridianos) {
                meridiano2 = avancarMeridiano(
                  anel.meridiano2[k] ?? 0,
                  envolve(lf - deslocMeridiano2),
                  livre,
                  podeAcenderSozinho,
                )
              }
              const armado = meridiano === 1 || meridiano2 === 1
              if (podeAcender && livre) {
                // Na tela inteira: longe da borda, o brilho não sai cortado.
                const naTela =
                  meioX >= 12 &&
                  meioX <= W - 12 &&
                  meioY >= vistaT &&
                  meioY <= vistaB
                // Sob a lanterna (mouse ou passeio autônomo), se não acendeu
                // há pouco: com o ponteiro parado, o mesmo `;` não repisca.
                let sob = false
                if (
                  !armado &&
                  lanternaAcende &&
                  (inicio <= 0 || agora - inicio >= BRASA.lanterna.recargaMs)
                ) {
                  const lx = lanterna.x - meioX
                  const ly = lanterna.y - meioY
                  sob = lx * lx + ly * ly < raioAcende2
                }
                if (armado) {
                  // Fora da tela não há o que esperar: desiste nesta volta.
                  if (
                    !naTela ||
                    tentarAcender(anel, k, meioX, meioY, fora, naTela, agora)
                  ) {
                    if (meridiano === 1) meridiano = 2
                    if (meridiano2 === 1) meridiano2 = 2
                  }
                } else if (sob) {
                  tentarAcender(anel, k, meioX, meioY, fora, naTela, agora)
                } else if (
                  juntar &&
                  naTela &&
                  zi > 0.2 &&
                  fora >= BRASA.foraMinimo
                ) {
                  const ddx = meioX - pedido.x
                  const ddy = meioY - pedido.y
                  const d = Math.sqrt(ddx * ddx + ddy * ddy)
                  if (d <= pedido.raio) {
                    candidatos.push({ anel, k, x: meioX, y: meioY, d })
                  }
                }
              }
              anel.meridiano[k] = meridiano
              if (doisMeridianos) anel.meridiano2[k] = meridiano2
              const ini = anel.pulsos[k] ?? 0
              decorrido = agora - ini
              if (ini > 0 && decorrido >= 0 && decorrido < duracaoBrasa) {
                // Acende rápido e esfria devagar (curva de brasa).
                const esfriou = (decorrido - BRASA.subidaMs) / BRASA.esfriaMs
                brasa =
                  decorrido < BRASA.subidaMs
                    ? suave(decorrido / BRASA.subidaMs)
                    : (1 - esfriou) * (1 - esfriou)
                plena = anel.plena[k] === 1
              }
            }
            if (brasa <= 0) {
              pintar(p.sx, p, ax, ay, c, s, largura, altura, alfaTinta)
              continue
            }
            // Tinta saindo; o laranja entra por cima. Na subida a tinta sai
            // mais rápido que o laranja entra: o `;` que pula já é laranja,
            // não um `;` preto grande.
            const sai = 1 - brasa
            const tinta =
              alfaTinta * (decorrido < BRASA.subidaMs ? sai * sai : sai)
            const acesa = alfa + (0.95 * alfaAnel - alfa) * fora
            const registro = plena ? registros[nRegistros] : undefined
            if (registro) {
              // Plena: o passe das brasas desenha brilho, onda, a tinta
              // saindo e o `;` negrito, os dois com o mesmo pulo (senão o
              // crossfade mostra dois `;` de tamanhos diferentes).
              nRegistros += 1
              let cm = cl + cl2
              let sm = sl + sl2
              const norma = Math.sqrt(cm * cm + sm * sm) || 1
              cm /= norma
              sm /= norma
              registro.x = meioX
              registro.y = meioY
              registro.c = c
              registro.s = s
              registro.largura = largura
              registro.altura = altura
              registro.acesa = acesa
              registro.tinta = tinta
              registro.brasa = brasa
              registro.decorrido = decorrido
              registro.fora = fora
              registro.alfaAnel = alfaAnel
              registro.ex = -r * cm
              registro.ey = y
              registro.ez = r * sm
              registro.cm = cm
              registro.sm = sm
            } else {
              // Zona calma: só a cor, atenuada.
              if (tinta > 0.01) {
                pintar(p.sx, p, ax, ay, c, s, largura, altura, tinta)
              }
              pintar(xLaranja, p, ax, ay, c, s, largura, altura, acesa * brasa)
            }
            continue
          }

          // A linha compila: uma onda quente corre a instrução cujo `;`
          // acabou de acender, do começo dela até ele. Fora da zona calma.
          let calor = 0
          if (!parado && p.ponto >= 0) {
            const ini = anel.pulsos[p.ponto] ?? 0
            if (ini > 0 && anel.plena[p.ponto] === 1) {
              const L = BRASA.compila.largura
              const frente =
                -L + ((agora - ini) / BRASA.compila.duracaoMs) * (1 + 2 * L)
              const distancia = Math.abs(frente - p.fracao)
              if (distancia < L) {
                calor = BRASA.compila.pico * (1 - suave(distancia / L)) * fora
              }
            }
          }
          if (calor > 0.01) {
            pintar(
              p.sx,
              p,
              ax,
              ay,
              c,
              s,
              largura,
              altura,
              alfaTinta * (1 - calor),
            )
            pintar(
              p.sx + deslocLaranja,
              p,
              ax,
              ay,
              c,
              s,
              largura,
              altura,
              alfaTinta * calor,
            )
          } else {
            pintar(p.sx, p, ax, ay, c, s, largura, altura, alfaTinta)
          }
        }
        if (!atras) anel.fator = fatorVelocidade
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Pedido atendido (cascata da abertura, toque): os `;` livres mais perto
    // do ponto, afastados entre si (nunca dois vizinhos na mesma linha),
    // respeitando o teto de simultâneas. A cascata da abertura é uma vez só
    // e mantém os 180 ms; o toque passa pela porteira como qualquer brasa
    // (uma ficha cada, intervalo mínimo desde a última): tocar sem parar
    // nunca vira pisca-pisca.
    if (juntar) {
      pedido.ativo = false
      const C = BRASA.cadencia
      const passo = pedido.abertura
        ? pedido.passoMs
        : Math.max(pedido.passoMs, C.intervaloMinMs)
      const primeiraDaCascata = porteira.ultima + C.intervaloMinMs
      if (pedido.abertura) aberturaPendente = false
      candidatos.sort((a, b) => a.d - b.d)
      const escolhidos: { x: number; y: number }[] = []
      const minimo = 3 * alturaGlifo
      for (const cand of candidatos) {
        if (escolhidos.length >= pedido.quantos) break
        if (fimDasBrasas.length >= C.simultaneas) break
        const perto = escolhidos.some(
          (o) => Math.hypot(o.x - cand.x, o.y - cand.y) < minimo,
        )
        if (perto) continue
        let inicio = agora + escolhidos.length * passo
        if (pedido.abertura) {
          // A cascata é a primeira brasa; se alguma acendeu no mesmo
          // instante, ela espera o intervalo mínimo antes de começar.
          inicio =
            Math.max(agora, primeiraDaCascata) + escolhidos.length * passo
        } else {
          if (porteira.fichas < 1) break
          porteira.fichas -= 1
          inicio = Math.max(inicio, porteira.ultima + C.intervaloMinMs)
        }
        acender(cand.anel, cand.k, inicio, true, cand.x, cand.y)
        escolhidos.push(cand)
      }
      candidatos.length = 0
    }

    // Passe das brasas plenas, por cima dos anéis: brilho, onda e `;`
    // negrito com o pulo de escala.
    let eco = 0
    if (nRegistros > 0) {
      const intensidade = BRASA.intensidade
      // Brilho em duas camadas, em `multiply`: tinge de laranja o fundo e os
      // glifos por baixo sem lavar a tinta (o `lighter` some no fundo claro).
      ctx.globalCompositeOperation = "multiply"
      for (let i = 0; i < nRegistros; i += 1) {
        const b = registros[i]
        if (!b) continue
        const nivel = b.brasa * b.fora * b.alfaAnel * intensidade
        if (nivel <= 0.01) continue
        // O brilho nunca entra na caixa calma: o raio para na distância até
        // ela (o sprite chega a zero na borda).
        const ateCalma = distanciaCalma(b.x, b.y)
        const rh = Math.min(
          ateCalma,
          Math.max(b.altura * BRASA.halo.raio, BRASA.halo.raioMinPx),
        )
        ctx.globalAlpha = Math.min(1, BRASA.halo.alfa * nivel)
        ctx.drawImage(haloBrasa, b.x - rh, b.y - rh, rh * 2, rh * 2)
        const rn = Math.min(
          ateCalma,
          Math.max(b.altura * BRASA.nucleo.raio, BRASA.nucleo.raioMinPx),
        )
        ctx.globalAlpha = Math.min(1, BRASA.nucleo.alfa * nivel)
        ctx.drawImage(nucleo, b.x - rn, b.y - rn, rn * 2, rn * 2)
      }
      ctx.globalCompositeOperation = "source-over"

      // Onda: círculo geodésico em volta do `;` (raio angular crescendo),
      // projetado com a esfera, então a curvatura do planeta aparece. Só na
      // frente, nunca na zona calma (o traço se interrompe ali), e some
      // quando o globo achata em fita.
      const O = BRASA.onda
      const curvaOnda = suave((curva - 0.8) / 0.2)
      if (curvaOnda > 0) {
        ctx.strokeStyle = CONFIG.cores.laranja
        ctx.lineWidth = O.espessuraPx
        const rhoMax = Math.max(O.raioRad, O.raioMinPx / Math.max(Rv, 1))
        for (let i = 0; i < nRegistros; i += 1) {
          const b = registros[i]
          if (!b || b.decorrido < 0 || b.decorrido >= O.duracaoMs) continue
          const u = b.decorrido / O.duracaoMs
          const resta = 1 - u
          const alfaOnda =
            O.alfa *
            intensidade *
            resta *
            Math.sqrt(resta) *
            b.fora *
            b.alfaAnel *
            curvaOnda
          if (alfaOnda <= 0.01) continue
          const rho = rhoMax * (1 - resta * resta * resta)
          const cosR = Math.cos(rho)
          const sinR = Math.sin(rho)
          // Base tangente no `;`: e1 ao longo do paralelo, e2 = P × e1.
          const e1x = b.sm
          const e1z = b.cm
          const e2x = b.ey * b.cm
          const e2y = Math.sqrt(b.ex * b.ex + b.ez * b.ez)
          const e2z = -b.ey * b.sm
          ctx.beginPath()
          let caneta = false
          for (let j = 0; j <= pontosOnda; j += 1) {
            const cf = ondaCos[j] ?? 1
            const sf = ondaSen[j] ?? 0
            const qx = cosR * b.ex + sinR * (cf * e1x + sf * e2x)
            const qy = cosR * b.ey + sinR * sf * e2y
            const qw = cosR * b.ez + sinR * (cf * e1z + sf * e2z)
            if (t6 * qx + t7 * qy + t8 * qw < 0.02) {
              caneta = false
              continue
            }
            const zq = m6 * qx + m7 * qy + m8 * qw
            const sq = F / (F - zq)
            const X = centroX + (m0 * qx + m1 * qy + m2 * qw) * Rv * sq
            const Y = centroY + (m3 * qx + m4 * qy + m5 * qw) * Rv * sq
            if (distanciaCalma(X, Y) === 0) {
              caneta = false
              continue
            }
            if (caneta) ctx.lineTo(X, Y)
            else ctx.moveTo(X, Y)
            caneta = true
          }
          ctx.globalAlpha = Math.min(1, alfaOnda)
          ctx.stroke()
        }
      }

      // `;` negrito, com o pulo em torno do centro do glifo. Na borda da
      // zona calma ele volta ao peso da grade em crossfade (por `fora`),
      // sem trocar de glifo num quadro.
      const PA = atlasDeLinhas.ponto
      const proporcao = PA.wNegrito / PA.w
      const E = BRASA.escala
      const ECO = BRASA.ecoPolos
      for (let i = 0; i < nRegistros; i += 1) {
        const b = registros[i]
        if (!b) continue
        const animada = b.decorrido >= 0
        const salto = animada ? pulo(b.decorrido / E.duracaoMs) : 0
        const escala = 1 + E.pico * intensidade * salto * b.fora
        // Eco nos polos: cada ignição soma um impulso curto, com teto.
        if (animada && b.decorrido < ECO.duracaoMs) {
          const subida = Math.min(1, b.decorrido / 80)
          eco += subida * (1 - suave(b.decorrido / ECO.duracaoMs)) * b.fora
        }
        ctx.setTransform(
          dpr * b.c,
          dpr * b.s,
          -dpr * b.s,
          dpr * b.c,
          b.x * dpr,
          b.y * dpr,
        )
        if (b.tinta > 0.01) {
          const lw = b.largura * escala
          const lh = b.altura * escala
          ctx.globalAlpha = Math.min(1, b.tinta)
          ctx.drawImage(
            imagem,
            PA.xTinta,
            PA.y,
            PA.w,
            alturaAtlas,
            -lw / 2,
            -lh / 2,
            lw,
            lh,
          )
        }
        const alfaNegrito = b.acesa * b.brasa * b.fora
        if (alfaNegrito > 0.01) {
          const dw = b.largura * proporcao * escala
          const dh = b.altura * escala
          ctx.globalAlpha = Math.min(1, alfaNegrito)
          ctx.drawImage(
            imagem,
            PA.xNegrito,
            PA.y,
            PA.wNegrito,
            alturaAtlas,
            -dw / 2,
            -dh / 2,
            dw,
            dh,
          )
        }
        const alfaRegular = b.acesa * b.brasa * (1 - b.fora)
        if (alfaRegular > 0.01) {
          ctx.globalAlpha = Math.min(1, alfaRegular)
          ctx.drawImage(
            imagem,
            PA.xLaranja,
            PA.y,
            PA.w,
            alturaAtlas,
            -b.largura / 2,
            -b.altura / 2,
            b.largura,
            b.altura,
          )
        }
      }
      eco = Math.min(ECO.teto, eco) * intensidade
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

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

    // Polos: dois `;` grandes, laranja, projetados com a esfera. Respiram
    // devagar e, a cada ignição, mais forte por um instante (eco, somado no
    // passe das brasas, com teto); somem na fita junto com a curvatura. O
    // polo que cai na zona calma (no celular, o globo fica atrás do texto)
    // é atenuado como os glifos de lá, e ali não tem eco.
    if (estado.polos > 0.01) {
      const base =
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
        const foraPolo = suave(
          distanciaCalma(centroX + qx * Rv * sp, centroY + qy * Rv * sp) /
            zonaTransicao,
        )
        const ecoPolo = eco * foraPolo
        const respira = base + BRASA.ecoPolos.escala * ecoPolo
        const realce = 1 + BRASA.ecoPolos.alfa * ecoPolo
        const tamanho = Rv * 0.17 * respira * sp
        ctx.font = `700 ${tamanho}px ${familia}`
        ctx.fillStyle = CONFIG.cores.laranja
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.globalAlpha = Math.min(
          1,
          estado.polos *
            curva *
            (0.55 + 0.45 * suave((qz + 0.3) / 0.6)) *
            realce *
            foraPolo,
        )
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
    // Aparelho híbrido: enquanto o mouse se mexe (e por `pausaMouseMs`
    // depois), ele manda na lanterna; o passeio só volta sem ele.
    if (
      toque &&
      preset.lanterna &&
      agora - ultimoMouse > CONFIG.lanternaAutonoma.pausaMouseMs
    ) {
      // Sem ponteiro, a lanterna passeia sozinha (Lissajous) pela parte
      // visível do globo fora do texto: o globo continua vivo no toque.
      // O alvo fica na faixa e dentro do disco (corda na altura dele): as
      // duas regiões são convexas, então o caminho amortecido também fica.
      const LA = CONFIG.lanternaAutonoma
      const fase = ((agora / 1000) * Math.PI * 2) / LA.periodoS
      const y = Math.min(
        passeio.y1,
        Math.max(passeio.y0, passeio.cy + passeio.ay * Math.sin(LA.fy * fase)),
      )
      const dy = y - passeio.gy
      const meiaCorda = Math.sqrt(
        Math.max(0, passeio.gr * passeio.gr - dy * dy),
      )
      const xMin = Math.max(passeio.x0, passeio.gx - meiaCorda)
      const xMax = Math.min(passeio.x1, passeio.gx + meiaCorda)
      const x = passeio.cx + passeio.ax * Math.sin(LA.fx * fase)
      lanterna.alvoX =
        xMin <= xMax ? Math.min(xMax, Math.max(xMin, x)) : (xMin + xMax) / 2
      lanterna.alvoY = y
    }
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
  // Fim da cascata da abertura (ms): até lá a decisão rápida não amostra, para
  // as brasas da abertura não empurrarem um aparelho no limite para o estático.
  let medirDepoisDe = 0
  const adaptar = (custo: number, agora: number) => {
    // Durante a entrada o globo ainda é pequeno e tem poucos glifos: esses
    // quadros baratos não dizem nada sobre o custo em regime.
    if (estado.escala < 0.999 || estado.revelacao < 0.999) return
    if (
      amostrasIniciais.length < DESEMPENHO.amostrasParaDecidir &&
      agora < medirDepoisDe
    ) {
      return
    }
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
    if (preset.nasceNoTitulo && preset.pulsosNoMeridiano) {
      // Abertura com faísca: o globo acabou de nascer do `;` do título e uma
      // cascata curta de brasas, da mais perto do título para dentro do
      // planeta, liga um ao outro. Só no modo animado (`pedir` confere).
      const A = CONFIG.brasa.abertura
      linha.call(
        () => {
          medirDepoisDe =
            performance.now() +
            A.quantos * A.passoMs +
            CONFIG.brasa.subidaMs +
            CONFIG.brasa.esfriaMs
          // Sem a faísca (sem âncora ou sem animação), o ritmo normal começa já.
          if (!ponto.ativo || reduzido.matches || !animar) {
            aberturaPendente = false
          }
          if (ponto.ativo) {
            pedir(
              ponto.x,
              ponto.y,
              A.quantos,
              Number.POSITIVE_INFINITY,
              A.passoMs,
              true,
            )
          }
        },
        undefined,
        (inicioRevelacao + 0.95) * fatorEntrada,
      )
    }
  }

  /** Modo estático: um quadro final, redesenhado só na rolagem e no resize. */
  const quadroEstatico = () => {
    estado.revelacao = 1
    estado.polos = 1
    estado.escala = 1
    estado.deslocX = 0
    estado.deslocY = 0
    assentar()
    // Os `;` acesos e parados são escolhidos de novo a cada quadro estático
    // inteiro (início, resize); na rolagem eles seguem presos aos glifos.
    escolherFixas = true
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
    ultimoMouse = performance.now()
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
  /**
   * Toque no hero acende os `;` mais perto do dedo (no próximo quadro). O
   * ouvinte é passivo e nada é cancelado: a rolagem e os CTAs seguem
   * intocados. Toque no bloco de texto não acende nada.
   */
  const aoTocar = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || !montado) return
    const agora = performance.now()
    const T = CONFIG.brasa.toque
    if (agora - ultimoToque < T.intervaloMs) return
    const c = canvas.getBoundingClientRect()
    const x = e.clientX - c.left
    const y = e.clientY - c.top
    if (distanciaCalma(x, y) === 0) return
    ultimoToque = agora
    pedir(x, y, T.quantos, T.raioPx, T.passoMs, false)
  }
  const aoSair = (e: PointerEvent) => {
    // O dedo que sobe também "sai": no toque a lanterna é a autônoma.
    if (e.pointerType !== "mouse") return
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
      // A entrada termina na hora: sem isso, a timeline seguiria mexendo no
      // estado por baixo do quadro estático.
      linha.progress(1).pause()
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
    canvas.dataset.ignicoes = "0"
    canvas.dataset.ignicoesVisiveis = "0"
    if (toque) {
      // A lanterna autônoma parte do centro do passeio (ver `passo`).
      lanterna.alvoX = passeio.cx
      lanterna.alvoY = passeio.cy
      lanterna.x = passeio.cx
      lanterna.y = passeio.cy
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
  secao.addEventListener("pointerdown", aoTocar, { passive: true })
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
    secao.removeEventListener("pointerdown", aoTocar)
    document.removeEventListener("pointerleave", aoSair)
    document.removeEventListener("visibilitychange", aoVisibilidade)
    reduzido.removeEventListener("change", aoMudarMovimento)
    observadorTela.disconnect()
    observadorTamanho.disconnect()
  }
}
