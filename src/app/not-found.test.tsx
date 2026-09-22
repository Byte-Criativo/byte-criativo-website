import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import NotFound, { metadata } from "./not-found"

describe("404 (not-found)", () => {
  it("exporta metadata com o título e a descrição da copy v1", () => {
    expect(metadata.title).toBe("Página não encontrada")
    expect(metadata.description).toBe(
      "Esta página não existe ou mudou de lugar. Veja os trabalhos, os serviços ou fale com a Byte Criativo sobre um projeto de site, plataforma ou sistema.",
    )
  })

  it("renderiza o landmark main com skip link", () => {
    render(<NotFound />)
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo")
    expect(
      screen.getByRole("link", { name: /pular para o conteúdo/i }),
    ).toHaveAttribute("href", "#conteudo")
  })

  it("renderiza o H1 e o texto da copy v1", () => {
    render(<NotFound />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Essa página não existe ou mudou de lugar.",
    )
    expect(
      screen.getByText(
        /O site da Byte Criativo mudou de estrutura, e alguns endereços antigos deixaram de existir\./,
      ),
    ).toBeInTheDocument()
  })

  it("oferece os quatro caminhos da copy v1", () => {
    render(<NotFound />)
    const lista = screen.getByRole("list", { name: "Caminhos do site" })

    expect(
      within(lista).getByRole("link", { name: "Ir para o início" }),
    ).toHaveAttribute("href", "/")
    expect(
      within(lista).getByRole("link", { name: "Ver trabalhos" }),
    ).toHaveAttribute("href", "/portfolio")
    expect(
      within(lista).getByRole("link", { name: "Ver todos os serviços" }),
    ).toHaveAttribute("href", "/servicos")
    expect(
      within(lista).getByRole("link", { name: "Falar sobre um projeto" }),
    ).toHaveAttribute("href", "/contato")
  })
})
