import { LeadForm } from "@/src/components/LeadForm"
import { ctaContent, sectionIds } from "@/src/content/home"
import { CTAContainer, CTADescription, CTATitle, CTAWrapper } from "./styles"

export function CTASection() {
  return (
    <CTAWrapper id={sectionIds.contact}>
      <CTAContainer>
        <CTATitle>{ctaContent.title}</CTATitle>
        <CTADescription>{ctaContent.description}</CTADescription>
        <LeadForm />
      </CTAContainer>
    </CTAWrapper>
  )
}
