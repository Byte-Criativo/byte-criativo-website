import { gsap } from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

gsap.registerPlugin(DrawSVGPlugin)

/**
 * Motor do protótipo "A Mesma Linha".
 *
 * Uma única linha fechada em forma de 8 nasce no `;` do título e é
 * percorrida por um traço (dash) que viaja sem costura. Quando a cabeça do
 * traço passa por um "slot", uma forma de interface se desenha a partir
 * dali (DrawSVG), segura, pinga um `;` laranja e se desfaz. No lobo de
 * baixo, em vez de interface, o traço vira linhas de código.
 *
 * Tudo em SVG no DOM, com unidades = pixels CSS (viewBox = tamanho da cena).
 */

import type { Variacao } from "./variacao"
export type { Variacao }

export type OpcoesLinha = {
  variacao: Variacao
  /** Caixa do `;` do título, relativa à cena. */
  ancora: () => { x: number; y: number } | null
  /** Caixa do último CTA, relativa à cena (para a composição no celular). */
  limiteTexto: () => number
  movimentoReduzido: boolean
  toque: boolean
}

type Ponto = { x: number; y: number }
type TipoForma = "botao" | "campo" | "card" | "grafico" | "toggle"

const NS = "http://www.w3.org/2000/svg"
const FORMAS: TipoForma[] = ["botao", "campo", "card", "grafico", "toggle"]

const CONFIG = {
  base: { traco: 2.4, formasPorVolta: 3, pingaSempre: true, escala: 1 },
  contida: { traco: 1.8, formasPorVolta: 2, pingaSempre: false, escala: 0.9 },
  ousada: { traco: 2.6, formasPorVolta: 3, pingaSempre: true, escala: 1 },
} as const

/** Período da volta completa do traço, em segundos. */
const PERIODO_S = 8
/** Fração do caminho visível como traço. */
const FRACAO_TRACO = 0.28

// --- utilidades -------------------------------------------------------------

function aleatorio(semente: number): () => number {
  let a = Math.floor(semente * 2 ** 32) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function embaralhar<T>(lista: T[], r: () => number): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const a = copia[i] as T
    copia[i] = copia[j] as T
    copia[j] = a
  }
  return copia
}

