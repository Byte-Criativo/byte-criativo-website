import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Notice } from "./notice"

describe("Notice", () => {
  it("não tem papel próprio: quem anuncia é o contêiner do formulário", () => {
    const { container } = render(
      <Notice tipo="erro" primeiraFrase="Não deu para enviar agora." />,
    )
    const bloco = container.firstElementChild
    expect(bloco).not.toHaveAttribute("role")
    expect(bloco).not.toHaveAttribute("aria-live")
    expect(bloco).not.toHaveAttribute("aria-atomic")
    expect(container.querySelector("[role='alert']")).toBeNull()
    expect(container.querySelector("[role='status']")).toBeNull()
    expect(container.querySelector("[aria-live]")).toBeNull()
  })

  it("o tipo é dito pelo texto e pelo ícone, nunca só pela cor", () => {
    const { container } = render(
      <Notice tipo="aviso" primeiraFrase="Muitas tentativas seguidas." />,
    )
    expect(screen.getByText("Muitas tentativas seguidas.")).toBeInTheDocument()
    const sinais = [...container.querySelectorAll("svg")]
    expect(sinais.length).toBeGreaterThan(0)
    for (const sinal of sinais) {
      expect(sinal).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("a primeira frase usa a cor semântica e o resto usa --ink", () => {
    render(
      <Notice tipo="erro" primeiraFrase="Não deu para enviar agora.">
        Você pode chamar no WhatsApp.
      </Notice>,
    )
    expect(screen.getByText("Não deu para enviar agora.")).toHaveClass(
      "text-danger-text",
    )
    expect(screen.getByText("Você pode chamar no WhatsApp.")).toHaveClass(
      "text-ink",
    )
  })

  it("aviso usa a cor de atenção e um traçado de ícone próprio", () => {
    const erro = render(
      <Notice tipo="erro" primeiraFrase="Não deu para enviar agora." />,
    )
    const tracadoErro = erro.container.querySelector("svg")?.innerHTML
    erro.unmount()

    const aviso = render(
      <Notice tipo="aviso" primeiraFrase="Muitas tentativas seguidas." />,
    )
    expect(screen.getByText("Muitas tentativas seguidas.")).toHaveClass(
      "text-warning-text",
    )
    // 1.4.1: se os dois tipos usassem o mesmo traçado, a diferença ficaria
    // só na cor.
    expect(aviso.container.querySelector("svg")?.innerHTML).not.toEqual(
      tracadoErro,
    )
  })

  it("aceita uma ação abaixo do texto, dentro do bloco", () => {
    const { container } = render(
      <Notice
        tipo="erro"
        primeiraFrase="Não deu para enviar agora."
        acao={<button type="button">Chamar no WhatsApp</button>}
      />,
    )
    const botao = screen.getByRole("button", { name: "Chamar no WhatsApp" })
    expect(container.firstElementChild?.contains(botao)).toBe(true)
    const frase = screen.getByText("Não deu para enviar agora.")
    expect(
      frase.compareDocumentPosition(botao) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it("fica em fluxo: nunca fixo, nunca grudado, nunca cobre conteúdo", () => {
    const { container } = render(
      <Notice tipo="erro" primeiraFrase="Não deu para enviar agora." />,
    )
    const bloco = container.firstElementChild
    const classes = bloco?.className ?? ""
    expect(classes).not.toContain("fixed")
    expect(classes).not.toContain("sticky")
    expect(classes).not.toContain("absolute")
    expect(bloco?.getAttribute("style") ?? "").not.toContain("position")
  })
})
