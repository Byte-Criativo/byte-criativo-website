import { ArrowDown, ArrowUp } from "@phosphor-icons/react"
import { Answer, QuestionAnswerContainer, Question } from "./styles"

interface QuestionAnswerProps {
  question: string
  answer: string
  isOpen?: boolean
  onClick: () => void
}

export function QuestionAnswer({
  isOpen = false,
  question,
  answer,
  onClick,
}: QuestionAnswerProps) {
  function handleOnClick() {
    onClick()
  }

  return (
    <QuestionAnswerContainer>
      <Question onClick={handleOnClick}>
        <p>{question}</p>
        {isOpen ? <ArrowUp size={32} /> : <ArrowDown size={32} />}
      </Question>
      {isOpen && <Answer>{answer}</Answer>}
    </QuestionAnswerContainer>
  )
}
