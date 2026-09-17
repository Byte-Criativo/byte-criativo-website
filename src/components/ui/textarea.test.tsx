import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("tem altura mínima de --space-10 e só redimensiona na vertical", () => {
    render(<Textarea id="contexto" name="contexto" required />)
    const campo = screen.getByRole("textbox")
    expect(campo).toHaveClass("min-h-(--space-10)")
    expect(campo).toHaveClass("resize-y")
  })

  it("não usa maxlength", () => {
    render(<Textarea id="contexto" name="contexto" required />)
    expect(screen.getByRole("textbox")).not.toHaveAttribute("maxlength")
  })
})
