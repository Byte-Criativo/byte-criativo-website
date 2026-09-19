import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PortfolioPage, { metadata } from "./page"
import { getHomePage, getPortfolioPage } from "@/content"

const portfolio = getPortfolioPage()
const salas = getHomePage().salas

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

    const colecao = json["@graph"].find(
      (item: Record<string, unknown>) => item["@type"] === "CollectionPage",
    )
    const lista = colecao.mainEntity
    expect(lista["@type"]).toBe("ItemList")
    expect(lista.itemListElement).toHaveLength(salas.items.length)
    expect(lista.itemListElement[0].item).toEqual({
      "@type": "CreativeWork",
      name: salas.items[0]?.name,
      url: `https://www.bcriativo.com${salas.items[0]?.caseStudyUrl}`,
    })
  })

  it("renderiza breadcrumbs com Início e Trabalhos como página atual", () => {
    render(<PortfolioPage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(within(nav).getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(within(nav).getByText("Trabalhos")).toHaveAttribute(
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

  it("renderiza uma sala por trabalho publicado, com legenda e ações", () => {
    render(<PortfolioPage />)
    const secao = screen.getByRole("region", { name: "Trabalhos publicados" })

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

      const estudo = within(artigo).getByRole("link", {
        name: `Ver estudo de caso do ${sala.name}`,
      })
      expect(estudo).toHaveAttribute("href", sala.caseStudyUrl)

      const noAr = within(artigo).getByRole("link", {
        name: `Ver projeto no ar do ${sala.name} (abre em nova aba)`,
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
