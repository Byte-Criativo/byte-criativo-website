import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { homePageData } from "@/content/home"
import { HomeHero } from "./home-hero"

// O canvas é import dinâmico só no cliente; no jsdom basta não montar nada.
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}))

// O jsdom não tem IntersectionObserver; a ilha HeroCena só observa, nunca
// precisa de uma entrada real aqui.
class ObservadorFalso {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

describe("HomeHero", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", ObservadorFalso)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("tem um único h1 com o texto íntegro, sem o ';' no nome acessível", () => {
    render(<HomeHero hero={homePageData.hero} />)
    const titulos = screen.getAllByRole("heading", { level: 1 })
    expect(titulos).toHaveLength(1)
    expect(titulos[0]).toHaveAccessibleName(
      "Software sob medida com design que diferencia",
    )
    // Nenhuma cópia oculta: o texto aparece uma vez só no DOM.
    expect(titulos[0]?.textContent).toBe(
      "Software sob medida com design que diferencia;",
    )
  })

  it("o ';' é decorativo, laranja e é a âncora da arte", () => {
    const { container } = render(<HomeHero hero={homePageData.hero} />)
    const semicolon = container.querySelector(".hero-semicolon")
    expect(semicolon).toHaveAttribute("aria-hidden", "true")
    expect(semicolon).toHaveClass("semicolon")
    expect(semicolon?.textContent).toBe(";")
  })

  it("mantém os dois CTAs com os rótulos e destinos atuais", () => {
    render(<HomeHero hero={homePageData.hero} />)
    expect(
      screen.getByRole("link", { name: "Falar sobre meu projeto" }),
    ).toHaveAttribute("href", "/contato")
    expect(screen.getByRole("link", { name: "Ver projetos" })).toHaveAttribute(
      "href",
      "/portfolio",
    )
  })

  it("a seção é a mesma landmark de antes e o indicador de rolagem é decorativo", () => {
    const { container } = render(<HomeHero hero={homePageData.hero} />)
    const secao = container.querySelector("section#hero")
    expect(secao).toHaveAttribute("aria-label", "Início")
    expect(container.querySelector(".hero-rolar")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
    expect(container.querySelector(".hero-sentinela")).not.toBeNull()
  })
})
