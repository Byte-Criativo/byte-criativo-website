import { Header } from "@/src/components/Header"
import { HeroHeading, HeroSection, HomeContainer, HomeContent } from "./styles"
import { Button } from "@/src/components/Button"

export default function Home() {
  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <HeroSection>
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
        </HeroSection>
      </HomeContent>
    </HomeContainer>
  )
}
