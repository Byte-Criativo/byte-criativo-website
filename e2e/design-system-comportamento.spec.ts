import { test, expect } from "@playwright/test"

test.describe("Catálogo: foco no diálogo", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("o menu prende o foco, fecha com Esc e devolve o foco ao gatilho", async ({
    page,
  }) => {
    await page.goto("/design-system")
    const gatilho = page.getByRole("button", { name: "Menu" })
    await gatilho.click()

    const dialogo = page.getByRole("dialog")
    await expect(dialogo).toBeVisible()
    await expect(
      dialogo.getByRole("button", { name: "Fechar menu" }),
    ).toBeFocused()

    // Tab circula dentro do diálogo: nunca alcança o conteúdo de trás.
    for (let passo = 0; passo < 12; passo += 1) {
      await page.keyboard.press("Tab")
      const dentro = await page.evaluate(
        () => document.activeElement?.closest("dialog") !== null,
      )
      expect(dentro).toBe(true)
    }

    await page.keyboard.press("Escape")
    await expect(dialogo).toBeHidden()
    await expect(gatilho).toBeFocused()
  })

  test("o foco nunca fica coberto pelo header (RC4)", async ({ page }) => {
    await page.goto("/design-system")
    for (let passo = 0; passo < 25; passo += 1) {
      await page.keyboard.press("Tab")
      // O WebKit headless pode deixar o elemento focado fora da viewport
      // após vários Tabs. Este teste verifica a cobertura pelo header.
      const foco = page.locator(":focus")
      if ((await foco.count()) > 0) await foco.scrollIntoViewIfNeeded()
      const visivel = await page.evaluate(() => {
        const ativo = document.activeElement
        if (!ativo || ativo === document.body) return true
        const caixa = ativo.getBoundingClientRect()
        const alvo = document.elementFromPoint(
          caixa.x + caixa.width / 2,
          caixa.y + caixa.height / 2,
        )
        return ativo.contains(alvo) || alvo === ativo
      })
      expect(visivel).toBe(true)
    }
  })
})

test.describe("Catálogo sem JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })

  test("todo conteúdo aparece e todo destino é alcançável", async ({
    page,
  }) => {
    await page.goto("/design-system")

    // RC9: sem JS a raiz não recebe data-js.
    await expect(page.locator("html")).not.toHaveAttribute("data-js", /.*/)

    // MobileNav: o link para o rodapé aparece, o botão não.
    await expect(page.getByRole("link", { name: "Menu" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden()
    await expect(page.locator("#navegacao-rodape")).toHaveCount(1)

    // FrenteVerso: controle oculto, as duas faces visíveis com rótulo.
    await expect(
      page.getByRole("group", {
        name: "Mostrar a frente ou o verso do Festival Alumiô",
      }),
    ).toBeHidden()
    await expect(
      page.getByRole("heading", { name: "Frente", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Verso", exact: true }),
    ).toBeVisible()

    // CopyEmail: botão oculto, endereço e mailto de pé.
    await expect(
      page.getByRole("button", { name: "Copiar e-mail" }),
    ).toBeHidden()
    await expect(
      page.getByRole("link", { name: "Escrever e-mail" }),
    ).toBeVisible()

    // Galeria: sem gatilhos de ampliação, figuras legíveis.
    await expect(
      page.getByRole("button", { name: /Ampliar imagem/ }),
    ).toHaveCount(0)

    // Sala: já na cor do projeto, nunca no estado parede.
    await expect(page.locator("#sala-catalogo")).toHaveAttribute(
      "data-estado",
      "projeto",
    )
  })
})

test.describe("Catálogo com movimento reduzido", () => {
  test("a sala não passa pelo estado parede e a barra de progresso some", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/design-system")
    await expect(page.locator("#sala-catalogo")).toHaveAttribute(
      "data-estado",
      "projeto",
    )
    await expect(page.locator("[data-progresso]")).toBeHidden()
  })

  test("as durações dos tokens zeram", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/design-system")
    const duracao = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--dur-base")
        .trim(),
    )
    expect(["0ms", "0s"]).toContain(duracao)
  })
})
