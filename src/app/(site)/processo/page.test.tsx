import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ProcessoPage, { metadata } from "./page"
import { getProcessoPage } from "@/content"

const processo = getProcessoPage()

describe("Página Processo (/processo)", () => {
  it("exporta metadata com seoTitle, description e canonical /processo", () => {
    expect(metadata.title).toEqual({ absolute: processo.seo.seoTitle })
    expect(metadata.description).toBe(processo.seo.description)
    expect(metadata.alternates?.canonical).toBe("/processo")
  })

  it("renderiza script ld+json com WebPage e BreadcrumbList", () => {
    const { container } = render(<ProcessoPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toContain("Organization")
    expect(tipos).toContain("WebSite")
    expect(tipos).toContain("WebPage")
    expect(tipos).toContain("BreadcrumbList")
  })

  it("renderiza breadcrumbs com Início e Processo como página atual", () => {
    render(<ProcessoPage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(within(nav).getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(within(nav).getByText("Processo")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("renderiza exatamente um H1 com o lede", () => {
    render(<ProcessoPage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent("Como um projeto anda por aqui;")
    expect(screen.getByText(processo.lede)).toBeInTheDocument()
  })

  it("renderiza a seção 'Onde design, produto e engenharia se cruzam'", () => {
    render(<ProcessoPage />)
    const secao = screen.getByRole("region", {
      name: processo.ondeSeCruzam.h2,
    })
    expect(within(secao).getByText(processo.ondeSeCruzam.text))
  })

  it("renderiza as 5 etapas como H3 com os rótulos fixos", () => {
    render(<ProcessoPage />)
    const secao = screen.getByRole("region", { name: "As cinco etapas" })
    expect(secao).toBeInTheDocument()

    for (const etapa of processo.etapas) {
      const titulo = within(secao).getByRole("heading", {
        level: 3,
        name: etapa.title,
      })
      const item = titulo.closest("li")
      expect(item).not.toBeNull()
      if (!item) continue

      expect(within(item).getByText("O que acontece")).toBeInTheDocument()
      expect(within(item).getByText(etapa.whatHappens)).toBeInTheDocument()
      expect(within(item).getByText("Você recebe")).toBeInTheDocument()
      expect(within(item).getByText(etapa.youReceive)).toBeInTheDocument()
      expect(within(item).getByText("Sua participação")).toBeInTheDocument()
      expect(
        within(item).getByText(etapa.yourParticipation),
      ).toBeInTheDocument()

      const ondeAparece = within(item).queryByText("Onde aparece num trabalho")
      if (etapa.whereAppears) {
        expect(ondeAparece).not.toBeNull()
        expect(within(item).getByText(etapa.whereAppears)).toBeInTheDocument()
      } else {
        expect(ondeAparece).toBeNull()
      }
    }
  })

  it("renderiza a seção do diagnóstico com perguntas, o que trazer e o que sai", () => {
    render(<ProcessoPage />)
    const secao = screen.getByRole("region", { name: processo.diagnostico.h2 })

    for (const question of processo.diagnostico.questions) {
      expect(within(secao).getByText(question)).toBeInTheDocument()
    }

    expect(
      within(secao).getByRole("heading", {
        level: 3,
        name: processo.diagnostico.whatToBring.h3,
      }),
    ).toBeInTheDocument()
    for (const item of processo.diagnostico.whatToBring.items) {
      expect(within(secao).getByText(`— ${item}`)).toBeInTheDocument()
    }
    expect(
      within(secao).getByText(processo.diagnostico.whatToBring.note),
    ).toBeInTheDocument()

    expect(
      within(secao).getByRole("heading", {
        level: 3,
        name: processo.diagnostico.whatComesOut.h3,
      }),
    ).toBeInTheDocument()
    expect(
      within(secao).getByText(processo.diagnostico.whatComesOut.text),
    ).toBeInTheDocument()
  })

  it("renderiza parceiros e depois da entrega", () => {
    render(<ProcessoPage />)
    const parceiros = screen.getByRole("region", {
      name: processo.parceiros.h2,
    })
    expect(within(parceiros).getByText(processo.parceiros.text))

    const depois = screen.getByRole("region", {
      name: processo.depoisDaEntrega.h2,
    })
    expect(within(depois).getByText(processo.depoisDaEntrega.text))
  })

  it("renderiza as dúvidas como itens de FAQ", () => {
    render(<ProcessoPage />)
    const secao = screen.getByRole("region", {
      name: "Dúvidas sobre custo, prazo e manutenção",
    })
    for (const duvida of processo.duvidas) {
      expect(within(secao).getByText(duvida.question)).toBeInTheDocument()
      expect(within(secao).getByText(duvida.answer)).toBeInTheDocument()
    }
  })

  it("renderiza a banda final com CTA e WhatsApp", () => {
    render(<ProcessoPage />)
    const banda = screen.getByRole("region", {
      name: processo.ctaFinal.h2.replace(/;$/, ""),
    })
    expect(banda).toHaveAttribute("id", "conversa-processo")

    const cta = within(banda).getByRole("link", {
      name: processo.ctaFinal.ctaPrimary.label,
    })
    expect(cta).toHaveAttribute("href", processo.ctaFinal.ctaPrimary.href)

    const whatsapp = within(banda).getByRole("link", {
      name: new RegExp(processo.ctaFinal.ctaSecondary.label),
    })
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
  })
})
