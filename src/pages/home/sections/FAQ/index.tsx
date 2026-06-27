import { SectionTitle } from "@/src/components/SectionTitle"
import { FAQContainer, FAQQuestionsBox } from "./styles"
import { QuestionAnswer } from "@/src/components/QuestionAnswer"
import { useState } from "react"

type QuestionAnswersType = {
  id: number
  question: string
  answer: string
}

const questionsAndAnswers: QuestionAnswersType[] = [
  {
    id: 1,
    question: "Quais os trabalhos desenvolvidos pela Byte Criativo?",
    answer:
      "Desenvolvemos soluções em softwares, como web apps dinâmicos e intuitivos, aplicativos mobile para Android e iOS, e-commerces e demais soluções que você necessitar. Nós criamos experiências memoráveis que conectam, convertem e retêm.",
  },
  {
    id: 2,
    question: "Como se dá o processo de criação da Byte Criativo?",
    answer:
      "Examinamos a demanda, para que o orçamento seja condizente com o escopo do trabalho. Depois vem a parte de desenvolvimento, onde deixamos você por dentro do processo, esclarecendo quaisquer dúvidas. Como cada projeto é personalizado, o tempo de entrega também varia. Projeto pronto, entregamos e nos mantemos disponíveis para suportes necessários.",
  },
  {
    id: 3,
    question:
      "Vocês fazem apenas o trabalho de desenvolvimento de software ou cuidam também do design?",
    answer:
      "Para que o desenvolvimento em web seja feito da melhor forma possível, recomendamos que o cliente tenha uma identidade visual bem definida, o que vai além de ter um logotipo. Caso você não tenha esse material, esse desenvolvimento pode ser incluído no pacote. Afinal, toda a identidade da sua marca, desenvolvimento em software inclusive, precisa estar em unidade.",
  },
  {
    id: 4,
    question:
      "Qual o valor do investimento que terei que fazer e qual a duração de um projeto?",
    answer:
      "Cada projeto é único e muito particular. Portanto é impossível precificar sem ter uma real noção do escopo. Os custos e o prazo para conclusão variam conforme a complexidade e abrangência do trabalho em questão. Para ter uma noção de prazo e valores, sugerimos que preencha o formulário de detalhamento de projeto sem compromisso.",
  },
]

export function FAQSection() {
  const [isOpen, setIsOpen] = useState<number>()

  function handleToggleAnswer(id: number) {
    if (isOpen === id) {
      return setIsOpen(0)
    }

    setIsOpen(id)
  }

  return (
    <FAQContainer id="FAQ">
      <div className="left-side">
        <SectionTitle heading="Dúvidas" span="FAQ" />
        <FAQQuestionsBox>
          {questionsAndAnswers.map((item) => {
            return (
              <QuestionAnswer
                key={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={isOpen === item.id}
                onClick={() => handleToggleAnswer(item.id)}
              />
            )
          })}
        </FAQQuestionsBox>
      </div>
    </FAQContainer>
  )
}
