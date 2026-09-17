import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Container } from "./container"

describe("Container", () => {
  it("aplica largura máxima e margem da grade", () => {
    render(<Container>conteúdo</Container>)
    const caixa = screen.getByText("conteúdo")
    expect(caixa).toHaveClass("max-w-(--grid-container-max)")
    expect(caixa).toHaveClass("px-(--grid-margin)")
  })

  it("não acrescenta papel: continua um div por padrão", () => {
    render(<Container>conteúdo</Container>)
    expect(screen.getByText("conteúdo").tagName).toBe("DIV")
  })
})
