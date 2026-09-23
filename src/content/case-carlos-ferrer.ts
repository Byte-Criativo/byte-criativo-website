import type { CaseStudyData } from "./schema"

// Projeto próprio, confirmado pelo autor; fatos observados no site em 2026-09-22.
export const carlosFerrerCaseRaw = {
  slug: "carlos-ferrer",
  status: "published",
  order: 4,
  title: "Carlos Ferrer Online: uma história em quatro eras da web",
  subtitle:
    "Projeto próprio de Carlos Ferrer: currículo e portfólio com quatro interpretações visuais da mesma trajetória profissional.",
  summary:
    "Projeto próprio: site-currículo e portfólio de Carlos Ferrer, com quatro eras da web e navegação em português e inglês.",
  projectType: "Projeto próprio · currículo e portfólio",
  liveUrl: "https://www.carlosferrer.online/",
  liveCheckedAt: "2026-09-22",
  role: {
    disciplines: ["desenvolvimento do site pessoal"],
    evidence: [
      {
        kind: "owner-statement",
        note: "Carlos Ferrer confirmou que desenvolveu seu site-currículo-portfólio como projeto próprio. Não é um contrato com cliente externo.",
        confirmedAt: "2026-09-22",
      },
    ],
  },
  thirdPartyCredits: [],
  needs: [
    "Apresentar trajetória, habilidades e projetos em um endereço próprio",
    "Explorar quatro eras da web a partir da mesma história profissional",
    "Dar acesso ao currículo e à navegação em português e inglês",
  ],
  uxDecisions: [
    {
      title: "Uma história, quatro interfaces",
      problem:
        "O portfólio apresenta diferentes linguagens visuais sem abandonar a trajetória profissional.",
      decision:
        "A Web Time Machine liga as versões de 1997, 2004, 2012 e 2026, mantendo acesso às seções de currículo.",
    },
    {
      title: "Currículo e idioma à mão",
      problem:
        "Visitantes podem procurar uma apresentação rápida ou uma leitura profissional mais detalhada.",
      decision:
        "A navegação oferece acesso direto ao currículo e à versão em inglês, além das seções de projetos e experiência.",
    },
  ],
  engineering: [
    {
      name: "Next.js, React e TypeScript",
      verified: true,
      evidence:
        "Tecnologias declaradas na seção “Sobre esta página” de /1997, consultada em 2026-09-22; não houve auditoria do repositório.",
    },
  ],
  observableResults: [
    {
      label: "Versões da experiência",
      value: "Rotas para 1997, 2004, 2012 e 2026 disponíveis na navegação",
      source: "site",
      checkedAt: "2026-09-22",
    },
    {
      label: "Acesso ao currículo",
      value: "Link dedicado para /cv e alternância para inglês",
      source: "site",
      checkedAt: "2026-09-22",
    },
  ],
  services: ["desenvolvimento-de-sites"],
  media: {
    cover: {
      src: "/cases/carlos-ferrer/home-1440.avif",
      width: 1440,
      height: 900,
      alt: "Abertura do portfólio Carlos Ferrer Online",
      caption:
        "Abertura do portfólio Carlos Ferrer Online. Captura de 2026-09-22.",
      capturedAt: "2026-09-22",
      sourceUrl: "https://www.carlosferrer.online/",
      containsThirdParty: [],
    },
    gallery: [
      {
        src: "/cases/carlos-ferrer/home-1440.avif",
        width: 1440,
        height: 900,
        alt: "Abertura do portfólio Carlos Ferrer Online",
        caption:
          "Abertura do portfólio Carlos Ferrer Online. Captura de 2026-09-22.",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.carlosferrer.online/",
        containsThirdParty: [],
      },
      {
        src: "/cases/carlos-ferrer/era-1997-1440.avif",
        width: 1440,
        height: 900,
        alt: "A trajetória profissional na interface inspirada em 1997",
        caption:
          "A trajetória profissional na interface inspirada em 1997. Captura de 2026-09-22.",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.carlosferrer.online/1997",
        containsThirdParty: [],
      },
      {
        src: "/cases/carlos-ferrer/home-390.avif",
        width: 390,
        height: 844,
        alt: "Abertura do portfólio pessoal no celular",
        caption:
          "Abertura do portfólio pessoal no celular. Captura de 2026-09-22.",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.carlosferrer.online/",
        containsThirdParty: [],
      },
    ],
  },
  theme: {
    surface: "#F4EFE7",
    surfaceAlt: "#EEE7DC",
    ink: "#111111",
    inkMuted: "#59544D",
    accent: "#0B5CAD",
    accent2: "#0B5CAD",
    ctaBg: "#111111",
    ctaInk: "#F4EFE7",
    easel: "#111111",
    displayFont: "none",
    texture: "none",
  },
  permissions: {
    cleared: true,
    notes:
      "Inclusão solicitada pelo próprio autor em 2026-09-22, identificada como projeto próprio. Capturas selecionadas sem dados de contato pessoal. Período de desenvolvimento não informado.",
  },
  seo: {
    title: "Carlos Ferrer Online: estudo de caso | Byte Criativo",
    description:
      "Projeto próprio de currículo e portfólio: a trajetória de Carlos Ferrer em quatro eras da web, com acesso ao currículo e versão em inglês.",
  },
  updatedAt: "2026-09-22",
} satisfies CaseStudyData
