import { SectionTitle } from "@/src/components/SectionTitle"
import { FAQContainer, FAQForm, FAQQuestionsBox } from "./styles"
import { QuestionAnswer } from "@/src/components/QuestionAnswer"
import { Button } from "@/src/components/Button"

export function FAQSection() {
  return (
    <FAQContainer>
      <div className="left-side">
        <SectionTitle heading="Dúvidas" span="FAQ" />
        <FAQQuestionsBox>
          <QuestionAnswer
            question="Lorem ipsum dolor sit amet, consectetur?"
            answer="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con at cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim venia."
          />
          <QuestionAnswer
            question="Lorem ipsum dolor sit amet, consectetur?"
            answer="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con at cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim venia."
          />
          <QuestionAnswer
            question="Lorem ipsum dolor sit amet, consectetur?"
            answer="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con at cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim venia."
          />
          <QuestionAnswer
            question="Lorem ipsum dolor sit amet, consectetur?"
            answer="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con at cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es Ut enim ad minim venia."
          />
        </FAQQuestionsBox>
      </div>
      <FAQForm>
        <h3>Lorem ipsum dolor</h3>
        <div className="inputs">
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="E-mail" />
          <textarea placeholder="Mensagem" />
        </div>
        <Button className="button">Enviar</Button>
      </FAQForm>
    </FAQContainer>
  )
}