/** Curva suave (Catmull-Rom → Bézier cúbica) fechada pelos pontos. */
function caminhoSuave(pontos: Ponto[]): string {
  const n = pontos.length
  const p = (i: number) => pontos[((i % n) + n) % n] as Ponto
  let d = `M ${p(0).x.toFixed(1)} ${p(0).y.toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1)
    const p1 = p(i)
    const p2 = p(i + 1)
    const p3 = p(i + 2)
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d + " Z"
}

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  atributos: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag)
  for (const [k, v] of Object.entries(atributos)) e.setAttribute(k, String(v))
  return e
}

// --- geometria do 8 ---------------------------------------------------------

type Geometria = {
  /** Trecho aberto do `;` até o cruzamento do 8 (fica desenhado, fino). */
  dLead: string
  /** O 8 fechado, percorrido pelo traço viajante. */
  dLaco: string
  pontos: Ponto[]
  /** Distâncias aproximadas (polilinha) de cada ponto do laço. */
  distancias: number[]
  slots: { nome: "topo" | "lado" | "codigo"; indice: number }[]
}

/** Curva aberta suave pelos pontos. */
function caminhoAberto(pontos: Ponto[]): string {
  const n = pontos.length
  const p = (i: number) => pontos[Math.max(0, Math.min(n - 1, i))] as Ponto
  let d = `M ${p(0).x.toFixed(1)} ${p(0).y.toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1)
    const p1 = p(i)
    const p2 = p(i + 1)
    const p3 = p(i + 2)
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

/**
 * Gera a geometria: um trecho aberto que sai do `;` do título e entra no
 * cruzamento do 8, e o 8 fechado (lemniscata) que o traço percorre sem
 * costura. Vertical no desktop (um lobo em cima, um embaixo), horizontal no
 * celular (abaixo do texto).
 */
function gerarGeometria(
  largura: number,
  altura: number,
  ancora: Ponto,
  limiteTexto: number,
  r: () => number,
  ousada: boolean,
): Geometria {
  const horizontal = largura < 900
  const amp = ousada ? 10 : 6

  // Extensões REAIS do 8: meia altura e meia largura em px.
  let cx: number
  let cy: number
  let meiaX: number
  let meiaY: number
  if (horizontal) {
    const topo = limiteTexto + 28
    const base = altura - 24
    cx = largura / 2
    cy = (topo + base) / 2
    meiaX = largura * 0.46
    meiaY = Math.min(96, (base - topo) / 2)
  } else {
    const topo = 128
    const base = altura - 56
    const esquerda = ousada ? largura * 0.06 : ancora.x + 70
    const direita = largura - (ousada ? largura * 0.06 : 72)
    cx = (esquerda + direita) / 2
    cy = (topo + base) / 2
    meiaY = (base - topo) / 2
    meiaX = (direita - esquerda) / 2
  }

  // lead-in aberto: do `;` até o cruzamento, com uma barriga suave
  const inicio = { x: ancora.x + 22, y: ancora.y + 2 }
  const lead: Ponto[] = [
    inicio,
    {
      x: inicio.x + (cx - inicio.x) * 0.5 + (r() - 0.5) * 30,
      y: inicio.y + (cy - inicio.y) * 0.5 - (horizontal ? 0 : 48),
    },
    { x: cx, y: cy },
  ]

  // lemniscata a partir do cruzamento (t = π/2), uma volta completa.
  // u ∈ [-1, 1] e v ∈ [-0,5, 0,5]: os fatores normalizam para as extensões.
  const N = 56
  const pontos: Ponto[] = []
  for (let i = 0; i < N; i++) {
    const t = Math.PI / 2 + (i / N) * Math.PI * 2
    const den = 1 + Math.sin(t) ** 2
    const u = Math.cos(t) / den
    const v = (Math.sin(t) * Math.cos(t)) / den
    const ruido = i === 0 ? 0 : 1
    const p = horizontal
      ? { x: cx + meiaX * u, y: cy + meiaY * v * 2 }
      : { x: cx + meiaX * v * 2, y: cy + meiaY * u }
    pontos.push({
      x: p.x + (r() - 0.5) * amp * ruido,
      y: p.y + (r() - 0.5) * amp * ruido,
    })
  }
  const indiceCruzamento = -1

  const distancias: number[] = [0]
  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1] as Ponto
    const b = pontos[i] as Ponto
    distancias.push(
      (distancias[i - 1] as number) + Math.hypot(b.x - a.x, b.y - a.y),
    )
  }

  // slots: extremos dos lobos
  const idx = (f: (p: Ponto) => number) => {
    let melhor = indiceCruzamento + 2
    for (let i = indiceCruzamento + 2; i < N; i++) {
      if (f(pontos[i] as Ponto) > f(pontos[melhor] as Ponto)) melhor = i
    }
    return melhor
  }
  const slots: Geometria["slots"] = horizontal
    ? [
        { nome: "topo", indice: idx((p) => -p.x) },
        { nome: "lado", indice: idx((p) => p.x) },
        { nome: "codigo", indice: idx((p) => p.y) },
      ]
    : [
        { nome: "topo", indice: idx((p) => -p.y) },
        { nome: "lado", indice: idx((p) => p.x) },
        { nome: "codigo", indice: idx((p) => p.y) },
      ]
  slots.sort((a, b) => a.indice - b.indice)

  return {
    dLead: caminhoAberto(lead),
    dLaco: caminhoSuave(pontos),
    pontos,
    distancias,
    slots,
  }
}

// --- formas de interface ----------------------------------------------------

