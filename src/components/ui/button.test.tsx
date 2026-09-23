import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

// C1: extrai o `onClick` do elemento React devolvido por Button(), chamado
// como função plana (sem DOM), para inspecionar exatamente o que teria que
// ser serializado se um Server Component renderizasse <Button> direto.
function onClickDe(elemento: ReactElement): unknown {
  return (elemento.props as { onClick?: unknown }).onClick
}

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
    render(<Button href="/contato">Falar sobre meu projeto</Button>)
    const link = screen.getByRole("link", { name: "Falar sobre meu projeto" })
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
    render(<Button type="button">Falar sobre meu projeto</Button>)
    expect(screen.getByRole("button").className).toContain("ponteiro:")
  })

  // C1: Button é Server Component (especificação, "Renderização"). Chamar o
  // componente como função plana (sem `render`/DOM) inspeciona o elemento
  // React que ele devolve — o mesmo objeto que teria que ser serializado
  // para o payload RSC caso um Server Component o renderizasse. Antes da
  // correção, este teste falhava: `elemento.props.onClick` era sempre uma
  // função (o wrapper interno), mesmo sem `onClick` do chamador e com
  // `enviando` falso.
  it("C1: sem onClick nem enviando, não anexa handler de clique (renderiza em Server Component)", () => {
    const elemento = Button({ type: "button", children: "Copiar e-mail" })
    expect(onClickDe(elemento)).toBeUndefined()
  })

  it("C1: com onClick do chamador, o handler é anexado normalmente", () => {
    const aoClicar = vi.fn()
    const elemento = Button({
      type: "button",
      onClick: aoClicar,
      children: "Copiar e-mail",
    })
    expect(typeof onClickDe(elemento)).toBe("function")
  })

  it("C1: enviando sem onClick ainda assim anexa handler (precisa interceptar o clique)", () => {
    const elemento = Button({
      type: "submit",
      enviando: true,
      children: "Enviar mensagem",
    })
    expect(typeof onClickDe(elemento)).toBe("function")
  })

  it("I1: o foco repete o mesmo feedback do hover (RC2)", () => {
    const { rerender } = render(
      <Button type="button">Falar sobre meu projeto</Button>,
    )
    expect(screen.getByRole("button")).toHaveClass(
      "focus-visible:bg-action-bg-hover",
    )

    rerender(
      <Button type="button" variante="contorno">
        Menu
      </Button>,
    )
    const contorno = screen.getByRole("button", { name: "Menu" })
    expect(contorno).toHaveClass("focus-visible:underline")
    expect(contorno).toHaveClass(
      "focus-visible:decoration-(length:--border-w-focus)",
    )
  })
})
