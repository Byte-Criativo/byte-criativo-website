import { describe, expect, it } from "vitest"
import robots from "./robots"
import { SITE_URL } from "@/lib/seo/metadata"
import { CANONICAL_ORIGIN } from "../../e2e/contract/inventory"

describe("robots", () => {
  it("libera o site inteiro para todos os agentes", () => {
    const result = robots()
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" })
  })

  it("aponta para o sitemap na origem canônica", () => {
    expect(SITE_URL).toBe(CANONICAL_ORIGIN)
    expect(robots().sitemap).toBe(`${CANONICAL_ORIGIN}/sitemap.xml`)
  })
})
