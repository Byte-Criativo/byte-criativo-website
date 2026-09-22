import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CaseStudy } from "@/content/schema"
import CasePage, {
  generateStaticParams,
  generateMetadata,
  dynamicParams,
} from "./page"

// Double/fixture: isola a renderização da página dos cases reais, então a
// renderização da rota é testada com um case de mentira. A validação do
// double pelo schema fica no primeiro teste; os loaders reais são cobertos
// em src/content/cases.test.ts. A fixture mora em vi.hoisted porque a
// fábrica do vi.mock roda antes das importações do módulo.
const { casePublicado, caseEmRevisao } = vi.hoisted(() => {
  const imagem = {
    src: "/cases/case-teste/home-1440.avif",
    width: 1440,
    height: 900,
    alt: "Página inicial do Case Teste em destaque",
    caption: "Home do Case Teste, capturada em 2026-09-16",
    capturedAt: "2026-09-16",
    sourceUrl: "https://www.caseteste.com.br/",
  }

  const casePublicado = {
    slug: "case-teste",
    status: "published",
    order: 1,
    title: "Case Teste: um projeto de exemplo",
    subtitle: "Site de exemplo usado só nos testes da rota de case.",
    summary: "Resumo do case de teste.",
    projectType: "Site institucional",
    liveUrl: "https://www.caseteste.com.br/",
    liveCheckedAt: "2026-09-16",
    role: {
      disciplines: ["desenvolvimento"],
      evidence: [
        {
          kind: "owner-statement",
          note: "Autorizado pelo dono",
          confirmedAt: "2026-09-18",
        },
      ],
    },
    thirdPartyCredits: [
      { item: "Fotografias", credit: "Autoria de terceiros" },
    ],
    needs: ["Precisava disto", "Precisava daquilo", "E também de outro"],
    uxDecisions: [
      { title: "Decisão um", problem: "Problema um", decision: "Caminho um" },
      {
        title: "Decisão dois",
        problem: "Problema dois",
        decision: "Caminho dois",
      },
    ],
    engineering: [
      { name: "Next.js", verified: true, evidence: "Observado ao vivo" },
    ],
    observableResults: [
      {
        label: "Páginas no ar",
        value: "4 em 2026-09-16",
        source: "sitemap",
        checkedAt: "2026-09-16",
      },
    ],
    services: ["desenvolvimento-de-sites"],
    media: {
      cover: imagem,
      gallery: [
        imagem,
        imagem,
        {
          ...imagem,
          src: "/cases/case-teste/mobile-390.avif",
          width: 390,
          height: 844,
        },
      ],
    },
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
    },
    permissions: { cleared: true, notes: "Autorizado em teste" },
    seo: {
      title: "Case Teste: estudo de caso | Byte Criativo",
      description: "Descrição de SEO do case de teste.",
    },
    updatedAt: "2026-09-19",
  }

  const caseEmRevisao = {
    ...casePublicado,
    slug: "case-em-revisao",
    status: "review",
    permissions: { cleared: false, notes: "Gate D5 aberto" },
  }

  return { casePublicado, caseEmRevisao }
})

vi.mock("@/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content")>()
  return {
    ...actual,
    getPublishedCases: () => [casePublicado],
    getCaseBySlug: (slug: string) =>
      slug === casePublicado.slug
        ? casePublicado
        : slug === caseEmRevisao.slug
          ? caseEmRevisao
          : undefined,
  }
})

describe("CasePage - double", () => {
  it("a fixture de publicado é um CaseStudy válido", () => {
    expect(CaseStudy.safeParse(casePublicado).success).toBe(true)
  })
})

