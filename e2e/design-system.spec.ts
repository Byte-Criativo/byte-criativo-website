import { AxeBuilder } from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

async function violacoesGraves(page: import("@playwright/test").Page) {
  const resultados = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
  return resultados.violations.filter(
    (violacao) =>
      violacao.impact === "serious" || violacao.impact === "critical",
  )
}

test.describe("Catálogo de componentes", () => {
  test("não tem violações axe serious/critical em 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/design-system")

    const graves = await violacoesGraves(page)
    expect(
      graves.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([])
  })

  test("não tem violações axe serious/critical em 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/design-system")

    const graves = await violacoesGraves(page)
    expect(
      graves.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([])
  })

  test("com o menu aberto também não há violação grave", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/design-system")
    await page.getByRole("button", { name: "Menu" }).click()
    await expect(page.getByRole("dialog")).toBeVisible()

    const graves = await violacoesGraves(page)
    expect(
      graves.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([])
  })
})
