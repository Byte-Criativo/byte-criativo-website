import { Header } from "@/src/components/Header"
import { HomeContainer, HomeContent } from "./styles"
import { SectionTitle } from "@/src/components/SectionTitle"
import { Link } from "@/src/components/Link"

import ArrowIcon from "@/src/assets/icons/ArrowLink.svg"
import { HeroSection } from "./sections/Hero"
import { CardsSection } from "./sections/Cards"
import { CasesSection } from "./sections/Cases"
import { ServicesSection } from "./sections/Services"
import { CTASection } from "./sections/CTA"
import { FooterSection } from "./sections/Footer"

export default function Home() {
  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <HeroSection />
        <CardsSection />
        <CasesSection />
        <ServicesSection />
        <div>Nosso time</div>
        <div style={{ margin: '120px 0'}}>FAQ</div>
        <CTASection />
      </HomeContent>
      <FooterSection />
    </HomeContainer>
  )
}
