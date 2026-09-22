import { z } from "zod"

/**
 * Esquema do formulário de lead, compartilhado entre a Server Action
 * (`contato/actions.ts`, fonte de verdade) e a validação síncrona da ilha
 * LeadForm no evento `submit`. Não importa nada de `server-only`: o esquema
 * entra no bundle da ilha.
 *
 * Mensagens: copy v1, seção 13.2. Valores de `tipo` e `prazo`: copy v1,
 * seção 7 — um teste em `lead-form.test.ts` garante que continuam iguais
 * às opções do conteúdo (`src/content/pages.ts`).
 */

export const TIPOS_PROJETO = [
  "site",
  "plataforma",
  "sistema-interno",
  "automacao",
  "cultural",
  "ainda-nao-sei",
] as const

export const CANAIS = ["whatsapp", "email"] as const

export const PRAZOS = [
  "Tenho uma data",
  "Nos próximos meses",
  "Sem pressa",
] as const

export const LIMITE_NOME = 100
export const LIMITE_CONTEXTO_FORM = 2_000
/** Mínimo que diferencia "contexto curto demais" de uma frase de verdade. */
export const MINIMO_CONTEXTO = 10
/** Máximos do que entra no corpo do e-mail (whatsapp com pontuação e 55). */
export const LIMITE_WHATSAPP = 20
export const LIMITE_EMAIL = 254
export const LIMITE_EMPRESA = 100

/** Mensagens da copy v1, seção 13.2 — nunca inventar texto novo aqui. */
export const ERRO_LEAD = {
  nomeVazio: "Faltou o seu nome.",
  nomeLongo: "O nome passou de 100 caracteres. Use uma forma mais curta.",
  tipoNaoEscolhido:
    'Escolha uma opção. Se ainda não souber, marque "Ainda não sei".',
  contextoCurto: "Conte um pouco mais, nem que seja uma frase.",
  contextoLongo:
    "O texto passou de 2.000 caracteres. Resuma o essencial; o resto fica para a conversa.",
  canalNaoEscolhido: "Escolha como prefere continuar: WhatsApp ou e-mail.",
  whatsappVazio: "Faltou o seu WhatsApp.",
  whatsappInvalido: "Esse número parece incompleto. Confere o DDD?",
  emailVazio: "Faltou o seu e-mail.",
  emailInvalido: "Esse e-mail parece incompleto. Confere?",
} as const

const vazioParaIndefinido = (valor: unknown): unknown =>
  typeof valor === "string" && valor.trim() === "" ? undefined : valor

/** DDD + número (10–11 dígitos), com ou sem o 55 do país (12–13). */
function whatsappPlausivel(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "")
  return digitos.length >= 10 && digitos.length <= 13
}

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

/** Erros por campo, uma mensagem por campo, na ordem do formulário. */
export type ErrosLead = Partial<
  Record<
    | "nome"
    | "tipo"
    | "contexto"
    | "canal"
    | "whatsapp"
    | "email"
    | "empresa"
    | "prazo",
    string
  >
>

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

/** Campos de texto do formulário, preservados em todo retorno sem sucesso. */
export type ValoresLead = {
  nome: string
  tipo: string
  contexto: string
  canal: string
  whatsapp: string
  email: string
  empresa: string
  prazo: string
}

/** Lê o `FormData` (ou um registro de strings) no formato do esquema. */
export function extrairValoresLead(
  ler: (campo: string) => string | null,
): ValoresLead {
  const valor = (campo: string): string => ler(campo) ?? ""
  return {
    nome: valor("nome"),
    tipo: valor("tipo"),
    contexto: valor("contexto"),
    canal: valor("canal"),
    whatsapp: valor("whatsapp"),
    email: valor("email"),
    empresa: valor("empresa"),
    prazo: valor("prazo"),
  }
}

export function extrairLeadDoFormData(formData: FormData): ValoresLead {
  return extrairValoresLead((campo) => {
    const valor = formData.get(campo)
    return typeof valor === "string" ? valor : null
  })
}

/** Estado da Server Action, compartilhado com a ilha (`useActionState`). */
export type LeadFormState = {
  status: "inicial" | "erro" | "fallback"
  erros: ErrosLead
  valores: ValoresLead
}

export const VALORES_VAZIOS: ValoresLead = {
  nome: "",
  tipo: "",
  contexto: "",
  canal: "",
  whatsapp: "",
  email: "",
  empresa: "",
  prazo: "",
}

export const ESTADO_INICIAL_LEAD: LeadFormState = {
  status: "inicial",
  erros: {},
  valores: VALORES_VAZIOS,
}
