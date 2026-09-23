import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CaseHero } from "./case-hero"

const PROPS = {
  titulo: "A programação de um festival na mão de quem vai",
  subtitulo:
    "Um site para o Festival Alumiô no Centro Histórico de João Pessoa.",
  imagem: <div data-imagem>captura</div>,
  fichaTecnica: [
    { termo: "Tipo", descricao: "Site de festival" },
    { termo: "Plataformas", descricao: "Web" },
    { termo: "Tecnologias", descricao: "Next.js" },
  ],
  projetoNoAr: {
    nome: "Festival Alumiô",
    href: "https://festivalalumio.com.br",
  },
}

describe("CaseHero", () => {
  it("tem o único h1 da página, com o ; fora do nome", () => {
    const { container } = render(<CaseHero {...PROPS} />)
    expect(container.querySelectorAll("h1")).toHaveLength(1)
    expect(
      screen.getByRole("heading", { level: 1, name: PROPS.titulo }),
    ).toBeInTheDocument()
  })

  it("a ficha técnica é uma lista de definição com termos e descrições", () => {
    const { container } = render(<CaseHero {...PROPS} />)
    expect(container.querySelectorAll("dl dt")).toHaveLength(3)
    expect(container.querySelectorAll("dl dd")).toHaveLength(3)
    expect(screen.getByText("Tipo").tagName).toBe("DT")
    expect(screen.getByText("Site de festival").tagName).toBe("DD")
  })

  it("não inventa item: renderiza só o que recebe (D5 aberta)", () => {
    const { container } = render(<CaseHero {...PROPS} />)
    expect(container.textContent).not.toMatch(/O que a Byte fez/)
    expect(container.textContent).not.toMatch(/\bAno\b/)
    expect(container.textContent).not.toMatch(/cliente/i)
  })

  it("o link externo segue a RC5", () => {
    render(<CaseHero {...PROPS} />)
    const link = screen.getByRole("link", {
      name: "Visitar site do Festival Alumiô (abre em nova aba)",
    })
    expect(link).toHaveAttribute("href", "https://festivalalumio.com.br")
    expect(link).toHaveAttribute("target", "_blank")
    const rel = link.getAttribute("rel") ?? ""
    expect(rel).toContain("noopener")
    expect(rel).toContain("noreferrer")
  })

  it("único focável próprio é o link do projeto no ar, e o LCP entra sem animação", () => {
    const { container } = render(<CaseHero {...PROPS} />)
    expect(screen.getAllByRole("link")).toHaveLength(1)
    expect(container.querySelectorAll("button")).toHaveLength(0)

    const imagem = container.querySelector("[data-imagem]")
    expect(imagem).not.toBeNull()
    // M3 da guarda de tokens: o número entra por interpolação para o
    // utilitário nunca existir como texto contíguo neste arquivo.
    const opacidadeZero = new RegExp(`(^|\\s)opacity-${0}(\\s|$)`)
    let no: Element | null = imagem
    while (no && no !== container) {
      const classe = no.getAttribute("class") ?? ""
      expect(classe).not.toMatch(opacidadeZero)
      expect(classe).not.toContain("animate-")
      expect(classe).not.toContain("transition-opacity")
      no = no.parentElement
    }
  })
})
