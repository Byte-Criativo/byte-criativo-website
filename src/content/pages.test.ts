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

    it("identifica o controlador na seção 1 e o resumo LGPD na seção 2", () => {
      const [secaoControlador, secaoResumo] = privacidadePage.sections
      expect(JSON.stringify(secaoControlador)).toContain("52.652.130/0001-02")
      expect(JSON.stringify(secaoControlador)).toContain("Byte Criativo")
      const resumo = secaoResumo?.blocks?.find((b) => b.type === "list")
      expect(resumo?.type).toBe("list")
      if (resumo?.type === "list") {
        expect(resumo.items).toHaveLength(6)
      }
    })

    it("não carrega anotações internas do rascunho (PENDENTE) nas seções", () => {
      const texto = JSON.stringify(privacidadePage.sections)
      expect(texto).not.toContain("PENDENTE")
      expect(texto).not.toContain("Proposta da arquitetura técnica")
      expect(texto).not.toContain("Não documentado")
      expect(texto).not.toContain("a definir")
      expect(texto).not.toContain("Confirmar para o site novo")
    })

    it("possui as 15 seções do rascunho, numeradas de 1 a 15", () => {
      expect(privacidadePage.sections).toHaveLength(15)
      expect(privacidadePage.sections.map((s) => s.number)).toEqual(
        Array.from({ length: 15 }, (_, i) => String(i + 1)),
      )
      const sectionIds = privacidadePage.sections.map((s) => s.id)
      expect(sectionIds).toEqual([
        "quem-e-responsavel",
        "resumo",
        "quais-dados-sao-tratados",
        "cookies-e-armazenamento",
        "compartilhamento",
        "transferencia-internacional",
        "retencao",
        "direitos",
        "seguranca",
        "canal-de-privacidade",
        "criancas-e-adolescentes",
        "links-para-outros-sites",
        "aplicativo-pomodoro",
        "mudancas-nesta-politica",
        "anpd",
      ])
    })

    it("cobre as subseções 3.1 a 3.9 na seção de dados tratados", () => {
      const dados = privacidadePage.sections.find(
        (s) => s.id === "quais-dados-sao-tratados",
      )
      expect(dados?.subsections).toHaveLength(9)
      expect(dados?.subsections?.map((sub) => sub.number)).toEqual(
        Array.from({ length: 9 }, (_, i) => `3.${i + 1}`),
      )
    })

    it("porta as tabelas das seções 5 e 14 com linhas completas", () => {
      const comTabela = privacidadePage.sections.filter((section) =>
        section.blocks?.some((bloco) => bloco.type === "table"),
      )
      expect(comTabela.map((s) => s.number)).toEqual(["5", "14"])
      for (const section of comTabela) {
        for (const bloco of section.blocks ?? []) {
          if (bloco.type !== "table") continue
          expect(bloco.caption.length).toBeGreaterThan(0)
          for (const linha of bloco.rows) {
            expect(linha).toHaveLength(bloco.columns.length)
          }
        }
      }
    })
  })

  describe("portfolioPage", () => {
    it("passa na validação do PortfolioPageSchema", () => {
      expect(PortfolioPageSchema.safeParse(portfolioPage).success).toBe(true)
    })

    it("apresenta os projetos autorizados e distingue o projeto próprio", () => {
      expect(portfolioPage.intro.length).toBeGreaterThanOrEqual(2)
      const introCompleta = portfolioPage.intro.join(" ")
      expect(introCompleta).toContain("banda")
      expect(introCompleta).toContain("site de festival")
      expect(introCompleta).toContain("plataforma cultural")
      expect(introCompleta).toContain("projeto próprio")
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
