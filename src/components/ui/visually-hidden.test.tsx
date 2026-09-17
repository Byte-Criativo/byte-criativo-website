import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { VisuallyHidden } from "./visually-hidden"

describe("VisuallyHidden", () => {
  it("usa a classe de recorte e não hidden", () => {
    render(<VisuallyHidden>complemento</VisuallyHidden>)
    const span = screen.getByText("complemento")
    expect(span).toHaveClass("sr-only")
    expect(span).not.toHaveAttribute("hidden")
  })

  it("sem separador, não antepõe espaço (comportamento padrão)", () => {
    const { container } = render(<VisuallyHidden>complemento</VisuallyHidden>)
    expect(container.textContent).toBe("complemento")
  })

  // M5: R51 (a armadilha do espaço na RC5) resolvia o problema só dentro do
  // TextLink, à custa de cada chamador lembrar de compor um `{" "}`
  // explícito antes do <VisuallyHidden>. Como a L3/L4 vão repetir esse
  // padrão (Ficha, VideoLoop, WhatsAppLink), o prop `separador` move essa
  // responsabilidade para dentro do próprio VisuallyHidden: quem usa
  // `separador` não precisa lembrar do espaço, não importa como formata o
  // JSX ao redor (mesmo com o texto visível e o VisuallyHidden em linhas
  // diferentes, caso em que a quebra de linha do JSX não vira espaço).
  it("separador antepõe um espaço real, fora do recorte, ao conteúdo", () => {
    render(
      <button type="button">
        Ver estudo de caso
        <VisuallyHidden separador>do Festival Alumiô</VisuallyHidden>
      </button>,
    )
    expect(
      screen.getByRole("button", {
        name: "Ver estudo de caso do Festival Alumiô",
      }),
    ).toBeInTheDocument()
  })

  it("o espaço do separador fica fora do recorte (span.sr-only só tem o conteúdo)", () => {
    render(<VisuallyHidden separador>complemento</VisuallyHidden>)
    const span = screen.getByText("complemento")
    expect(span.textContent).toBe("complemento")
  })
})
