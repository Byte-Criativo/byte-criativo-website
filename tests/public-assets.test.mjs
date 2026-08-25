import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("robots.txt permite indexacao e aponta para o sitemap canonico", () => {
  const robots = readFileSync("public/robots.txt", "utf8")

  assert.match(robots, /User-agent: \*/)
  assert.match(robots, /Allow: \//)
  assert.match(robots, /Sitemap: https:\/\/www\.bcriativo\.com\/sitemap\.xml/)
})

test("sitemap.xml lista a URL canonica da home", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8")

  assert.match(sitemap, /<loc>https:\/\/www\.bcriativo\.com\/<\/loc>/)
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/servicos\/desenvolvimento-de-sites<\/loc>/,
  )
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/servicos\/sistemas-web-sob-medida<\/loc>/,
  )
  assert.match(sitemap, /<priority>1\.0<\/priority>/)
})

test("sitemap.xml contem exatamente as 12 URLs finais do site", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8")

  const expectedLocs = [
    "https://www.bcriativo.com/",
    "https://www.bcriativo.com/sobre",
    "https://www.bcriativo.com/servicos",
    "https://www.bcriativo.com/portfolio",
    "https://www.bcriativo.com/contato",
    "https://www.bcriativo.com/servicos/desenvolvimento-de-sites",
    "https://www.bcriativo.com/servicos/sistemas-web-sob-medida",
    "https://www.bcriativo.com/servicos/ui-ux-design",
    "https://www.bcriativo.com/servicos/landing-pages",
    "https://www.bcriativo.com/servicos/design-de-produto",
    "https://www.bcriativo.com/servicos/copywriting-para-web",
    "https://www.bcriativo.com/servicos/automacao-e-integracoes",
  ]

  const actualLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  )

  assert.deepEqual(
    actualLocs.sort(),
    [...expectedLocs].sort(),
    "sitemap deve conter exatamente as 12 URLs finais, nem mais nem menos",
  )

  for (const loc of expectedLocs) {
    assert.match(sitemap, new RegExp(`<lastmod>2026-08-25</lastmod>`))
    const urlBlockPattern = new RegExp(
      `<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>\\s*<lastmod>2026-08-25</lastmod>`,
    )
    assert.match(sitemap, urlBlockPattern, `${loc} deve ter lastmod 2026-08-25`)
  }
})

test("sitemap.xml nao contem mais as rotas antigas de servico nem o blog", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8")

  // As regexes fixam o dominio logo antes do path (sem "/servicos/" no meio)
  // para não colidir com os locs válidos aninhados que compartilham o mesmo
  // slug, como .../servicos/landing-pages e .../servicos/automacao-e-integracoes.
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/sites-profissionais<\/loc>/,
  )
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/sistemas-web<\/loc>/,
  )
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/landing-pages<\/loc>/,
  )
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/automacao-e-integracoes<\/loc>/,
  )
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/www\.bcriativo\.com\/blog<\/loc>/,
  )
})

test("imagem Open Graph tem dimensoes recomendadas", () => {
  const ogImage = readFileSync("public/og-image.png")

  assert.equal(ogImage.toString("ascii", 1, 4), "PNG")
  assert.equal(ogImage.readUInt32BE(16), 1200)
  assert.equal(ogImage.readUInt32BE(20), 630)
})
