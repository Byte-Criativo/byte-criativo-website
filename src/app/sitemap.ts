import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo/metadata"
import { publishedCaseEntries } from "@/content/cases"

// Data da copy v1 aprovada (2026-09), a mesma do `lastUpdated` da política de
// privacidade. A especificação 5.6 prevê `lastModified` derivado do campo
// `updatedAt` do conteúdo; como as páginas de Fase 8 ainda não carregam esse
// campo (só os cases têm `updatedAt`), a data fica centralizada aqui até o
// conteúdo ganhar `updatedAt` por página.
export const CONTENT_UPDATED_AT = "2026-09-16"

// Todas as rotas públicas indexáveis do site. `/contato/obrigado` fica fora de
// propósito: tem `robots: { index: false }` (especificação 5.6). As rotas de
// case (`/portfolio/[slug]`) não ficam aqui: entram via caseSitemapEntries a
// partir dos slugs publicados.
export const SITEMAP_PATHS = [
  "/",
  "/sobre",
  "/servicos",
  "/servicos/desenvolvimento-de-sites",
  "/servicos/sistemas-web-sob-medida",
  "/servicos/ui-ux-design",
  "/servicos/landing-pages",
  "/servicos/design-de-produto",
  "/servicos/copywriting-para-web",
  "/servicos/automacao-e-integracoes",
  "/portfolio",
  "/contato",
  "/processo",
  "/privacidade",
  "/pomodoro/privacidade",
] as const

// Função pura: uma rota de case por slug publicado recebido, com
// `lastModified` do `updatedAt` do case (especificação 5.6). O chamador
// decide quais slugs entram — em produção é `publishedCaseEntries`, que hoje
// é vazio (todos os cases em "review", gate D5).
export function caseSitemapEntries(
  cases: ReadonlyArray<{ slug: string; updatedAt: string }>,
): MetadataRoute.Sitemap {
  return cases.map((estudo) => ({
    url: `${SITE_URL}/portfolio/${estudo.slug}`,
    lastModified: estudo.updatedAt,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...SITEMAP_PATHS.map((path) => ({
      url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
      lastModified: CONTENT_UPDATED_AT,
    })),
    ...caseSitemapEntries(publishedCaseEntries),
  ]
}
