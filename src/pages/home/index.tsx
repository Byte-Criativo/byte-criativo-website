import { Header } from "@/src/components/Header"
import { HomeContainer, HomeContent } from "./styles"

import { HeroSection } from "./sections/Hero"
import { CardsSection } from "./sections/Cards"
import { CasesSection } from "./sections/Cases"
import { ServicesSection } from "./sections/Services"
import { CTASection } from "./sections/CTA"
import { FooterSection } from "./sections/Footer"
import { TeamSection } from "./sections/Team"

export default function Home() {
  return (
    <HomeContainer>
      <Header />
      <HomeContent>
        <HeroSection />
        <CardsSection />
        <CasesSection />
        <ServicesSection />
        <TeamSection />
        <div style={{ margin: "120px 0" }}>FAQ</div>
        <CTASection />
      </HomeContent>
      <FooterSection />
    </HomeContainer>
  )
}
