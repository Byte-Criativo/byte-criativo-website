import {
  gravarDadosContinuacao,
  type DadosContinuacao,
} from "./continuar-conversa"

/**
 * Provas **estáticas** da Pendência 5 / LGPD: a chave de continuação não tem
 * onde guardar contato. Compiladas por `npm run typecheck` e nunca rodadas
 * pelo vitest — se `DadosContinuacao` ganhar `email` ou `telefone`, ou virar
 * um tipo aberto, as duas diretivas abaixo passam a ser "unused" e o
 * typecheck deixa de sair com 0. Esse é o alarme.
 *
 * Vive no repositório de propósito: enquanto a única prova disso foi um
 * arquivo temporário do gate, escrito e apagado a cada corrida, a garantia
 * mais cara do bloco não tinha dono e morreria junto com a fase.
 */
export function chaveDeContinuacaoRecusaEmail(): void {
  gravarDadosContinuacao({
    envio: "e1",
    gravadoEm: 1_700_000_000_000,
    nome: "Ana",
    tipo: "Um site",
    contexto: "x",
    // @ts-expect-error e-mail nunca é gravado na chave de continuação
    email: "ana@exemplo.com",
  })
}

export function chaveDeContinuacaoRecusaTelefone(): void {
  const dados: DadosContinuacao = {
    envio: "e1",
    gravadoEm: 1_700_000_000_000,
    nome: "Ana",
    tipo: "Um site",
    contexto: "x",
    // @ts-expect-error telefone nunca é gravado na chave de continuação
    telefone: "+5583991253377",
  }
  gravarDadosContinuacao(dados)
}
