import { expect, test } from "@playwright/test"

test("o formulário mostra erros de validação e oferece WhatsApp se o e-mail falhar", async ({
  page,
}) => {
  await page.goto("/contato")
  await expect(page.locator("html[data-hidratado]")).toBeAttached()

  const formulario = page.locator("form.lead-form")
  await formulario.getByRole("button", { name: "Enviar mensagem" }).click()
  await expect(formulario.getByText("Faltou o seu nome.")).toBeVisible()

  await formulario
    .getByRole("textbox", { name: /Seu nome/ })
    .fill("Pessoa Teste")
  await formulario.getByRole("radio", { name: "Site ou landing page" }).check()
  await formulario
    .getByRole("textbox", { name: /Conte um pouco do contexto/ })
    .fill("Quero criar um site para apresentar meus serviços.")
  await formulario.getByRole("radio", { name: "E-mail" }).check()
  await formulario
    .getByRole("textbox", { name: /Seu e-mail/ })
    .fill("teste@example.com")
  await formulario
    .locator('input[name="carimbo"]')
    .evaluate((elemento: HTMLInputElement) => {
      elemento.value = String(Date.now() - 4_000)
    })

  await formulario.getByRole("button", { name: "Enviar mensagem" }).click()
  await expect(
    formulario.getByText("A mensagem não foi enviada."),
  ).toBeVisible()
  await expect(
    formulario.getByRole("button", { name: "Chamar no WhatsApp" }),
  ).toBeVisible()
})

test("cases ainda em revisão não são publicados", async ({ page }) => {
  const resposta = await page.goto("/portfolio/underground-pb")
  expect(resposta?.status()).toBe(404)
  await expect(
    page.getByRole("heading", {
      name: "Essa página não existe ou mudou de lugar.",
    }),
  ).toBeVisible()

  await page.goto("/")
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Underground PB" }),
  ).toHaveCount(0)
})

test.describe("formulário sem JavaScript", () => {
  test.use({ javaScriptEnabled: false })

  test("devolve erros de validação sem perder o texto preenchido", async ({
    page,
  }) => {
    await page.goto("/contato")
    const formulario = page.locator("form.lead-form")
    await formulario
      .getByRole("textbox", { name: /Seu nome/ })
      .fill("Pessoa Teste")
    await formulario.getByRole("button", { name: "Enviar mensagem" }).click()

    await expect(formulario.getByText(/Escolha uma opção/)).toBeVisible()
    await expect(
      formulario.getByRole("textbox", { name: /Seu nome/ }),
    ).toHaveValue("Pessoa Teste")
  })

  test("oferece um link funcional de WhatsApp quando o e-mail falha", async ({
    page,
  }) => {
    await page.goto("/contato")
    const formulario = page.locator("form.lead-form")
    await formulario
      .getByRole("textbox", { name: /Seu nome/ })
      .fill("Pessoa Teste")
    await formulario
      .getByRole("radio", { name: "Site ou landing page" })
      .check()
    await formulario
      .getByRole("textbox", { name: /Conte um pouco do contexto/ })
      .fill("Quero criar um site para apresentar meus serviços.")
    await formulario.getByRole("radio", { name: "E-mail" }).check()
    await formulario
      .getByRole("textbox", { name: /Seu e-mail/ })
      .fill("teste@example.com")
    await formulario.getByRole("button", { name: "Enviar mensagem" }).click()

    await expect(
      formulario.getByText("A mensagem não foi enviada."),
    ).toBeVisible()
    await expect(
      formulario.getByRole("link", { name: "Chamar no WhatsApp" }),
    ).toHaveAttribute("href", /^https:\/\/wa\.me\//)
  })
})
