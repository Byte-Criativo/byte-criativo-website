import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  FrenteVersoControle,
  FrenteVersoFaces,
  FrenteVersoProvider,
} from "./frente-verso"

function montar() {
  return render(
    <FrenteVersoProvider projeto="Festival Alumiô">
      <FrenteVersoControle />
      <FrenteVersoFaces
        frente={<p>captura do projeto</p>}
        verso={<p>o que o projeto precisava</p>}
      />
    </FrenteVersoProvider>,
  )
}

describe("FrenteVerso", () => {
  it("o grupo é nomeado pelo projeto e tem dois botões", () => {
    montar()
    const grupo = screen.getByRole("group", {
      name: "Mostrar a frente ou o verso do Festival Alumiô",
    })
    expect(grupo).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Frente" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Verso" })).toBeInTheDocument()
  })

  it("exatamente um botão está pressionado, e começa na frente", () => {
    montar()
    expect(screen.getByRole("button", { name: "Frente" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "Verso" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("acionar Verso troca o estado sem mudar os rótulos", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Verso" }))
    expect(screen.getByRole("button", { name: "Verso" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    expect(screen.getByRole("button", { name: "Frente" })).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("acionar o botão já pressionado não muda nada", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Frente" }))
    expect(screen.getByRole("button", { name: "Frente" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("Enter e Espaço acionam, e o foco fica no botão", async () => {
    montar()
    const verso = screen.getByRole("button", { name: "Verso" })
    verso.focus()
    await userEvent.keyboard("{Enter}")
    expect(verso).toHaveAttribute("aria-pressed", "true")
    expect(verso).toHaveFocus()

    const frente = screen.getByRole("button", { name: "Frente" })
    frente.focus()
    await userEvent.keyboard(" ")
    expect(frente).toHaveAttribute("aria-pressed", "true")
  })

  it("as duas faces ficam no HTML; o estado é só um atributo", async () => {
    montar()
    expect(screen.getByText("captura do projeto")).toBeInTheDocument()
    expect(screen.getByText("o que o projeto precisava")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Verso" }))
    expect(
      screen.getByText("o que o projeto precisava").closest("[data-face]"),
    ).toHaveAttribute("data-ativo", "true")
    expect(
      screen.getByText("captura do projeto").closest("[data-face]"),
    ).toHaveAttribute("data-ativo", "false")
  })

  it("sem JS o controle fica oculto e os rótulos das faces ficam visíveis", () => {
    const { container } = montar()
    expect(container.querySelector("[role=group]")).toHaveClass("hidden")
    expect(container.querySelector("[role=group]")?.className).toContain(
      "js:inline-flex",
    )
    const rotuloFrente = screen.getByRole("heading", { name: "Frente" })
    expect(rotuloFrente.className).toContain("js:sr-only")
  })

  it("nenhuma face carrega hidden por padrão (RC9: alcançável sem JS)", () => {
    const { container } = montar()
    expect(container.querySelector('[data-face="frente"]')).not.toHaveAttribute(
      "hidden",
    )
    expect(container.querySelector('[data-face="verso"]')).not.toHaveAttribute(
      "hidden",
    )
  })

  it("o verso troca todas as vars pelo tema do verso", () => {
    const { container } = montar()
    expect(container.querySelector('[data-face="verso"]')).toHaveAttribute(
      "data-surface",
      "verso",
    )
  })

  // I2 (gate B, RC10): em cores forçadas, bg-ink/text-bg somem (o fundo não
  // é desenhado) e os dois botões ficam visualmente iguais mesmo com
  // aria-pressed distinto. O controle precisa de um seletor estável para a
  // regra de forced-colors em globals.css conseguir mirar só o botão
  // pressionado.
  it("o controle carrega o atributo que a regra de cores forçadas (RC10) usa como seletor", () => {
    const { container } = montar()
    expect(container.querySelector("[role=group]")).toHaveAttribute(
      "data-controle-frente-verso",
    )
  })
})
