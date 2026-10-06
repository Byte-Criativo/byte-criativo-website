/**
 * Parâmetros do hero da home: o globo de código "Ponto e vírgula, planeta"
 * e o agendamento do motor. Tudo que define aparência e custo da peça vive
 * aqui; o motor (globo-motor.ts) só lê este objeto. Para a arte ficar mais
 * calma ou mais presente, troque `VARIANTE_DA_HOME` ou ajuste os números.
 */

export type GloboVariante = "media" | "contida" | "ousada"

type Preset = {
  paralelos: number
  periodoS: number
  lanterna: boolean
  pulsosNoMeridiano: boolean
  alfaFrente: number
  nasceNoTitulo: boolean
  achataNaRolagem: boolean
}

/** Parâmetros da peça, num lugar só. */
export const GLOBO = {
  presets: {
    media: {
      paralelos: 36,
      periodoS: 100,
      lanterna: true,
      pulsosNoMeridiano: true,
      alfaFrente: 0.62,
      nasceNoTitulo: false,
      achataNaRolagem: false,
    },
    contida: {
      paralelos: 24,
      periodoS: 120,
      lanterna: false,
      pulsosNoMeridiano: false,
      alfaFrente: 0.55,
      nasceNoTitulo: false,
      achataNaRolagem: false,
    },
    ousada: {
      paralelos: 36,
      periodoS: 110,
      lanterna: true,
      pulsosNoMeridiano: true,
      alfaFrente: 0.62,
      nasceNoTitulo: true,
      achataNaRolagem: true,
    },
  } satisfies Record<GloboVariante, Preset>,
  /** Paralelos no celular (abaixo de 48 rem). */
  paralelosCelular: 24,
  /** Distância focal da câmera, em raios (1,8 a 2,4 convence). */
  foco: 3,
  /** Inclinação do eixo na tela (graus) e para dentro da tela (graus). */
  inclinacaoZ: 20,
  inclinacaoX: -13,
  /** Precessão do eixo: amplitude (graus) e período (s). */
  precessaoGraus: 1.5,
  precessaoS: 40,
  /** Parallax do ponteiro, em graus, com a inércia da lanterna. */
  parallaxGraus: 4,
  /** Latitude máxima dos paralelos (graus). */
  latitudeMax: 78,
  /** Deriva de velocidade entre paralelos (fração). */
  deriva: 0.06,
  /** Opacidade do texto: frente, horizonte e hemisfério de trás. */
  alfaHorizonte: 0.07,
  alfaTras: 0.06,
  /** Lanterna do ponteiro: raio (px), desaceleração local. */
  raioLanterna: 180,
  desaceleracaoLanterna: 0.4,
  /** Pulso laranja do `;` ao cruzar o meridiano: duração e máximo simultâneo. */
  pulsoMs: 400,
  pulsosSimultaneos: 4,
  /** Respiração dos polos: amplitude e período (s). */
  respiracaoPolos: 0.06,
  respiracaoS: 6,
  /** Fator de duração da versão curta da entrada (navegações seguintes). */
  entradaCurta: 0.25,
  cores: {
    laranja: "#f65606",
    azul: "#0b5cad",
    preto: "#000000",
    superficie: "#eef5fc",
  },
} as const

/** Variação usada na home: a ousada nasce do `;` do título e achata ao rolar. */
export const VARIANTE_DA_HOME: GloboVariante = "ousada"

/** Agendamento do motor (hook use-hero-canvas.ts). */
export const HERO_ARTE = {
  /**
   * A arte começa depois do `load`, num momento ocioso: no máximo
   * `esperaInicioMaxMs` depois do load (requestIdleCallback) ou, sem a API,
   * `esperaInicioMinMs` depois.
   */
  esperaInicioMaxMs: 1200,
  esperaInicioMinMs: 250,
} as const
