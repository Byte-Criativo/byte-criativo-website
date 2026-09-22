import { z } from "zod"

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
  extrairValoresLead,
  type ErrosLead,
  type ValoresLead,
} from "./lead-form-shared"

export * from "./lead-form-shared"

const vazioParaIndefinido = (valor: unknown): unknown =>
  typeof valor === "string" && valor.trim() === "" ? undefined : valor

/** DDD + número (10–11 dígitos), com ou sem o 55 do país (12–13). */
function whatsappPlausivel(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "")
  return digitos.length >= 10 && digitos.length <= 13
}

/** Esquema autoritativo da Server Action; a ilha usa a validação leve. */
export const leadSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(1, ERRO_LEAD.nomeVazio)
      .max(LIMITE_NOME, ERRO_LEAD.nomeLongo),
    tipo: z.enum(TIPOS_PROJETO, ERRO_LEAD.tipoNaoEscolhido),
    contexto: z
      .string()
      .trim()
      .min(MINIMO_CONTEXTO, ERRO_LEAD.contextoCurto)
      .max(LIMITE_CONTEXTO_FORM, ERRO_LEAD.contextoLongo),
    canal: z.enum(CANAIS, ERRO_LEAD.canalNaoEscolhido),
    // Tamanhos máximos: tudo aqui vai para o corpo do e-mail. A copy 13.2
    // não tem mensagem própria para esses limites — whatsapp e e-mail usam
    // as mensagens de "inválido" (um valor longo demais é, na prática,
    // inválido); empresa é truncada em silêncio em vez de inventar copy.
    whatsapp: z
      .string()
      .trim()
      .max(LIMITE_WHATSAPP, ERRO_LEAD.whatsappInvalido),
    email: z.string().trim().max(LIMITE_EMAIL, ERRO_LEAD.emailInvalido),
    empresa: z.preprocess(
      vazioParaIndefinido,
      z
        .string()
        .trim()
        .transform((valor) => valor.slice(0, LIMITE_EMPRESA))
        .optional(),
    ),
    prazo: z.preprocess(vazioParaIndefinido, z.enum(PRAZOS).optional()),
  })
  .superRefine((dados, ctx) => {
    // O servidor exige só o campo do canal escolhido (especificação,
    // LeadForm › Anatomia): sem suporte a `:has()` os dois ficam visíveis,
    // mas nunca os dois obrigatórios.
    if (dados.canal === "whatsapp") {
      if (dados.whatsapp === "") {
        ctx.addIssue({
          code: "custom",
          path: ["whatsapp"],
          message: ERRO_LEAD.whatsappVazio,
        })
      } else if (!whatsappPlausivel(dados.whatsapp)) {
        ctx.addIssue({
          code: "custom",
          path: ["whatsapp"],
          message: ERRO_LEAD.whatsappInvalido,
        })
      }
    }
    if (dados.canal === "email") {
      if (dados.email === "") {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: ERRO_LEAD.emailVazio,
        })
      } else if (!z.email().safeParse(dados.email).success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: ERRO_LEAD.emailInvalido,
        })
      }
    }
  })

export type LeadDados = z.infer<typeof leadSchema>

export function errosPorCampo(erro: z.ZodError): ErrosLead {
  const { fieldErrors } = z.flattenError(erro)
  const erros: ErrosLead = {}
  const entradas = Object.entries(
    fieldErrors as Record<string, string[] | undefined>,
  )
  for (const [campo, mensagens] of entradas) {
    const primeira = mensagens?.[0]
    if (primeira) erros[campo as keyof ErrosLead] = primeira
  }
  return erros
}

export function extrairLeadDoFormData(formData: FormData): ValoresLead {
  return extrairValoresLead((campo) => {
    const valor = formData.get(campo)
    return typeof valor === "string" ? valor : null
  })
}
