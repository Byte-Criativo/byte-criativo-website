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
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  HOME_JSON_LD,
  HOME_URL,
  HOME_SEO_TITLE,
  OG_IMAGE_URL,
  ROBOTS_PROPS,
} from "@/src/lib/seo"

export default function Home() {
  return (
    <>
      <Head>
        {generateNextSeo({
          title: HOME_SEO_TITLE,
          description: DEFAULT_SEO_DESCRIPTION,
          canonical: HOME_URL,
          robotsProps: ROBOTS_PROPS,
          openGraph: {
            title: DEFAULT_SEO_TITLE,
            description: DEFAULT_SEO_DESCRIPTION,
            url: HOME_URL,
            images: [
              {
                url: OG_IMAGE_URL,
                width: 1200,
                height: 630,
                alt: "Byte Criativo - software sob medida",
                type: "image/png",
              },
            ],
          },
        })}
        <script
          key="home-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
        />
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
