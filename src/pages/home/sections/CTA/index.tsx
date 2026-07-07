import { Button } from "@/src/components/Button"
import { ctaContent, sectionIds } from "@/src/content/home"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { CTAContainer, CTADescription, CTATitle, CTAWrapper } from "./styles"

export function CTASection() {
  return (
    <CTAWrapper id={sectionIds.contact}>
      <CTAContainer>
        <CTATitle>{ctaContent.title}</CTATitle>
        <CTADescription>{ctaContent.description}</CTADescription>
        <Button
          href={WHATSAPP_URL}
          target="_blank"
          onClick={() => trackWhatsAppClick("cta")}
        >
          {ctaContent.buttonLabel}
        </Button>
      </CTAContainer>
    </CTAWrapper>
  )
}
