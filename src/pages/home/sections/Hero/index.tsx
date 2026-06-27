import { Button } from "@/src/components/Button"
import { HeroContainer, HeroHeading } from "./styles"
import Image from "next/image"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroHeading>
        <Image src="/byteSymbolLeft.svg" alt="" width={87} height={90} />
        <h1>
          Soluções inteligentes e personalizadas em uma
          <span> software house</span>
        </h1>
        <Image src="/byteSymbolRight.svg" alt="" width={86} height={90} />
      </HeroHeading>
      <p>
        Esqueça as soluções prontas. Descubra o que realmente impulsiona a sua
        empresa!
      </p>
      <Button href="mailto:contato@bcriativo.com">Comece seu projeto</Button>
    </HeroContainer>
  )
}
