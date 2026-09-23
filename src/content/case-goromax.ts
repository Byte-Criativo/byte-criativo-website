import type { CaseStudyData } from "./schema"

// Escopo e inclusão autorizados pelo responsável em 2026-09-22.
// Observações limitadas ao site público; sem atribuir música, fotografia
// ou materiais de imprensa à Byte. Ver docs/case-approvals.md.
export const goromaxCaseRaw = {
  slug: "goromax",
  status: "published",
  order: 3,
  title: "GOROMAX: identidade e presença digital para uma banda autoral",
  subtitle:
    "Design, UI/UX, identidade, conteúdo e desenvolvimento do site para a banda GOROMAX.",
  summary:
    "Site da banda GOROMAX: identidade, design, UI/UX, conteúdo e desenvolvimento, com música, agenda, galeria e imprensa.",
  projectType: "Site de banda",
  liveUrl: "https://www.goromax.com.br/",
  liveCheckedAt: "2026-09-22",
  role: {
    disciplines: [
      "desenvolvimento do site",
      "design e UI/UX",
      "identidade",
      "conteúdo do site",
    ],
    evidence: [
      {
        kind: "owner-statement",
        note: "O responsável confirmou desenvolvimento, design e UI/UX, identidade e conteúdo. Trabalho para a banda GOROMAX.",
        confirmedAt: "2026-09-22",
      },
      {
        kind: "footer-credit",
        url: "https://www.goromax.com.br/",
        text: "Código por Byte Criativo",
        checkedAt: "2026-09-22",
      },
    ],
  },
  thirdPartyCredits: [
    { item: "Capa do single Vai Além", credit: "Uyl Aires" },
    {
      item: "Performance e entrevista no Clan Sessions",
      credit: "Clan Sessions TV",
    },
    {
      item: "Matérias de imprensa",
      credit: "Veículos identificados e vinculados na página de imprensa",
    },
    {
      item: "Fotografias e obras musicais",
      credit: "Não atribuídas à Byte Criativo",
    },
  ],
  needs: [
    "Dar à banda uma presença digital com identidade própria",
    "Reunir música, agenda e registros visuais",
    "Oferecer caminhos para ouvir a banda e entrar em contato",
  ],
  uxDecisions: [
    {
      title: "Música com destino claro",
      problem: "Os lançamentos estão disponíveis em plataformas externas",
      decision: "Discografia com links para ouvir e uma página de plataformas",
    },
    {
      title: "Agenda separada do histórico",
      problem: "Shows realizados e futuras datas têm funções diferentes",
      decision:
        "A agenda informa quando não há datas confirmadas e mantém o histórico em outra área",
    },
    {
      title: "Imprensa com fontes",
      problem: "As matérias estão distribuídas entre diferentes veículos",
      decision:
        "Uma página reúne os recortes, identifica os veículos e leva às publicações originais",
    },
  ],
  engineering: [
    {
      name: "Imagens responsivas",
      verified: true,
      evidence:
        "HTML da home em 2026-09-22: logo e imagem principal com srcset e variantes de largura em /_next/image.",
    },
    {
      name: "Carregamento adiado na imprensa",
      verified: true,
      evidence:
        "HTML de /imprensa em 2026-09-22: imagens das matérias com loading=lazy.",
    },
  ],
  observableResults: [
    {
      label: "Presença digital",
      value: "Site publicado com discografia, agenda, galeria e contato",
      source: "site",
      checkedAt: "2026-09-22",
    },
    {
      label: "Arquivo de imprensa",
      value: "Página com recortes e links para os veículos de origem",
      source: "site",
      checkedAt: "2026-09-22",
    },
  ],
  services: ["desenvolvimento-de-sites", "ui-ux-design"],
  media: {
    cover: {
      src: "/cases/goromax/home-1440.avif",
      width: 1440,
      height: 900,
      alt: "Página inicial da GOROMAX, com a marca e uma fotografia da banda",
      caption: "Home da GOROMAX, capturada em 2026-09-22",
      capturedAt: "2026-09-22",
      sourceUrl: "https://www.goromax.com.br/",
      containsThirdParty: ["foto", "marca"],
    },
    gallery: [
      {
        src: "/cases/goromax/home-1440.avif",
        width: 1440,
        height: 900,
        alt: "Página inicial da GOROMAX, com a marca e uma fotografia da banda",
        caption: "Home da GOROMAX no desktop, capturada em 2026-09-22",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.goromax.com.br/",
        containsThirdParty: ["foto", "marca"],
      },
      {
        src: "/cases/goromax/home-390.avif",
        width: 390,
        height: 844,
        alt: "Página inicial da GOROMAX no celular, com a marca e os caminhos para música e shows",
        caption: "Home no celular, capturada em 2026-09-22",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.goromax.com.br/",
        containsThirdParty: ["foto", "marca"],
      },
      {
        src: "/cases/goromax/imprensa-1440.avif",
        width: 1440,
        height: 900,
        alt: "Página de imprensa da GOROMAX, com matérias e identificação dos veículos",
        caption: "Arquivo de imprensa, capturado em 2026-09-22",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.goromax.com.br/imprensa",
        containsThirdParty: ["foto", "arte", "marca"],
      },
    ],
  },
  // Sala goromax existente em src/styles/tokens.json.
  theme: {
    surface: "#090806",
    surfaceAlt: "#15110D",
    ink: "#EEE3CB",
    inkMuted: "#C2B49B",
    accent: "#DFA43E",
    accent2: "#C3551D",
    ctaBg: "#EEE3CB",
    ctaInk: "#0D0B09",
    easel: "#EEE3CB",
    displayFont: "none",
    texture: "grain",
  },
  permissions: {
    cleared: true,
    notes:
      "Inclusão do site e atualização periódica das capturas autorizadas em 2026-09-22. Escopo confirmado: desenvolvimento, design e UI/UX, identidade e conteúdo do site para a banda GOROMAX. Período e parceiros não informados. Obras musicais, fotografias, capa do single e matérias mantêm suas atribuições próprias.",
  },
  seo: {
    title: "GOROMAX: estudo de caso | Byte Criativo",
    description:
      "Identidade, design, UI/UX, conteúdo e desenvolvimento do site da banda GOROMAX pela Byte Criativo. Conheça o projeto e visite o site publicado.",
  },
  updatedAt: "2026-09-22",
} satisfies CaseStudyData
