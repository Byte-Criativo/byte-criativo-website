import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const pages = [
  ".next/server/pages/index.html",
  ".next/server/pages/portfolio.html",
  ".next/server/pages/servicos/desenvolvimento-de-sites.html",
]

test("HTML estático contém estilos SSR do styled-components", () => {
  for (const page of pages) {
    const html = readFileSync(page, "utf8")
    assert.match(
      html,
      /<style[^>]*data-styled/,
      `${page} deve conter <style data-styled> (sem isso o site renderiza sem CSS)`,
    )
  }
})
