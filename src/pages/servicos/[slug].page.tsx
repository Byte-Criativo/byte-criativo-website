import { Header } from "@/src/components/Header"
import { Button } from "@/src/components/Button"
import { FooterSection } from "@/src/pages/home/sections/Footer"
import {
  buildWhatsAppUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  WHATSAPP_NUMBER,
} from "@/src/lib/contact"
import {
  DEFAULT_OG_IMAGES,
  HOME_URL,
  LOGO_URL,
  ROBOTS_PROPS,
  SITE_NAME,
  SITE_URL,
} from "@/src/lib/seo"
import {
  getServicePage,
  servicePages,
  type ServicePage,
} from "@/src/content/services"
import Head from "next/head"
import Link from "next/link"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import { generateNextSeo } from "next-seo/pages"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import {
  RelatedGrid,
  RelatedLink,
  ServiceCard,
  ServiceCta,
  ServiceGrid,
  ServiceHero,
  ServiceHeroActions,
  ServiceHeroMedia,
  ServiceIntro,
  ServiceMain,
  ServicePageContainer,
  ServiceProcessList,
  ServiceSection,
} from "./styles"
import Image from "next/image"

type ServicePageProps = {
  service: ServicePage
  relatedServices: Array<Pick<ServicePage, "slug" | "title" | "description">>
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: servicePages.map((service) => ({
    params: { slug: service.slug },
  })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<ServicePageProps> = ({
  params,
}) => {
  const slug = String(params?.slug ?? "")
  const service = getServicePage(slug)

  if (!service) {
    return { notFound: true }
  }

  return {
    props: {
      service: { ...service },
      relatedServices: servicePages
        .filter((item) => item.slug !== service.slug)
        .slice(0, 3)
        .map(({ slug, title, description }) => ({
          slug,
          title,
          description,
        })),
    },
  }
}

export default function ServicePage({
  service,
  relatedServices,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!service) {
    return null
  }

  const canonical = `${SITE_URL}/servicos/${service.slug}`
  const title = `${service.seoTitle} | ${SITE_NAME}`
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    `Olá! Gostaria de conversar sobre ${service.title.toLowerCase()} com a Byte Criativo.`,
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
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE_E164,
      },
      {
        "@type": "WebSite",
        "@id": `${HOME_URL}#website`,
        url: HOME_URL,
        name: SITE_NAME,
        inLanguage: "pt-BR",
        publisher: {
          "@id": `${HOME_URL}#organization`,
        },
      },
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: service.title,
        description: service.description,
        provider: {
          "@id": `${HOME_URL}#organization`,
        },
        areaServed: "BR",
        serviceType: service.title,
        url: canonical,
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        description: service.description,
        inLanguage: "pt-BR",
        isPartOf: {
          "@id": `${HOME_URL}#website`,
        },
        about: {
          "@id": `${canonical}#service`,
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
            name: "Serviços",
            item: `${HOME_URL}#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: canonical,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <>
      <Head>
        {generateNextSeo({
          title: service.seoTitle,
          description: service.description,
          canonical,
          robotsProps: ROBOTS_PROPS,
          openGraph: {
            title,
            description: service.description,
            url: canonical,
            images: DEFAULT_OG_IMAGES,
          },
        })}
        <script
          key={`${service.slug}-json-ld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <ServicePageContainer>
        <Header />
        <ServiceMain>
          <ServiceHero>
            <ServiceIntro>
              <span>{service.eyebrow}</span>
              <h1>{service.title}</h1>
              <p>{service.description}</p>
              <ServiceHeroActions>
                <Button
                  href={whatsappUrl}
                  target="_blank"
                  onClick={() => trackWhatsAppClick("service-page")}
                >
                  Falar sobre este serviço
                </Button>
                <Link href="/#services">Ver todos os serviços</Link>
              </ServiceHeroActions>
            </ServiceIntro>
            <ServiceHeroMedia aria-hidden="true">
              <Image src="/byteSymbolLeft.svg" alt="" width={87} height={90} />
              <Image src="/byteSymbolRight.svg" alt="" width={86} height={90} />
            </ServiceHeroMedia>
          </ServiceHero>

          <ServiceSection>
            <h2>Quando faz sentido contratar</h2>
            <ServiceGrid>
              {service.bestFor.map((item) => (
                <ServiceCard key={item}>{item}</ServiceCard>
              ))}
            </ServiceGrid>
          </ServiceSection>

          <ServiceSection>
            <h2>O que buscamos entregar</h2>
            <p>{service.promise}</p>
            <ServiceGrid>
              {service.outcomes.map((outcome) => (
                <ServiceCard key={outcome}>{outcome}</ServiceCard>
              ))}
            </ServiceGrid>
          </ServiceSection>

          <ServiceSection>
            <h2>Entregáveis comuns</h2>
            <ServiceGrid>
              {service.deliverables.map((deliverable) => (
                <ServiceCard key={deliverable}>{deliverable}</ServiceCard>
              ))}
            </ServiceGrid>
          </ServiceSection>

          <ServiceSection>
            <h2>Como conduzimos o projeto</h2>
            <ServiceProcessList>
              {service.process.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ServiceProcessList>
          </ServiceSection>

          <ServiceSection>
            <h2>Dúvidas frequentes</h2>
            <ServiceGrid>
              {service.faqs.map((faq) => (
                <ServiceCard key={faq.question}>
                  <strong>{faq.question}</strong>
                  <small>{faq.answer}</small>
                </ServiceCard>
              ))}
            </ServiceGrid>
          </ServiceSection>

          <ServiceCta>
            <h2>Quer entender se esse é o caminho certo?</h2>
            <p>
              Envie o contexto do seu projeto e a gente te ajuda a organizar
              prioridades, escopo inicial e próximos passos.
            </p>
            <Button
              href={whatsappUrl}
              target="_blank"
              onClick={() => trackWhatsAppClick("service-page")}
            >
              Conversar sobre meu projeto
            </Button>
          </ServiceCta>

          <ServiceSection>
            <h2>Outras formas de ajudar</h2>
            <RelatedGrid>
              {relatedServices.map((related) => (
                <RelatedLink
                  key={related.slug}
                  href={`/servicos/${related.slug}`}
                >
                  <strong>{related.title}</strong>
                  <span>{related.description}</span>
                </RelatedLink>
              ))}
            </RelatedGrid>
          </ServiceSection>
        </ServiceMain>
        <FooterSection />
      </ServicePageContainer>
    </>
  )
}
