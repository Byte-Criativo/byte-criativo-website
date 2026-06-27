import { Button } from "@/src/components/Button"
import { CTAContainer, CTADescription, CTATitle, CTAWrapper } from "./styles"

export function CTASection() {
  return (
    <CTAWrapper id="contact">
      <CTAContainer>
        <CTATitle>Vamos transformar sua ideia em produto?</CTATitle>
        <CTADescription>
          Conte o que você precisa. A gente te ajuda a desenhar o melhor caminho
          para tirar sua solução do papel.
        </CTADescription>
        <Button href="mailto:contato@bcriativo.com">Enviar e-mail</Button>
      </CTAContainer>
    </CTAWrapper>
  )
}
