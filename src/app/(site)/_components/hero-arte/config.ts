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
    zonaCalma: { margemPx: 24, transicaoPx: 80, alfaMax: 0.1 },
    /** Tamanho da fonte dos glifos, em px CSS, limitado nesta faixa. */
    fonteMinPx: 12,
    fonteMaxPx: 15,
  },
  /**
   * Custo sob controle. Sem aceleração gráfica (renderizador por software ou
   * sem WebGL) o globo fica estático: um quadro final, redesenhado só na
   * rolagem e no resize. Com aceleração, a qualidade se adapta ao custo
   * medido de cada quadro: o custo de uma janela de `janelaQuadros` quadros
   * é a mediana (um pico isolado de GC ou de outra aba não conta); com
   * `janelasParaDescer` janelas seguidas acima de `custoAltoMs` desce um
   * degrau; abaixo de `custoBaixoMs` por `intervaloDegrauS` segundos sobe
   * um, mas nunca de volta a um degrau que já falhou antes do resfriamento.
   * Começa em `degrauInicial` durante a entrada e nos `segurarInicialS`
   * segundos seguintes.
   *
   * Nenhuma troca de degrau é visível de um quadro para o outro: paralelos e
   * hemisfério de trás entram e saem em fade de `transicaoS` segundos.
   */
  desempenho: {
    custoAltoMs: 12,
    custoBaixoMs: 7,
    janelaQuadros: 30,
    janelasParaDescer: 2,
    intervaloDegrauS: 3,
    /** Intervalo mínimo entre descidas de degrau (quadro caro desce rápido). */
    intervaloDescidaS: 1,
    /** Espera para voltar a um degrau que falhou; dobra a cada nova falha. */
    resfriamentoS: 20,
    segurarInicialS: 2,
    degrauInicial: 1,
    transicaoS: 0.9,
    /**
     * Degraus, do mais rico ao mais barato, na ordem em que a perda menos
     * aparece: hemisfério de trás, DPR, fração de paralelos e, por último,
     * o fps do ticker.
     */
    degraus: [
      { tras: true, densidade: 1, dprMax: 2, fps: 60 },
      { tras: false, densidade: 1, dprMax: 2, fps: 60 },
      { tras: false, densidade: 1, dprMax: 1.5, fps: 60 },
      { tras: false, densidade: 0.66, dprMax: 1.5, fps: 60 },
      { tras: false, densidade: 0.5, dprMax: 1, fps: 60 },
      { tras: false, densidade: 0.33, dprMax: 1, fps: 60 },
      { tras: false, densidade: 0.33, dprMax: 1, fps: 30 },
    ],
    /**
     * Desenho do modo estático (sem aceleração ou com movimento reduzido):
     * o mesmo de antes dos degraus com fade, para o custo do quadro único no
     * renderizador por software (Lighthouse do CI) não mudar.
     */
    estatico: { tras: true, densidade: 0.66 },
    /** Montagem (atlas e anéis) acima disto é dividida em dois ciclos ociosos. */
    montagemMaxMs: 20,
    /**
     * Saída para o modo estático pelo custo medido: se a mediana de
     * `amostrasParaDecidir` quadros (depois de `quadrosDeAquecimento`)
     * passar de `custoEstaticoMs`, ou se o último degrau continuar acima de
     * `custoAltoMs`, o globo para num quadro final. É o que cobre a
     * renderização por software que o navegador não admite pelo nome (o
     * Firefox mascara o renderizador) e os aparelhos lentos.
     */
    custoEstaticoMs: 24,
    amostrasParaDecidir: 10,
    quadrosDeAquecimento: 3,
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
  /**
   * Os anéis são desenhados em trechos (uma chamada de Canvas por pedaço de
   * palavra, não por glifo): cada trecho é reto, e o arco que ele cobre é
   * limitado para a corda não se afastar mais que isto (px) da curva.
   */
  trechoFlechaPx: 0.5,
  /** Latitude máxima dos paralelos (graus). */
  latitudeMax: 78,
  /** Deriva de velocidade entre paralelos (fração). */
  deriva: 0.06,
  /** Opacidade do texto: frente, horizonte e hemisfério de trás. */
  alfaHorizonte: 0.07,
  alfaTras: 0.06,
  /**
   * Faixa do contorno (profundidade na esfera unitária) em que o glifo entra
   * e sai em fade: nenhum glifo aparece ou some de um quadro para o outro.
   */
  horizonte: 0.08,
  /** Lanterna do ponteiro: raio (px), desaceleração local. */
  raioLanterna: 180,
  desaceleracaoLanterna: 0.4,
  /**
   * Brasa do `;` ao cruzar o meridiano: acende em `subidaMs`, esfria de
   * laranja para tinta em `esfriaMs` (crossfade) e deixa um brilho laranja
   * atrás do glifo (alfa e raio em alturas de glifo). No máximo
   * `pulsosSimultaneos` brasas acesas ao mesmo tempo.
   */
  pulso: { subidaMs: 140, esfriaMs: 1300, brilhoAlfa: 0.3, brilhoRaio: 1.3 },
  pulsosSimultaneos: 5,
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
