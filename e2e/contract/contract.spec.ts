import { readFileSync } from "node:fs"
import { join } from "node:path"
import { expect, test } from "@playwright/test"
import {
  findLinkHref,
  findMetaContent,
  jsonLdBlocks,
  visibleText,
} from "./html"
import {
  LEGACY_REDIRECTS,
  PRESERVED_ROUTES,
  ROUTES_WITHOUT_JSON_LD,
  canonicalFor,
} from "./inventory"

const POMODORO_PRIVACIDADE_TEXT = readFileSync(
  join(__dirname, "fixtures", "pomodoro-privacidade.txt"),
  "utf-8",
).trim()

for (const route of PRESERVED_ROUTES) {
  test(`rota preservada ${route}: 200, canonical, título e descrição`, async ({
    request,
  }) => {
    const response = await request.get(route, { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(findLinkHref(html, "canonical")).toBe(canonicalFor(route))
    expect(html).toMatch(/<title[^>]*>[^<]{10,}<\/title>/)
    expect(findMetaContent(html, "description")?.length ?? 0).toBeGreaterThan(
      50,
    )
    expect(findMetaContent(html, "og:image")).toBeTruthy()
    expect(findMetaContent(html, "robots") ?? "").not.toMatch(/noindex/)
    const blocks = jsonLdBlocks(html)
    for (const block of blocks) {
      expect(block).toBeTruthy()
    }
    if (!ROUTES_WITHOUT_JSON_LD.includes(route)) {
      expect(blocks.length).toBeGreaterThan(0)
    }
  })
}

for (const { from, to } of LEGACY_REDIRECTS) {
  test(`redirect legado ${from} → ${to} em 1 salto`, async ({
    request,
    baseURL,
  }) => {
    const response = await request.get(from, { maxRedirects: 0 })
    expect([301, 308]).toContain(response.status())
    const location = response.headers()["location"]
    expect(location).toBeTruthy()
    const resolved = new URL(location, baseURL)
    expect(resolved.origin).toBe(new URL(baseURL as string).origin)
    expect(resolved.pathname).toBe(to)
    const destination = await request.get(to, { maxRedirects: 0 })
    expect(destination.status()).toBe(200)
  })
}

test("headers de segurança na home", async ({ request }) => {
  const response = await request.get("/")
  const headers = response.headers()
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'")
  expect(headers["strict-transport-security"]).toContain("max-age=")
  expect(headers["x-content-type-options"]).toBe("nosniff")
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin")
})

test("sitemap lista as rotas preservadas e todas respondem 200", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const xml = await response.text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  for (const route of PRESERVED_ROUTES) {
    expect(locs).toContain(canonicalFor(route))
  }
  for (const loc of locs) {
    const page = await request.get(new URL(loc).pathname, { maxRedirects: 0 })
    expect(page.status(), loc).toBe(200)
  }
})

test("robots aponta para o sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt")
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain(
    "Sitemap: https://www.bcriativo.com/sitemap.xml",
  )
})

test("política do Pomodoro preservada", async ({ request }) => {
  const response = await request.get("/pomodoro/privacidade")
  const html = await response.text()
  const h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)
  expect(visibleText(h1Match?.[1] ?? "")).toBe("Política de Privacidade")
  expect(html).toMatch(
    /<title[^>]*>Política de Privacidade do Pomodoro \| Byte Criativo<\/title>/,
  )
  expect(visibleText(html)).toContain(POMODORO_PRIVACIDADE_TEXT)
})

test("organização com CNPJ no JSON-LD da home", async ({ request }) => {
  const html = await (await request.get("/")).text()
  const serialized = JSON.stringify(jsonLdBlocks(html))
  expect(serialized).toContain("52.652.130/0001-02")
  expect(serialized).toContain("https://www.bcriativo.com/#organization")
})

test("rota inexistente responde 404", async ({ request }) => {
  const response = await request.get("/rota-que-nao-existe-contrato", {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(404)
})
