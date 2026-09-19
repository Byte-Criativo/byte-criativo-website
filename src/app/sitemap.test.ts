import { describe, expect, it } from "vitest"
import sitemap, { CONTENT_UPDATED_AT, SITEMAP_PATHS } from "./sitemap"
import { SITE_URL } from "@/lib/seo/metadata"
import { PRESERVED_ROUTES, canonicalFor } from "../../e2e/contract/inventory"

const NEW_PUBLIC_ROUTES = ["/processo", "/privacidade"] as const

describe("sitemap", () => {
  it("cobre todas as rotas preservadas do contrato", () => {
    for (const route of PRESERVED_ROUTES) {
      expect(SITEMAP_PATHS).toContain(route)
    }
  })

  it("cobre as rotas públicas novas do redesign", () => {
    for (const route of NEW_PUBLIC_ROUTES) {
      expect(SITEMAP_PATHS).toContain(route)
    }
  })

  it("não inclui /contato/obrigado (robots noindex, especificação 5.6)", () => {
    expect(SITEMAP_PATHS).not.toContain("/contato/obrigado")
    const urls = sitemap().map((entry) => entry.url)
    expect(urls.some((url) => url.includes("/contato/obrigado"))).toBe(false)
  })

  it("emite uma entrada por rota, sem duplicatas", () => {
    const entries = sitemap()
    expect(entries).toHaveLength(SITEMAP_PATHS.length)
    const urls = entries.map((entry) => entry.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("usa a origem canônica em todas as URLs", () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true)
    }
    for (const path of SITEMAP_PATHS) {
      expect(sitemap().map((entry) => entry.url)).toContain(canonicalFor(path))
    }
  })

  it("a home usa a raiz com barra final", () => {
    const home = sitemap().find((entry) => entry.url === `${SITE_URL}/`)
    expect(home).toBeDefined()
  })

  it("todas as entradas têm lastModified da copy v1", () => {
    for (const entry of sitemap()) {
      expect(entry.lastModified).toBe(CONTENT_UPDATED_AT)
    }
  })
})
