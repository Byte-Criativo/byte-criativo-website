import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("leva autocomplete, tipo e required para o DOM", () => {
    render(
      <Input
        id="whatsapp"
        name="whatsapp"
        tipo="tel"
        inputMode="tel"
        autoComplete="tel"
        required
      />,
    )
    const campo = screen.getByRole("textbox")
    expect(campo).toHaveAttribute("type", "tel")
    expect(campo).toHaveAttribute("autocomplete", "tel")
    expect(campo).toHaveAttribute("inputmode", "tel")
    expect(campo).toBeRequired()
  })

  it("não usa maxlength: o limite é validado com mensagem", () => {
    render(<Input id="nome" name="nome" autoComplete="name" required />)
    expect(screen.getByRole("textbox")).not.toHaveAttribute("maxlength")
  })

  it("marca inválido e aponta a descrição quando o Field manda", () => {
    render(
      <Input
        id="email"
        name="email"
        tipo="email"
        autoComplete="email"
        required
        aria-invalid
        aria-describedby="email-erro"
      />,
    )
    const campo = screen.getByRole("textbox")
    expect(campo).toHaveAttribute("aria-invalid", "true")
    expect(campo).toHaveAttribute("aria-describedby", "email-erro")
  })
})
