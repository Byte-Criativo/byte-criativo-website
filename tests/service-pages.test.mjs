import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

// As mensagens de WhatsApp são fixadas aqui (não importadas de
// src/content/services.ts) porque os testes .mjs deste arquivo rodam sobre
// o HTML já compilado em .next/, sem importar TypeScript. A duplicação com
// src/content/services.ts é aceitável: este teste protege o HTML
// efetivamente publicado, não a fonte de conteúdo.
const servicePages = [
  {
    slug: "desenvolvimento-de-sites",
    title: "Desenvolvimento de Sites Profissionais | Byte Criativo",
    h1: "Desenvolvimento de sites profissionais",
    whatsappMessage:
      "Olá! Vi a página de sites da Byte Criativo e quero conversar sobre um site para o meu negócio.",
  },
  {
    slug: "sistemas-web-sob-medida",
    title: "Sistemas Web Sob Medida | Byte Criativo",
    h1: "Sistemas web sob medida",
    whatsappMessage:
      "Olá! Vi a página de sistemas sob medida da Byte Criativo e quero conversar sobre um sistema para a minha operação.",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design para Sites e Sistemas | Byte Criativo",
    h1: "UI/UX Design para produtos digitais",
    whatsappMessage:
      "Olá! Vi a página de UI/UX da Byte Criativo e quero conversar sobre a interface de um produto.",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages para Captação de Leads | Byte Criativo",
    h1: "Landing pages para campanhas e lançamentos",
    whatsappMessage:
      "Olá! Vi a página de landing pages da Byte Criativo. Tenho uma campanha ou lançamento e quero conversar sobre uma página.",
  },
  {
    slug: "design-de-produto",
    title: "Design de Produto Digital | Byte Criativo",
    h1: "Design de produto digital",
    whatsappMessage:
      "Olá! Vi a página de design de produto da Byte Criativo e quero ajuda para definir o que construir primeiro.",
  },
  {
    slug: "copywriting-para-web",
    title: "Copywriting para Sites e Landing Pages | Byte Criativo",
    h1: "Copywriting para web",
    whatsappMessage:
      "Olá! Vi a página de textos para web da Byte Criativo e quero conversar sobre os textos do meu site.",
  },
  {
    slug: "automacao-e-integracoes",
    title: "Automação de Processos e Integração de Sistemas | Byte Criativo",
    h1: "Automação e integrações",
    whatsappMessage:
      "Olá! Vi a página de automações da Byte Criativo e quero conversar sobre conectar as ferramentas que uso.",
  },
]

const WHATSAPP_NUMBER = "5583991253377"

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
    const canonical = `https://www.bcriativo.com/servicos/${service.slug}`

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

test("paginas de servico linkam para o WhatsApp com a mensagem do conteudo", () => {
  for (const service of servicePages) {
    const html = readFileSync(
      `.next/server/pages/servicos/${service.slug}.html`,
      "utf8",
    )
    // React escapa "&" como "&amp;" em atributos HTML; nenhuma das mensagens
    // atuais contém "&", mas comparamos com a forma que realmente aparece no
    // build (href com aspas) em vez de só buscar a query string solta.
    const expectedHref = `href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.whatsappMessage)}"`

    assert.ok(
      html.includes(expectedHref),
      `${service.slug} deve linkar para o WhatsApp com a mensagem especifica do servico`,
    )
  }
})
