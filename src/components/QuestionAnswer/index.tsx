import { useId } from "react"
import { ArrowDown } from "@phosphor-icons/react"
import {
  Answer,
  AnswerWrapper,
  QuestionAnswerContainer,
  Question,
} from "./styles"

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
  const id = useId()
  const questionId = `${id}-question`
  const answerId = `${id}-answer`

  return (
    <QuestionAnswerContainer>
      <Question
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onClick}
        type="button"
        $isOpen={isOpen}
      >
        <p>{question}</p>
        <ArrowDown size={28} aria-hidden />
      </Question>
      <AnswerWrapper
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        $isOpen={isOpen}
      >
        <Answer>{answer}</Answer>
      </AnswerWrapper>
    </QuestionAnswerContainer>
  )
}
