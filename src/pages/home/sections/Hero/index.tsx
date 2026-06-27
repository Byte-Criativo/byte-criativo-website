import { Button } from "@/src/components/Button"
import { heroContent } from "@/src/content/home"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { HeroContainer, HeroHeading } from "./styles"
import Image from "next/image"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroHeading>
        <Image src="/byteSymbolLeft.svg" alt="" width={87} height={90} />
        <h1>
          {heroContent.heading}
          <span>{heroContent.highlight}</span>
        </h1>
        <Image src="/byteSymbolRight.svg" alt="" width={86} height={90} />
      </HeroHeading>
      <p>{heroContent.description}</p>
      <Button href={WHATSAPP_URL} target="_blank">
        {heroContent.ctaLabel}
      </Button>
    </HeroContainer>
  )
}
