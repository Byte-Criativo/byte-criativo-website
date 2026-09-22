import { describe, expect, it } from "vitest"
import { getContatoPage } from "@/content"
import {
  CANAIS,
  errosPorCampo,
  ERRO_LEAD,
  extrairLeadDoFormData,
  leadSchema,
  PRAZOS,
  TIPOS_PROJETO,
} from "./lead-form"

const VALIDO = {
  nome: "Ana",
  tipo: "site",
  contexto: "Temos um site antigo e precisamos renovar.",
  canal: "email",
  whatsapp: "",
  email: "ana@exemplo.com",
  empresa: "",
  prazo: "",
}

function parse(dados: Record<string, string>) {
  return leadSchema.safeParse(dados)
}

describe("leadSchema", () => {
  it("os valores de tipo, canal e prazo são os do conteúdo publicado", () => {
    const contato = getContatoPage()
    expect([...TIPOS_PROJETO].sort()).toEqual(
      contato.projectTypeOptions.map((opcao) => opcao.value).sort(),
    )
    expect([...PRAZOS].sort()).toEqual([...contato.deadlineOptions].sort())
    expect([...CANAIS].sort()).toEqual(["email", "whatsapp"])
  })

  it("aceita o preenchimento válido pelo canal e-mail", () => {
    const resultado = parse(VALIDO)
    expect(resultado.success).toBe(true)
    if (resultado.success) {
      expect(resultado.data.empresa).toBeUndefined()
      expect(resultado.data.prazo).toBeUndefined()
    }
  })

  it("exige o nome e limita a 100 caracteres (copy 13.2)", () => {
    expect(errosPorCampo(parse({ ...VALIDO, nome: "" }).error!).nome).toBe(
      ERRO_LEAD.nomeVazio,
    )
    expect(
      errosPorCampo(parse({ ...VALIDO, nome: "a".repeat(101) }).error!).nome,
    ).toBe(ERRO_LEAD.nomeLongo)
  })

  it("exige o tipo, com a mensagem da copy", () => {
    expect(errosPorCampo(parse({ ...VALIDO, tipo: "" }).error!).tipo).toBe(
      ERRO_LEAD.tipoNaoEscolhido,
    )
    expect(errosPorCampo(parse({ ...VALIDO, tipo: "loja" }).error!).tipo).toBe(
      ERRO_LEAD.tipoNaoEscolhido,
    )
  })

  it("exige contexto mínimo e limita a 2.000 caracteres", () => {
    expect(
      errosPorCampo(parse({ ...VALIDO, contexto: "oi" }).error!).contexto,
    ).toBe(ERRO_LEAD.contextoCurto)
    expect(
      errosPorCampo(parse({ ...VALIDO, contexto: "a".repeat(2_001) }).error!)
        .contexto,
    ).toBe(ERRO_LEAD.contextoLongo)
  })

  it("exige o canal", () => {
    expect(errosPorCampo(parse({ ...VALIDO, canal: "" }).error!).canal).toBe(
      ERRO_LEAD.canalNaoEscolhido,
    )
  })

  it("no canal WhatsApp exige um número plausível, com DDD", () => {
    const base = { ...VALIDO, canal: "whatsapp", email: "" }
    expect(errosPorCampo(parse(base).error!).whatsapp).toBe(
      ERRO_LEAD.whatsappVazio,
    )
    expect(
      errosPorCampo(parse({ ...base, whatsapp: "9123" }).error!).whatsapp,
    ).toBe(ERRO_LEAD.whatsappInvalido)
    // Só o campo do canal é exigido: e-mail vazio não é erro aqui.
    const valido = parse({ ...base, whatsapp: "(83) 99125-3377" })
    expect(valido.success).toBe(true)
  })

  it("no canal e-mail exige um endereço plausível", () => {
    expect(errosPorCampo(parse({ ...VALIDO, email: "" }).error!).email).toBe(
      ERRO_LEAD.emailVazio,
    )
    expect(
      errosPorCampo(parse({ ...VALIDO, email: "ana@" }).error!).email,
    ).toBe(ERRO_LEAD.emailInvalido)
    // WhatsApp vazio não é erro quando o canal é e-mail.
    expect(parse(VALIDO).success).toBe(true)
  })

  it("aceita prazo das opções e recusa valor fora delas", () => {
    expect(parse({ ...VALIDO, prazo: "Tenho uma data" }).success).toBe(true)
    const invalido = parse({ ...VALIDO, prazo: "Para ontem" })
    expect(invalido.success).toBe(false)
    expect(errosPorCampo(invalido.error!).prazo).toBeTruthy()
  })

  it("devolve um erro por campo, com a primeira mensagem de cada um", () => {
    const erros = errosPorCampo(
      parse({ ...VALIDO, nome: "", tipo: "", contexto: "" }).error!,
    )
    expect(erros).toEqual({
      nome: ERRO_LEAD.nomeVazio,
      tipo: ERRO_LEAD.tipoNaoEscolhido,
      contexto: ERRO_LEAD.contextoCurto,
    })
  })
})

describe("extrairLeadDoFormData", () => {
  it("lê strings e devolve vazio para campos ausentes ou arquivo", () => {
    const formData = new FormData()
    formData.set("nome", "Ana")
    formData.set("email", new File(["x"], "x.txt"))
    expect(extrairLeadDoFormData(formData)).toEqual({
      nome: "Ana",
      tipo: "",
      contexto: "",
      canal: "",
      whatsapp: "",
      email: "",
      empresa: "",
      prazo: "",
    })
  })
})
