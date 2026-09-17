import { describe, it, expect } from "vitest"
import { getServicePage } from "./services"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"
import { hasConsecutiveRepeatedWords } from "@/src/test/whatsapp-message"

const expectedMessages: Record<string, string> = {
  "desenvolvimento-de-sites":
    "Olá! Vi a página de sites da Byte Criativo e quero conversar sobre um site para o meu negócio.",
  "landing-pages":
    "Olá! Vi a página de landing pages da Byte Criativo. Tenho uma campanha ou lançamento e quero conversar sobre uma página.",
  "sistemas-web-sob-medida":
    "Olá! Vi a página de sistemas sob medida da Byte Criativo e quero conversar sobre um sistema para a minha operação.",
  "ui-ux-design":
    "Olá! Vi a página de UI/UX da Byte Criativo e quero conversar sobre a interface de um produto.",
  "design-de-produto":
    "Olá! Vi a página de design de produto da Byte Criativo e quero ajuda para definir o que construir primeiro.",
  "copywriting-para-web":
    "Olá! Vi a página de textos para web da Byte Criativo e quero conversar sobre os textos do meu site.",
  "automacao-e-integracoes":
    "Olá! Vi a página de automações da Byte Criativo e quero conversar sobre conectar as ferramentas que uso.",
}

describe("servicePages whatsappMessage", () => {
  for (const [slug, expectedMessage] of Object.entries(expectedMessages)) {
    describe(slug, () => {
      const service = getServicePage(slug)

      it("usa a mensagem fixa exata definida para o serviço", () => {
        expect(service?.whatsappMessage).toBe(expectedMessage)
      })

      it("não repete a mesma palavra consecutivamente", () => {
        expect(
          hasConsecutiveRepeatedWords(service?.whatsappMessage ?? ""),
        ).toBe(false)
      })

      it("contém 'Byte Criativo' e tem no máximo 200 caracteres", () => {
        expect(service?.whatsappMessage).toContain("Byte Criativo")
        expect(service?.whatsappMessage.length).toBeLessThanOrEqual(200)
      })

      it("gera a URL do WhatsApp esperada com a mensagem codificada", () => {
        expect(
          buildWhatsAppUrl(WHATSAPP_NUMBER, service?.whatsappMessage ?? ""),
        ).toBe(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            service?.whatsappMessage ?? "",
          )}`,
        )
      })
    })
  }
})
