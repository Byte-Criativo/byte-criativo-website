import { describe, it, expect } from "vitest"
import { pagesContent } from "./pages"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"

const expectedMessages: Record<string, string> = {
  sobre: "Olá! Li sobre a Byte Criativo e quero conversar sobre um projeto.",
  servicos:
    "Olá! Vi os serviços da Byte Criativo e quero falar sobre um projeto.",
  portfolio:
    "Olá! Vi os trabalhos da Byte Criativo e quero falar sobre um projeto.",
  contato:
    "Olá! Vim pela página de contato da Byte Criativo e quero falar sobre um projeto.",
}

function hasConsecutiveRepeatedWords(message: string) {
  const words = message.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  return words.some((word, index) => index > 0 && word === words[index - 1])
}

describe("pagesContent whatsappMessage", () => {
  for (const [key, expectedMessage] of Object.entries(expectedMessages)) {
    describe(key, () => {
      const page = pagesContent[key as keyof typeof pagesContent]

      it("usa a mensagem fixa exata definida para a página", () => {
        expect(page.whatsappMessage).toBe(expectedMessage)
      })

      it("não repete a mesma palavra consecutivamente", () => {
        expect(hasConsecutiveRepeatedWords(page.whatsappMessage)).toBe(false)
      })

      it("contém 'Byte Criativo' e tem no máximo 200 caracteres", () => {
        expect(page.whatsappMessage).toContain("Byte Criativo")
        expect(page.whatsappMessage.length).toBeLessThanOrEqual(200)
      })

      it("gera a URL do WhatsApp esperada com a mensagem codificada", () => {
        expect(buildWhatsAppUrl(WHATSAPP_NUMBER, page.whatsappMessage)).toBe(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(page.whatsappMessage)}`,
        )
      })
    })
  }
})
