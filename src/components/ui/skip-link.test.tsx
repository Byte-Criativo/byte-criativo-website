import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SkipLink } from "./skip-link"

describe("SkipLink", () => {
  it("é um link para o conteúdo com o nome fixo", () => {
    render(<SkipLink />)
    const link = screen.getByRole("link", { name: "Pular para o conteúdo" })
    expect(link).toHaveAttribute("href", "#conteudo")
  })

  it("some por deslocamento e reaparece no foco, com camada acima de tudo", () => {
    render(<SkipLink />)
    const link = screen.getByRole("link", { name: "Pular para o conteúdo" })
    expect(link).toHaveClass("sr-only")
    expect(link).toHaveClass("focus:not-sr-only")
    expect(link).toHaveClass("focus:z-(--z-skip)")
  })

  it("aceita outro destino", () => {
    render(<SkipLink destino="navegacao-rodape" />)
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "#navegacao-rodape",
    )
  })
})
