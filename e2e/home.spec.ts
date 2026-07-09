import { test, expect } from "@playwright/test"

test.describe("Home", () => {
  test("navegação principal abre a página de serviços", async ({ page }) => {
    await page.goto("/")
    await page.locator("header").getByRole("link", { name: "Serviços" }).click()
    await expect(page).toHaveURL(/\/servicos$/)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /sites, sistemas e soluções digitais/i,
      }),
    ).toBeVisible()
  })

  test("FAQ abre a resposta ao clicar na pergunta", async ({ page }) => {
    await page.goto("/")
    const question = page.getByRole("button", { name: /Quais os trabalhos/ })
    await expect(question).toHaveAttribute("aria-expanded", "false")
    await question.click()
    await expect(question).toHaveAttribute("aria-expanded", "true")
    const answerId = await question.getAttribute("aria-controls")
    await expect(page.locator(`#${answerId}`)).toContainText(/web apps/i)
  })

  test("menu mobile abre e mostra os itens de navegação", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await expect(
      page.locator("header").getByRole("link", { name: "Serviços" }),
    ).toBeHidden()
    await page.getByRole("button", { name: "Abrir menu" }).click()
    await expect(
      page.getByRole("dialog").getByRole("link", { name: "Serviços" }),
    ).toBeVisible()
  })

  test("CTA do WhatsApp abre em nova aba com proteção anti-tabnabbing", async ({
    page,
  }) => {
    await page.goto("/")
    const cta = page
      .locator("header")
      .getByRole("link", { name: /Agendar diagnóstico/ })
    await expect(cta).toHaveAttribute("target", "_blank")
    await expect(cta).toHaveAttribute("rel", /noopener/)
    await expect(cta).toHaveAttribute("rel", /noreferrer/)
    await expect(cta).toHaveAttribute("href", /wa\.me/)
  })
})
