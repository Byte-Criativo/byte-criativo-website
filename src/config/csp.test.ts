import { describe, expect, it } from "vitest"
import nextConfig from "../../next.config"

async function getContentSecurityPolicy(): Promise<string> {
  const headersFn = nextConfig.headers
  if (!headersFn) {
    throw new Error("next.config.ts não define headers()")
  }
  const rules = await headersFn()
  const rule = rules.find((r) => r.source === "/:path*")
  const header = rule?.headers?.find((h) => h.key === "Content-Security-Policy")
  if (!header) {
    throw new Error("Content-Security-Policy não encontrada em next.config.ts")
  }
  return header.value
}

function sourcesOf(csp: string): string[] {
  return csp
    .split(";")
    .map((directive) => directive.trim())
    .filter(Boolean)
    .flatMap((directive) => directive.split(/\s+/).slice(1))
}

describe("Content-Security-Policy (next.config.ts)", () => {
  it("inclui \"frame-ancestors 'none'\"", async () => {
    const csp = await getContentSecurityPolicy()
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it("não tem upgrade-insecure-requests (R46: quebra o WebKit em http://localhost/http://127.0.0.1 no e2e do CI)", async () => {
    const csp = await getContentSecurityPolicy()
    expect(csp).not.toContain("upgrade-insecure-requests")
  })

  it("nenhuma fonte é ou começa com http:, ws: ou é o coringa *", async () => {
    const csp = await getContentSecurityPolicy()
    const sources = sourcesOf(csp)
    expect(sources.length).toBeGreaterThan(0)
    for (const source of sources) {
      expect(source.startsWith("http:")).toBe(false)
      expect(source.startsWith("ws:")).toBe(false)
      expect(source).not.toBe("*")
    }
  })
})
