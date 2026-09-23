import { expect, test, type Page } from "@playwright/test"

const NOME_MARCA = "Byte Criativo, página inicial"

async function conferirMarcaECabecalho(page: Page) {
  const cabecalho = page.getByRole("banner")
  const inicio = cabecalho.getByRole("link", { name: NOME_MARCA }).first()
  const logo = inicio.locator("img")
  await expect(logo).toBeVisible()
  await expect(logo).toHaveAttribute("src", "/logoByte.png")
  await expect(inicio).toHaveAttribute("href", "/")

  // Detecta asset quebrado, compressão flex e proporção alterada: a mera
  // presença de uma imagem no DOM não comprova a restauração da marca.
  await expect
    .poll(() =>
      logo.evaluate((elemento: HTMLImageElement) =>
        Boolean(elemento.complete && elemento.naturalWidth > 0),
      ),
    )
    .toBe(true)
  const marca = await logo.evaluate((elemento: HTMLImageElement) => {
    const caixa = elemento.getBoundingClientRect()
    return {
      largura: caixa.width,
      altura: caixa.height,
      natural: elemento.naturalWidth / elemento.naturalHeight,
      visivel:
        caixa.left >= 0 &&
        caixa.right <= window.innerWidth &&
        caixa.top >= 0 &&
        caixa.bottom <= window.innerHeight,
    }
  })
  expect(marca.largura).toBeGreaterThanOrEqual(180)
  expect(marca.altura).toBeGreaterThan(30)
  expect(marca.largura / marca.altura).toBeCloseTo(marca.natural, 1)
  expect(marca.visivel).toBe(true)

  const problemas = await cabecalho.evaluate((elemento) => {
    const controles = Array.from(elemento.querySelectorAll("a, button"))
      .filter((controle) => !controle.closest("dialog"))
      .map((controle) => ({
        nome: controle.textContent?.trim(),
        caixa: controle.getBoundingClientRect(),
      }))
      .filter(({ caixa }) => caixa.width > 0 && caixa.height > 0)
    const sobreposicoes: string[] = []
    for (const [indice, controle] of controles.entries()) {
      for (const outro of controles.slice(indice + 1)) {
        if (
          controle.caixa.left < outro.caixa.right &&
          controle.caixa.right > outro.caixa.left &&
          controle.caixa.top < outro.caixa.bottom &&
          controle.caixa.bottom > outro.caixa.top
        ) {
          sobreposicoes.push(`${controle.nome} / ${outro.nome}`)
        }
      }
    }
    return {
      sobreposicoes,
      foraDaTela: controles
        .filter(({ caixa }) => caixa.left < 0 || caixa.right > innerWidth)
        .map(({ nome }) => nome),
      excessoHorizontal: Math.max(
        document.documentElement.scrollWidth - innerWidth,
        document.body.scrollWidth - innerWidth,
      ),
    }
  })
  expect(problemas.sobreposicoes).toEqual([])
  expect(problemas.foraDaTela).toEqual([])
  expect(problemas.excessoHorizontal).toBeLessThanOrEqual(1)
}

test.describe("Marca oficial e navegação responsiva", () => {
  for (const largura of [360, 390, 768, 1024, 1440, 1920]) {
    test(`marca carregada, sem cortes ou sobreposições em ${largura}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: largura, height: 900 })
      await page.goto("/")
      await page.evaluate(() => document.fonts.ready)
      await conferirMarcaECabecalho(page)

      const cabecalho = page.getByRole("banner")
      if (largura >= 1024) {
        for (const nome of [
          "Projetos",
          "Serviços",
          "Como trabalhamos",
          "Sobre",
          "Falar sobre meu projeto",
        ]) {
          await expect(
            cabecalho.getByRole("link", { name: nome, exact: true }),
          ).toBeVisible()
        }
      } else {
        await expect(
          cabecalho.getByRole("button", { name: "Menu" }),
        ).toBeVisible()
      }

      await page.evaluate(() => window.scrollTo(0, 800))
      await conferirMarcaECabecalho(page)

      await page.goto("/portfolio/underground-pb")
      await conferirMarcaECabecalho(page)
      await page
        .getByRole("banner")
        .getByRole("link", { name: NOME_MARCA })
        .first()
        .click()
      await expect(page).toHaveURL(/\/$/)
      await conferirMarcaECabecalho(page)
    })
  }

  test("menu funciona por teclado, devolve foco e libera a rolagem ao fechar ou navegar", async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/servicos")
    const gatilho = page.getByRole("button", { name: "Menu", exact: true })
    await gatilho.focus()
    await page.keyboard.press("Enter")
    const dialogo = page.getByRole("dialog", { name: "Menu" })
    await expect(dialogo).toBeVisible()
    await expect(
      dialogo.getByRole("button", { name: "Fechar menu" }),
    ).toBeFocused()

    for (let passo = 0; passo < 12; passo += 1) {
      await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
      expect(
        await dialogo.evaluate((elemento) =>
          elemento.contains(document.activeElement),
        ),
      ).toBe(true)
    }
    await page.keyboard.press("Escape")
    await expect(dialogo).toBeHidden()
    await expect(gatilho).toBeFocused()
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden")
    await conferirMarcaECabecalho(page)

    await gatilho.click()
    await dialogo.getByRole("link", { name: NOME_MARCA }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(dialogo).toBeHidden()
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden")
    await conferirMarcaECabecalho(page)
  })
})

test.describe("Marca antes da hidratação", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } })

  test("logo oficial e retorno à home funcionam sem JavaScript", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await conferirMarcaECabecalho(page)
    await page
      .getByRole("banner")
      .getByRole("link", { name: NOME_MARCA })
      .first()
      .click()
    await expect(page).toHaveURL(/\/$/)
    await conferirMarcaECabecalho(page)
    await expect(
      page.getByRole("link", { name: "Menu", exact: true }),
    ).toHaveAttribute("href", "#navegacao-rodape")
  })
})
