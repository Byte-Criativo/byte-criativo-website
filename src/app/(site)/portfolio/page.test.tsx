import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import PortfolioPage, { metadata } from "./page"
import { getHomePage, getPortfolioPage } from "@/content"

// Estado mutável do mock: quais slugs o loader getPublishedCases devolve.
// O hub só lê `.slug` dos cases publicados, então o double é mínimo.
const estado = vi.hoisted(() => ({ slugsPublicados: [] as string[] }))

vi.mock("@/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content")>()
  return {
    ...actual,
    getPublishedCases: () => estado.slugsPublicados.map((slug) => ({ slug })),
  }
})

const portfolio = getPortfolioPage()
const salas = getHomePage().salas

beforeEach(() => {
  estado.slugsPublicados = []
})

describe("Hub de Trabalhos (/portfolio)", () => {
  it("exporta metadata com seoTitle, description e canonical /portfolio", () => {
    expect(metadata.title).toEqual({ absolute: portfolio.seo.seoTitle })
    expect(metadata.description).toBe(portfolio.seo.description)
    expect(metadata.alternates?.canonical).toBe("/portfolio")
  })

  it("renderiza script ld+json com CollectionPage, ItemList e BreadcrumbList", () => {
    const { container } = render(<PortfolioPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toContain("Organization")
    expect(tipos).toContain("WebSite")
    expect(tipos).toContain("CollectionPage")
    expect(tipos).toContain("BreadcrumbList")
  })

  it("renderiza breadcrumbs com Início e Trabalhos como página atual", () => {
    render(<PortfolioPage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(within(nav).getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(within(nav).getByText("Projetos")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("renderiza exatamente um H1 e a introdução", () => {
    render(<PortfolioPage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent("Cada projeto com a própria identidade;")

    for (const paragrafo of portfolio.intro) {
      expect(screen.getByText(paragrafo)).toBeInTheDocument()
    }
  })

  it("renderiza uma sala por trabalho, com legenda e link do site ao vivo", () => {
    render(<PortfolioPage />)
    const secao = screen.getByRole("region", { name: "Projetos publicados" })

    for (const sala of salas.items) {
      const artigo = within(secao).getByRole("article", { name: sala.name })
      expect(
        within(artigo).getByRole("heading", { level: 2, name: sala.name }),
      ).toBeInTheDocument()
      expect(within(artigo).getByText(sala.type)).toBeInTheDocument()
      expect(within(artigo).getByText(sala.phrase)).toBeInTheDocument()
      expect(within(artigo).getByAltText(sala.image.alt)).toBeInTheDocument()

      for (const capacidade of sala.capabilities) {
        expect(within(artigo).getByText(capacidade)).toBeInTheDocument()
      }

      const noAr = within(artigo).getByRole("link", {
        name: `Visitar site do ${sala.name} (abre em nova aba)`,
      })
      expect(noAr).toHaveAttribute("href", sala.liveUrl)
    }
  })

  it("renderiza a banda final com CTA e WhatsApp", () => {
    render(<PortfolioPage />)
    const banda = screen.getByRole("region", { name: portfolio.ctaFinal.h2 })
    expect(banda).toHaveAttribute("id", "conversa-portfolio")
    expect(within(banda).getByText(portfolio.ctaFinal.text)).toBeInTheDocument()

    const cta = within(banda).getByRole("link", {
      name: portfolio.ctaFinal.ctaPrimary.label,
    })
    expect(cta).toHaveAttribute("href", "/contato?origem=portfolio")

    const whatsapp = within(banda).getByRole("link", {
      name: new RegExp(portfolio.ctaFinal.ctaSecondary.label),
    })
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
  })
})

describe("Hub de Trabalhos — gate D5 (estudos de caso)", () => {
  it("sem cases publicados, nenhuma sala mostra link de estudo de caso e o ItemList fica vazio", () => {
    estado.slugsPublicados = []
    const { container } = render(<PortfolioPage />)

    const secao = screen.getByRole("region", { name: "Projetos publicados" })
    expect(
      within(secao).queryByRole("link", { name: /Ver estudo de caso/ }),
    ).not.toBeInTheDocument()

    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const colecao = json["@graph"].find(
      (item: Record<string, unknown>) => item["@type"] === "CollectionPage",
    )
    expect(colecao.mainEntity["@type"]).toBe("ItemList")
    expect(colecao.mainEntity.itemListElement).toHaveLength(0)
  })

  it("com um case publicado, só a sala dele mostra o link e o ItemList anuncia só ele", () => {
    estado.slugsPublicados = ["underground-pb"]
    const { container } = render(<PortfolioPage />)

    const secao = screen.getByRole("region", { name: "Projetos publicados" })
    const salaPublicada = salas.items.find((s) => s.slug === "underground-pb")!
    const salaEmRevisao = salas.items.find((s) => s.slug !== "underground-pb")!

    const artigoPublicado = within(secao).getByRole("article", {
      name: salaPublicada.name,
    })
    expect(
      within(artigoPublicado).getByRole("link", {
        name: `Ver estudo de caso do ${salaPublicada.name}`,
      }),
    ).toHaveAttribute("href", salaPublicada.caseStudyUrl)

    const artigoEmRevisao = within(secao).getByRole("article", {
      name: salaEmRevisao.name,
    })
    expect(
      within(artigoEmRevisao).queryByRole("link", {
        name: /Ver estudo de caso/,
      }),
    ).not.toBeInTheDocument()
    // A sala em revisão continua com o link do site ao vivo.
    expect(
      within(artigoEmRevisao).getByRole("link", {
        name: `Visitar site do ${salaEmRevisao.name} (abre em nova aba)`,
      }),
    ).toHaveAttribute("href", salaEmRevisao.liveUrl)

    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const colecao = json["@graph"].find(
      (item: Record<string, unknown>) => item["@type"] === "CollectionPage",
    )
    expect(colecao.mainEntity.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "CreativeWork",
          name: salaPublicada.name,
          url: `https://www.bcriativo.com${salaPublicada.caseStudyUrl}`,
        },
      },
    ])
  })
})
