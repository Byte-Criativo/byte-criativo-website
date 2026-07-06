import { describe, it, expect, beforeEach } from "vitest"
import { pushToDataLayer, trackWhatsAppClick } from "./analytics"

describe("analytics", () => {
  beforeEach(() => {
    window.dataLayer = []
  })

  it("pushToDataLayer cria o dataLayer e empurra o evento", () => {
    delete (window as { dataLayer?: unknown[] }).dataLayer
    pushToDataLayer({ event: "teste" })
    expect(window.dataLayer).toEqual([{ event: "teste" }])
  })

  it("trackWhatsAppClick empurra whatsapp_click com o location", () => {
    trackWhatsAppClick("hero")
    expect(window.dataLayer).toContainEqual({
      event: "whatsapp_click",
      location: "hero",
    })
  })
})
