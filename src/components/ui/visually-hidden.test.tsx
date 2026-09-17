import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { VisuallyHidden } from "./visually-hidden"

describe("VisuallyHidden", () => {
  it("continua na árvore de acessibilidade (recorte, nunca display none)", () => {
    // R51: o espaço entre o texto visível e o complemento fica num nó de
    // texto explícito (`{" "}`), fora do <VisuallyHidden>. Uma quebra de
    // linha entre JSX de texto e uma tag é descartada pelo parser (não vira
    // espaço) e o dom-accessibility-api também não junta nomes acessíveis
    // de nós adjacentes com espaço — sem o `{" "}` explícito, o nome sai
    // "Ver estudo de casodo Festival Alumiô", sem espaço.
    render(
      <button type="button">
        Ver estudo de caso <VisuallyHidden>do Festival Alumiô</VisuallyHidden>
      </button>,
    )
    expect(
      screen.getByRole("button", {
        name: "Ver estudo de caso do Festival Alumiô",
      }),
    ).toBeInTheDocument()
  })

  it("usa a classe de recorte e não hidden", () => {
    render(<VisuallyHidden>complemento</VisuallyHidden>)
    const span = screen.getByText("complemento")
    expect(span).toHaveClass("sr-only")
    expect(span).not.toHaveAttribute("hidden")
  })
})
