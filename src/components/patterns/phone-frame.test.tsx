import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Media } from "./media"
import { PhoneFrame } from "./phone-frame"

function renderFrame() {
  return render(
    <PhoneFrame legenda="Programação no celular, capturada em 12/09/2026">
      <Media
        tipo="captura"
        src="/capturas/alumio-390.png"
        width={390}
        height={844}
        sizes="(min-width: 48rem) 33vw, 66vw"
        alt="Lista de apresentações filtrável no celular"
      />
    </PhoneFrame>,
  )
}

describe("PhoneFrame", () => {
  it("legenda visível associada pela figure", () => {
    renderFrame()
    expect(
      screen.getByRole("figure", { name: /Programação no celular/ }),
    ).toBeInTheDocument()
  })

  it("usa o raio de celular e o contorno do cavalete", () => {
    const { container } = renderFrame()
    const figura = container.querySelector("figure")
    expect(figura).toHaveClass("rounded-(--radius-phone)")
    expect(figura).toHaveClass("border-(length:--border-w-easel)")
  })

  it("sem notch, sem barra de status e sem reflexo: só a captura", () => {
    const { container } = renderFrame()
    expect(container.querySelectorAll("img")).toHaveLength(1)
    expect(container.querySelectorAll("[data-notch]")).toHaveLength(0)
  })
})
