import "server-only"

import { Resend } from "resend"
import { CONTACT_EMAIL } from "./contact"
import type { LeadDados } from "./lead-form"

/**
 * Único registro do lead no MVP: um e-mail de texto puro para a caixa da
 * Byte (arquitetura técnica 5.7 — sem banco de dados). Corpo conforme a
 * copy v1, seção 13.3 ("E-mail interno do lead"), sem IP.
 *
 * Configuração de produção:
 * - `RESEND_API_KEY`: sem ela `sendLeadEmail` falha de forma tratada
 *   (`LeadEmailError`), e a action cai no estado "fallback" — nunca quebra
 *   build nem testes.
 * - `LEAD_EMAIL_FROM`: remetente verificado no Resend (padrão abaixo serve
 *   para desenvolvimento com o domínio de testes do provedor).
 * - `LEAD_EMAIL_TO`: caixa que recebe o lead (padrão: e-mail de contato).
 */

export const EMAIL_TIMEOUT_MS = 10_000

const REMETENTE_PADRAO = "Site Byte Criativo <onboarding@resend.dev>"

export class LeadEmailError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = "LeadEmailError"
  }
}

export type LeadParaEmail = {
  dados: LeadDados
  /** Rótulo visível do tipo ("Site ou landing page"), não o valor interno. */
  tipoRotulo: string
  /** Valor do campo oculto `origem` (utm/página de entrada), se houver. */
  origem?: string
}

function montarCorpo({ dados, tipoRotulo, origem }: LeadParaEmail): string {
  const linhas = [
    `Nome: ${dados.nome}`,
    `O que quer construir: ${tipoRotulo}`,
    `Contexto: ${dados.contexto}`,
    `Canal preferido: ${dados.canal === "whatsapp" ? "WhatsApp" : "E-mail"}`,
    dados.canal === "whatsapp"
      ? `WhatsApp: ${dados.whatsapp}`
      : `E-mail: ${dados.email}`,
    dados.empresa ? `Empresa: ${dados.empresa}` : null,
    dados.prazo ? `Prazo: ${dados.prazo}` : null,
    origem ? `Origem: ${origem}` : null,
  ].filter((linha): linha is string => linha !== null)

  return linhas.join("\n")
}

async function comTimeout<T>(promessa: Promise<T>): Promise<T> {
  let temporizador: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promessa,
      new Promise<never>((_resolve, rejeita) => {
        temporizador = setTimeout(
          () => rejeita(new LeadEmailError("tempo esgotado no provedor")),
          EMAIL_TIMEOUT_MS,
        )
      }),
    ])
  } finally {
    clearTimeout(temporizador)
  }
}

export async function sendLeadEmail(lead: LeadParaEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new LeadEmailError("RESEND_API_KEY não configurada")
  }

  // Instância criada por envio, nunca no topo do módulo: importar este
  // arquivo sem a env (build, testes) não pode falhar.
  const resend = new Resend(apiKey)

  const { error } = await comTimeout(
    resend.emails.send({
      from: process.env.LEAD_EMAIL_FROM ?? REMETENTE_PADRAO,
      to: process.env.LEAD_EMAIL_TO ?? CONTACT_EMAIL,
      subject: `Novo contato pelo site: ${lead.tipoRotulo}`,
      text: montarCorpo(lead),
      // Reply-to do lead (arquitetura 5.7): só existe quando o lead deixou
      // um e-mail; no canal WhatsApp não há endereço para responder.
      ...(lead.dados.canal === "email" ? { replyTo: lead.dados.email } : {}),
    }),
  )

  if (error) {
    throw new LeadEmailError(error.message)
  }
}
