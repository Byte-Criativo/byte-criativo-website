import { Header } from "@/src/components/Header"
import { HomeContainer, HomeContent } from "./styles"

import { HeroSection } from "./sections/Hero"
import { CardsSection } from "./sections/Cards"
import { CasesSection } from "./sections/Cases"
import { ServicesSection } from "./sections/Services"
import { CTASection } from "./sections/CTA"
import { FooterSection } from "./sections/Footer"
import { TeamSection } from "./sections/Team"
import { FAQSection } from "./sections/FAQ"
import { NextSeo } from "next-seo"

export default function Home() {
  return (
    <>
      <NextSeo
        title="Byte Criativo | Software House"
        description="Soluções inteligentes e personalizadas em uma software house. Isso é a ByteCriativo;"
      />
      <HomeContainer>
        <Header />
        <HomeContent>
          <HeroSection />
          <CardsSection />
          <CasesSection />
          <ServicesSection />
          <TeamSection />
          <FAQSection />
          <CTASection />
        </HomeContent>
        <FooterSection />
      </HomeContainer>
    </>
  )
}
