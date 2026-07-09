import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import nextConfig from "../next.config.mjs"

const html = readFileSync(".next/server/pages/index.html", "utf8")

test("configura headers de seguranca para todas as rotas", async () => {
  assert.equal(typeof nextConfig.headers, "function")

  const headerRules = await nextConfig.headers()
  const globalRule = headerRules.find((rule) => rule.source === "/:path*")
  const headers = Object.fromEntries(
    globalRule.headers.map(({ key, value }) => [key, value]),
  )

  assert.match(headers["Content-Security-Policy"], /default-src 'self'/)
  assert.match(headers["Content-Security-Policy"], /object-src 'none'/)
  assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/)
  assert.match(
    headers["Content-Security-Policy"],
    /script-src[^;]+https:\/\/www\.googletagmanager\.com/,
  )
  assert.match(
    headers["Content-Security-Policy"],
    /connect-src[^;]+https:\/\/www\.google-analytics\.com/,
  )
  assert.match(headers["Content-Security-Policy"], /upgrade-insecure-requests/)
  assert.equal(headers["X-Content-Type-Options"], "nosniff")
  assert.equal(headers["X-Frame-Options"], "DENY")
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin")
  assert.match(headers["Permissions-Policy"], /camera=\(\)/)
  assert.match(headers["Strict-Transport-Security"], /max-age=63072000/)
})

test("links em nova aba carregam protecao contra tabnabbing", () => {
  const blankAnchors = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []

  assert.ok(blankAnchors.length > 0, "deve haver links externos em nova aba")

  for (const anchor of blankAnchors) {
    const rel = anchor.match(/rel="([^"]+)"/)?.[1] ?? ""

    assert.match(rel, /\bnoopener\b/, anchor)
    assert.match(rel, /\bnoreferrer\b/, anchor)
  }
})
