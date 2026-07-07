import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const servicePages = [
  {
    slug: "desenvolvimento-de-sites",
    title: "Desenvolvimento de Sites Profissionais | Byte Criativo",
    h1: "Desenvolvimento de sites profissionais",
  },
  {
    slug: "sistemas-web-sob-medida",
    title: "Sistemas Web Sob Medida | Byte Criativo",
    h1: "Sistemas web sob medida",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design para Sites e Sistemas | Byte Criativo",
    h1: "UI/UX Design para produtos digitais",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages para Captação de Leads | Byte Criativo",
    h1: "Landing pages para campanhas e lançamentos",
  },
  {
    slug: "design-de-produto",
    title: "Design de Produto Digital | Byte Criativo",
    h1: "Design de produto digital",
  },
  {
    slug: "copywriting-para-web",
    title: "Copywriting para Sites e Landing Pages | Byte Criativo",
    h1: "Copywriting para web",
  },
]

function getAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}="([^"]+)"`))?.[1]
}

function getHeadTag(html, pattern) {
  const match = html.match(pattern)

  assert.ok(match, `Tag not found for pattern ${pattern}`)

  return match[0]
}

test("renderiza paginas de servico com SEO e conteudo no HTML estatico", () => {
  for (const service of servicePages) {
    const html = readFileSync(
      `.next/server/pages/servicos/${service.slug}.html`,
      "utf8",
    )
    const canonical = `https://www.bytecriativotech.com.br/servicos/${service.slug}`

    assert.ok(
      html.includes(`<title data-next-head="">${service.title}</title>`),
      `${service.slug} deve renderizar title especifico`,
    )
    assert.equal(
      getAttribute(getHeadTag(html, /<link rel="canonical"[^>]+>/), "href"),
      canonical,
    )
    assert.ok(
      html.includes(`<h1>${service.h1}</h1>`),
      `${service.slug} deve renderizar H1 especifico`,
    )
    assert.match(
      html,
      /<script type="application\/ld\+json" data-next-head="">/,
    )
    assert.match(html, /"@type":"Service"/)
    assert.match(html, /"@type":"BreadcrumbList"/)
    assert.match(html, /"@type":"FAQPage"/)
  }
})

test("home aponta para todas as paginas de servico", () => {
  const html = readFileSync(".next/server/pages/index.html", "utf8")

  for (const service of servicePages) {
    assert.match(html, new RegExp(`href="/servicos/${service.slug}"`))
  }
})
