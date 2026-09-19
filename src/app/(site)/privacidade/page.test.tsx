import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PrivacidadePage, { metadata } from "./page"
import { getPrivacidadePage } from "@/content"

const privacidade = getPrivacidadePage()

describe("Página Privacidade (/privacidade)", () => {
  it("exporta metadata com seoTitle, description e canonical /privacidade", () => {
    expect(metadata.title).toEqual({ absolute: privacidade.seo.seoTitle })
    expect(metadata.description).toBe(privacidade.seo.description)
    expect(metadata.alternates?.canonical).toBe("/privacidade")
  })

  it("renderiza script ld+json apenas com Organization, WebSite e WebPage", () => {
    const { container } = render(<PrivacidadePage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toEqual(["Organization", "WebSite", "WebPage"])
  })

  it("renderiza exatamente um H1 com o título e a data de atualização", () => {
    render(<PrivacidadePage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(privacidade.title)

    const tempo = screen.getByText(/Última atualização:/)
    expect(tempo.querySelector("time")).toHaveAttribute(
      "datetime",
      privacidade.lastUpdated,
    )
    expect(tempo).toHaveTextContent("16 de setembro de 2026")
  })

  it("renderiza todas as seções numeradas como H2 com seus conteúdos", () => {
    render(<PrivacidadePage />)

    for (const section of privacidade.sections) {
      const titulo = `${section.number}. ${section.title}`
      const secao = screen.getByRole("region", { name: titulo })
      expect(
        within(secao).getByRole("heading", { level: 2, name: titulo }),
      ).toBeInTheDocument()

      const paragrafos = Array.isArray(section.content)
        ? section.content
        : [section.content]
      for (const paragrafo of paragrafos) {
        // Trechos repetidos dentro da mesma seção (ex.: a linha de base
        // legal das subseções 3.3 e 3.6) são válidos no texto da política.
        expect(
          within(secao).getAllByText(paragrafo).length,
        ).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it("renderiza as subseções como H3 dentro da seção de dados tratados", () => {
    render(<PrivacidadePage />)

    const principal = privacidade.sections.find((s) => s.subsections)
    expect(principal).toBeDefined()
    if (!principal) return

    const secao = screen.getByRole("region", {
      name: `${principal.number}. ${principal.title}`,
    })

    for (const sub of principal.subsections ?? []) {
      const titulo = `${sub.number} ${sub.title}`
      expect(
        within(secao).getByRole("heading", { level: 3, name: titulo }),
      ).toBeInTheDocument()

      const paragrafos = Array.isArray(sub.content)
        ? sub.content
        : [sub.content]
      for (const paragrafo of paragrafos) {
        expect(
          within(secao).getAllByText(paragrafo).length,
        ).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it("não renderiza breadcrumbs", () => {
    render(<PrivacidadePage />)
    expect(
      screen.queryByRole("navigation", { name: "Caminho da página" }),
    ).toBeNull()
  })
})
