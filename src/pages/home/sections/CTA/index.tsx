import { Button } from "@/src/components/Button"
import { WHATSAPP_URL } from "@/src/lib/contact"
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
        <Button href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          Enviar mensagem
        </Button>
      </CTAContainer>
    </CTAWrapper>
  )
}
