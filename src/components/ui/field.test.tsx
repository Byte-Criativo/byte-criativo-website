import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Field } from "./field"
import { Input } from "./input"

describe("Field", () => {
  it("associa o label visível ao controle e diz se é obrigatório", () => {
    render(
      <Field id="nome" label="Seu nome" obrigatorio>
        {(aria) => <Input {...aria} name="nome" autoComplete="name" />}
      </Field>,
    )
    expect(screen.getByLabelText("Seu nome (obrigatório)")).toBeInTheDocument()
  })

  it("diz (opcional) quando o campo não é obrigatório", () => {
    render(
      <Field id="empresa" label="Empresa, marca ou projeto" obrigatorio={false}>
        {(aria) => (
          <Input {...aria} name="empresa" autoComplete="organization" />
        )}
      </Field>,
    )
    expect(
      screen.getByLabelText("Empresa, marca ou projeto (opcional)"),
    ).toBeInTheDocument()
  })

  it("sem erro, não há aria-invalid e o id do erro não entra no describedby", () => {
    render(
      <Field id="nome" label="Seu nome" obrigatorio ajuda="Como devo te chamar">
        {(aria) => <Input {...aria} name="nome" autoComplete="name" />}
      </Field>,
    )
    const campo = screen.getByRole("textbox")
    expect(campo).not.toHaveAttribute("aria-invalid")
    expect(campo).toHaveAttribute("aria-describedby", "nome-ajuda")
  })

  it("com erro, ajuda e contador, o describedby vem na ordem erro, ajuda, contador", () => {
    render(
      <Field
        id="contexto"
        label="Conte um pouco do contexto"
        obrigatorio
        ajuda="Pode ser em poucas linhas"
        erro="Escreva pelo menos uma frase."
        contador="120 de 2.000 caracteres"
      >
        {(aria) => <Input {...aria} name="contexto" autoComplete="off" />}
      </Field>,
    )
    const campo = screen.getByRole("textbox")
    expect(campo).toHaveAttribute("aria-invalid", "true")
    expect(campo).toHaveAttribute(
      "aria-describedby",
      "contexto-erro contexto-ajuda contexto-contador",
    )
  })

  it("todo id citado no describedby existe no DOM", () => {
    const { container } = render(
      <Field
        id="contexto"
        label="Conte um pouco do contexto"
        obrigatorio
        erro="Escreva pelo menos uma frase."
      >
        {(aria) => <Input {...aria} name="contexto" autoComplete="off" />}
      </Field>,
    )
    const ids =
      screen
        .getByRole("textbox")
        .getAttribute("aria-describedby")
        ?.split(" ") ?? []
    expect(ids).toHaveLength(1)
    for (const id of ids) {
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    }
  })

  it("a mensagem de erro não é só cor: traz ícone e texto", () => {
    const { container } = render(
      <Field id="email" label="Seu e-mail" obrigatorio erro="E-mail inválido.">
        {(aria) => <Input {...aria} name="email" autoComplete="email" />}
      </Field>,
    )
    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument()
    expect(container.querySelector("#email-erro svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("tipo opcoes vira fieldset com legend, virando um grupo nomeado", () => {
    render(
      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
      >
        {() => <input type="radio" name="tipo" value="site" />}
      </Field>,
    )
    expect(
      screen.getByRole("group", {
        name: "O que você quer construir? (obrigatório)",
      }),
    ).toBeInTheDocument()
  })
})
