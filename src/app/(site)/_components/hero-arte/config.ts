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
   * vertical é medido a partir do fim do bloco de texto
   * (`abaixoDoConteudoVh`; negativo sobe o globo para trás do texto).
   */
  layout: {
    /** ≥ 64 rem */
    desktop: { diametroVh: 100, centroX: 0.7, centroY: 0.6 },
    /** 48 a 64 rem */
    tablet: { diametroVh: 90, centroX: 0.68, centroY: 0.58 },
    /** < 48 rem */
    celular: { diametroVw: 155, centroX: 0.6, abaixoDoConteudoVh: -14 },
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
     * Desenho do modo estático (sem aceleração ou com movimento reduzido).
     * O custo do quadro único no renderizador por software (Lighthouse do
     * CI) é o que pesa: no celular o globo é maior (mais texto por anel),
     * então ali o quadro parado leva metade dos paralelos.
     */
    estatico: { tras: true, densidade: 0.66, densidadeCelular: 0.5 },
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
   * Brasa do `;`, a assinatura do globo. Ao cruzar o meridiano da frente (ou
   * passar sob a lanterna), o `;` acende em laranja negrito em `subidaMs`,
   * dá um pulo de escala e esfria até a tinta em `esfriaMs` (crossfade). Atrás
   * dele, um brilho em duas camadas (núcleo denso e halo largo, misturados
   * por `multiply`, que é o "bloom" que funciona sobre fundo claro); sobre a
   * esfera, uma onda geodésica se abre a partir dele. Na zona calma do texto
   * o `;` só troca de cor, atenuado: nada de brilho, pulo, onda ou linha
   * compilando ali.
   */
  brasa: {
    /**
     * Botão de equilíbrio: multiplica o alfa do brilho, o overshoot da
     * escala e o alfa da onda. Calibrado com capturas no mesmo instante
     * da ignição (desktop 1440×900 e Pixel 7) em 0,7 / 1 / 1,4: em 0,7 o
     * brilho quase some no celular e a onda vira fio; em 1,4 o núcleo vira
     * mancha laranja e a onda compete com o texto. Em 1 a brasa é vista à
     * primeira olhada e continua menor que o `;` do título.
     */
    intensidade: 1,
    subidaMs: 140,
    esfriaMs: 1300,
    /**
     * Brilho: alfa no pico e raio em alturas de glifo, com raio mínimo em
     * px CSS (o glifo do celular é pequeno e o brilho sumia).
     */
    nucleo: { alfa: 0.42, raio: 0.95, raioMinPx: 13 },
    halo: { alfa: 0.16, raio: 2.7, raioMinPx: 38 },
    /**
     * Pulo do `;`: cresce até 1 + `pico` (com leve overshoot) e volta ao
     * tamanho em `duracaoMs`, em torno do centro do glifo.
     */
    escala: { pico: 0.5, duracaoMs: 400 },
    /**
     * Onda: círculo geodésico projetado (`pontos` pontos) que nasce no `;` e
     * se abre até `raioRad` sobre a esfera em `duracaoMs`, sumindo. Em globo
     * pequeno, o raio na tela não fica abaixo de `raioMinPx`.
     */
    onda: {
      raioRad: 0.25,
      raioMinPx: 60,
      duracaoMs: 900,
      alfa: 0.55,
      espessuraPx: 1.25,
      pontos: 24,
    },
    /**
     * Cadência: ritmo, não pisca-pisca. Teto de `porSegundo` ignições
     * visíveis (balde de fichas com capacidade `rajada`: a primeira depois
     * de uma pausa nunca é barrada, e a rajada curta impede pares colados),
     * `intervaloMinMs` entre duas, e no máximo `simultaneas` brasas acesas.
     * Ignição fora da tela (ou sob o véu) não acontece: não se veria e
     * gastaria a cota. Na zona calma não passa pela porteira (é só troca de
     * cor, quase invisível).
     */
    cadencia: {
      porSegundo: 1,
      rajada: 1.3,
      intervaloMinMs: 450,
      simultaneas: 4,
    },
    /**
     * Janela do meridiano (rad ao longo do paralelo): o `;` que cruza com a
     * porteira fechada espera a vez enquanto não passar desta distância
     * (~7 s de giro). A porteira atrasa em vez de descartar: as brasas que
     * chegam juntas se espalham pelas pausas e o ritmo fica regular
     * (rodízio) quase sem perder nenhuma.
     */
    janelaMeridianoRad: 0.4,
    /**
     * Fração mínima "fora da zona calma" (0 dentro da caixa do texto, 1 a
     * `transicaoPx` dela) para a ignição ser plena (com brilho, pulo e
     * onda) e contar como visível.
     */
    foraMinimo: 0.5,
    /**
     * A linha compila: ao acender, uma onda quente corre os trechos da
     * instrução que o `;` encerra, do começo até ele, em `duracaoMs` (tinta
     * → laranja suave, até `pico` → tinta). `largura` é a meia-largura da
     * onda, em fração da instrução.
     */
    compila: { duracaoMs: 450, pico: 0.75, largura: 0.3 },
    /**
     * Lanterna acende: o `;` que passa a `raioPx` do centro da lanterna
     * acende (pela porteira), se não acendeu nos últimos `recargaMs`. Vale
     * para o mouse e, com `autonoma`, para a lanterna que passeia sozinha no
     * toque.
     */
    lanterna: { raioPx: 30, recargaMs: 4000, autonoma: true },
    /**
     * Toque no hero acende até `quantos` `;` a no máximo `raioPx` do dedo,
     * um a cada `passoMs` (nunca menos que o intervalo mínimo da cadência),
     * cada um gastando uma ficha da porteira. Um toque a cada `intervaloMs`,
     * no máximo.
     */
    toque: { quantos: 2, raioPx: 110, passoMs: 200, intervaloMs: 1200 },
    /**
     * Abertura com faísca: quando o globo termina de nascer do `;` do
     * título, `quantos` ignições, uma a cada `passoMs`, do `;` mais perto
     * do título para dentro do planeta.
     */
    abertura: { quantos: 4, passoMs: 180 },
    /**
     * Quadro estático (sem animação): até `quantos` `;` acesos e parados,
     * com brilho em `nivel`, longe da zona calma e afastados entre si pelo
     * menos `distanciaMinR` raios do globo.
     */
    estatico: { quantos: 3, nivel: 0.85, distanciaMinR: 0.22 },
    /**
     * Eco nos polos: cada ignição dá aos dois `;` grandes dos polos um
     * impulso curto de respiração (escala + `escala`, alfa × (1 + `alfa`))
     * que decai sozinho em `duracaoMs`. Impulsos juntos somam até `teto`:
     * nunca vira pisca-pisca. Escala com `intensidade`; fora do quadro
     * estático.
     */
    ecoPolos: { escala: 0.08, alfa: 0.3, duracaoMs: 750, teto: 1.5 },
    /**
     * Meridiano de ignição no celular (< 48 rem), deslocado ao longo dos
     * paralelos: põe a ignição na faixa livre entre o texto e o véu sem
     * mexer no globo (nem na fita). 0 = meridiano da frente; positivo leva
     * as brasas para a direita e para baixo. Com `adaptativo`, a geometria
     * escolhe, entre ±`limiteRad`, o deslocamento que põe mais paralelos
     * cruzando a faixa livre (de `afastamentoCalmaPx` abaixo da zona calma,
     * onde a brasa já é plena, até o véu), pesando mais os mais longe do
     * texto; `rad` é o preferido no empate e o valor sem adaptação. Com
     * `segundo`, um segundo meridiano (a pelo menos `separacaoRad` do
     * primeiro e com nota de pelo menos `segundoMinimo` da dele) dobra as
     * ignições na faixa estreita. A porteira continua a mesma.
     */
    meridianoCelular: {
      rad: 0.35,
      adaptativo: true,
      afastamentoCalmaPx: 40,
      limiteRad: 1.1,
      segundo: true,
      separacaoRad: 0.5,
      segundoMinimo: 0.5,
    },
    /**
     * Segundo meridiano de ignição no desktop e no tablet (rad, à direita do
     * da frente). Acima do véu, o meridiano da frente só cruza ~19 dos 36
     * paralelos: sozinho, dá ~0,65 brasa por segundo, com pausas longas. Com
     * o segundo, a porteira (1 por segundo) passa a ditar o ritmo.
     */
    meridianoDesktop: { segundo: true, segundoRad: 0.5 },
    /**
     * Véu de saída (gradiente no rodapé do hero, por cima do canvas): a
     * fração de cima dele que ainda conta como visível. Com 0, nenhuma
     * brasa acende sob o véu (nem conta em `data-ignicoes-visiveis`): a
     * régua do motor é a mesma de quem mede "fora do véu".
     */
    veuVisivel: 0,
  },
  /**
   * Lanterna autônoma no toque (sem ponteiro): passeia numa curva de
   * Lissajous de `periodoS` segundos (frequências `fx` e `fy`) pela parte
   * visível do globo fora da zona calma: a `margemPx` das bordas da tela, a
   * `afastamentoCalmaPx` da caixa calma e dentro de `discoR` raios do
   * centro do globo.
   */
  lanternaAutonoma: {
    periodoS: 14,
    fx: 1,
    fy: 2,
    margemPx: 28,
    afastamentoCalmaPx: 40,
    discoR: 0.92,
    /** Aparelho híbrido: o mouse manda na lanterna até tanto depois. */
    pausaMouseMs: 3000,
  },
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
