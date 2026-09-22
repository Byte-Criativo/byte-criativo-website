"use server"

import type { Route } from "next"
import { redirect } from "next/navigation"
import { after } from "next/server"
import { getContatoPage } from "@/content"
import { sendLeadEmail } from "@/lib/email"
import {
  CANAIS,
  errosPorCampo,
  extrairLeadDoFormData,
  leadSchema,
  type LeadFormState,
} from "@/lib/lead-form"

/**
 * Server Action do formulário de lead (arquitetura técnica 5.7), na ordem
 * da especificação: bot → honeypot/carimbo → validação Zod → envio do
 * e-mail → fallback com WhatsApp → log sem dados pessoais → redirect.
 *
 * Tratada como endpoint público (5.8): nada do que chega é confiável, o
 * esquema valida tudo e nenhum HTML do lead é refletido (o corpo do e-mail
 * é texto puro montado aqui; os erros voltam só com as mensagens da copy).
 */

/**
 * Envio abaixo deste intervalo depois do carimbo de montagem é tratado como
 * robô. Sem JS o carimbo vai vazio e a verificação é pulada — o formulário
 * sem JS nunca é bloqueado por ela.
 */
const ENVIO_MINIMO_MS = 3_000

/**
 * Verificação de robô invisível (3.3.8). A integração com o BotID da Vercel
 * está pendente (risco 3 da arquitetura técnica: licença e termos a
 * confirmar); até lá, a função existe para o ponto de encaixe não mudar.
 */
async function verificarBot(): Promise<boolean> {
  return false
}

/** Máximo do campo oculto `origem`, que entra no corpo do e-mail. */
const LIMITE_ORIGEM = 200

/**
 * O identificador de envio é ecoado no redirect e usado como chave de
 * idempotência no Resend. Aceita apenas UUID v4 gerado pela ilha.
 */
const FORMATO_ENVIO =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Sucesso genérico, sem avisar o robô nem enviar nada (copy v1, 13.2).
 * Ecoa o `?canal=` quando o valor é um canal válido: sem isso a resposta
 * do descarte seria distinguível da resposta legítima (e a página de
 * obrigado cairia no estado degradado de acesso direto).
 */
function sucessoGenerico(
  motivo: "bot" | "honeypot" | "rapido",
  formData: FormData,
): never {
  // A spec registra só a contagem dos envios descartados pelo honeypot
  // (sem conteúdo), para detectar preenchimento automático indevido.
  if (motivo === "honeypot") {
    after(() => {
      console.info("envio de lead descartado pelo honeypot")
    })
  }
  const canal = textoDoCampo(formData, "canal")
  if ((CANAIS as readonly string[]).includes(canal)) {
    redirect(`/contato/obrigado?canal=${canal}` as Route)
  }
  redirect("/contato/obrigado")
}

function textoDoCampo(formData: FormData, campo: string): string {
  const valor = formData.get(campo)
  return typeof valor === "string" ? valor : ""
}

export async function submitLead(
  _estadoAnterior: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // 1. Verificação de robô.
  if (await verificarBot()) {
    sucessoGenerico("bot", formData)
  }

  // 2. Honeypot preenchido ou envio rápido demais.
  if (textoDoCampo(formData, "verificacao").trim() !== "") {
    sucessoGenerico("honeypot", formData)
  }
  const carimbo = Number(textoDoCampo(formData, "carimbo"))
  if (
    Number.isFinite(carimbo) &&
    carimbo > 0 &&
    Date.now() - carimbo < ENVIO_MINIMO_MS
  ) {
    sucessoGenerico("rapido", formData)
  }

  // 3. Valação Zod: erros por campo, valores preservados.
  const valores = extrairLeadDoFormData(formData)
  const resultado = leadSchema.safeParse(valores)
  if (!resultado.success) {
    return {
      status: "erro",
      erros: errosPorCampo(resultado.error),
      valores,
    }
  }
  const dados = resultado.data

  const tipoRotulo =
    getContatoPage().projectTypeOptions.find(
      (opcao) => opcao.value === dados.tipo,
    )?.label ?? dados.tipo

  const origem = textoDoCampo(formData, "origem").trim().slice(0, LIMITE_ORIGEM)
  const envioBruto = textoDoCampo(formData, "envio").trim()
  const envio = FORMATO_ENVIO.test(envioBruto) ? envioBruto : ""

  // 4 e 5. Envio; falha do provedor vira o estado "fallback" (a ilha mostra
  // o Notice com o botão de WhatsApp montado só no clique).
  try {
    await sendLeadEmail({
      dados,
      tipoRotulo,
      ...(origem !== "" ? { origem } : {}),
      ...(envio !== "" ? { envio } : {}),
    })
  } catch {
    after(() => {
      // Log sem dados pessoais: canal e tipo bastam para operar a fila.
      console.error("falha ao enviar o lead por e-mail", {
        canal: dados.canal,
        tipo: dados.tipo,
      })
    })
    return { status: "fallback", erros: {}, valores }
  }

  // 6. Log de servidor, sem dados pessoais.
  after(() => {
    console.info("lead enviado", {
      canal: dados.canal,
      tipo: dados.tipo,
      comIdentificador: envio !== "",
    })
  })

  // 7. Sucesso: redirect com (e sem JS) para a confirmação, ecoando o
  // identificador de envio quando a ilha gravou um (sem JS vai vazio).
  const parametros = new URLSearchParams({ canal: dados.canal })
  if (envio !== "") parametros.set("envio", envio)
  redirect(`/contato/obrigado?${parametros.toString()}` as Route)
}
