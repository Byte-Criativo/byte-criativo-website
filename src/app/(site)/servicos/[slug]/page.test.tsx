import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ServiceDetailPage, {
  generateStaticParams,
  generateMetadata,
  dynamicParams,
} from "./page"
import { getAllServices, getPublishedCases, getServiceBySlug } from "@/content"

describe("ServiceDetailPage - SSG & Metadata", () => {
  it("dynamicParams é false para forçar SSG estrito", () => {
    expect(dynamicParams).toBe(false)
  })

  it("generateStaticParams retorna exatamente os 7 slugs preservados", () => {
    const params = generateStaticParams()
    expect(params).toHaveLength(7)
    const slugs = params.map((p) => p.slug)
    expect(slugs).toEqual([
      "desenvolvimento-de-sites",
      "landing-pages",
      "sistemas-web-sob-medida",
      "automacao-e-integracoes",
      "ui-ux-design",
      "design-de-produto",
      "copywriting-para-web",
    ])
  })

  it("generateMetadata retorna metadados corretos para slug válido", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "desenvolvimento-de-sites" }),
    })
    const service = getServiceBySlug("desenvolvimento-de-sites")!
    expect(meta.title).toEqual({ absolute: service.seoTitle })
    expect(meta.description).toBe(service.description)
    expect(meta.alternates?.canonical).toBe(
      "/servicos/desenvolvimento-de-sites",
    )
  })

  it("generateMetadata retorna objeto vazio para slug inválido", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "slug-inexistente" }),
    })
    expect(meta).toEqual({})
  })
})

