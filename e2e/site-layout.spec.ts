import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Layout do site (landmarks e acessibilidade)", () => {
  test("renderiza banner, main e contentinfo", async ({ page }) => {
    await page.goto("/")

    const banner = page.getByRole("banner")
    await expect(banner).toBeVisible()

    // No celular a navegação desktop existe no HTML, mas fica oculta por CSS.
    const navPrincipal = banner.locator('nav[aria-label="Principal"]').first()
    await expect(navPrincipal).toBeAttached()

    const main = page.locator("main#conteudo")
    await expect(main).toBeAttached()

    const footer = page.getByRole("contentinfo")
    await expect(footer).toBeVisible()

    const navRodape = footer.locator("#navegacao-rodape")
    await expect(navRodape).toBeVisible()
  })

  test("skip link ganha foco com Tab e aponta para #conteudo", async ({
    page,
  }) => {
    await page.goto("/")
    await page.keyboard.press("Tab")

    const skipLink = page.getByRole("link", {
      name: "Pular para o conteúdo",
    })
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveAttribute("href", "#conteudo")
  })

  test("não tem violações axe serious/critical em 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")

    const resultados = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()

    const graves = resultados.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    )
    expect(graves).toEqual([])
  })

  test("não tem violações axe serious/critical em 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    const resultados = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()

    const graves = resultados.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    )
    expect(graves).toEqual([])
  })
})
