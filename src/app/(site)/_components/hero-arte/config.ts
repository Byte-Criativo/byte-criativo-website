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
  /**
   * Tamanho e posição do globo por faixa de largura. O globo é maior que a
   * tela de propósito: as bordas direita e inferior o cortam. O centro é
   * fração da largura (x) e da altura (y) do hero; no celular, o centro
   * vertical fica logo abaixo do bloco de texto (`abaixoDoConteudoVh`).
   */
  layout: {
    /** ≥ 64 rem */
    desktop: { diametroVh: 100, centroX: 0.7, centroY: 0.6 },
    /** 48 a 64 rem */
    tablet: { diametroVh: 90, centroX: 0.68, centroY: 0.58 },
    /** < 48 rem */
    celular: { diametroVw: 128, centroX: 0.75, abaixoDoConteudoVh: 8 },
    /**
     * Zona calma do texto: dentro da caixa do bloco de conteúdo (mais a
     * margem) os glifos ficam com no máximo `alfaMax`, com transição suave
     * de `transicaoPx` a partir da borda. É o que garante o contraste AA do
     * título, do apoio e dos CTAs com o globo passando por trás.
     */
    zonaCalma: { margemPx: 24, transicaoPx: 80, alfaMax: 0.12 },
    /** Tamanho da fonte dos glifos, em px CSS, limitado nesta faixa. */
    fonteMinPx: 12,
    fonteMaxPx: 15,
  },
  /**
   * Custo sob controle. Sem aceleração gráfica (renderizador por software ou
   * sem WebGL) o globo fica estático: um quadro final, redesenhado só na
   * rolagem e no resize. Com aceleração, a qualidade se adapta ao custo
   * medido de cada quadro: acima de `custoAltoMs` na média de
   * `janelaQuadros` quadros desce um degrau (menos glifos, depois DPR 1,
   * depois 30 fps); abaixo de `custoBaixoMs` por `intervaloDegrauS`
   * segundos sobe um degrau. Começa em `degrauInicial` durante a entrada e
   * nos `segurarInicialS` segundos seguintes.
   */
  desempenho: {
    custoAltoMs: 12,
    custoBaixoMs: 5,
    janelaQuadros: 20,
    intervaloDegrauS: 3,
    segurarInicialS: 2,
    degrauInicial: 1,
    /** Degraus: fração de glifos desenhados, teto de DPR e fps do ticker. */
    degraus: [
      { densidade: 1, dprMax: 2, fps: 60 },
      { densidade: 0.66, dprMax: 2, fps: 60 },
      { densidade: 0.5, dprMax: 2, fps: 60 },
      { densidade: 0.33, dprMax: 2, fps: 60 },
      { densidade: 0.33, dprMax: 1, fps: 60 },
      { densidade: 0.33, dprMax: 1, fps: 30 },
    ],
    /** Montagem (atlas e anéis) acima disto é dividida em dois ciclos ociosos. */
    montagemMaxMs: 20,
  },
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
