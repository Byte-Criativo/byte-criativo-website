import { CONTACT_EMAIL, CONTACT_PHONE_E164 } from "@/lib/contact"
import { SITE_NAME, SITE_URL } from "./metadata"

export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export function organization(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logoByte.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    taxID: "52.652.130/0001-02",
    sameAs: [
      "https://instagram.com/bytecriativo",
      "https://www.linkedin.com/company/byte-criativo/",
    ],
  }
}

export const WEBSITE_ID = `${SITE_URL}/#website`

export function webSite(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "pt-BR",
  }
}

export function webPage({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}): Record<string, unknown> {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "pt-BR",
  }
}

export function serviceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string
  description: string
  path: string
  serviceType?: string
}): Record<string, unknown> {
  const url = `${SITE_URL}${path}`
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: { "@id": ORGANIZATION_ID },
    serviceType: serviceType ?? name,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  }
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function breadcrumbsJsonLd(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildJsonLdGraph(
  nodes: Array<Record<string, unknown>>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
