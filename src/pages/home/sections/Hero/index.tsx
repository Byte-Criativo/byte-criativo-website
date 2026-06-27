import { Button } from "@/src/components/Button"
import { HeroContainer, HeroHeading } from "./styles"
import Image from "next/image"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroHeading>
        <Image src="/byteSymbolLeft.svg" alt="" width={87} height={90} />
        <h1>
          Software sob medida para marcas que querem
          <span> crescer com tecnologia</span>
        </h1>
        <Image src="/byteSymbolRight.svg" alt="" width={86} height={90} />
      </HeroHeading>
      <p>
        Unimos estratégia, design e desenvolvimento para criar produtos digitais
        elegantes, rápidos e preparados para evoluir com a sua empresa.
      </p>
      <Button href="mailto:contato@bcriativo.com">Comece seu projeto</Button>
    </HeroContainer>
  )
}
