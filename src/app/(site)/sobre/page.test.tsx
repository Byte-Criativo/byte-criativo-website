import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import SobrePage, { metadata } from "./page"
import { getSobrePage } from "@/content"

const sobre = getSobrePage()

describe("Página Sobre (/sobre)", () => {
  it("exporta metadata com seoTitle, description e canonical /sobre", () => {
    expect(metadata.title).toEqual({ absolute: sobre.seo.seoTitle })
    expect(metadata.description).toBe(sobre.seo.description)
    expect(metadata.alternates?.canonical).toBe("/sobre")
  })

  it("renderiza script ld+json com AboutPage e BreadcrumbList", () => {
    const { container } = render(<SobrePage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toContain("Organization")
    expect(tipos).toContain("WebSite")
    expect(tipos).toContain("AboutPage")
    expect(tipos).toContain("BreadcrumbList")
  })

  it("renderiza breadcrumbs com Início e Sobre como página atual", () => {
    render(<SobrePage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(within(nav).getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(within(nav).getByText("Sobre")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("renderiza exatamente um H1 com o lede", () => {
    render(<SobrePage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent("Você fala com quem desenha e programa;")
    expect(screen.getByText(sobre.lede)).toBeInTheDocument()
  })

  it("renderiza 'Quem conduz' e o manifesto com link para os trabalhos", () => {
    render(<SobrePage />)
    const quemConduz = screen.getByRole("region", {
      name: sobre.quemConduz.h2,
    })
    expect(within(quemConduz).getByText(sobre.quemConduz.text))

    const trajetoria = screen.getByRole("region", {
      name: sobre.trajetoria.h2,
    })
    for (const paragraph of sobre.trajetoria.manifestoParagraphs) {
      expect(within(trajetoria).getByText(paragraph)).toBeInTheDocument()
    }
    const cta = within(trajetoria).getByRole("link", {
      name: sobre.trajetoria.cta.label,
    })
    expect(cta).toHaveAttribute("href", sobre.trajetoria.cta.href)
  })

  it("renderiza os 3 princípios com link para o processo", () => {
    render(<SobrePage />)
    const secao = screen.getByRole("region", { name: "Três princípios" })

    for (const principio of sobre.principios) {
      expect(
        within(secao).getByRole("heading", {
          level: 3,
          name: principio.title,
        }),
      ).toBeInTheDocument()
      expect(within(secao).getByText(principio.description)).toBeInTheDocument()
    }

    const link = within(secao).getByRole("link", {
      name: "Ver o processo completo",
    })
    expect(link).toHaveAttribute("href", "/processo")
  })

  it("renderiza parceiros, onde a Byte está e os dados cadastrais", () => {
    render(<SobrePage />)

    const parceiros = screen.getByRole("region", { name: sobre.parceiros.h2 })
    expect(within(parceiros).getByText(sobre.parceiros.text))

    const onde = screen.getByRole("region", { name: sobre.ondeEstamos.h2 })
    expect(within(onde).getByText(sobre.ondeEstamos.text))

    const empresa = screen.getByRole("region", { name: sobre.empresa.h2 })
    expect(
      within(empresa).getByText(
        `${sobre.empresa.name}, CNPJ ${sobre.empresa.cnpj}.`,
      ),
    ).toBeInTheDocument()
  })

  it("renderiza a banda final com CTA e WhatsApp", () => {
    render(<SobrePage />)
    const banda = screen.getByRole("region", {
      name: sobre.ctaFinal.h2.replace(/;$/, ""),
    })
    expect(banda).toHaveAttribute("id", "conversa-sobre")

    const cta = within(banda).getByRole("link", {
      name: sobre.ctaFinal.ctaPrimary.label,
    })
    expect(cta).toHaveAttribute("href", sobre.ctaFinal.ctaPrimary.href)

    const whatsapp = within(banda).getByRole("link", {
      name: new RegExp(sobre.ctaFinal.ctaSecondary.label),
    })
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
  })
})
