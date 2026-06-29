import { questionsAndAnswers } from "@/src/content/faq"
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "@/src/lib/contact"

export const SITE_URL = "https://www.bytecriativotech.com.br"
export const HOME_URL = `${SITE_URL}/`
export const SITE_NAME = "Byte Criativo"
export const HOME_SEO_TITLE = "Software House e Produtos Digitais Sob Medida"
export const DEFAULT_SEO_TITLE = `${HOME_SEO_TITLE} | ${SITE_NAME}`
export const DEFAULT_SEO_DESCRIPTION =
  "Software house que cria sites, sistemas web, back-end, UI/UX e produtos digitais sob medida para empresas que querem crescer com tecnologia."
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`
export const DEFAULT_OG_IMAGES = [
  {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: "Byte Criativo - software sob medida",
    type: "image/png",
  },
]
export const LOGO_URL = `${SITE_URL}/logoByte.png`
export const ROBOTS_PROPS = {
  maxSnippet: -1,
  maxImagePreview: "large" as const,
  maxVideoPreview: -1,
}

export const SOCIAL_LINKS = [INSTAGRAM_URL, LINKEDIN_URL]

export const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${HOME_URL}#organization`,
      name: SITE_NAME,
      legalName: SITE_NAME,
      taxID: "52.652.130/0001-02",
      url: HOME_URL,
      logo: LOGO_URL,
      image: OG_IMAGE_URL,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE_E164,
      sameAs: SOCIAL_LINKS,
      description: DEFAULT_SEO_DESCRIPTION,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: CONTACT_PHONE_E164,
          email: CONTACT_EMAIL,
          areaServed: "BR",
          availableLanguage: ["pt-BR", "Portuguese"],
        },
      ],
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
      "@type": "WebPage",
      "@id": `${HOME_URL}#webpage`,
      url: HOME_URL,
      name: DEFAULT_SEO_TITLE,
      description: DEFAULT_SEO_DESCRIPTION,
      inLanguage: "pt-BR",
      isPartOf: {
        "@id": `${HOME_URL}#website`,
      },
      about: {
        "@id": `${HOME_URL}#organization`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${HOME_URL}#faq`,
      mainEntity: questionsAndAnswers.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    },
  ],
}
