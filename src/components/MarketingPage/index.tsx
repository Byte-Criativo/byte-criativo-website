import Head from "next/head"
import Image from "next/image"
import { generateNextSeo } from "next-seo/pages"
import { Header } from "@/src/components/Header"
import { Button } from "@/src/components/Button"
import { FooterSection } from "@/src/pages/home/sections/Footer"
import type { MarketingPageContent } from "@/src/content/pages"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import { getSafeRel } from "@/src/lib/link-security"
import {
  DEFAULT_OG_IMAGES,
  HOME_URL,
  LOGO_URL,
  ROBOTS_PROPS,
  SITE_NAME,
  SITE_URL,
} from "@/src/lib/seo"
import {
  CardGrid,
  CardImage,
  CardLink,
  FinalCta,
  HeroActions,
  HeroContent,
  HeroPanel,
  OrderedList,
  PageCard,
  PageContainer,
  PageHero,
  PageMain,
  PageSection,
  SecondaryLink,
  TagList,
} from "./styles"

type MarketingPageProps = {
  page: MarketingPageContent
}

function isExternalUrl(href: string) {
  return href.startsWith("http")
}

export function MarketingPage({ page }: MarketingPageProps) {
  const canonical = `${SITE_URL}${page.route}`
  const title = `${page.seoTitle} | ${SITE_NAME}`
  const whatsappUrl =
    page.primaryCtaHref ??
    buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      `Olá! Gostaria de conversar sobre ${page.title.toLowerCase()} com a Byte Criativo.`,
    )

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${HOME_URL}#organization`,
        name: SITE_NAME,
        url: HOME_URL,
        logo: LOGO_URL,
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description: page.description,
        inLanguage: "pt-BR",
        isPartOf: {
          "@id": `${HOME_URL}#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: HOME_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: canonical,
          },
        ],
      },
    ],
  }

  return (
    <>
      <Head>
        {generateNextSeo({
          title: page.seoTitle,
          description: page.description,
          canonical,
          robotsProps: ROBOTS_PROPS,
          openGraph: {
            title,
            description: page.description,
            url: canonical,
            images: DEFAULT_OG_IMAGES,
          },
        })}
        <script
          key={`${page.route}-json-ld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <PageContainer>
        <Header />
        <PageMain>
          <PageHero>
            <HeroContent>
              <span>{page.eyebrow}</span>
              <h1>{page.heroTitle}</h1>
              <p>{page.heroDescription}</p>
              <HeroActions>
                <Button
                  href={whatsappUrl}
                  target={whatsappUrl.startsWith("http") ? "_blank" : undefined}
                  onClick={() => trackWhatsAppClick("cta")}
                >
                  {page.primaryCtaLabel}
                </Button>
                {page.secondaryCtaHref && page.secondaryCtaLabel ? (
                  <SecondaryLink href={page.secondaryCtaHref}>
                    {page.secondaryCtaLabel}
                  </SecondaryLink>
                ) : null}
              </HeroActions>
            </HeroContent>
            <HeroPanel aria-label="Resumo da página">
              <strong>{page.title}</strong>
              <p>{page.description}</p>
            </HeroPanel>
          </PageHero>

          {page.sections.map((section) => (
            <PageSection key={section.title}>
              {section.eyebrow ? <span>{section.eyebrow}</span> : null}
              <h2>{section.title}</h2>
              {section.description ? <p>{section.description}</p> : null}

              {section.cards ? (
                <CardGrid>
                  {section.cards.map((card) => (
                    <PageCard key={card.title}>
                      {card.imageSrc && card.imageAlt ? (
                        <CardImage>
                          <Image
                            src={card.imageSrc}
                            alt={card.imageAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                          />
                        </CardImage>
                      ) : null}
                      {card.meta ? <small>{card.meta}</small> : null}
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      {card.tags ? (
                        <TagList
                          aria-label={`Tecnologias e categorias de ${card.title}`}
                        >
                          {card.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </TagList>
                      ) : null}
                      {card.href && card.ctaLabel ? (
                        <CardLink
                          href={card.href}
                          target={
                            isExternalUrl(card.href) ? "_blank" : undefined
                          }
                          rel={getSafeRel(
                            isExternalUrl(card.href) ? "_blank" : undefined,
                          )}
                        >
                          {card.ctaLabel}
                        </CardLink>
                      ) : card.ctaLabel ? (
                        <small>{card.ctaLabel}</small>
                      ) : null}
                    </PageCard>
                  ))}
                </CardGrid>
              ) : null}

              {section.orderedItems ? (
                <OrderedList>
                  {section.orderedItems.map((item, index) => (
                    <li key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </OrderedList>
              ) : null}
            </PageSection>
          ))}

          <FinalCta>
            <h2>{page.finalCta.title}</h2>
            <p>{page.finalCta.description}</p>
            <Button
              href={whatsappUrl}
              target={whatsappUrl.startsWith("http") ? "_blank" : undefined}
              onClick={() => trackWhatsAppClick("cta")}
            >
              {page.finalCta.buttonLabel}
            </Button>
          </FinalCta>
        </PageMain>
        <FooterSection />
      </PageContainer>
    </>
  )
}
