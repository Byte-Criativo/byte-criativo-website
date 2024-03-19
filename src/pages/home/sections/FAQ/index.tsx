import { SectionTitle } from "@/src/components/SectionTitle"
import { FAQContainer, FAQForm, FAQQuestionsBox } from "./styles"
import { QuestionAnswer } from "@/src/components/QuestionAnswer"
import { Button } from "@/src/components/Button"
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
      "Na era onde a tecnologia dita o ritmo dos negócios, nós estamos um passo à frente, criando web apps dinâmicos e intuitivos, desenvolvendo aplicativos mobile que se adaptam perfeitamente tanto a smartphones utilizando Android como iOS, e levando seu e-commerce não só para a existência, mas para a excelência, com uma gestão completa que eleva a experiência do usuário a outro patamar. Não está na web ainda? Deixe que nossos especialistas transformem seu conceito em um Produto Mínimo Viável (MVP) surpreendente, dando vida à sua visão e colocando-o no mapa em um mercado competitivo. E se você precisa de algo verdadeiramente único, nossa equipe está pronta para desenvolver softwares personalizados, feitos sob medida para as suas necessidades. Na Byte Criativo, não apenas construímos soluções; nós criamos experiências memoráveis que conectam, convertem e retêm. Sua ideia tem potencial. Nós temos a expertise para realizá-la. Vamos juntos?",
  },
  {
    id: 2,
    question: "Como se dá o processo de criação da Byte Criativo?",
    answer:
      "Examinamos as demandas, o planejamento, as necessidades e o escopo abrangente do projeto. Posteriormente, validamos esses aspectos para elaborar uma proposta orçamentária minuciosa. Com o orçamento aceito, redigimos um contrato detalhando o escopo do trabalho e o enviamos por e-mail para ser assinado. Durante o processo, estaremos ao seu lado, mantendo-o informado sobre o progresso, esclarecendo quaisquer dúvidas e assegurando que sua jornada ao desenvolver um projeto conosco seja excepcional. Conforme nos aproximamos da conclusão, celebramos o lançamento de mais um projeto de sucesso e continuamos a oferecer nosso apoio aos clientes, ajudando-os a crescer seus negócios.",
  },
  {
    id: 3,
    question:
      "Vocês fazem apenas o trabalho de desenvolvimento de software ou cuidam também do design?",
    answer:
      "Geralmente recomendamos que o desenvolvimento da aplicação web e seu design sejam centralizados de um ponto único. Refinamos nossa metodologia ao longo dos últimos anos para otimizar a colaboração entre nossos programadores e nossos criativos, visando uma entrega de trabalho altamente eficaz e satisfatória. Ainda que prefiramos estar engajados em cada fase do processo, também disponibilizamos serviços específicos de programação para projetos.",
  },
  {
    id: 4,
    question:
      "Qual o valor do investimento que terei que fazer e qual a duração de um projeto?",
    answer:
      "Cada projeto apresenta suas particularidades, impossibilitando uma estimativa genérica. Os custos e o prazo para conclusão variam conforme a complexidade e abrangência do trabalho em questão. Para uma avaliação precisa, sugerimos o preenchimento do nosso formulário de detalhamento do projeto, o que nos permite entender melhor suas exigências e fornecer um orçamento e estimativa de tempo mais precisos.",
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
      <FAQForm>
        <h3>Ainda com dúvida?</h3>
        <p>Mande uma mensagem pro nosso time</p>
        <div className="inputs">
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="E-mail" />
          <textarea placeholder="Mensagem" />
        </div>
        <Button href="mailto:oi@bytecriativo.com" className="button">
          Enviar
        </Button>
      </FAQForm>
    </FAQContainer>
  )
}
