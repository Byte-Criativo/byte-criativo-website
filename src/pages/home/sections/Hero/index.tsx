import { Button } from "@/src/components/Button"
import { HeroContainer, HeroHeading } from "./styles"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroHeading>
        <img src="/byteSymbolLeft.svg" alt="" />
        <h1>
          Soluções inteligentes e personalizadas em uma
          <span> software house</span>
        </h1>
        <img src="/byteSymbolRight.svg" alt="" />
      </HeroHeading>
      <p>
        Esqueça as soluções prontas. Descubra o que realmente impulsiona a sua
        empresa!
      </p>
      <Button href="mailto:contato@bcriativo.com">Comece seu projeto</Button>
    </HeroContainer>
  )
}
