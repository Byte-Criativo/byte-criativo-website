import { Button } from "@/src/components/Button"
import { heroContent } from "@/src/content/home"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import {
  HeroActions,
  HeroBackdrop,
  HeroContainer,
  HeroEyebrow,
  HeroHeading,
} from "./styles"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroBackdrop aria-hidden="true">;</HeroBackdrop>
      <HeroEyebrow>{heroContent.eyebrow}</HeroEyebrow>
      <HeroHeading>
        {heroContent.heading}
        <span>;</span>
      </HeroHeading>
      <p>{heroContent.description}</p>
      <HeroActions>
        <Button
          href={WHATSAPP_URL}
          target="_blank"
          onClick={() => trackWhatsAppClick("hero")}
        >
          {heroContent.ctaLabel}
        </Button>
        <Button href={heroContent.secondaryCtaHref} variant="ghost">
          {heroContent.secondaryCtaLabel}
        </Button>
      </HeroActions>
    </HeroContainer>
  )
}
