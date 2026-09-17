import { AxeBuilder } from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

// Tags do contrato de acessibilidade da Fase 6: WCAG 2.0 e 2.1 nível A/AA,
// mais WCAG 2.2 AA (owasp/best-practice ficam fora de propósito, para não
// travar o CI com regras sem consenso).
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

test.describe("Acessibilidade", () => {
  test("home não tem violações axe serious/critical", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()

    const seriousOrCritical = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    )

    if (seriousOrCritical.length > 0) {
      const details = seriousOrCritical
        .map((violation) => {
          const selectors = violation.nodes
            .map((node) => node.target.join(" "))
            .join(", ")
          return `- ${violation.id} (${violation.impact}): ${selectors}`
        })
        .join("\n")
      throw new Error(`Violações axe serious/critical na home:\n${details}`)
    }

    expect(seriousOrCritical).toEqual([])
  })
})
