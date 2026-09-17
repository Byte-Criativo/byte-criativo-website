import { test, expect } from "@playwright/test"

const TRACKING_HOST_SUFFIXES = [
  "googletagmanager.com",
  "google-analytics.com",
  "doubleclick.net",
  "googleadservices.com",
]

test.describe("Sem rastreamento sem consentimento", () => {
  test("nao grava cookies de Google Analytics/Ads ao carregar a home", async ({
    page,
    context,
  }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const cookies = await context.cookies()
    const trackingCookies = cookies.filter(
      (cookie) =>
        cookie.name.startsWith("_ga") || cookie.name.startsWith("_gcl"),
    )

    expect(trackingCookies).toEqual([])
  })

  test("nao faz requisicoes para hosts de rastreamento do Google ao carregar a home", async ({
    page,
  }) => {
    const trackingRequests: string[] = []

    page.on("request", (request) => {
      const host = new URL(request.url()).hostname
      if (TRACKING_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
        trackingRequests.push(request.url())
      }
    })

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    expect(trackingRequests).toEqual([])
  })
})
