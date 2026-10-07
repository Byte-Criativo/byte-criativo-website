import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Breadcrumbs, type NivelTrilha } from "./breadcrumbs"

const TRILHA: NivelTrilha[] = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Projetos", href: "/portfolio" },
  { rotulo: "Festival Alumiô" },
]

const TRILHA_LONGA: NivelTrilha[] = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Serviços", href: "/servicos" },
  { rotulo: "Sites e experiências", href: "/servicos/sites-e-experiencias" },
  { rotulo: "Sistemas web sob medida" },
]

describe("Breadcrumbs", () => {
  it("é uma navegação nomeada com lista ordenada", () => {
    const { container } = render(<Breadcrumbs trilha={TRILHA} />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(nav.querySelector("ol")).not.toBeNull()
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
  })

  it("os níveis com href viram links e o último é texto atual", () => {
    render(<Breadcrumbs trilha={TRILHA} />)
    expect(screen.getAllByRole("link")).toHaveLength(2)
    expect(screen.queryByRole("link", { name: "Festival Alumiô" })).toBeNull()
    const atual = screen.getByText("Festival Alumiô")
    expect(atual).toHaveAttribute("aria-current", "page")
    expect(atual.tagName).not.toBe("A")
  })

  it("o separador fica fora da leitura e fora dos links", () => {
    const { container } = render(<Breadcrumbs trilha={TRILHA} />)
    const separadores = [...container.querySelectorAll("[data-separador]")]
    expect(separadores).toHaveLength(2)
    for (const separador of separadores) {
      expect(separador).toHaveAttribute("aria-hidden", "true")
      expect(separador.closest("a")).toBeNull()
    }
  })

  it("cada link mantém alvo mínimo de 24 px", () => {
    render(<Breadcrumbs trilha={TRILHA} />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveClass("min-h-(--alvo-min)")
    }
  })

  it("a trilha renderizada é a recebida, de qualquer profundidade", () => {
    const { container } = render(<Breadcrumbs trilha={TRILHA_LONGA} />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    expect(screen.getAllByRole("link")).toHaveLength(3)
    expect(container.querySelectorAll("[data-separador]")).toHaveLength(3)
    expect(screen.getByText("Sistemas web sob medida")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  // Quebrada, a segunda linha começava com um "›" órfão. A trilha fica numa
  // linha e quem cede é o nível atual (repete o H1 logo abaixo).
  it("fica numa linha só e o nível atual é que encolhe, com reticências", () => {
    const { container } = render(<Breadcrumbs trilha={TRILHA_LONGA} />)
    expect(container.querySelector("ol")).not.toHaveClass("flex-wrap")
    const atual = screen.getByText("Sistemas web sob medida")
    expect(atual).toHaveClass("truncate")
    expect(atual.closest("li")).toHaveClass("overflow-hidden")
    for (const link of screen.getAllByRole("link")) {
      expect(link.closest("li")).toHaveClass("flex-none")
    }
  })
})
