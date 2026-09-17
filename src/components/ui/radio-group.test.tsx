import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Field } from "./field"
import { RadioGroup } from "./radio-group"

const OPCOES = [
  { valor: "site", rotulo: "Um site" },
  { valor: "sistema", rotulo: "Um sistema" },
  { valor: "nao-sei", rotulo: "Ainda não sei" },
]

describe("RadioGroup", () => {
  it("cada opção é um rádio nomeado pelo label que o envolve", () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
      >
        {(aria) => <RadioGroup name="tipo" opcoes={OPCOES} aria={aria} />}
      </Field>,
    )
    expect(screen.getByRole("radio", { name: "Um site" })).toBeInTheDocument()
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  it("todas as opções compartilham o name, que é o que faz as setas andarem", () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
      >
        {(aria) => <RadioGroup name="tipo" opcoes={OPCOES} aria={aria} />}
      </Field>,
    )
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("name", "tipo")
    }
  })

  it("marcar uma opção desmarca a anterior", async () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
      >
        {(aria) => (
          <RadioGroup
            name="tipo"
            opcoes={OPCOES}
            defaultValue="site"
            aria={aria}
          />
        )}
      </Field>,
    )
    await userEvent.click(screen.getByRole("radio", { name: "Um sistema" }))
    expect(screen.getByRole("radio", { name: "Um sistema" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Um site" })).not.toBeChecked()
  })

  it("com erro, cada rádio recebe aria-invalid (a mensagem é do grupo)", () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
        erro="Escolha uma opção."
      >
        {(aria) => <RadioGroup name="tipo" opcoes={OPCOES} aria={aria} />}
      </Field>,
    )
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-invalid", "true")
      expect(radio).toHaveAttribute("aria-describedby", "tipo-erro")
    }
  })

  it("cada opção tem alvo de 44 px de altura", () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
      >
        {(aria) => <RadioGroup name="tipo" opcoes={OPCOES} aria={aria} />}
      </Field>,
    )
    expect(
      screen.getByRole("radio", { name: "Um site" }).closest("label"),
    ).toHaveClass("min-h-(--alvo-toque)")
  })
})
