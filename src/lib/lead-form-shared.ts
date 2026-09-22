/** Valores, mensagens e estado compartilhados entre servidor e ilha do formulário. */

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
