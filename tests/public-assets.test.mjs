import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("robots.txt permite indexacao e aponta para o sitemap canonico", () => {
  const robots = readFileSync("public/robots.txt", "utf8")

  assert.match(robots, /User-agent: \*/)
  assert.match(robots, /Allow: \//)
  assert.match(
    robots,
    /Sitemap: https:\/\/www\.bytecriativotech\.com\.br\/sitemap\.xml/,
  )
})

test("sitemap.xml lista a URL canonica da home", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8")

  assert.match(
    sitemap,
    /<loc>https:\/\/www\.bytecriativotech\.com\.br\/<\/loc>/,
  )
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.bytecriativotech\.com\.br\/servicos\/desenvolvimento-de-sites<\/loc>/,
  )
  assert.match(
    sitemap,
    /<loc>https:\/\/www\.bytecriativotech\.com\.br\/servicos\/sistemas-web-sob-medida<\/loc>/,
  )
  assert.match(sitemap, /<priority>1\.0<\/priority>/)
})

test("imagem Open Graph tem dimensoes recomendadas", () => {
  const ogImage = readFileSync("public/og-image.png")

  assert.equal(ogImage.toString("ascii", 1, 4), "PNG")
  assert.equal(ogImage.readUInt32BE(16), 1200)
  assert.equal(ogImage.readUInt32BE(20), 630)
})