describe("ServiceDetailPage - Renderização", () => {
  it("chama notFound() quando o slug é inexistente", async () => {
    await expect(
      ServiceDetailPage({
        params: Promise.resolve({ slug: "slug-que-nao-existe" }),
      }),
    ).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
  })

  it("renderiza a página completa para desenvolvimento-de-sites", async () => {
    const service = getServiceBySlug("desenvolvimento-de-sites")!
    const jsx = await ServiceDetailPage({
      params: Promise.resolve({ slug: "desenvolvimento-de-sites" }),
    })

    const { container } = render(jsx)

    // Breadcrumbs
    const breadcrumbsNav = screen.getByRole("navigation", {
      name: "Caminho da página",
    })
    expect(breadcrumbsNav).toBeInTheDocument()
    expect(
      within(breadcrumbsNav).getByRole("link", { name: "Início" }),
    ).toHaveAttribute("href", "/")
    expect(
      within(breadcrumbsNav).getByRole("link", { name: "Serviços" }),
    ).toHaveAttribute("href", "/servicos")
    const breadcrumbCurrent = within(breadcrumbsNav).getByText(service.title)
    expect(breadcrumbCurrent).toBeInTheDocument()
    expect(breadcrumbCurrent).toHaveAttribute("aria-current", "page")

    // Hero: Eyebrow, H1 (com ;), Lede, CTAs
    expect(screen.getByText(service.eyebrow)).toBeInTheDocument()

    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveTextContent(service.title)
    const semicolonSpan = h1.querySelector("[aria-hidden='true']")
    expect(semicolonSpan).toHaveTextContent(";")

    expect(screen.getByText(service.promise)).toBeInTheDocument()

    // CTAs do hero
    const heroCta = screen.getAllByRole("link", {
      name: "Falar sobre um projeto",
    })[0]
    expect(heroCta).toHaveAttribute(
      "href",
      "/contato?tipo=desenvolvimento-de-sites&origem=desenvolvimento-de-sites",
    )

    const heroWhatsApp = screen.getAllByRole("link", {
      name: /Chamar no WhatsApp/i,
    })[0]
    expect(heroWhatsApp).toHaveAttribute("data-location", "service-hero")
    expect(heroWhatsApp).toHaveAttribute(
      "data-context",
      "desenvolvimento-de-sites",
    )

    // Seção "Quando faz sentido"
    expect(
      screen.getByRole("heading", { level: 2, name: "Quando faz sentido" }),
    ).toBeInTheDocument()
    for (const item of service.quandoFazSentido) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }

    // Seção "O que você recebe"
    expect(
      screen.getByRole("heading", { level: 2, name: "O que você recebe" }),
    ).toBeInTheDocument()
    for (const item of service.oQueRecebe) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }

    // Exemplo em uso
    expect(
      screen.getByRole("heading", { level: 2, name: "Exemplo em uso" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(service.ondeFoiAplicado.description),
    ).toBeInTheDocument()
    if (
      service.ondeFoiAplicado.linkText &&
      getPublishedCases().some(
        (estudo) => estudo.slug === service.ondeFoiAplicado.caseSlug,
      )
    ) {
      expect(
        screen.getByRole("link", {
          name: service.ondeFoiAplicado.linkText,
        }),
      ).toHaveAttribute("href", service.ondeFoiAplicado.linkHref)
    }

    // Seção "Como o projeto é conduzido"
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Como o projeto é conduzido",
      }),
    ).toBeInTheDocument()
    for (const item of service.comoConduzimos) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }
    expect(
      screen.getByRole("link", { name: "Ver o processo completo" }),
    ).toHaveAttribute("href", "/processo")

    // Seção "Dúvidas sobre {nome do serviço em minúsculas}"
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: `Dúvidas sobre ${service.title.toLowerCase()}`,
      }),
    ).toBeInTheDocument()
    for (const faq of service.faqs) {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
      expect(screen.getByText(faq.answer)).toBeInTheDocument()
    }

    // Seção "Serviços relacionados"
    expect(
      screen.getByRole("heading", { level: 2, name: "Serviços relacionados" }),
    ).toBeInTheDocument()
    for (const relSlug of service.servicosRelacionados) {
      const rel = getServiceBySlug(relSlug)!
      expect(screen.getByRole("link", { name: rel.title })).toHaveAttribute(
        "href",
        `/servicos/${rel.slug}`,
      )
      expect(screen.getByText(rel.description)).toBeInTheDocument()
    }

    // Banda final de CTA (ConversaBand no verso)
    expect(
      screen.getByRole("region", {
        name: `Falar sobre ${service.title.toLowerCase()}`,
      }),
    ).toBeInTheDocument()

    // JSON-LD estruturado
    const scriptTag = container.querySelector(
      "script[type='application/ld+json']",
    )
    expect(scriptTag).not.toBeNull()
    const jsonLd = JSON.parse(scriptTag!.textContent || "{}")
    expect(jsonLd["@context"]).toBe("https://schema.org")
    expect(Array.isArray(jsonLd["@graph"])).toBe(true)

    const graphTypes = jsonLd["@graph"].map(
      (node: { "@type": string }) => node["@type"],
    )
    expect(graphTypes).toContain("Organization")
    expect(graphTypes).toContain("WebSite")
    expect(graphTypes).toContain("WebPage")
    expect(graphTypes).toContain("BreadcrumbList")
    expect(graphTypes).toContain("Service")
    expect(graphTypes).toContain("FAQPage")

    const serviceNode = jsonLd["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "Service",
    )
    expect(serviceNode.name).toBe(service.title)
    expect(serviceNode.url).toContain(`/servicos/${service.slug}`)
  })

  // Testa todos os 7 serviços para assegurar renderização sem erro
  const allServices = getAllServices()
  for (const s of allServices) {
    it(`renderiza com sucesso a página do serviço: ${s.slug}`, async () => {
      const jsx = await ServiceDetailPage({
        params: Promise.resolve({ slug: s.slug }),
      })
      const { container } = render(jsx)

      const h1 = screen.getByRole("heading", { level: 1 })
      expect(h1).toHaveTextContent(s.title)

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: `Dúvidas sobre ${s.title.toLowerCase()}`,
        }),
      ).toBeInTheDocument()

      expect(
        container.querySelector("script[type='application/ld+json']"),
      ).not.toBeNull()
    })
  }
})
