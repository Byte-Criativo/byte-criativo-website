import { Button } from "@/src/components/Button"
import { heroContent } from "@/src/content/home"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import { HeroActions, HeroContainer, HeroEyebrow, HeroHeading } from "./styles"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroEyebrow>{heroContent.eyebrow}</HeroEyebrow>
      <HeroHeading>
        <Image src="/byteSymbolLeft.svg" alt="" width={87} height={90} />
        <h1>
          {heroContent.heading}
          <span>{heroContent.highlight}</span>
        </h1>
        <Image src="/byteSymbolRight.svg" alt="" width={86} height={90} />
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
        <Link href={heroContent.secondaryCtaHref}>
          {heroContent.secondaryCtaLabel}
        </Link>
      </HeroActions>
    </HeroContainer>
  )
}
