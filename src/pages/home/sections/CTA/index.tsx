import { Button } from "@/src/components/Button"
import { CTAContainer, CTATitle } from "./styles"

export function CTASection() {
  return (
    <div id="contact" style={{ paddingTop: "7.5rem" }}>
      <CTAContainer>
        <CTATitle>Vamos começar o projeto?</CTATitle>
        <Button>Enviar Email</Button>
      </CTAContainer>
    </div>
  )
}
