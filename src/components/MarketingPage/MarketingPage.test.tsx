import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithTheme } from "@/src/test/utils"
import { MarketingPage } from "./index"
import { pagesContent } from "@/src/content/pages"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"

describe("MarketingPage", () => {
  it("usa a mensagem fixa da página no link de WhatsApp do CTA principal", () => {
    renderWithTheme(<MarketingPage page={pagesContent.contato} />)

    const expectedHref = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      pagesContent.contato.whatsappMessage,
    )

    const cta = screen.getByRole("link", {
      name: pagesContent.contato.primaryCtaLabel,
    })

    expect(cta).toHaveAttribute("href", expectedHref)
  })
})
