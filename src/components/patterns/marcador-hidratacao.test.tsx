import { render } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { MarcadorHidratacao } from "./marcador-hidratacao"

describe("MarcadorHidratacao", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-js")
    document.documentElement.removeAttribute("data-hidratado")
  })

  it("grava data-hidratado quando data-js existe", () => {
    document.documentElement.setAttribute("data-js", "")
    render(<MarcadorHidratacao />)
    expect(document.documentElement).toHaveAttribute("data-hidratado")
  })

  it("não grava nada depois que data-js foi removido (RC9: a remoção é definitiva)", () => {
    render(<MarcadorHidratacao />)
    expect(document.documentElement).not.toHaveAttribute("data-hidratado")
  })
})
