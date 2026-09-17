import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Sala } from "./sala"

describe("Sala", () => {
  it("o nível externo carrega o estado e NÃO carrega data-case", () => {
    const { container } = render(
      <Sala slug="underground-pb" id="sala-underground-pb">
        <p>obra</p>
      </Sala>,
    )
    const moldura = container.querySelector("#sala-underground-pb")
    expect(moldura).toHaveAttribute("data-estado", "projeto")
    expect(moldura).not.toHaveAttribute("data-case")
  })

  it("o nível interno é a superfície com o tema da sala", () => {
    const { container } = render(
      <Sala slug="festival-alumio">
        <p>obra</p>
      </Sala>,
    )
    expect(
      container.querySelector('[data-case="festival-alumio"]'),
    ).not.toBeNull()
  })

  it("o cavalete é decorativo", () => {
    const { container } = render(
      <Sala slug="goromax">
        <p>obra</p>
      </Sala>,
    )
    expect(container.querySelector("[data-cavalete]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("a obra fica dentro da superfície e continua acessível", () => {
    render(
      <Sala slug="underground-pb">
        <p>obra</p>
      </Sala>,
    )
    const obra = screen.getByText("obra")
    expect(obra.closest('[data-case="underground-pb"]')).not.toBeNull()
  })

  it("hero e larga mudam só o arranjo, nunca a semântica", () => {
    const { container, rerender } = render(
      <Sala slug="underground-pb" variante="hero">
        <p>obra</p>
      </Sala>,
    )
    expect(container.querySelector("[data-sala]")).toHaveAttribute(
      "data-variante",
      "hero",
    )
    rerender(
      <Sala slug="underground-pb" variante="larga">
        <p>obra</p>
      </Sala>,
    )
    expect(container.querySelector("[data-sala]")).toHaveAttribute(
      "data-variante",
      "larga",
    )
  })
})
