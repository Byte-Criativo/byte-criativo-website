import { Header } from "@/src/components/Header"
import { HomeContainer, HomeContent } from "./styles"

import { HeroSection } from "./sections/Hero"
import { CardsSection } from "./sections/Cards"
import { CasesSection } from "./sections/Cases"
import { ServicesSection } from "./sections/Services"
import { CTASection } from "./sections/CTA"
import { FooterSection } from "./sections/Footer"
import { FAQSection } from "./sections/FAQ"
import Head from "next/head"
import { generateNextSeo } from "next-seo/pages"

export default function Home() {
  return (
    <>
      <Head>
        {generateNextSeo({
          title: "Byte Criativo | Software House",
          description:
            "Soluções inteligentes e personalizadas em uma software house. Isso é a ByteCriativo;",
        })}
      </Head>
      <HomeContainer>
        <Header />
        <HomeContent>
          <HeroSection />
          <CardsSection />
          <CasesSection />
          <ServicesSection />
          <FAQSection />
          <CTASection />
        </HomeContent>
        <FooterSection />
      </HomeContainer>
    </>
  )
}
