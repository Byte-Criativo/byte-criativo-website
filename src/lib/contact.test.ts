import { describe, it, expect } from "vitest"
import { buildWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_URL } from "./contact"

describe("buildWhatsAppUrl", () => {
  it("monta a URL do WhatsApp com a mensagem codificada", () => {
    expect(buildWhatsAppUrl("5511999999999", "Olá, tudo bem?")).toBe(
      "https://wa.me/5511999999999?text=Ol%C3%A1%2C%20tudo%20bem%3F",
    )
  })

  it("WHATSAPP_URL usa o número configurado e não contém espaços", () => {
    expect(
      WHATSAPP_URL.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`),
    ).toBe(true)
    expect(WHATSAPP_URL).not.toContain(" ")
  })
})
