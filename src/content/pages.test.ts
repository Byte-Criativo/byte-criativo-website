import { describe, it, expect } from "vitest"
import { pagesContent } from "./pages"
import { buildWhatsAppUrl, WHATSAPP_NUMBER, CONTACT_EMAIL } from "@/lib/contact"
import { hasConsecutiveRepeatedWords } from "@/test/whatsapp-message"

const expectedMessages: Record<string, string> = {
  sobre: "Olá! Li sobre a Byte Criativo e quero conversar sobre um projeto.",
  servicos:
    "Olá! Vi os serviços da Byte Criativo e quero falar sobre um projeto.",
  portfolio:
    "Olá! Vi os trabalhos da Byte Criativo e quero falar sobre um projeto.",
  contato:
    "Olá! Vim pela página de contato da Byte Criativo e quero falar sobre um projeto.",
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

import {
  processoPage,
  sobrePage,
  contatoPage,
  obrigadoPage,
  privacidadePage,
  portfolioPage,
} from "./pages"
import {
  ProcessoPageSchema,
  SobrePageSchema,
  ContatoPageSchema,
  ObrigadoPageSchema,
  PrivacidadePageSchema,
  PortfolioPageSchema,
} from "./schema"

describe("Páginas institucionais (Processo, Sobre, Contato, Obrigado, Privacidade)", () => {
  describe("processoPage", () => {
    it("passa na validação do ProcessoPageSchema", () => {
      expect(ProcessoPageSchema.safeParse(processoPage).success).toBe(true)
    })

    it("possui exatamente 5 etapas com descrições e entregas", () => {
      expect(processoPage.etapas).toHaveLength(5)
      processoPage.etapas.forEach((etapa, idx) => {
        expect(etapa.number).toBe(idx + 1)
        expect(etapa.title.length).toBeGreaterThanOrEqual(3)
        expect(etapa.whatHappens.length).toBeGreaterThanOrEqual(10)
        expect(etapa.youReceive.length).toBeGreaterThanOrEqual(10)
        expect(etapa.yourParticipation.length).toBeGreaterThanOrEqual(10)
      })
    })

    it("possui seção de diagnóstico com perguntas e entregáveis", () => {
      expect(processoPage.diagnostico.questions).toHaveLength(5)
      expect(
        processoPage.diagnostico.whatToBring.items.length,
      ).toBeGreaterThanOrEqual(3)
      expect(
        processoPage.diagnostico.whatComesOut.text.length,
      ).toBeGreaterThanOrEqual(10)
    })

    it("possui 4 dúvidas sobre custo, prazo, template e pós-entrega", () => {
      expect(processoPage.duvidas).toHaveLength(4)
    })
  })

  describe("sobrePage", () => {
    it("passa na validação do SobrePageSchema", () => {
      expect(SobrePageSchema.safeParse(sobrePage).success).toBe(true)
    })

    it("possui manifesto com múltiplos parágrafos", () => {
      expect(
        sobrePage.trajetoria.manifestoParagraphs.length,
      ).toBeGreaterThanOrEqual(5)
    })

    it("possui exatamente 3 princípios fundamentais", () => {
      expect(sobrePage.principios).toHaveLength(3)
      const titles = sobrePage.principios.map((p) => p.title)
      expect(titles[0]).toContain("Diagnóstico antes do código")
      expect(titles[1]).toContain("Design e engenharia na mesma mesa")
      expect(titles[2]).toContain("Feito para durar e evoluir")
    })

    it("possui dados cadastrais e CNPJ válido", () => {
      expect(sobrePage.empresa.name).toBe("Byte Criativo")
      expect(sobrePage.empresa.cnpj).toBe("52.652.130/0001-02")
    })
  })

  describe("contatoPage", () => {
    it("passa na validação do ContatoPageSchema", () => {
      expect(ContatoPageSchema.safeParse(contatoPage).success).toBe(true)
    })

    it("possui os 2 caminhos (formulário e direto)", () => {
      expect(contatoPage.caminhos.formulario.buttonLabel).toBe(
        "Enviar mensagem",
      )
      expect(contatoPage.caminhos.direto.whatsapp.number).toBe(WHATSAPP_NUMBER)
      expect(contatoPage.caminhos.direto.email.address).toBe(CONTACT_EMAIL)
    })

    it("possui 6 opções de tipo de projeto alinhadas ao tracking", () => {
      expect(contatoPage.projectTypeOptions).toHaveLength(6)
      const values = contatoPage.projectTypeOptions.map((o) => o.value)
      expect(values).toEqual([
        "site",
        "plataforma",
        "sistema-interno",
        "automacao",
        "cultural",
        "ainda-nao-sei",
      ])
    })

    it("possui os 3 próximos passos claros", () => {
      expect(contatoPage.proximosPassos.steps).toHaveLength(3)
    })
  })

  describe("obrigadoPage", () => {
    it("passa na validação do ObrigadoPageSchema", () => {
      expect(ObrigadoPageSchema.safeParse(obrigadoPage).success).toBe(true)
    })

    it("possui alternativas para WhatsApp, E-mail e acesso direto", () => {
      expect(obrigadoPage.canais.whatsapp.buttonLabel).toBe(
        "Chamar no WhatsApp",
      )
      expect(obrigadoPage.canais.email.textWithEmail).toContain("{email}")
      expect(obrigadoPage.canais.direto.link.href).toBe("/")
    })
  })

  describe("privacidadePage", () => {
    it("passa na validação do PrivacidadePageSchema", () => {
      expect(PrivacidadePageSchema.safeParse(privacidadePage).success).toBe(
        true,
      )
    })

    it("possui dados de controlador e resumo de conformidade LGPD", () => {
      expect(privacidadePage.responsavel.name).toBe("Byte Criativo")
      expect(privacidadePage.responsavel.cnpj).toBe("52.652.130/0001-02")
      expect(privacidadePage.resumo.length).toBeGreaterThanOrEqual(5)
    })

    it("possui seções detalhadas cobrindo bases legais, direitos e segurança", () => {
      expect(privacidadePage.sections.length).toBeGreaterThanOrEqual(8)
      const sectionIds = privacidadePage.sections.map((s) => s.id)
      expect(sectionIds).toContain("quem-e-responsavel")
      expect(sectionIds).toContain("quais-dados-sao-tratados")
      expect(sectionIds).toContain("cookies-e-armazenamento")
      expect(sectionIds).toContain("compartilhamento")
      expect(sectionIds).toContain("direitos")
      expect(sectionIds).toContain("seguranca")
    })
  })

  describe("portfolioPage", () => {
    it("passa na validação do PortfolioPageSchema", () => {
      expect(PortfolioPageSchema.safeParse(portfolioPage).success).toBe(true)
    })

    it("usa a versão publicável da introdução, sem mencionar a Goromax (D12)", () => {
      expect(portfolioPage.intro.length).toBeGreaterThanOrEqual(2)
      const introCompleta = portfolioPage.intro.join(" ")
      expect(introCompleta).not.toContain("banda")
      expect(introCompleta).toContain("festival no Centro Histórico")
      expect(introCompleta).toContain("plataforma da música independente")
    })

    it("aponta o CTA final para /contato com origem portfolio", () => {
      expect(portfolioPage.ctaFinal.ctaPrimary.href).toBe(
        "/contato?origem=portfolio",
      )
      expect(portfolioPage.ctaFinal.ctaSecondary.whatsappMessage).toBe(
        "Olá! Vi os trabalhos da Byte Criativo e quero falar sobre um projeto.",
      )
    })
  })
})
