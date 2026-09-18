import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { NavegacaoTrabalhos } from "./navegacao-trabalhos"

const ANTERIOR = { nome: "Underground PB", href: "/portfolio/underground-pb" }

describe("NavegacaoTrabalhos", () => {
  it("com dois trabalhos não há nav: só Ver todos os trabalhos", () => {
    render(<NavegacaoTrabalhos todosHref="/portfolio" />)
    expect(screen.queryByRole("navigation")).toBeNull()
    expect(
      screen.getByRole("link", { name: "Ver todos os trabalhos" }),
    ).toHaveAttribute("href", "/portfolio")
    expect(screen.getAllByRole("link")).toHaveLength(1)
  })

  it("com três ou mais, vira navegação nomeada com dois links", () => {
    render(<NavegacaoTrabalhos anterior={ANTERIOR} todosHref="/portfolio" />)
    const nav = screen.getByRole("navigation", { name: "Outros trabalhos" })
    const itens = [...nav.querySelectorAll("li")]
    expect(itens).toHaveLength(2)
    const anterior = screen.getByRole("link", {
      name: "Trabalho anterior: Underground PB",
    })
    expect(anterior).toHaveAttribute("href", "/portfolio/underground-pb")
    expect(itens[0]?.contains(anterior)).toBe(true)
  })

  it("o nome do link já inclui o projeto: nenhum complemento oculto", () => {
    render(<NavegacaoTrabalhos anterior={ANTERIOR} todosHref="/portfolio" />)
    const link = screen.getByRole("link", {
      name: "Trabalho anterior: Underground PB",
    })
    expect(link.querySelector(".sr-only")).toBeNull()
    expect(link.textContent?.trim()).toBe("Trabalho anterior: Underground PB")
  })

  it("não repete o destino do bloco Próximo trabalho", () => {
    const { container } = render(
      <NavegacaoTrabalhos anterior={ANTERIOR} todosHref="/portfolio" />,
    )
    expect(container.textContent).not.toMatch(/Próximo trabalho/)
    const destinos = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
    expect(new Set(destinos).size).toBe(destinos.length)
  })

  it("nenhuma seta e nenhum ícone: o texto diz o sentido", () => {
    const { container } = render(
      <NavegacaoTrabalhos anterior={ANTERIOR} todosHref="/portfolio" />,
    )
    expect(container.querySelector("svg")).toBeNull()
    expect(container.querySelector("img")).toBeNull()
    expect(container.textContent).not.toMatch(/[←→↗⟶⟵»«]/)
  })
})
