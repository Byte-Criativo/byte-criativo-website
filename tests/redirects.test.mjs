import assert from "node:assert/strict"
import test from "node:test"
import nextConfig from "../next.config.mjs"

const expected = [
  ["/sites-profissionais", "/servicos/desenvolvimento-de-sites"],
  ["/sistemas-web", "/servicos/sistemas-web-sob-medida"],
  ["/landing-pages", "/servicos/landing-pages"],
  ["/automacao-e-integracoes", "/servicos/automacao-e-integracoes"],
]

test("redireciona páginas de serviço antigas com 301", async () => {
  const redirects = await nextConfig.redirects()

  for (const [source, destination] of expected) {
    const rule = redirects.find((r) => r.source === source)
    assert.ok(rule, `redirect de ${source} deve existir`)
    assert.equal(rule.destination, destination)
    assert.equal(rule.permanent, true)
  }
})
