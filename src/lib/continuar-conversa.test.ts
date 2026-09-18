import { beforeEach, describe, expect, it } from "vitest"
import {
  apagarDadosContinuacao,
  CHAVE_CONTINUACAO,
  gravarDadosContinuacao,
  lerEApagarDadosContinuacao,
  LIMITE_CONTEXTO,
  montarMensagemContinuacao,
  type DadosContinuacao,
} from "./continuar-conversa"

const DADOS: DadosContinuacao = {
  envio: "e1",
  gravadoEm: 1_700_000_000_000,
  nome: "Ana",
  empresa: "Alumiô",
  tipo: "Um site",
  contexto: "Precisamos publicar a programação do festival.",
}

describe("chave de continuação", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("a chave e o limite do contexto são os do contrato", () => {
    expect(CHAVE_CONTINUACAO).toBe("byte-criativo:continuar-conversa")
    expect(LIMITE_CONTEXTO).toBe(500)
  })

  it("grava e lê quando o identificador bate", () => {
    gravarDadosContinuacao(DADOS)
    expect(lerEApagarDadosContinuacao("e1")).toEqual(DADOS)
  })

  // LGPD / Pendência 5: o que vai para o sessionStorage é exatamente o
  // contrato, nem um campo a mais. A prova de que o **tipo** não aceita
  // contato é estática e vive em `continuar-conversa.tipos.ts`, compilada
  // por `npm run typecheck`; esta aqui defende o que é de fato gravado.
  it("grava só os seis campos do contrato, e nenhum contato", () => {
    gravarDadosContinuacao(DADOS)
    const bruto = sessionStorage.getItem(CHAVE_CONTINUACAO) ?? ""
    expect(Object.keys(JSON.parse(bruto) as object).sort()).toEqual([
      "contexto",
      "empresa",
      "envio",
      "gravadoEm",
      "nome",
      "tipo",
    ])
    expect(bruto).not.toMatch(/@|\+55|mail|telefone|phone/i)
  })

  it("apaga a chave mesmo quando o identificador não bate", () => {
    gravarDadosContinuacao(DADOS)
    expect(lerEApagarDadosContinuacao("outro")).toBeNull()
    expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull()
  })

  it("apaga a chave depois de uma leitura bem-sucedida (leitura única)", () => {
    gravarDadosContinuacao(DADOS)
    lerEApagarDadosContinuacao("e1")
    expect(lerEApagarDadosContinuacao("e1")).toBeNull()
  })

  it("sem identificador na URL, descarta e apaga", () => {
    gravarDadosContinuacao(DADOS)
    expect(lerEApagarDadosContinuacao(undefined)).toBeNull()
    expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull()
  })

  it("chave corrompida não quebra e é apagada", () => {
    sessionStorage.setItem(CHAVE_CONTINUACAO, "{nao é json")
    expect(lerEApagarDadosContinuacao("e1")).toBeNull()
    expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull()
  })

  it("corta o contexto no limite da copy v1", () => {
    gravarDadosContinuacao({ ...DADOS, contexto: "x".repeat(900) })
    const lido = lerEApagarDadosContinuacao("e1")
    expect(lido?.contexto).toHaveLength(LIMITE_CONTEXTO)
  })

  it("apagarDadosContinuacao limpa em qualquer caminho sem sucesso", () => {
    gravarDadosContinuacao(DADOS)
    apagarDadosContinuacao()
    expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull()
  })

  it("a mensagem montada traz nome, empresa, tipo e contexto, e nenhum contato", () => {
    const mensagem = montarMensagemContinuacao(DADOS)
    expect(mensagem).toContain("Ana")
    expect(mensagem).toContain("Alumiô")
    expect(mensagem).toContain("Um site")
    expect(mensagem).toContain("Precisamos publicar a programação do festival.")
    // LGPD / Pendência 5: e-mail e telefone nunca entram na mensagem.
    expect(mensagem).not.toMatch(/@|\+55/)
  })

  it("sem empresa a mensagem não inventa linha de empresa nem deixa linha vazia", () => {
    const semEmpresa: DadosContinuacao = {
      envio: DADOS.envio,
      gravadoEm: DADOS.gravadoEm,
      nome: DADOS.nome,
      tipo: DADOS.tipo,
      contexto: DADOS.contexto,
    }
    const mensagem = montarMensagemContinuacao(semEmpresa)
    expect(mensagem).toContain("Ana")
    expect(mensagem).not.toContain("Alumiô")
    // Nem a linha vazia, nem o rótulo órfão: a linha inteira desaparece.
    expect(mensagem).not.toContain("Projeto:")
    expect(mensagem).not.toMatch(/^\s*$/m)
  })
})
