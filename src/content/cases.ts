import { z } from "zod"
import { CaseStudy, type CaseStudyData } from "./schema"

// Dados dos estudos de caso, portados das fichas internas
// (docs/content/cases/*.md) — só fatos com status "confirmado" ou observados
// e datados nas fichas. O dono confirmou o escopo e autorizou todos os
// elementos das capturas selecionadas em 2026-09-22 (docs/case-approvals.md).
// O refine do schema CaseStudy impede publicar sem permissions.cleared.
//
// IMPORTANTE: este arquivo NÃO importa "server-only" de propósito — o
// sitemap (src/app/sitemap.ts) importa `publishedCaseEntries` daqui e
// precisa carregar fora do contexto de servidor (Vitest). Os loaders com a
// proteção ficam em src/content/index.ts.

export const caseStudiesRaw = [
  {
    slug: "underground-pb",
    status: "published",
    order: 1,
    title: "Underground PB: a cena independente da Paraíba em um só lugar",
    subtitle:
      "Plataforma web cultural com contas, envio moderado de conteúdo, mapa de palcos, manifest e service worker.",
    summary:
      "Plataforma da cena independente da Paraíba: diretório de bandas, agenda, mapa de palcos, lançamentos e memória, com contas e moderação.",
    projectType: "Plataforma cultural",
    liveUrl: "https://www.undergroundpb.com.br/",
    liveCheckedAt: "2026-09-16",
    role: {
      disciplines: ["identidade visual", "site e software"],
      evidence: [
        {
          kind: "owner-statement",
          note: "A Byte Criativo criou toda a identidade e o site/software do Underground PB.",
          confirmedAt: "2026-09-22",
        },
        {
          kind: "repository",
          ref: "https://github.com/carlosferrerdev/underground-paraibano",
          path: "requirements.txt",
        },
      ],
    },
    thirdPartyCredits: [
      {
        item: "Textos e imagens dos perfis de bandas",
        credit: "Enviados pelas próprias bandas",
      },
      { item: "Notícias", credit: "Autores identificados em cada notícia" },
      {
        item: "Cartazes de eventos",
        credit: "Artes de produtoras dos eventos",
      },
      {
        item: "Fontes Anton e Barlow",
        credit: "Arquivos autohospedados pelo projeto",
      },
    ],
    // As descrições de recursos se limitam ao que foi observado ao vivo.
    needs: [
      "Reunir bandas, agenda, palcos, lançamentos, notícias e memória em uma plataforma",
      "Permitir envios de conteúdo sujeitos à curadoria",
      "Oferecer navegação em telas de celular",
    ],
    uxDecisions: [
      {
        title: "Próximo evento em destaque",
        problem: "A home reúne agenda e demais conteúdos da cena",
        decision: "A primeira dobra destaca um evento futuro e leva à agenda",
      },
      {
        title: "Mapa e lista de palcos juntos",
        problem:
          "A página de palcos reúne busca, filtros e formas de exploração",
        decision: "Oferece lista, mapa e circuito na mesma página",
      },
      {
        title: "Embeds só com consentimento",
        problem: "Players de Spotify e YouTube usam recursos de terceiros",
        decision:
          "A interface pede permissão antes de carregar vídeos e faixas externos",
      },
    ],
    engineering: [
      {
        name: "htmx 1.9.12",
        verified: true,
        evidence: "window.htmx.version observado ao vivo em 2026-09-16",
      },
      {
        name: "MapLibre GL 4.7.1",
        verified: true,
        evidence: "Versão detectada ao vivo em /palcos/?ver=mapa em 2026-09-16",
      },
      {
        name: "PWA com service worker",
        verified: true,
        evidence:
          "Manifest com display standalone e sw.js ativo no escopo / em 2026-09-16",
      },
      {
        name: "Cloudflare e Render",
        verified: true,
        evidence:
          "Headers server: cloudflare, cf-ray e x-render-origin-server em 2026-09-16",
      },
    ],
    observableResults: [
      {
        label: "Bandas no diretório",
        value: "88 em 2026-09-16",
        source: "site",
        checkedAt: "2026-09-16",
      },
      {
        label: "Palcos com coordenada",
        value: "5 de 5 em 2026-09-16",
        source: "site",
        checkedAt: "2026-09-16",
      },
      {
        label: "Maior lastmod observado no sitemap",
        value: "lastmod de 2026-09-15",
        source: "sitemap",
        checkedAt: "2026-09-16",
      },
    ],
    services: ["sistemas-web-sob-medida"],
    media: {
      // Capturas reais do estado do site em 2026-09-22. Originais e seleção:
      // scripts/portfolio/underground-pb.md. O dono autorizou o uso de todos
      // os elementos das capturas selecionadas em 2026-09-22.
      cover: {
        src: "/cases/underground-pb/home-1440.avif",
        width: 1440,
        height: 900,
        alt: "Página inicial do Underground PB, com um show em destaque e acesso à agenda",
        caption: "Home do Underground PB, capturada em 2026-09-22",
        capturedAt: "2026-09-22",
        sourceUrl: "https://www.undergroundpb.com.br/",
        containsThirdParty: ["arte", "foto", "conteudo-usuario"],
      },
      gallery: [
        {
          src: "/cases/underground-pb/home-1440.avif",
          width: 1440,
          height: 900,
          alt: "Página inicial do Underground PB, com um show em destaque e acesso à agenda",
          caption: "Home do Underground PB, capturada em 2026-09-22",
          capturedAt: "2026-09-22",
          sourceUrl: "https://www.undergroundpb.com.br/",
          containsThirdParty: ["arte", "foto", "conteudo-usuario"],
        },
        {
          src: "/cases/underground-pb/agenda-1440.avif",
          width: 1440,
          height: 900,
          alt: "Agenda de shows do Underground PB com busca, filtro de cidade e eventos em cartões",
          caption: "Agenda de shows, capturada em 2026-09-22",
          capturedAt: "2026-09-22",
          sourceUrl: "https://www.undergroundpb.com.br/agenda/",
          containsThirdParty: ["arte", "foto", "conteudo-usuario"],
        },
        {
          src: "/cases/underground-pb/palcos-1440.avif",
          width: 1440,
          height: 900,
          alt: "Página de palcos do Underground PB com filtros, lista de espaços e mapa",
          caption: "Palcos da Paraíba no desktop, capturados em 2026-09-22",
          capturedAt: "2026-09-22",
          sourceUrl: "https://www.undergroundpb.com.br/palcos/",
          containsThirdParty: ["conteudo-usuario"],
        },
        {
          src: "/cases/underground-pb/palcos-390.avif",
          width: 390,
          height: 844,
          alt: "Página de palcos do Underground PB no celular, com mapa e lista de espaços",
          caption: "Palcos da Paraíba no celular, capturados em 2026-09-22",
          capturedAt: "2026-09-22",
          sourceUrl: "https://www.undergroundpb.com.br/palcos/",
          containsThirdParty: ["conteudo-usuario"],
        },
      ],
    },
    // R36: cores da sala underground-pb em src/styles/tokens.json.
    theme: {
      surface: "#F4EFE7",
      surfaceAlt: "#EEE7DC",
      ink: "#111111",
      inkMuted: "#59544D",
      accent: "#E30613",
      accent2: "#B4050E",
      ctaBg: "#111111",
      ctaInk: "#F4EFE7",
      easel: "#111111",
      displayFont: "anton",
      texture: "noise",
    },
    permissions: {
      cleared: true,
      notes:
        "Escopo confirmado pelo dono em 2026-09-22: identidade integral e site/software. Uso de todos os elementos das capturas selecionadas autorizado na mesma data. Período e parceiros não informados; não publicar atribuições adicionais.",
    },
    seo: {
      title: "Underground PB: estudo de caso | Byte Criativo",
      description:
        "Estudo de caso da plataforma cultural Underground PB: diretório de bandas, agenda, mapa de palcos e memória da cena independente da Paraíba.",
    },
    updatedAt: "2026-09-22",
  },
  {
    slug: "festival-alumio",
    status: "published",
    order: 2,
    title: "Festival Alumiô: a programação do festival na mão de quem vai",
    subtitle:
      "Site do Alumiô Festival 2026 no Centro Histórico de João Pessoa, com programação filtrável e favoritos no aparelho.",
    summary:
      "Site do Alumiô Festival 2026: programação filtrável por dia, artista e local, favoritos sem cadastro, circuito e memória fotográfica.",
    projectType: "Site de festival",
    liveUrl: "https://www.festivalalumio.com.br/",
    liveCheckedAt: "2026-09-16",
    role: {
      // O dono confirmou apenas o site, sem atribuir identidade, ilustrações
      // ou conteúdo à Byte.
      disciplines: ["site"],
      evidence: [
        {
          kind: "owner-statement",
          note: "No Festival Alumiô, a Byte Criativo fez apenas o site.",
          confirmedAt: "2026-09-22",
        },
        {
          kind: "footer-credit",
          url: "https://www.festivalalumio.com.br/",
          text: "Feito na Paraíba pela Byte Criativo",
          checkedAt: "2026-09-16",
        },
      ],
    },
    thirdPartyCredits: [
      {
        item: "Fotografias da memória de edições anteriores",
        credit: "Ricardo Pinto · @alternativab",
      },
      {
        item: "Cartazes de sexta",
        credit: "Artes da campanha 2026 · perfil oficial do Alumiô",
      },
      {
        item: "Fontes da programação",
        credit: "Anúncios do perfil @alumiopb e matérias do Portal BDig",
      },
      {
        item: "Fontes Barlow Condensed e Atkinson Hyperlegible",
        credit: "Arquivos autohospedados pelo projeto",
      },
    ],
    needs: [
      "Mostrar três dias de festival em vários palcos e casas do Centro Histórico",
      "Deixar o público montar o próprio roteiro sem criar conta",
      "Mostrar a fonte de cada apresentação e a data de atualização da agenda",
    ],
    uxDecisions: [
      {
        title: "Favoritos sem cadastro",
        problem: "A página oferece uma forma de organizar apresentações",
        decision:
          "Favoritos salvos no próprio aparelho, com o aviso “Seus favoritos ficam neste aparelho, sem cadastro.”",
      },
      {
        title: "Contagem dos filtros anunciada",
        problem: "A programação pode ser filtrada na página",
        decision:
          "Região aria-live anuncia quantas apresentações foram encontradas",
      },
      {
        title: "Agenda legível sem JavaScript",
        problem: "Os filtros e favoritos dependem de JavaScript",
        decision:
          "Sem JavaScript, a agenda publicada aparece no HTML com aviso sobre filtros e favoritos",
      },
    ],
    engineering: [
      {
        name: "Next.js 16.3.4 (App Router)",
        verified: true,
        evidence:
          "window.next.version e __next_f observados ao vivo em 2026-09-16",
      },
      {
        name: "Vercel",
        verified: true,
        evidence:
          "Headers server: Vercel, x-vercel-cache e x-nextjs-prerender em 2026-09-16",
      },
      {
        name: "next/image com srcset",
        verified: true,
        evidence: "Imagens servidas via /_next/image com srcset em 2026-09-16",
      },
    ],
    observableResults: [
      {
        label: "Apresentações na programação",
        value: "57 em 2026-09-16 (agenda parcial, atualizada em 09/09/2026)",
        source: "site",
        checkedAt: "2026-09-16",
      },
      {
        label: "URLs no sitemap",
        value: "4 em 2026-09-16",
        source: "sitemap",
        checkedAt: "2026-09-16",
      },
      {
        label: "Pré-renderização",
        value: "x-nextjs-prerender: 1 nas 4 páginas em 2026-09-16",
        source: "headers",
        checkedAt: "2026-09-16",
      },
    ],
    services: ["desenvolvimento-de-sites"],
    media: {
      // Capturas reais do estado do site em 2026-09-16. Originais e seleção:
      // scripts/portfolio/festival-alumio.md. O dono autorizou o uso de todos
      // os elementos das capturas selecionadas em 2026-09-22.
      cover: {
        src: "/cases/festival-alumio/home-1440.avif",
        width: 1440,
        height: 900,
        alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
        caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
        capturedAt: "2026-09-16",
        sourceUrl: "https://www.festivalalumio.com.br/",
        containsThirdParty: ["arte", "marca"],
      },
      gallery: [
        {
          src: "/cases/festival-alumio/home-1440.avif",
          width: 1440,
          height: 900,
          alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
          caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/",
          containsThirdParty: ["arte", "marca"],
        },
        {
          src: "/cases/festival-alumio/programacao-1440.avif",
          width: 1440,
          height: 900,
          alt: "Página de programação do Festival Alumiô, com filtros por dia, artista e palco",
          caption:
            "Filtros da programação em desktop, capturados em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/programacao",
          containsThirdParty: ["arte", "marca"],
        },
        {
          src: "/cases/festival-alumio/circuito-1440.avif",
          width: 1440,
          height: 900,
          alt: "Página do circuito do Festival Alumiô, com ilustrações do Centro Histórico",
          caption: "Apresentação do circuito, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/circuito",
          containsThirdParty: ["arte", "marca"],
        },
        {
          src: "/cases/festival-alumio/programacao-390.avif",
          width: 390,
          height: 844,
          alt: "Programação do Festival Alumiô no celular, com opções de dia e busca por artista",
          caption: "Programação no celular, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/programacao",
          containsThirdParty: ["arte", "marca"],
        },
      ],
    },
    // R36: cores da sala festival-alumio em src/styles/tokens.json.
    theme: {
      surface: "#FF7614",
      surfaceAlt: "#FFF2D8",
      ink: "#19151C",
      inkMuted: "#3B352F",
      accent: "#1645E8",
      accent2: "#FFE358",
      ctaBg: "#19151C",
      ctaInk: "#FFF2D8",
      easel: "#19151C",
      displayFont: "barlow-condensed",
      texture: "noise",
    },
    permissions: {
      cleared: true,
      notes:
        "Escopo confirmado pelo dono em 2026-09-22: apenas o site. Uso de todos os elementos das capturas selecionadas autorizado na mesma data. Identidade, ilustrações e conteúdo não são atribuídos à Byte; período e parceiros não informados.",
    },
    seo: {
      title: "Festival Alumiô: estudo de caso | Byte Criativo",
      description:
        "Estudo de caso do site do Alumiô Festival 2026: programação filtrável, favoritos no aparelho sem cadastro, circuito e memória fotográfica.",
    },
    updatedAt: "2026-09-22",
  },
]

export const caseStudies: CaseStudyData[] = z
  .array(CaseStudy)
  .parse(caseStudiesRaw)

// Slugs publicados em ordem de exibição, para o sitemap e para
// generateStaticParams. Hoje a lista é vazia: os dois cases aguardam o
// O schema recusa "published" sem permissions.cleared.
export const publishedCaseEntries: ReadonlyArray<{
  slug: string
  updatedAt: string
}> = caseStudies
  .filter((estudo) => estudo.status === "published")
  .sort((a, b) => a.order - b.order)
  .map((estudo) => ({ slug: estudo.slug, updatedAt: estudo.updatedAt }))
