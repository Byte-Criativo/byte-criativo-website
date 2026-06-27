import { Button } from "@/src/components/Button"
import { CTAContainer, CTATitle, CTAWrapper } from "./styles"

export function CTASection() {
  return (
    <CTAWrapper id="contact">
      <CTAContainer>
        <CTATitle>Vamos começar seu projeto?</CTATitle>
        <Button href="mailto:contato@bcriativo.com">Enviar e-mail</Button>
      </CTAContainer>
    </CTAWrapper>
  )
}
