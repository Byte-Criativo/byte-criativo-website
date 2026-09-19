import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ServicosPage, { metadata } from "./page"
import { getServiceHub } from "@/content"

const serviceHub = getServiceHub()

describe("Hub de Serviços (/servicos)", () => {
  it("exporta metadata com seoTitle, description e canonical /servicos", () => {
    expect(metadata.title).toBe(serviceHub.intro.seoTitle)
    expect(metadata.description).toBe(serviceHub.intro.description)
    expect(metadata.alternates?.canonical).toBe("/servicos")
  })

  it("renderiza script ld+json com grafo Schema.org completo", () => {
    const { container } = render(<ServicosPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const json = JSON.parse(script?.textContent ?? "{}")
    expect(json["@context"]).toBe("https://schema.org")
    expect(Array.isArray(json["@graph"])).toBe(true)

    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toContain("Organization")
    expect(tipos).toContain("WebSite")
    expect(tipos).toContain("WebPage")
    expect(tipos).toContain("BreadcrumbList")
  })

  it("renderiza breadcrumbs no topo com Início e Serviços como página atual", () => {
    render(<ServicosPage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(nav).toBeInTheDocument()

    const linkInicio = within(nav).getByRole("link", { name: "Início" })
    expect(linkInicio).toHaveAttribute("href", "/")

    const paginaAtual = within(nav).getByText("Serviços")
    expect(paginaAtual).toHaveAttribute("aria-current", "page")
  })

  it("renderiza H1 com ponto e vírgula no estilo Byte Criativo e texto de lede", () => {
    render(<ServicosPage />)
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(h1).toHaveTextContent(
      "Sites, sistemas e design decididos na mesma mesa;",
    )

    const semicolonSpan = h1.querySelector(".semicolon")
    expect(semicolonSpan).not.toBeNull()
    expect(semicolonSpan).toHaveTextContent(";")
    expect(semicolonSpan).toHaveAttribute("aria-hidden", "true")

    expect(screen.getByText(serviceHub.intro.lede)).toBeInTheDocument()
  })

  it("renderiza as âncoras rápidas para as 3 capacidades no topo", () => {
    render(<ServicosPage />)
    const navCapacidades = screen.getByRole("navigation", {
      name: "Capacidades rápidas",
    })

    const links = within(navCapacidades).getAllByRole("link")
    expect(links).toHaveLength(3)

    expect(
      within(navCapacidades).getByRole("link", {
        name: "Sites e experiências",
      }),
    ).toHaveAttribute("href", "#sites-e-experiencias")
    expect(
      within(navCapacidades).getByRole("link", { name: "Sistemas e produtos" }),
    ).toHaveAttribute("href", "#sistemas-e-produtos")
    expect(
      within(navCapacidades).getByRole("link", { name: "Design" }),
    ).toHaveAttribute("href", "#design")
  })

  it("renderiza a seção 'Por onde começar' com as 4 situações e links de ação", () => {
    render(<ServicosPage />)
    const secao = screen.getByRole("region", { name: "Por onde começar" })
    expect(secao).toBeInTheDocument()

    expect(
      within(secao).getByRole("heading", {
        level: 2,
        name: "Por onde começar",
      }),
    ).toBeInTheDocument()

    for (const sit of serviceHub.situacoes) {
      const heading = within(secao).getByRole("heading", {
        level: 3,
        name: sit.situation,
      })
      expect(heading).toBeInTheDocument()

      const itemLi = heading.closest("li")
      expect(itemLi).not.toBeNull()
      if (itemLi) {
        const link = within(itemLi).getByRole("link", { name: sit.targetLabel })
        expect(link).toHaveAttribute("href", sit.targetAnchor)
      }
    }
  })

  it("renderiza as 3 seções de capacidade com seus IDs, descrições e serviços", () => {
    const { container } = render(<ServicosPage />)

    for (const capacidade of serviceHub.capacidades) {
      const secao = container.querySelector<HTMLElement>(
        `section#${capacidade.id}`,
      )
      expect(secao).not.toBeNull()
      if (!secao) continue

      expect(
        within(secao).getByRole("heading", {
          level: 2,
          name: capacidade.title,
        }),
      ).toBeInTheDocument()

      expect(within(secao).getByText(capacidade.text)).toBeInTheDocument()

      for (const service of capacidade.services) {
        const linkServico = within(secao).getByRole("link", {
          name: service.title,
        })
        expect(linkServico).toHaveAttribute("href", service.href)

        expect(
          within(secao).getByRole("heading", { level: 3, name: service.title }),
        ).toBeInTheDocument()

        expect(within(secao).getByText(service.description)).toBeInTheDocument()
      }

      if (capacidade.relatedCase) {
        const linkCase = within(secao).getByRole("link", {
          name: capacidade.relatedCase.linkText,
        })
        expect(linkCase).toHaveAttribute(
          "href",
          `/portfolio/${capacidade.relatedCase.slug}`,
        )
      }
    }
  })

  it("a capacidade 'Design' não possui link de case study associado", () => {
    const { container } = render(<ServicosPage />)
    const secaoDesign = container.querySelector<HTMLElement>("section#design")
    expect(secaoDesign).not.toBeNull()
    if (!secaoDesign) return

    const links = within(secaoDesign).getAllByRole("link")
    expect(links).toHaveLength(3) // apenas UI/UX, Design de produto, Copywriting
    expect(
      within(secaoDesign).queryByRole("link", { name: /estudo de caso/i }),
    ).toBeNull()
  })

  it("renderiza a seção 'Evolução contínua' com texto e link para o processo", () => {
    render(<ServicosPage />)
    const secao = screen.getByRole("region", { name: "Evolução contínua" })
    expect(secao).toBeInTheDocument()

    expect(
      within(secao).getByRole("heading", {
        level: 2,
        name: serviceHub.evolucaoContinua.h2,
      }),
    ).toBeInTheDocument()

    expect(
      within(secao).getByText(serviceHub.evolucaoContinua.text),
    ).toBeInTheDocument()

    const cta = within(secao).getByRole("link", {
      name: serviceHub.evolucaoContinua.cta.label,
    })
    expect(cta).toHaveAttribute("href", serviceHub.evolucaoContinua.cta.href)
  })

  it("renderiza a banda de CTA final (#conversa-hub) com botão e WhatsApp", () => {
    render(<ServicosPage />)
    const secaoCta = screen.getByRole("region", {
      name: serviceHub.ctaFinal.h2,
    })
    expect(secaoCta).toBeInTheDocument()
    expect(secaoCta).toHaveAttribute("id", "conversa-hub")

    expect(
      within(secaoCta).getByRole("heading", {
        level: 2,
        name: serviceHub.ctaFinal.h2,
      }),
    ).toBeInTheDocument()

    expect(
      within(secaoCta).getByText(serviceHub.ctaFinal.text),
    ).toBeInTheDocument()

    const btnContato = within(secaoCta).getByRole("link", {
      name: serviceHub.ctaFinal.ctaPrimary.label,
    })
    expect(btnContato).toHaveAttribute(
      "href",
      serviceHub.ctaFinal.ctaPrimary.href,
    )

    const btnWhatsApp = within(secaoCta).getByRole("link", {
      name: new RegExp(serviceHub.ctaFinal.ctaSecondary.label),
    })
    expect(btnWhatsApp).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
    expect(btnWhatsApp).toHaveAttribute("data-location", "services-hub")
    expect(btnWhatsApp).toHaveAttribute("data-context", "hub")
  })
})
