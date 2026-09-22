import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TagList } from "./tag"

const ITENS = ["Busca e filtros", "Mapa de palcos", "Contas com moderação"]

describe("TagList", () => {
  it("é uma lista nomeada com um item por capacidade", () => {
    render(<TagList itens={ITENS} />)
    const lista = screen.getByRole("list", { name: "Capacidades" })
    expect(lista.querySelectorAll("li")).toHaveLength(3)
  })

  it("cada capacidade é um item próprio: o separador da copy não é renderizado", () => {
    const { container } = render(<TagList itens={ITENS} />)
    expect(container.textContent).not.toContain("·")
    expect(screen.getByText("Mapa de palcos").tagName).toBe("LI")
  })

  it("não é controle: sem foco, sem alvo e sem peso de botão", () => {
    const { container } = render(<TagList itens={ITENS} />)
    const item = screen.getByText("Busca e filtros")
    expect(item).not.toHaveAttribute("tabindex")
    expect(item).not.toHaveAttribute("role")
    expect(item.className).not.toContain("min-h-")
    expect(item.className).not.toContain("font-semibold")
    expect(item.className).not.toContain("font-bold")
    expect(item.className).not.toContain("shadow-")
    expect(container.querySelector("button")).toBeNull()
    expect(container.querySelector("a")).toBeNull()
  })

  it("aceita outro rótulo de lista", () => {
    render(<TagList itens={ITENS} rotulo="Plataformas" />)
    expect(
      screen.getByRole("list", { name: "Plataformas" }),
    ).toBeInTheDocument()
  })
})
