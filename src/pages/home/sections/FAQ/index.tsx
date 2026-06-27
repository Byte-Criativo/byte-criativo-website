import { SectionTitle } from "@/src/components/SectionTitle"
import { faqSectionTitle, sectionIds } from "@/src/content/home"
import { FAQContainer, FAQQuestionsBox } from "./styles"
import { QuestionAnswer } from "@/src/components/QuestionAnswer"
import { useState } from "react"
import { questionsAndAnswers } from "@/src/content/faq"

export function FAQSection() {
  const [isOpen, setIsOpen] = useState<number>()

  function handleToggleAnswer(id: number) {
    if (isOpen === id) {
      return setIsOpen(0)
    }

    setIsOpen(id)
  }

  return (
    <FAQContainer id={sectionIds.faq}>
      <div className="left-side">
        <SectionTitle
          heading={faqSectionTitle.heading}
          span={faqSectionTitle.eyebrow}
        />
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
