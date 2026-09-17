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

  // I2: o preflight do Tailwind aplica list-style: none em ul/ol/menu, o
  // que remove o papel implícito de lista no Safari/VoiceOver. jsdom não
  // aplica CSS, então getByRole("list") já passava mesmo sem o atributo —
  // este teste afirma o atributo explícito, não só o papel resultante.
  it("I2: ul e ol recebem role=list explícito (o preflight remove o papel implícito)", () => {
    render(
      <Stack as="ul" espaco={2}>
        <li>Busca e filtros</li>
      </Stack>,
    )
    expect(screen.getByRole("list")).toHaveAttribute("role", "list")
  })

  it("I2: um div não recebe role=list", () => {
    render(
      <Stack espaco={2}>
        <span>texto</span>
      </Stack>,
    )
    expect(screen.getByText("texto").parentElement).not.toHaveAttribute("role")
  })

  it("não nomeia um div, que não tem papel de lista", () => {
    render(
      <Stack rotulo="Capacidades" espaco={2}>
        texto
      </Stack>,
    )
    expect(screen.getByText("texto")).not.toHaveAttribute("aria-label")
  })

  // M6: a tabela de primitivos só permite --space-2 a --space-10; --space-1
  // não é uma opção válida de Stack. tsc (npm run typecheck) falha com
  // "Unused '@ts-expect-error' directive" se o tipo voltar a aceitar 1.
  it("M6: espaco={1} não compila (tipo restrito a --space-2..--space-10)", () => {
    // @ts-expect-error --space-1 não está na tabela de Stack.
    render(<Stack espaco={1}>itens</Stack>)
  })
})
