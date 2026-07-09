import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const html = readFileSync(".next/server/pages/index.html", "utf8")

function getAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}="([^"]+)"`))?.[1]
}

function getHeadTag(pattern) {
  const match = html.match(pattern)

  assert.ok(match, `Tag not found for pattern ${pattern}`)

  return match[0]
}

test("renderiza metadados SEO essenciais da home", () => {
  assert.match(
    html,
    /<html lang="pt-BR">/,
    "documento deve declarar idioma pt-BR",
  )

  assert.match(
    html,
    /<title data-next-head="">Software House, Sites e Sistemas Web Sob Medida \| Byte Criativo<\/title>/,
  )

  assert.match(
    html,
    /<meta name="description" content="A Byte Criativo cria sites, sistemas web, landing pages, UI\/UX e produtos digitais sob medida para empresas que querem vender mais e operar melhor\."/,
  )

  assert.equal(
    getAttribute(getHeadTag(/<link rel="canonical"[^>]+>/), "href"),
    "https://www.bytecriativotech.com.br/",
  )

  assert.equal(
    getAttribute(getHeadTag(/<meta name="robots"[^>]+>/), "content"),
    "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
  )
})

test("mantem Open Graph e Twitter Card prontos para compartilhamento", () => {
  assert.equal(
    getAttribute(getHeadTag(/<meta property="og:url"[^>]+>/), "content"),
    "https://www.bytecriativotech.com.br/",
  )

  assert.equal(
    getAttribute(getHeadTag(/<meta property="og:image"[^>]+>/), "content"),
    "https://www.bytecriativotech.com.br/og-image.png",
  )

  assert.equal(
    getAttribute(getHeadTag(/<meta name="twitter:card"[^>]+>/), "content"),
    "summary_large_image",
  )
})

test("inclui Google tag para mensuracao", () => {
  assert.match(
    html,
    /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-2W71B1J3SQ/,
  )
  assert.match(html, /gtag\('config', 'G-2W71B1J3SQ'\)/)
})

test("inclui JSON-LD valido para organizacao, pagina, site e FAQ", () => {
  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json" data-next-head="">(.+?)<\/script>/,
  )

  assert.ok(jsonLdMatch, "JSON-LD da home deve existir")

  const jsonLd = JSON.parse(jsonLdMatch[1])
  const graphTypes = jsonLd["@graph"].map((item) => item["@type"])

  assert.deepEqual(graphTypes, [
    "Organization",
    "WebSite",
    "WebPage",
    "FAQPage",
  ])

  const organization = jsonLd["@graph"].find(
    (item) => item["@type"] === "Organization",
  )
  const faq = jsonLd["@graph"].find((item) => item["@type"] === "FAQPage")

  assert.equal(organization.url, "https://www.bytecriativotech.com.br/")
  assert.equal(organization.email, "contato@bcriativo.com")
  assert.ok(organization.sameAs.includes("https://instagram.com/bytecriativo"))
  assert.ok(faq.mainEntity.length >= 4)
})

test("evita sinais que prejudicam indexacao ou contato", () => {
  assert.doesNotMatch(html, /noindex/)
  assert.doesNotMatch(html, /nofollow/)
  assert.doesNotMatch(html, /bytecriativotech\.com\.br\/\//)
  assert.doesNotMatch(html, /mailto:contato@bcriativo\.com/)
  assert.doesNotMatch(html, /team_photos|#team|Nosso Time/)
})
