import { ArrowDown } from "@phosphor-icons/react"
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
      <Question
        aria-expanded={isOpen}
        onClick={handleOnClick}
        type="button"
        $isOpen={isOpen}
      >
        <p>{question}</p>
        <ArrowDown size={28} />
      </Question>
      <Answer $isOpen={isOpen}>{answer}</Answer>
    </QuestionAnswerContainer>
  )
}
