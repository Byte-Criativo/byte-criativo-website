import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo/metadata"

// Equivalente ao robots.txt atual em produção (especificação 5.6): tudo
// liberado, com o sitemap na origem canônica.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
