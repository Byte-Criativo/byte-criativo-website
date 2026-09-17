import { test, expect } from "@playwright/test"

// Lista de permissão explícita de hosts de terceiros aceitos ao carregar a
// home sem consentimento prévio. Vazia por enquanto: o critério é negar
// tudo que não seja o próprio host, não listar hosts de rastreamento
// conhecidos (uma lista de bloqueio sempre fica incompleta).
const ALLOWED_THIRD_PARTY_HOSTS: string[] = []

test.describe("Sem rastreamento sem consentimento", () => {
  test("toda requisição ao carregar a home é para o host do baseURL (lista de permissão vazia)", async ({
    page,
    baseURL,
  }) => {
    if (!baseURL)
      throw new Error("baseURL não configurada em playwright.config.ts")
    const expectedHost = new URL(baseURL).hostname
    const foreignRequests: string[] = []

    page.on("request", (request) => {
      const host = new URL(request.url()).hostname
      if (host !== expectedHost && !ALLOWED_THIRD_PARTY_HOSTS.includes(host)) {
        foreignRequests.push(request.url())
      }
    })

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    expect(foreignRequests).toEqual([])
  })

  test("nao grava nenhum cookie ao carregar a home (inclui _ga/_gcl do Google Analytics/Ads)", async ({
    page,
    context,
  }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const cookies = await context.cookies()
    expect(cookies).toEqual([])
  })
})
