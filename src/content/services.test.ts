import { describe, it, expect } from "vitest"
import { getServicePage } from "./services"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/contact"
import { hasConsecutiveRepeatedWords } from "@/test/whatsapp-message"

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

import { servicePages, serviceHubData } from "./services"
import { ServiceDetailPageSchema, ServiceHubSchema } from "./schema"

describe("servicePages data structure", () => {
  it("contém exatamente os 7 serviços preservados", () => {
    expect(servicePages).toHaveLength(7)
    const slugs = servicePages.map((s) => s.slug)
    expect(slugs).toEqual([
      "desenvolvimento-de-sites",
      "landing-pages",
      "sistemas-web-sob-medida",
      "automacao-e-integracoes",
      "ui-ux-design",
      "design-de-produto",
      "copywriting-para-web",
    ])
  })

  for (const service of servicePages) {
    describe(`validando serviço: ${service.slug}`, () => {
      it("passa na validação do ServiceDetailPageSchema", () => {
        expect(ServiceDetailPageSchema.safeParse(service).success).toBe(true)
      })

      it("possui todos os blocos de conteúdo da copy v1", () => {
        expect(service.title.length).toBeGreaterThanOrEqual(5)
        expect(service.seoTitle.length).toBeGreaterThanOrEqual(5)
        expect(service.description.length).toBeGreaterThanOrEqual(20)
        expect(service.eyebrow.length).toBeGreaterThanOrEqual(3)
        expect(service.promise.length).toBeGreaterThanOrEqual(10)
        expect(service.quandoFazSentido.length).toBeGreaterThanOrEqual(2)
        expect(service.oQueRecebe.length).toBeGreaterThanOrEqual(2)
        expect(
          service.ondeFoiAplicado.description.length,
        ).toBeGreaterThanOrEqual(10)
        expect(service.comoConduzimos.length).toBeGreaterThanOrEqual(2)
        expect(service.faqs.length).toBeGreaterThanOrEqual(2)
        expect(service.servicosRelacionados.length).toBeGreaterThanOrEqual(1)
      })

      it("tem serviços relacionados que apontam apenas para outros serviços válidos", () => {
        for (const related of service.servicosRelacionados) {
          expect(servicePages.some((s) => s.slug === related)).toBe(true)
          expect(related).not.toBe(service.slug)
        }
      })
    })
  }
})

describe("serviceHubData structure", () => {
  it("passa na validação do ServiceHubSchema", () => {
    expect(ServiceHubSchema.safeParse(serviceHubData).success).toBe(true)
  })

  it("possui exatamente 4 situações mapeadas para as capacidades", () => {
    expect(serviceHubData.situacoes).toHaveLength(4)
    for (const situacao of serviceHubData.situacoes) {
      expect(situacao.situation.length).toBeGreaterThanOrEqual(10)
      expect(situacao.targetAnchor.startsWith("#")).toBe(true)
      expect(situacao.targetLabel.length).toBeGreaterThanOrEqual(5)
    }
  })

  it("possui exatamente 3 capacidades cobrindo os 7 serviços", () => {
    expect(serviceHubData.capacidades).toHaveLength(3)
    const capacityIds = serviceHubData.capacidades.map((c) => c.id)
    expect(capacityIds).toEqual([
      "sites-e-experiencias",
      "sistemas-e-produtos",
      "design",
    ])

    const allServicesInHub = serviceHubData.capacidades.flatMap((c) =>
      c.services.map((s) => s.slug),
    )
    expect(allServicesInHub).toHaveLength(7)
    for (const service of servicePages) {
      expect(allServicesInHub).toContain(service.slug)
    }
  })

  it("possui seção de evolução contínua e CTA final válidos", () => {
    expect(serviceHubData.evolucaoContinua.h2.length).toBeGreaterThanOrEqual(3)
    expect(serviceHubData.evolucaoContinua.text.length).toBeGreaterThanOrEqual(
      20,
    )
    expect(serviceHubData.ctaFinal.ctaPrimary.href).toContain("/contato")
    expect(serviceHubData.ctaFinal.ctaSecondary.whatsappMessage).toContain(
      "Byte Criativo",
    )
  })
})
