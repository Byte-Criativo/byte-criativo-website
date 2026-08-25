export type QuestionAnswer = {
  id: number
  question: string
  answer: string
}

export const questionsAndAnswers: QuestionAnswer[] = [
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
      "Não. Pode chegar com uma ideia solta ou um problema de operação. Organizar isso em escopo é parte do nosso trabalho.",
  },
]
