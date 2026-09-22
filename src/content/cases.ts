import { z } from "zod"
import { CaseStudy, type CaseStudyData } from "./schema"

// Dados dos estudos de caso, portados das fichas internas
// (docs/content/cases/*.md) — só fatos com status "confirmado" ou observados
// e datados nas fichas. As fichas aguardam assinatura do dono (gate D5):
// por isso todo case fica com status "review" e permissions.cleared: false,
// e o refine do schema CaseStudy impede publicação acidental.
//
// IMPORTANTE: este arquivo NÃO importa "server-only" de propósito — o
// sitemap (src/app/sitemap.ts) importa `publishedCaseEntries` daqui e
// precisa carregar fora do contexto de servidor (Vitest). Os loaders com a
// proteção ficam em src/content/index.ts.

const D5_NOTAS =
  "Gate D5 aberto: aguardando revisão e assinatura do dono. Publicar exige permissions.cleared: true após a assinatura."

export const caseStudiesRaw = [
  {
    slug: "underground-pb",
    status: "review",
    order: 1,
    title: "Underground PB: a cena independente da Paraíba em um só lugar",
    subtitle:
      "Plataforma web cultural com contas, envio moderado de conteúdo, mapa de palcos e PWA instalável.",
    summary:
      "Plataforma da cena independente da Paraíba: diretório de bandas, agenda, mapa de palcos, lançamentos e memória, com contas e moderação.",
    projectType: "Plataforma cultural",
    liveUrl: "https://www.undergroundpb.com.br/",
    liveCheckedAt: "2026-09-16",
    role: {
      // Ficha §2: nenhuma disciplina tem assinatura do dono (D5); o rodapé do
      // projeto traz assinatura pessoal, não a marca Byte. O que existe é
      // indício técnico de desenvolvimento (repositório e stack ao vivo).
      disciplines: ["desenvolvimento"],
      evidence: [
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
      { item: "Notícias", credit: "Assinadas por autores convidados" },
      { item: "Flyers de eventos", credit: "Produtoras dos eventos" },
      {
        item: "Fontes Anton e Barlow",
        credit: "Arquivos autohospedados pelo projeto",
      },
    ],
    // REVISÃO D5 (validar com o dono antes de publicar):
    // - needs[2] "falar a língua da cena": formulação editorial, sem base
    //   literal na ficha;
    // - thirdPartyCredits "Notícias — Assinadas por autores convidados": a
    //   ficha atesta apenas "3 autores distintos", sem qualificá-los;
    // - uxDecisions[1] "Vistas lista, mapa e circuito compartilham os mesmos
    //   filtros": a ficha atesta as 3 vistas e as 41 opções de filtro, mas
    //   não que os filtros são os mesmos entre as vistas.
    needs: [
      "Reunir bandas, shows, palcos, lançamentos, notícias e memória num lugar confiável",
      "Aceitar contribuições do público sem perder a curadoria",
      "Funcionar bem no celular e falar a língua da cena",
    ],
    uxDecisions: [
      {
        title: "O evento do dia abre a home",
        problem: "Quem chega quer saber o que tem hoje na cena",
        decision:
          "Hero dinâmico “Hoje na cena” com o próximo evento em destaque",
      },
      {
        title: "Mapa e lista de palcos juntos",
        problem: "Achar palco por região, gênero ou capacidade",
        decision:
          "Vistas lista, mapa e circuito compartilham os mesmos filtros",
      },
      {
        title: "Embeds só com consentimento",
        problem: "Players de Spotify e YouTube carregam recursos de terceiros",
        decision:
          "Vídeos e faixas só carregam depois da permissão; por padrão, só cookies essenciais",
      },
    ],
    engineering: [
      {
        name: "htmx 1.9.12",
        verified: true,
        evidence: "window.htmx.version observado ao vivo em 2026-09-16",
      },
      {
        name: "Django 6.0.8",
        verified: true,
        evidence:
          "Django==6.0.8 em requirements.txt do branch local feat/redesign-fase1; não detectável ao vivo (o branch local não reflete necessariamente a produção)",
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
        label: "Conteúdo mais recente no sitemap",
        value: "lastmod de 2026-09-15",
        source: "sitemap",
        checkedAt: "2026-09-16",
      },
    ],
    services: ["sistemas-web-sob-medida"],
    media: {
      // Lacuna: a única captura real disponível no repositório é a primeira
      // dobra (a mesma que home.ts já referencia). Os arquivos-mestre da
      // ficha §6 (1440 DPR 2, 390 DPR 3, internas) ainda não foram produzidos
      // e as capturas existentes estão fora do Git até D2. A galeria mínima
      // repete a captura disponível até a produção dos derivados.
      cover: {
        src: "/cases/underground-pb/home-1440.avif",
        alt: "Página inicial do Underground PB, com a agenda da cena independente da Paraíba em destaque",
        caption: "Home do Underground PB, capturada em 2026-09-16",
        capturedAt: "2026-09-16",
        sourceUrl: "https://www.undergroundpb.com.br/",
        containsThirdParty: ["arte", "conteudo-usuario"],
      },
      gallery: [
        {
          src: "/cases/underground-pb/home-1440.avif",
          alt: "Página inicial do Underground PB, com a agenda da cena independente da Paraíba em destaque",
          caption: "Home do Underground PB, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.undergroundpb.com.br/",
          containsThirdParty: ["arte", "conteudo-usuario"],
        },
        {
          src: "/cases/underground-pb/home-1440.avif",
          alt: "Página inicial do Underground PB, com a agenda da cena independente da Paraíba em destaque",
          caption: "Home do Underground PB, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.undergroundpb.com.br/",
          containsThirdParty: ["arte", "conteudo-usuario"],
        },
        {
          src: "/cases/underground-pb/home-1440.avif",
          alt: "Página inicial do Underground PB, com a agenda da cena independente da Paraíba em destaque",
          caption: "Home do Underground PB, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.undergroundpb.com.br/",
          containsThirdParty: ["arte", "conteudo-usuario"],
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
      cleared: false,
      notes: `${D5_NOTAS} Ficha docs/content/cases/underground-pb.md (seções 2, 3, 7 e 9): escopo por disciplina, período, parceiros e autorizações de terceiros pendentes; o crédito do rodapé do projeto é assinatura pessoal, não a marca Byte (D3). ATENÇÃO: role.disciplines ("desenvolvimento") vai além do "confirmado" da ficha (que rebaixa tudo a indício técnico até D5) — revalidar discipline a discipline na assinatura do D5 antes de publicar.`,
    },
    seo: {
      title: "Underground PB: estudo de caso | Byte Criativo",
      description:
        "Estudo de caso da plataforma cultural Underground PB: diretório de bandas, agenda, mapa de palcos e memória da cena independente da Paraíba.",
    },
    updatedAt: "2026-09-19",
  },
  {
    slug: "festival-alumio",
    status: "review",
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
      // Ficha §2: o único papel confirmado é a construção do site, coberta
      // pelo crédito público "Feito na Paraíba pela Byte Criativo". Demais
      // disciplinas são indício técnico ou PENDENTE (D5).
      disciplines: ["desenvolvimento"],
      evidence: [
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
      "Informar fonte e data de atualização em cada item da programação",
    ],
    uxDecisions: [
      {
        title: "Favoritos sem cadastro",
        problem: "Montar a própria programação não pode exigir criar conta",
        decision:
          "Favoritos salvos no próprio aparelho, com o aviso “Seus favoritos ficam neste aparelho, sem cadastro.”",
      },
      {
        title: "Contagem dos filtros anunciada",
        problem:
          "Quem usa leitor de tela precisa saber o resultado de cada filtro",
        decision:
          "Região aria-live anuncia quantas apresentações foram encontradas",
      },
      {
        title: "Agenda legível sem JavaScript",
        problem: "Os filtros dependem de JavaScript; a informação, não",
        decision:
          "Sem JavaScript a agenda completa aparece, com aviso para ativar os filtros e os favoritos",
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
      // Lacuna: igual ao underground-pb — só há a captura da primeira dobra
      // (a mesma que home.ts referencia). As 16 capturas de
      // docs/research/captures/2026-09-alumio/ estão fora do Git até D2 e os
      // derivados AVIF da ficha §6 ainda não foram produzidos.
      cover: {
        src: "/cases/festival-alumio/home-1440.avif",
        alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
        caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
        capturedAt: "2026-09-16",
        sourceUrl: "https://www.festivalalumio.com.br/",
        containsThirdParty: ["arte", "marca", "foto"],
      },
      gallery: [
        {
          src: "/cases/festival-alumio/home-1440.avif",
          alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
          caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/",
          containsThirdParty: ["arte", "marca", "foto"],
        },
        {
          src: "/cases/festival-alumio/home-1440.avif",
          alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
          caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/",
          containsThirdParty: ["arte", "marca", "foto"],
        },
        {
          src: "/cases/festival-alumio/home-1440.avif",
          alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
          caption: "Home do Festival Alumiô 2026, capturada em 2026-09-16",
          capturedAt: "2026-09-16",
          sourceUrl: "https://www.festivalalumio.com.br/",
          containsThirdParty: ["arte", "marca", "foto"],
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
      cleared: false,
      notes: `${D5_NOTAS} Ficha docs/content/cases/festival-alumio.md (seções 2, 3, 7 e 9): autoria de marca, ilustrações, paleta e tipografia, período, destino do site após 2026-09-20 e autorizações de terceiros pendentes.`,
    },
    seo: {
      title: "Festival Alumiô: estudo de caso | Byte Criativo",
      description:
        "Estudo de caso do site do Alumiô Festival 2026: programação filtrável, favoritos no aparelho sem cadastro, circuito e memória fotográfica.",
    },
    updatedAt: "2026-09-19",
  },
]

export const caseStudies: CaseStudyData[] = z
  .array(CaseStudy)
  .parse(caseStudiesRaw)

// Slugs publicados em ordem de exibição, para o sitemap e para
// generateStaticParams. Hoje a lista é vazia: os dois cases aguardam o
// gate D5 e o schema recusa "published" sem permissions.cleared.
export const publishedCaseEntries: ReadonlyArray<{
  slug: string
  updatedAt: string
}> = caseStudies
  .filter((estudo) => estudo.status === "published")
  .sort((a, b) => a.order - b.order)
  .map((estudo) => ({ slug: estudo.slug, updatedAt: estudo.updatedAt }))
