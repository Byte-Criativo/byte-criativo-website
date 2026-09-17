import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NavLink } from "./nav-link"

const usePathname = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({ usePathname }))

describe("NavLink", () => {
  it("marca a rota exata como página atual", () => {
    usePathname.mockReturnValue("/portfolio")
    render(
      <NavLink href="/portfolio" secao="/portfolio">
        Trabalhos
      </NavLink>,
    )
    expect(screen.getByRole("link", { name: "Trabalhos" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it('marca a seção ancestral com aria-current="true"', () => {
    usePathname.mockReturnValue("/portfolio/underground-pb")
    render(
      <NavLink href="/portfolio" secao="/portfolio">
        Trabalhos
      </NavLink>,
    )
    expect(screen.getByRole("link", { name: "Trabalhos" })).toHaveAttribute(
      "aria-current",
      "true",
    )
  })

  it("não marca nada fora da seção", () => {
    usePathname.mockReturnValue("/contato")
    render(
      <NavLink href="/portfolio" secao="/portfolio">
        Trabalhos
      </NavLink>,
    )
    expect(screen.getByRole("link", { name: "Trabalhos" })).not.toHaveAttribute(
      "aria-current",
    )
  })
})
