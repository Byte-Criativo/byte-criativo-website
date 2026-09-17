import { SITE_NAME, SITE_URL } from "./metadata"

export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export function organization(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logoByte.png`,
    email: "contato@bcriativo.com",
    telephone: "+5583991253377",
    taxID: "52.652.130/0001-02",
    sameAs: [
      "https://instagram.com/bytecriativo",
      "https://www.linkedin.com/company/byte-criativo/",
    ],
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
