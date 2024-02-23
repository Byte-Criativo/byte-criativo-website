import { Button } from "@/src/components/Button";
import { HeroContainer, HeroHeading } from "./styles";

export function HeroSection() {
  return (
    <HeroContainer>
          <HeroHeading>
            <img src="/byteSymbolLeft.svg" alt="" />
            <h1>
              Lorem ipsum <span>sit dolor</span> epte sit amet, ectetur elit
            </h1>
            <img src="/byteSymbolRight.svg" alt="" />
          </HeroHeading>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut dolor sit
          </p>
          <Button>Começar Projeto</Button>
      </HeroContainer>
  )
}