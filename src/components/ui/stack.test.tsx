import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Stack } from "./stack"

describe("Stack", () => {
  it("empilha com o espaço pedido", () => {
    render(<Stack espaco={6}>itens</Stack>)
    expect(screen.getByText("itens")).toHaveClass("gap-(--space-6)")
  })

  it("vira lista nomeada quando o conteúdo é lista", () => {
    render(
      <Stack as="ul" rotulo="Capacidades" espaco={2}>
        <li>Busca e filtros</li>
      </Stack>,
    )
    expect(
      screen.getByRole("list", { name: "Capacidades" }),
    ).toBeInTheDocument()
  })

  it("não nomeia um div, que não tem papel de lista", () => {
    render(
      <Stack rotulo="Capacidades" espaco={2}>
        texto
      </Stack>,
    )
    expect(screen.getByText("texto")).not.toHaveAttribute("aria-label")
  })
})
