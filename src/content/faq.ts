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
      "Sites, sistemas web sob medida e plataformas digitais. Design de interfaces, textos e integrações podem fazer parte do projeto conforme a necessidade. Você não precisa escolher a solução técnica antes da conversa.",
  },
  {
    id: 2,
    question: "Minha ideia ainda está no começo. Posso conversar?",
    answer:
      "Sim. Diga para quem seria o projeto e o que você gostaria que ele permitisse fazer. Se isso ainda não estiver claro, comece pela necessidade que percebeu. A conversa inicial ajuda a entender o contexto e avaliar o próximo passo.",
  },
  {
    id: 3,
    question: "Como saber se preciso de um site ou de um sistema?",
    answer:
      "Um site costuma atender à apresentação do negócio, dos serviços e dos caminhos de contato. Um sistema entra quando há tarefas, dados e regras próprias, como cadastros, permissões ou acompanhamento de pedidos. Podemos conversar sobre o que precisa acontecer antes de escolher o formato.",
  },
  {
    id: 4,
    question: "Como são definidos investimento e prazo?",
    answer:
      "Consideramos as páginas ou fluxos, o conteúdo disponível, as integrações, as regras de uso e as validações necessárias. Com a necessidade delimitada, a proposta apresenta entregas, investimento e prazo para sua aprovação.",
  },
  {
    id: 5,
    question: "Vocês avaliam projetos já existentes?",
    answer:
      "Você pode apresentar o site ou sistema atual e contar o que precisa mudar. A possibilidade de atuar depende da tecnologia, do estado do projeto e dos acessos necessários. Não envie senhas no primeiro contato.",
  },
  {
    id: 6,
    question: "Como acompanho o trabalho e o que acontece depois da entrega?",
    answer:
      "Você acompanha o desenvolvimento e participa das validações previstas no escopo. A forma de acompanhamento, as entregas e as condições de continuidade precisam estar claras na proposta. Manutenção, novas funcionalidades e suporte são tratados conforme o que for contratado.",
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
