import {
  CANAIS,
  ERRO_LEAD,
  LIMITE_CONTEXTO_FORM,
  LIMITE_EMAIL,
  LIMITE_EMPRESA,
  LIMITE_NOME,
  LIMITE_WHATSAPP,
  MINIMO_CONTEXTO,
  PRAZOS,
  TIPOS_PROJETO,
  type ErrosLead,
  type ValoresLead,
} from "./lead-form-shared"

// Mesma expressão usada por z.email() no esquema do servidor (Zod 4).
const EMAIL =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

/** Validação síncrona da ilha. A Server Action continua sendo a autoridade. */
export function validarLeadNoCliente(valores: ValoresLead): {
  erros: ErrosLead
  dados: ValoresLead
} {
  const dados = Object.fromEntries(
    Object.entries(valores).map(([campo, valor]) => [campo, valor.trim()]),
  ) as ValoresLead
  // O esquema do servidor também limita silenciosamente esse campo opcional.
  dados.empresa = dados.empresa.slice(0, LIMITE_EMPRESA)
  const erros: ErrosLead = {}

  if (!dados.nome) erros.nome = ERRO_LEAD.nomeVazio
  else if (dados.nome.length > LIMITE_NOME) erros.nome = ERRO_LEAD.nomeLongo

  if (!(TIPOS_PROJETO as readonly string[]).includes(dados.tipo)) {
    erros.tipo = ERRO_LEAD.tipoNaoEscolhido
  }

  if (dados.contexto.length < MINIMO_CONTEXTO) {
    erros.contexto = ERRO_LEAD.contextoCurto
  } else if (dados.contexto.length > LIMITE_CONTEXTO_FORM) {
    erros.contexto = ERRO_LEAD.contextoLongo
  }

  if (!(CANAIS as readonly string[]).includes(dados.canal)) {
    erros.canal = ERRO_LEAD.canalNaoEscolhido
  }

  if (dados.whatsapp.length > LIMITE_WHATSAPP) {
    erros.whatsapp = ERRO_LEAD.whatsappInvalido
  } else if (dados.canal === "whatsapp") {
    if (!dados.whatsapp) erros.whatsapp = ERRO_LEAD.whatsappVazio
    else {
      const digitos = dados.whatsapp.replace(/\D/g, "")
      if (digitos.length < 10 || digitos.length > 13) {
        erros.whatsapp = ERRO_LEAD.whatsappInvalido
      }
    }
  }

  if (dados.email.length > LIMITE_EMAIL) {
    erros.email = ERRO_LEAD.emailInvalido
  } else if (dados.canal === "email") {
    if (!dados.email) erros.email = ERRO_LEAD.emailVazio
    else if (!EMAIL.test(dados.email)) erros.email = ERRO_LEAD.emailInvalido
  }

  if (dados.prazo && !(PRAZOS as readonly string[]).includes(dados.prazo)) {
    // A copy ainda não define uma mensagem específica para prazo inválido.
    erros.prazo =
      'Invalid option: expected one of "Tenho uma data"|"Nos próximos meses"|"Sem pressa"'
  }

  return { erros, dados }
}
