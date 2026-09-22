import { z } from "zod"
import { FaqItemSchema, type FaqItem } from "./schema"

export type QuestionAnswer = {
  id: number
  question: string
  answer: string
}

export const faqItemsRaw = [
  {
    id: 1,
    question: "O que a Byte Criativo desenvolve?",
    answer:
      "Sites institucionais, sistemas web sob medida, landing pages, automações e produtos digitais. Também cuidamos de UI/UX e dos textos, para o projeto sair completo.",
  },
  {
    id: 2,
    question: "Como funciona o processo?",
    answer:
      "Começamos entendendo seu objetivo e sua operação. Com isso definimos escopo, prazo e investimento antes de escrever código. Durante o desenvolvimento você acompanha as decisões, e depois da entrega seguimos disponíveis para evolução.",
  },
  {
    id: 3,
    question: "Quanto custa e quanto tempo leva?",
    answer:
      "Depende do escopo. Um site institucional e um sistema com login e painéis são projetos muito diferentes. Depois da primeira conversa, você recebe uma proposta com valores, etapas e prazo.",
  },
  {
    id: 4,
    question: "Preciso ter tudo definido antes de falar com vocês?",
    answer:
      "Não. Pode chegar com uma ideia solta ou um problema de operação. Organizar isso em escopo é a primeira parte do trabalho.",
  },
  {
    id: 5,
    question: "Quem faz o projeto? Há parceiros?",
    answer:
      "Uma pessoa desenha e programa cada projeto, da primeira conversa ao que vai ao ar. Quando o projeto pede outra especialidade ou mais mãos, entram parceiros sob a mesma condução.",
  },
  {
    id: 6,
    question: "Atende em qualquer cidade?",
    answer:
      "Sim. O processo funciona à distância: conversas por vídeo, aprovações por link e o projeto num endereço de teste.",
  },
]

export const faqItems: FaqItem[] = z.array(FaqItemSchema).parse(faqItemsRaw)

// Preservado para compatibilidade com src/lib/seo.ts
export const questionsAndAnswers: QuestionAnswer[] = faqItemsRaw.map(
  (item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }),
)
