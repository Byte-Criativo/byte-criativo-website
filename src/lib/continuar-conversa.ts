/**
 * Chave única de continuação da conversa em `sessionStorage`.
 *
 * Guarda o mínimo: identificador de envio (aleatório e não pessoal), o
 * instante da gravação, nome, empresa, rótulo do tipo e o contexto cortado.
 * **E-mail e telefone nunca são gravados.** Qualquer script permitido pela
 * CSP consegue ler o `sessionStorage`, por isso a chave vive até a primeira
 * leitura ou até a aba fechar, e é apagada em todo caminho sem sucesso.
 */
export const CHAVE_CONTINUACAO = "byte-criativo:continuar-conversa"

/** Limite do contexto na mensagem de WhatsApp (copy v1, seção 14). */
export const LIMITE_CONTEXTO = 500

export type DadosContinuacao = {
  envio: string
  gravadoEm: number
  nome: string
  empresa?: string
  tipo: string
  contexto: string
}

export function gravarDadosContinuacao(dados: DadosContinuacao): void {
  const recortado: DadosContinuacao = {
    ...dados,
    contexto: cortarContexto(dados.contexto),
  }
  try {
    sessionStorage.setItem(CHAVE_CONTINUACAO, JSON.stringify(recortado))
  } catch {
    // Armazenamento indisponível (aba privada, cota): a página de obrigado
    // cai na versão sem dados, que é sempre válida.
  }
}

export function apagarDadosContinuacao(): void {
  try {
    sessionStorage.removeItem(CHAVE_CONTINUACAO)
  } catch {
    // Nada a fazer: sem armazenamento não há o que apagar.
  }
}

/**
 * Lê a chave **uma vez** e a apaga em qualquer caso. Devolve os dados só se
 * o identificador da chave for igual ao `envio` da URL; se não bater (envio
 * abortado, chave antiga, outra aba), descarta.
 */
export function lerEApagarDadosContinuacao(
  envio: string | undefined,
): DadosContinuacao | null {
  let bruto: string | null = null
  try {
    bruto = sessionStorage.getItem(CHAVE_CONTINUACAO)
  } catch {
    return null
  }
  apagarDadosContinuacao()

  if (!bruto || !envio) return null

  try {
    const dados = JSON.parse(bruto) as DadosContinuacao
    return dados.envio === envio ? dados : null
  } catch {
    return null
  }
}

/**
 * Corte do contexto na mensagem de WhatsApp (copy v1, seção 14): no fim da
 * última frase completa antes do limite, com "(continua)"; sem frase
 * completa, corte seco no limite. Fonte única do corte — usada na gravação
 * da chave e na montagem da mensagem, para o fallback do formulário e a
 * página de obrigado ficarem consistentes. Determinística e idempotente:
 * aplicar de novo sobre um texto já cortado devolve o mesmo texto.
 */
export function cortarContexto(contexto: string): string {
  if (contexto.length <= LIMITE_CONTEXTO) return contexto
  const recorte = contexto.slice(0, LIMITE_CONTEXTO)
  const fimFrase = Math.max(
    recorte.lastIndexOf(". "),
    recorte.lastIndexOf("! "),
    recorte.lastIndexOf("? "),
    recorte.lastIndexOf(".\n"),
  )
  const corte = fimFrase > 0 ? recorte.slice(0, fimFrase + 1) : recorte
  return `${corte} (continua)`
}

/**
 * Mensagem da continuação. Só os campos da chave entram — sem e-mail, sem
 * telefone. A linha da empresa some quando não há empresa, em vez de virar
 * uma linha vazia.
 */
export function montarMensagemContinuacao(dados: DadosContinuacao): string {
  const linhas = [
    `Olá! Sou ${dados.nome}.`,
    dados.empresa ? `Projeto: ${dados.empresa}.` : null,
    `O que quero construir: ${dados.tipo}.`,
    `Contexto: ${cortarContexto(dados.contexto)}`,
  ].filter((linha): linha is string => linha !== null)

  return linhas.join("\n")
}
