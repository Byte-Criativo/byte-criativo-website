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
  await expect(formulario.getByText("Faltou o seu nome.")).toBeHidden()
  await formulario.getByRole("radio", { name: "Site ou landing page" }).check()
  await expect(
    formulario.getByRole("radio", { name: "Site ou landing page" }),
  ).toBeChecked()
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

test("os dois cases publicados abrem com créditos, galeria e navegação", async ({
  page,
}) => {
  await page.goto("/portfolio")
  const underground = page.getByRole("link", {
    name: "Ver estudo de caso do Underground PB",
  })
  await expect(underground).toBeVisible()
  await underground.click()
  await expect(page).toHaveURL(/\/portfolio\/underground-pb$/)
  await expect(
    page.getByText("identidade visual · criação do site e software"),
  ).toBeVisible()
  await expect(page.locator("[data-galeria-item]")).toHaveCount(4)
  await page
    .getByRole("button", { name: /Ampliar imagem:/ })
    .first()
    .click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("dialog").getByRole("button", { name: "Fechar" }).click()

  await page.goto("/portfolio/festival-alumio")
  await expect(page.getByText("Atuação da Byte")).toBeVisible()
  await expect(page.locator("[data-galeria-item]")).toHaveCount(4)
  await expect(
    page.getByRole("link", { name: "Ver todos os projetos" }),
  ).toBeVisible()
})

test("novos cases distinguem cliente de projeto próprio e continuam a navegação", async ({
  page,
}) => {
  await page.goto("/portfolio")
  await page
    .getByRole("link", { name: "Ver estudo de caso do GOROMAX" })
    .click()
  await expect(page).toHaveURL(/\/portfolio\/goromax$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("GOROMAX")
  await expect(
    page.getByText(
      "desenvolvimento do site · design e UI/UX · identidade · conteúdo do site",
      { exact: true },
    ),
  ).toBeVisible()
  await expect(page.locator("[data-galeria-item]")).toHaveCount(3)
  await page
    .getByRole("button", { name: /Ampliar imagem:/ })
    .first()
    .click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await page
    .getByRole("link", { name: "Próximo projeto: Carlos Ferrer Online" })
    .click()
  await expect(page).toHaveURL(/\/portfolio\/carlos-ferrer$/)
  await expect(
    page.getByText("Projeto próprio · currículo e portfólio", { exact: true }),
  ).toBeVisible()
  await expect(page.locator("[data-galeria-item]")).toHaveCount(3)
  await expect(
    page.getByRole("link", { name: "Projeto anterior: GOROMAX" }),
  ).toHaveAttribute("href", "/portfolio/goromax")
  await expect(
    page.getByRole("link", { name: /Próximo projeto:/ }),
  ).toHaveCount(0)
  // O diálogo fechado contém cópias ampliadas; verificar capa e miniaturas visíveis.
  const imagens = page.locator("article img:visible")
  await expect(imagens).toHaveCount(4)
  for (const img of await imagens.all()) {
    await img.scrollIntoViewIfNeeded()
    await expect(img).toBeVisible()
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true)
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
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
