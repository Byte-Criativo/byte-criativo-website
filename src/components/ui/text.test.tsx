import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Text } from "./text"

describe("Text", () => {
  it("renderiza um parágrafo em body por padrão", () => {
    const { container } = render(<Text>Uma frase de contexto.</Text>)
    const p = container.querySelector("p")
    expect(p).not.toBeNull()
    expect(p).toHaveClass("text-body")
    expect(p).toHaveClass("text-ink")
  })

  it("aceita outro elemento e o papel caption com tom apagado", () => {
    render(
      <Text as="span" papel="caption" tom="muted">
        Plataforma cultural
      </Text>,
    )
    const span = screen.getByText("Plataforma cultural")
    expect(span.tagName).toBe("SPAN")
    expect(span).toHaveClass("text-caption")
    expect(span).toHaveClass("text-ink-muted")
  })

  it("code usa a família mono", () => {
    render(
      <Text as="code" papel="code">
        next build
      </Text>,
    )
    expect(screen.getByText("next build")).toHaveClass("font-mono")
  })

  it("medida limita a linha a 68 caracteres", () => {
    render(<Text medida>Texto longo.</Text>)
    expect(screen.getByText("Texto longo.")).toHaveClass("max-w-(--medida-max)")
  })
})