describe("CasePage - SSG & Metadata", () => {
  it("dynamicParams é false para forçar SSG estrito", () => {
    expect(dynamicParams).toBe(false)
  })

  it("generateStaticParams retorna apenas slugs publicados", () => {
    const params = generateStaticParams()
    expect(params).toEqual([{ slug: "case-teste" }])
    expect(params.some((p) => p.slug === "case-em-revisao")).toBe(false)
  })

  it("generateMetadata usa case.seo via buildMetadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "case-teste" }),
    })
    expect(meta.title).toEqual({ absolute: casePublicado.seo.title })
    expect(meta.description).toBe(casePublicado.seo.description)
    expect(meta.alternates?.canonical).toBe("/portfolio/case-teste")
    expect(meta.openGraph?.images).toEqual([
      {
        url: casePublicado.media.cover.src,
        width: casePublicado.media.cover.width,
        height: casePublicado.media.cover.height,
      },
    ])
  })

  it("generateMetadata retorna objeto vazio para slug inexistente ou em review", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: "desconhecido" }) }),
    ).resolves.toEqual({})
    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: "case-em-revisao" }),
      }),
    ).resolves.toEqual({})
  })
})

describe("CasePage - Renderização", () => {
  it("chama notFound() para slug inexistente", async () => {
    await expect(
      CasePage({ params: Promise.resolve({ slug: "desconhecido" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
  })

  it("chama notFound() para case em review (gate D5)", async () => {
    await expect(
      CasePage({ params: Promise.resolve({ slug: "case-em-revisao" }) }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
  })

  it("renderiza o case publicado com hero, corpo editorial, galeria e navegação", async () => {
    const jsx = await CasePage({
      params: Promise.resolve({ slug: "case-teste" }),
    })
    const { container } = render(jsx)

    // Breadcrumbs: Início / Trabalhos / Case Teste
    const breadcrumbsNav = screen.getByRole("navigation", {
      name: "Caminho da página",
    })
    expect(
      within(breadcrumbsNav).getByRole("link", { name: "Início" }),
    ).toHaveAttribute("href", "/")
    expect(
      within(breadcrumbsNav).getByRole("link", { name: "Trabalhos" }),
    ).toHaveAttribute("href", "/portfolio")

    // Hero do case dentro de article[data-case]
    const artigo = container.querySelector("article[data-case='case-teste']")
    expect(artigo).not.toBeNull()
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveTextContent(casePublicado.title)
    expect(
      screen.getByRole("link", { name: /Ver projeto no ar/ }),
    ).toHaveAttribute("href", casePublicado.liveUrl)

    // Corpo editorial
    for (const necessidade of casePublicado.needs) {
      expect(screen.getByText(necessidade)).toBeInTheDocument()
    }
    for (const decisao of casePublicado.uxDecisions) {
      expect(screen.getByText(decisao.title)).toBeInTheDocument()
      expect(screen.getByText(decisao.decision)).toBeInTheDocument()
    }
    for (const credito of casePublicado.thirdPartyCredits) {
      expect(screen.getByText(credito.item)).toBeInTheDocument()
    }

    // Galeria: 3 figuras com gatilho de ampliação (GaleriaDialog)
    const figuras = container.querySelectorAll("[data-galeria-item]")
    expect(figuras).toHaveLength(3)
    const imagemMobile = figuras[2]?.querySelector("img")
    expect(imagemMobile).toHaveAttribute("width", "390")
    expect(imagemMobile).toHaveAttribute("height", "844")

    // Navegação entre trabalhos: sem outro publicado, sobra "Ver todos"
    expect(
      screen.getByRole("link", { name: "Ver todos os trabalhos" }),
    ).toHaveAttribute("href", "/portfolio")

    // JSON-LD: WebPage + CreativeWork + BreadcrumbList (especificação 5.6)
    const scriptTag = container.querySelector(
      "script[type='application/ld+json']",
    )
    expect(scriptTag).not.toBeNull()
    const jsonLd = JSON.parse(scriptTag!.textContent || "{}")
    const tipos = jsonLd["@graph"].map(
      (node: { "@type": string }) => node["@type"],
    )
    expect(tipos).toContain("WebPage")
    expect(tipos).toContain("BreadcrumbList")
    const creativeWork = jsonLd["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "CreativeWork",
    )
    expect(creativeWork).toBeDefined()
    expect(creativeWork.creator["@id"]).toContain("#organization")
    expect(creativeWork.sameAs).toBe(casePublicado.liveUrl)
  })
})
