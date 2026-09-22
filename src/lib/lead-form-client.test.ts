import { describe, expect, it } from "vitest"
import { errosPorCampo, leadSchema } from "./lead-form"
import { validarLeadNoCliente } from "./lead-form-client"
import type { ValoresLead } from "./lead-form-shared"

const VALIDO: ValoresLead = {
  nome: "Ana",
  tipo: "site",
  contexto: "Temos um site antigo e precisamos renovar.",
  canal: "email",
  whatsapp: "",
  email: "ana@exemplo.com",
  empresa: "",
  prazo: "",
}

describe("validação síncrona do lead", () => {
  it.each([
    {
      nome: "vazio",
      mudancas: { nome: "", contexto: "", tipo: "", canal: "" },
    },
    {
      nome: "limites",
      mudancas: {
        nome: "a".repeat(101),
        contexto: "a".repeat(2001),
        whatsapp: "a".repeat(21),
        email: "a".repeat(255),
      },
    },
    {
      nome: "aparado",
      mudancas: {
        nome: " Ana ",
        contexto: "  Temos um site antigo e precisamos renovar.  ",
        email: " ana@exemplo.com ",
      },
    },
    { nome: "email inválido", mudancas: { email: "ana@" } },
    { nome: "whatsapp vazio", mudancas: { canal: "whatsapp", email: "" } },
    {
      nome: "whatsapp inválido",
      mudancas: { canal: "whatsapp", whatsapp: "9123" },
    },
    {
      nome: "whatsapp válido",
      mudancas: { canal: "whatsapp", whatsapp: "(83) 99125-3377", email: "" },
    },
    { nome: "prazo inválido", mudancas: { prazo: "Para ontem" } },
    { nome: "tipo inválido", mudancas: { tipo: "loja" } },
  ])("produz os mesmos erros do servidor: $nome", ({ mudancas }) => {
    const valores = { ...VALIDO, ...mudancas }
    const cliente = validarLeadNoCliente(valores)
    const servidor = leadSchema.safeParse(valores)
    expect(cliente.erros).toEqual(
      servidor.success ? {} : errosPorCampo(servidor.error),
    )
    expect(Object.keys(cliente.erros).length === 0).toBe(servidor.success)
  })

  it("limita a empresa opcional como o servidor antes de guardar a continuação", () => {
    const valores = { ...VALIDO, empresa: `  ${"A".repeat(120)}  ` }
    const cliente = validarLeadNoCliente(valores)
    const servidor = leadSchema.safeParse(valores)
    expect(servidor.success).toBe(true)
    if (servidor.success) {
      expect(cliente.dados.empresa).toBe(servidor.data.empresa)
    }
  })
})
