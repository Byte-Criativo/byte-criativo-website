import { ArrowDown, ArrowUp } from "@phosphor-icons/react"
import { Answer, QuestionAnswerContainer, Question } from "./styles"
import { useState } from "react"

interface QuestionAnswerProps {
  question: string
  answer: string
}

export function QuestionAnswer({ question, answer }: QuestionAnswerProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleToggleAnswer() {
    setIsOpen(!isOpen)
  }

  return (
    <QuestionAnswerContainer>
      <Question onClick={handleToggleAnswer}>
        <p>{question}</p>
        {isOpen ? <ArrowUp size={32} /> : <ArrowDown size={32} />}
      </Question>
      {isOpen && <Answer>{answer}</Answer>}
    </QuestionAnswerContainer>
  )
}
