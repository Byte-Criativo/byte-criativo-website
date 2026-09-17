import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("ação na página é um button com type explícito", () => {
    render(
      <Button type="button" variante="contorno">
        Copiar e-mail
      </Button>,
    )
    const botao = screen.getByRole("button", { name: "Copiar e-mail" })
    expect(botao).toHaveAttribute("type", "button")
  })

  it("navegação é um link com a mesma aparência", () => {
    render(<Button href="/contato">Falar sobre um projeto</Button>)
    const link = screen.getByRole("link", { name: "Falar sobre um projeto" })
    expect(link).toHaveAttribute("href", "/contato")
    expect(link).toHaveClass("bg-action")
  })

  it("primário tem 48 px de altura mínima e contorno tem 44 px", () => {
    const { rerender } = render(<Button type="submit">Enviar mensagem</Button>)
    expect(screen.getByRole("button")).toHaveClass("min-h-(--space-7)")

    rerender(
      <Button type="button" variante="contorno">
        Menu
      </Button>,
    )
    expect(screen.getByRole("button")).toHaveClass("min-h-(--alvo-toque)")
  })

  it("enviando mantém o rótulo, fica focável e ignora o segundo acionamento", async () => {
    const aoClicar = vi.fn()
    render(
      <Button type="submit" enviando onClick={aoClicar}>
        Enviar mensagem
      </Button>,
    )
    const botao = screen.getByRole("button", { name: "Enviar mensagem" })
    expect(botao).toHaveAttribute("aria-disabled", "true")
    expect(botao).not.toBeDisabled()

    await userEvent.click(botao)
    expect(aoClicar).not.toHaveBeenCalled()

    botao.focus()
    expect(botao).toHaveFocus()
  })

  it("nunca usa o atributo disabled", () => {
    render(
      <Button type="submit" enviando>
        Enviar mensagem
      </Button>,
    )
    expect(screen.getByRole("button")).not.toHaveAttribute("disabled")
  })

  it("hover só com ponteiro fino (RC2)", () => {
    render(<Button type="button">Falar sobre um projeto</Button>)
    expect(screen.getByRole("button").className).toContain("ponteiro:")
  })
})