function criarForma(
  tipo: TipoForma,
  centro: Ponto,
  escala: number,
  classes: { forma: string; codigo: string; codigoString: string },
): SVGGElement {
  const g = el("g", { class: classes.forma, "stroke-width": 2 })
  const add = (d: string, cls?: string) => {
    const p = el("path", { d })
    if (cls) p.setAttribute("class", cls)
    g.append(p)
  }
  const rect = (x: number, y: number, w: number, h: number, rx: number) =>
    `M ${x + rx} ${y} h ${w - 2 * rx} a ${rx} ${rx} 0 0 1 ${rx} ${rx} v ${h - 2 * rx} a ${rx} ${rx} 0 0 1 ${-rx} ${rx} h ${-(w - 2 * rx)} a ${rx} ${rx} 0 0 1 ${-rx} ${-rx} v ${-(h - 2 * rx)} a ${rx} ${rx} 0 0 1 ${rx} ${-rx} Z`
  const s = escala
  const x = centro.x
  const y = centro.y
  switch (tipo) {
    case "botao": {
      const w = 150 * s
      const h = 44 * s
      add(rect(x - w / 2, y - h / 2, w, h, 2))
      add(`M ${x - w / 2 + 26 * s} ${y + 1} h ${w - 52 * s}`)
      break
    }
    case "campo": {
      const w = 196 * s
      const h = 40 * s
      add(`M ${x - w / 2} ${y - h / 2 - 14 * s} h ${54 * s}`)
      add(rect(x - w / 2, y - h / 2, w, h, 2))
      add(`M ${x - w / 2 + 14 * s} ${y - 9 * s} v ${18 * s}`)
      break
    }
    case "card": {
      const w = 184 * s
      const h = 112 * s
      add(rect(x - w / 2, y - h / 2, w, h, 8))
      add(`M ${x - w / 2 + 18 * s} ${y - h / 2 + 26 * s} h ${w - 36 * s}`)
      add(
        `M ${x - w / 2 + 18 * s} ${y - h / 2 + 48 * s} h ${(w - 36 * s) * 0.7}`,
      )
      add(
        `M ${x - w / 2 + 18 * s} ${y - h / 2 + 70 * s} h ${(w - 36 * s) * 0.45}`,
      )
      add(rect(x - w / 2 + 18 * s, y + h / 2 - 32 * s, 56 * s, 18 * s, 2))
      break
    }
    case "grafico": {
      const w = 160 * s
      const h = 96 * s
      const base = y + h / 2
      add(`M ${x - w / 2} ${base} h ${w}`)
      const alturas = [0.45, 0.8, 0.6, 1]
      alturas.forEach((a, i) => {
        const bx = x - w / 2 + 14 * s + i * 38 * s
        add(rect(bx, base - h * a, 22 * s, h * a, 2))
      })
      break
    }
    case "toggle": {
      const w = 52 * s
      const h = 26 * s
      add(`M ${x - w / 2 - 70 * s} ${y + 1} h ${54 * s}`)
      add(rect(x - w / 2, y - h / 2, w, h, h / 2))
      const cxr = x + w / 2 - h / 2
      const rr = h / 2 - 5 * s
      add(
        `M ${cxr - rr} ${y} a ${rr} ${rr} 0 1 0 ${2 * rr} 0 a ${rr} ${rr} 0 1 0 ${-2 * rr} 0`,
      )
      break
    }
  }
  return g
}

function criarCodigo(
  centro: Ponto,
  escala: number,
  classes: { codigo: string; codigoString: string },
): SVGGElement {
  const g = el("g", { class: classes.codigo, "stroke-width": 2 })
  const linhas = [
    { recuo: 0, comp: 92 },
    { recuo: 26, comp: 136, string: true },
    { recuo: 26, comp: 74 },
    { recuo: 52, comp: 118 },
    { recuo: 0, comp: 58 },
  ]
  const s = escala
  const x0 = centro.x - 70 * s
  const y0 = centro.y - 36 * s
  linhas.forEach((l, i) => {
    const p = el("path", {
      d: `M ${x0 + l.recuo * s} ${y0 + i * 18 * s} h ${l.comp * s}`,
    })
    if (l.string) p.setAttribute("class", classes.codigoString)
    g.append(p)
  })
  return g
}

// --- montagem ---------------------------------------------------------------

export type Classes = {
  traco: string
  tracoFundo: string
  forma: string
  codigo: string
  codigoString: string
  semicolon: string
}

