import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { IndiceSemicolon, type ItemIndice } from "./indice-semicolon"

const ITENS: ItemIndice[] = [
  { id: "inicio", rotulo: "Início" },
  { id: "trabalhos", rotulo: "Projetos" },
  { id: "forma-de-pensar", rotulo: "Forma de pensar" },
  { id: "o-que-a-byte-faz", rotulo: "O que a Byte faz" },
  { id: "como-um-projeto-anda", rotulo: "Como um projeto anda" },
  { id: "conversa", rotulo: "Conversa" },
]

describe("IndiceSemicolon", () => {
  it("a caixa do glifo é opaca para preservar contraste sobre as salas", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    expect(screen.getByRole("link", { name: "Início" })).toHaveClass(
      "bg-surface",
    )
  })

  it("é uma navegação nomeada com uma lista ordenada de seis links", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    const nav = screen.getByRole("navigation", { name: "Seções desta página" })
    expect(nav.querySelector("ol")).not.toBeNull()
    expect(screen.getAllByRole("link")).toHaveLength(6)
  })

  it("cada link tem o nome da seção e aponta para a âncora", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    for (const item of ITENS) {
      expect(screen.getByRole("link", { name: item.rotulo })).toHaveAttribute(
        "href",
        `#${item.id}`,
      )
    }
  })

  it("o glifo é decorativo e não entra no nome", () => {
    const { container } = render(<IndiceSemicolon itens={ITENS} />)
    const glifos = [...container.querySelectorAll("[data-glifo]")]
    expect(glifos).toHaveLength(6)
    for (const glifo of glifos) {
      expect(glifo).toHaveAttribute("aria-hidden", "true")
      expect(glifo.textContent).toBe(";")
    }
  })

  it("a caixa tem 48 px e o link carrega o marcador que a ilha usa", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    const link = screen.getByRole("link", { name: "Início" })
    expect(link).toHaveClass("indice-link")
    expect(link).toHaveClass("size-(--space-7)")
    expect(link).toHaveAttribute("data-indice-link", "inicio")
  })

  // A caixa opaca é o que impede o `;` de sumir quando a coluna passa por
  // cima de uma sala com fundo escuro.

  // A coluna existe só a partir de breakpoints.lg: no celular ela ficaria
  // sobre o conteúdo, numa margem que nem existe.
  it("existe só a partir de breakpoints.lg", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    const nav = screen.getByRole("navigation", { name: "Seções desta página" })
    expect(nav).toHaveClass("hidden")
    expect(nav).toHaveClass("lg:block")
  })

  it("sem JS nenhum item é marcado como atual", () => {
    render(<IndiceSemicolon itens={ITENS} />)
    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current")
    }
  })
})
