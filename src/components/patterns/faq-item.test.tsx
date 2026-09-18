import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { FaqItem } from "./faq-item"

function montar(pergunta = "Quanto custa e quanto tempo leva?") {
  return render(<FaqItem pergunta={pergunta}>Depende do escopo.</FaqItem>)
}

describe("FaqItem", () => {
  it("a pergunta é o botão nativo do disclosure, sem ARIA manual", () => {
    const { container } = montar()
    const resumo = container.querySelector("details > summary")
    expect(resumo?.textContent).toContain("Quanto custa e quanto tempo leva?")
    expect(resumo).not.toHaveAttribute("role")
    expect(resumo).not.toHaveAttribute("aria-expanded")
    expect(resumo).not.toHaveAttribute("aria-controls")
    expect(resumo).not.toHaveAttribute("tabindex")
  })

  it("não usa o atributo name: dá para comparar respostas abertas", () => {
    const { container } = montar()
    expect(container.querySelector("details")).not.toHaveAttribute("name")
  })

  it("fechado, a resposta fica fora da busca por Tab; aberto, aparece", async () => {
    const { container } = montar("Pergunta")
    const detalhes = container.querySelector("details")
    expect(detalhes).not.toHaveAttribute("open")

    await userEvent.click(screen.getByText("Pergunta"))
    expect(detalhes).toHaveAttribute("open")

    await userEvent.click(screen.getByText("Pergunta"))
    expect(detalhes).not.toHaveAttribute("open")
  })

  it("o sinal + / − é decorativo", () => {
    const { container } = montar()
    const sinais = [...container.querySelectorAll("summary svg")]
    expect(sinais.length).toBeGreaterThan(0)
    for (const sinal of sinais) {
      expect(sinal).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("o summary tem 48 px de altura mínima", () => {
    const { container } = montar()
    expect(container.querySelector("summary")).toHaveClass("min-h-(--space-7)")
  })

  it("sem título dentro do summary e a resposta fora dele", () => {
    const { container } = montar("Pergunta")
    const resumo = container.querySelector("summary")
    expect(resumo?.querySelector("h1, h2, h3, h4, h5, h6")).toBeNull()
    expect(resumo?.textContent).not.toContain("Depende do escopo")
    expect(screen.getByText("Depende do escopo.")).toBeInTheDocument()
  })
})
