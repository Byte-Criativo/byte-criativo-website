import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Heading } from "./heading"

describe("Heading", () => {
  it("usa o nível pedido e o papel correspondente", () => {
    render(<Heading nivel={2}>Trabalhos</Heading>)
    const titulo = screen.getByRole("heading", { level: 2, name: "Trabalhos" })
    expect(titulo.tagName).toBe("H2")
    expect(titulo).toHaveClass("text-h2")
  })

  it("aceita papel diferente do nível, sem mudar a semântica", () => {
    render(
      <Heading nivel={1} papel="display">
        Quem desenha o seu site também escreve o código
      </Heading>,
    )
    const titulo = screen.getByRole("heading", { level: 1 })
    expect(titulo).toHaveClass("text-display")
  })

  it("deixa o ponto e vírgula fora do nome acessível", () => {
    render(
      <Heading nivel={2} semicolon>
        Conversa direta
      </Heading>,
    )
    expect(
      screen.getByRole("heading", { level: 2, name: "Conversa direta" }),
    ).toBeInTheDocument()
    expect(screen.getByText(";")).toHaveAttribute("aria-hidden", "true")
  })

  it("pinta o ponto e vírgula com --accent a partir de 24 px e com --accent-text abaixo", () => {
    const { rerender } = render(
      <Heading nivel={2} semicolon>
        Grande
      </Heading>,
    )
    expect(screen.getByText(";")).toHaveClass("semicolon")

    rerender(
      <Heading nivel={3} semicolon>
        Pequeno
      </Heading>,
    )
    expect(screen.getByText(";")).toHaveClass("semicolon-pequeno")
  })
})