export function montarLinha(
  svg: SVGSVGElement,
  classes: Classes,
  opcoes: OpcoesLinha,
): () => void {
  const cena = svg.parentElement as HTMLElement
  const largura = cena.clientWidth
  const altura = cena.clientHeight
  svg.setAttribute("viewBox", `0 0 ${largura} ${altura}`)
  svg.setAttribute("preserveAspectRatio", "none")

  const cfg = CONFIG[opcoes.variacao]
  const ousada = opcoes.variacao === "ousada"
  const semente = Math.random()
  const r = aleatorio(semente)
  const ancora = opcoes.ancora() ?? { x: largura * 0.4, y: altura * 0.45 }
  const horizontal = largura < 900
  const escalaForma = cfg.escala * (horizontal ? 0.62 : 1)

  const geo = gerarGeometria(
    largura,
    altura,
    ancora,
    opcoes.limiteTexto(),
    r,
    false,
  )

  // defs: filtro de traço "à mão"
  const defs = el("defs")
  const filtro = el("filter", {
    id: "linha-mao",
    x: "-5%",
    y: "-5%",
    width: "110%",
    height: "110%",
  })
  filtro.append(
    el("feTurbulence", {
      type: "fractalNoise",
      baseFrequency: "0.012",
      numOctaves: 2,
      seed: Math.floor(r() * 100),
      result: "ruido",
    }),
    el("feDisplacementMap", {
      in: "SourceGraphic",
      in2: "ruido",
      scale: ousada ? 3 : 2.2,
      xChannelSelector: "R",
      yChannelSelector: "G",
    }),
  )
  defs.append(filtro)
  svg.append(defs)

  const grupo = el("g")
  if (!opcoes.toque) grupo.setAttribute("filter", "url(#linha-mao)")
  svg.append(grupo)

  const camadaFundo = el("g")
  const camadaFormas = el("g")
  grupo.append(camadaFundo, camadaFormas)

  // No celular o lead cruzaria o apoio e os CTAs: a linha nasce no 8.
  const lead = el("path", {
    d: horizontal ? "M 0 0" : geo.dLead,
    class: classes.traco,
    "stroke-width": Math.max(1.2, cfg.traco * 0.6),
  })
  const traco = el("path", {
    d: geo.dLaco,
    class: classes.traco,
    "stroke-width": cfg.traco,
  })
  camadaFundo.append(lead, traco)

  const L = traco.getTotalLength()
  // a polilinha fecha no ponto inicial: soma o último trecho
  const ultimo = geo.pontos[geo.pontos.length - 1] as Ponto
  const primeiro = geo.pontos[0] as Ponto
  const comprimentoPolilinha =
    (geo.distancias[geo.distancias.length - 1] as number) +
    Math.hypot(ultimo.x - primeiro.x, ultimo.y - primeiro.y)
  const escalaDist = L / comprimentoPolilinha
  const seg = L * FRACAO_TRACO
  const slotsDist = geo.slots.map((s) => ({
    ...s,
    dist: (geo.distancias[s.indice] as number) * escalaDist,
    ponto: geo.pontos[s.indice] as Ponto,
  }))

  const tweens: gsap.core.Tween[] = []
  const timelines: gsap.core.Timeline[] = []

  // variação ousada: segunda linha, fina e clara, por trás do título
  let tracoFundo: SVGPathElement | null = null
  if (ousada && !horizontal) {
    const geoFundo = gerarGeometria(
      largura,
      altura,
      { x: largura * 0.08, y: altura * 0.5 },
      opcoes.limiteTexto(),
      r,
      true,
    )
    tracoFundo = el("path", {
      d: geoFundo.dLaco,
      class: classes.tracoFundo,
      "stroke-width": 1.4,
    })
    camadaFundo.prepend(tracoFundo)
  }

  // --- movimento reduzido: quadro estático ----------------------------------
  if (opcoes.movimentoReduzido) {
    const slotA = slotsDist[0]
    const slotB = slotsDist[2]
    if (slotA)
      camadaFormas.append(
        criarForma(
          "botao",
          deslocar(slotA.ponto, slotA.nome, escalaForma, horizontal),
          escalaForma,
          classes,
        ),
      )
    if (slotB)
      camadaFormas.append(
        criarCodigo(
          deslocar(slotB.ponto, slotB.nome, escalaForma, horizontal),
          escalaForma,
          classes,
        ),
      )
    return () => {
      svg.replaceChildren()
    }
  }

  // --- traço viajante --------------------------------------------------------
  const ordem = embaralhar(FORMAS, r)
  let proximaForma = 0
  let ultimaCabeca = 0
  let voltas = 0
  let pingouNestaVolta = false

  gsap.set(traco, { strokeDasharray: `0 ${L}`, strokeDashoffset: 0 })
  gsap.set(lead, { drawSVG: "0%" })

  const pingar = (ponto: Ponto): gsap.core.Timeline => {
    const t = el("text", {
      class: classes.semicolon,
      x: ponto.x,
      y: ponto.y,
      "font-size": 30 * escalaForma,
      "text-anchor": "middle",
    })
    t.textContent = ";"
    camadaFormas.append(t)
    const tl = gsap.timeline({ onComplete: () => t.remove() })
    tl.fromTo(
      t,
      { scale: 0, transformOrigin: "50% 50%", opacity: 1 },
      { scale: 1, duration: 0.35, ease: "back.out(2.2)" },
    )
    tl.to(t, { opacity: 0, duration: 0.35, ease: "power1.in" }, "+=0.7")
    timelines.push(tl)
    return tl
  }

  const cristalizar = (
    slot: (typeof slotsDist)[number],
    tipoForcado?: TipoForma,
  ) => {
    const centro = deslocar(slot.ponto, slot.nome, escalaForma, horizontal)
    const tl = gsap.timeline()
    timelines.push(tl)
    if (slot.nome === "codigo") {
      const g = criarCodigo(centro, escalaForma, classes)
      camadaFormas.append(g)
      const linhas = g.querySelectorAll("path")
      gsap.set(linhas, { drawSVG: "0%" })
      tl.to(linhas, {
        drawSVG: "100%",
        duration: 0.32,
        stagger: 0.09,
        ease: "power2.out",
      })
      tl.to(
        linhas,
        {
          drawSVG: "100% 100%",
          duration: 0.3,
          stagger: 0.06,
          ease: "power2.in",
        },
        "+=1.5",
      )
      tl.call(() => g.remove())
      return
    }
    const tipo =
      tipoForcado ?? (ordem[proximaForma % ordem.length] as TipoForma)
    proximaForma += 1
    const g = criarForma(tipo, centro, escalaForma, classes)
    camadaFormas.append(g)
    const partes = g.querySelectorAll("path")
    gsap.set(partes, { drawSVG: "0%" })
    tl.to(partes, {
      drawSVG: "100%",
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.inOut",
    })
    if (tipo === "botao") {
      tl.to(g, {
        scale: 0.97,
        transformOrigin: "50% 50%",
        duration: 0.11,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      })
    }
    const pinga = cfg.pingaSempre || !pingouNestaVolta
    if (pinga) {
      pingouNestaVolta = true
      const canto = cantoDaForma(tipo, centro, escalaForma)
      tl.add(pingar(canto), "-=0.05")
    }
    tl.to(
      partes,
      {
        drawSVG: "100% 100%",
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.in",
      },
      "+=1.25",
    )
    tl.call(() => g.remove())
  }

  const slotsAtivos = slotsDist.filter(
    (s, i) => i < cfg.formasPorVolta || s.nome === "codigo",
  )

  const verificarCabeca = (cabeca: number, primeiraVolta: boolean) => {
    for (const slot of slotsAtivos) {
      const cruzou =
        (ultimaCabeca < slot.dist && cabeca >= slot.dist) ||
        (cabeca < ultimaCabeca && slot.dist > ultimaCabeca)
      if (cruzou)
        cristalizar(
          slot,
          primeiraVolta && slot === slotsAtivos[0] ? "botao" : undefined,
        )
    }
    if (cabeca < ultimaCabeca) {
      voltas += 1
      pingouNestaVolta = false
    }
    ultimaCabeca = cabeca
  }

  // entrada: a linha sai do `;` (lead), entra no 8 e o traço cresce
  tweens.push(
    gsap.to(lead, { drawSVG: "100%", duration: 0.45, ease: "power2.inOut" }),
  )
  const entrada = gsap.to(traco, {
    strokeDasharray: `${seg} ${L - seg}`,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
    onUpdate() {
      verificarCabeca(seg * this.progress(), true)
    },
    onComplete() {
      const laco = gsap.to(traco, {
        strokeDashoffset: -L,
        duration: PERIODO_S,
        ease: "none",
        repeat: -1,
        onUpdate() {
          const cabeca = (seg + this.progress() * L) % L
          verificarCabeca(cabeca, voltas === 0)
        },
      })
      tweens.push(laco)
    },
  })
  tweens.push(entrada)

  if (tracoFundo) {
    const Lf = tracoFundo.getTotalLength()
    const segF = Lf * 0.5
    gsap.set(tracoFundo, { strokeDasharray: `${segF} ${Lf - segF}` })
    tweens.push(
      gsap.fromTo(
        tracoFundo,
        { opacity: 0 },
        { opacity: 0.22, duration: 1.2, delay: 0.4 },
      ),
    )
    tweens.push(
      gsap.to(tracoFundo, {
        strokeDashoffset: -Lf,
        duration: 26,
        ease: "none",
        repeat: -1,
      }),
    )
  }

  // respiração lenta de toda a cena
  tweens.push(
    gsap.to(grupo, {
      scale: 1.015,
      transformOrigin: `${ancora.x}px ${ancora.y}px`,
      duration: 4.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
  )

  // ponteiro: atração com inércia, sem perseguir
  let aoMover: ((e: PointerEvent) => void) | null = null
  if (!opcoes.toque) {
    const moverX = gsap.quickTo(grupo, "x", {
      duration: 1.4,
      ease: "power3.out",
    })
    const moverY = gsap.quickTo(grupo, "y", {
      duration: 1.4,
      ease: "power3.out",
    })
    aoMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const caixa = cena.getBoundingClientRect()
      const nx = ((e.clientX - caixa.left) / caixa.width - 0.5) * 2
      const ny = ((e.clientY - caixa.top) / caixa.height - 0.5) * 2
      moverX(Math.max(-1, Math.min(1, nx)) * 32)
      moverY(Math.max(-1, Math.min(1, ny)) * 22)
    }
    window.addEventListener("pointermove", aoMover, { passive: true })
  }

  // pausa fora da tela e com a aba oculta
  const pausar = () => {
    for (const t of tweens) t.pause()
    for (const t of timelines) t.pause()
  }
  const retomar = () => {
    for (const t of tweens) t.resume()
    for (const t of timelines) t.resume()
  }
  const aoVisibilidade = () =>
    document.visibilityState === "visible" ? retomar() : pausar()
  document.addEventListener("visibilitychange", aoVisibilidade)
  const io = new IntersectionObserver(
    (es) => (es.some((e) => e.isIntersecting) ? retomar() : pausar()),
    { threshold: 0 },
  )
  io.observe(svg)

  return () => {
    document.removeEventListener("visibilitychange", aoVisibilidade)
    if (aoMover) window.removeEventListener("pointermove", aoMover)
    io.disconnect()
    for (const t of tweens) t.kill()
    for (const t of timelines) t.kill()
    svg.replaceChildren()
  }
}

/** Centro da forma: dentro do lobo, a partir do ponto da linha. */
function deslocar(
  p: Ponto,
  nome: string,
  escala: number,
  horizontal = false,
): Ponto {
  const k = 60 * escala
  if (horizontal) {
    switch (nome) {
      case "topo":
        return { x: p.x + k * 1.6, y: p.y }
      case "lado":
        return { x: p.x - k * 1.6, y: p.y }
      case "codigo":
        return { x: p.x, y: p.y - k * 0.8 }
      default:
        return p
    }
  }
  switch (nome) {
    case "topo":
      return { x: p.x, y: p.y + k * 0.95 }
    case "lado":
      return { x: p.x - k * 2.1, y: p.y + k * 0.9 }
    case "codigo":
      return { x: p.x, y: p.y - k * 1.15 }
    default:
      return p
  }
}

function cantoDaForma(tipo: TipoForma, centro: Ponto, s: number): Ponto {
  const meio: Record<TipoForma, { w: number; h: number }> = {
    botao: { w: 150, h: 44 },
    campo: { w: 196, h: 40 },
    card: { w: 184, h: 112 },
    grafico: { w: 160, h: 96 },
    toggle: { w: 52, h: 26 },
  }
  const m = meio[tipo]
  return {
    x: centro.x + (m.w / 2) * s + 16 * s,
    y: centro.y + (m.h / 2) * s + 6 * s,
  }
}
