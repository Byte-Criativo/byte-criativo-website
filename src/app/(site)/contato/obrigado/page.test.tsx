import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ObrigadoPage, { metadata } from "./page"
import { getObrigadoPage } from "@/content"

const { busca } = vi.hoisted(() => ({ busca: { valor: "" } }))

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(busca.valor),
}))

const obrigado = getObrigadoPage()

describe("Página Obrigado (/contato/obrigado)", () => {
  beforeEach(() => {
    busca.valor = ""
  })

  it("exporta metadata com robots noindex e canonical /contato/obrigado", () => {
    expect(metadata.title).toEqual({ absolute: obrigado.seo.seoTitle })
    expect(metadata.description).toBe(obrigado.seo.description)
    expect(metadata.alternates?.canonical).toBe("/contato/obrigado")
    expect(metadata.robots).toEqual({ index: false })
  })

  it("não renderiza JSON-LD nem breadcrumbs", () => {
    const { container } = render(<ObrigadoPage />)
    expect(
      container.querySelector('script[type="application/ld+json"]'),
    ).toBeNull()
    expect(
      screen.queryByRole("navigation", { name: "Caminho da página" }),
    ).toBeNull()
  })

  it("renderiza exatamente um H1 de confirmação", () => {
    render(<ObrigadoPage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(obrigado.h1)
  })

  it("sem canal na URL, renderiza a versão de acesso direto com link para o início", () => {
    render(<ObrigadoPage />)
    expect(screen.getByText(obrigado.canais.direto.text)).toBeInTheDocument()
    const link = screen.getByRole("link", {
      name: obrigado.canais.direto.link.label,
    })
    expect(link).toHaveAttribute("href", "/")
  })

  it("com canal=whatsapp, renderiza a continuação pelo WhatsApp", () => {
    busca.valor = "canal=whatsapp&envio=teste-envio"
    render(<ObrigadoPage />)

    // Sem dados no armazenamento, a ilha cai na versão sem dados.
    expect(screen.getByText(obrigado.canais.direto.text)).toBeInTheDocument()
    const botao = screen.getByRole("link", {
      name: new RegExp(obrigado.canais.whatsapp.buttonLabel),
    })
    expect(botao).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
    expect(botao).toHaveAttribute("data-location", "obrigado")
  })

  it("com canal=email, renderiza o texto do canal de e-mail", () => {
    busca.valor = "canal=email"
    render(<ObrigadoPage />)

    expect(screen.getByText(obrigado.canais.direto.text)).toBeInTheDocument()
    const botao = screen.getByRole("link", {
      name: new RegExp(obrigado.canais.email.buttonLabel),
    })
    expect(botao).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )
  })

  it("renderiza os próximos passos com link para os trabalhos", () => {
    render(<ObrigadoPage />)
    const secao = screen.getByRole("region", {
      name: obrigado.proximosPassos.h2,
    })
    for (const step of obrigado.proximosPassos.steps) {
      expect(within(secao).getByText(step.description)).toBeInTheDocument()
    }
    const link = within(secao).getByRole("link", {
      name: obrigado.proximosPassos.link.label,
    })
    expect(link).toHaveAttribute("href", "/portfolio")
  })
})
