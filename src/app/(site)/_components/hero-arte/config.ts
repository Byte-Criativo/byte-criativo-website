/**
 * Parâmetros da arte generativa do hero ("Tecido de bytes").
 *
 * Tudo que define a aparência e o custo da peça vive aqui: velocidade,
 * escala, intensidade, cores e os limites de desempenho. O shader só lê
 * uniforms; o hook só lê este objeto. Para deixar a arte mais calma ou mais
 * intensa, troque o preset ou ajuste os números do preset escolhido.
 */

export type HeroIntensidade = "calma" | "media" | "intensa"

export type HeroPreset = {
  /** Velocidade do ciclo de movimento (1 = referência). */
  velocidade: number
  /** Quanto o campo de fluxo deforma a grade de bytes (0 a 1). */
  dobra: number
  /** Presença do azul nas áreas líquidas (0 a 1). */
  azul: number
  /** Amplitude do grão de filme (fração de 1, em sRGB). */
  grao: number
  /** Força com que o fluxo se curva em torno do ponteiro (0 a 1,5). */
  ponteiro: number
  /** Células da grade de bytes por unidade de altura da tela. */
  grade: number
}

export const HERO_ARTE = {
  /**
   * Resolução interna como fração da resolução CSS × DPR. O fluxo é suave e
   * aceita bem 0,5; é o maior ganho de desempenho disponível.
   */
  escala: 0.5,
  /** Teto de devicePixelRatio: 2 no desktop, 1,5 em telas de toque. */
  dprMax: 2,
  dprMaxToque: 1.5,
  /**
   * Qualidade adaptativa: um quadro é lento quando passa de `quadroLentoMs`
   * E de `fatorQuadroLento` × o menor intervalo já visto (o período do
   * monitor). Depois de `framesLentos` quadros lentos seguidos, a escala
   * interna cai 30% até `escalaMinima`.
   */
  quadroLentoMs: 20,
  fatorQuadroLento: 1.5,
  framesLentos: 24,
  escalaMinima: 0.2,
  /**
   * Período do ciclo completo da arte, em segundos. O tempo entra no shader
   * como um ângulo sobre um círculo, então o movimento é perfeitamente
   * periódico e nunca degrada com a aba aberta por horas.
   */
  periodoS: 150,
  /** Amortecimento do ponteiro por quadro (menor = mais inércia). */
  amortecimentoPonteiro: 0.045,
  /** Duração da revelação inicial a partir da cor base, em ms. */
  revelacaoMs: 1400,
  /** Espera do ResizeObserver antes de redimensionar o canvas, em ms. */
  esperaResizeMs: 120,
  /** Cores da arte: só variáveis CSS do tema. O hook resolve para OKLab. */
  cores: {
    base: "--bg",
    tinta: "--brand-surface",
    pedra: "--surface-muted",
    azul: "--brand-blue",
    laranja: "--accent",
    ink: "--ink",
  },
  /** Preset usado na home: "media" com a velocidade de "calma" (híbrido aprovado). */
  presetDaHome: "media" as HeroIntensidade,
  presets: {
    calma: {
      velocidade: 0.55,
      dobra: 0.35,
      azul: 0.55,
      grao: 0.03,
      ponteiro: 0.55,
      grade: 16,
    },
    media: {
      velocidade: 0.55,
      dobra: 0.6,
      azul: 0.75,
      grao: 0.04,
      ponteiro: 0.85,
      grade: 18,
    },
    intensa: {
      velocidade: 1.25,
      dobra: 1,
      azul: 1,
      grao: 0.05,
      ponteiro: 1.2,
      grade: 20,
    },
  } satisfies Record<HeroIntensidade, HeroPreset>,
} as const

export const INTENSIDADES: readonly HeroIntensidade[] = [
  "calma",
  "media",
  "intensa",
]

export function intensidadeValida(valor: unknown): valor is HeroIntensidade {
  return typeof valor === "string" && (INTENSIDADES as string[]).includes(valor)
}
