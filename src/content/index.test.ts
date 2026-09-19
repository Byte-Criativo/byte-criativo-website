import { describe, it, expect } from "vitest"
import {
  getSiteConfig,
  getHomePage,
  getServiceHub,
  getAllServices,
  getServiceBySlug,
  getProcessoPage,
  getSobrePage,
  getContatoPage,
  getObrigadoPage,
  getPrivacidadePage,
  getFaqItems,
} from "./index"

describe("Content Loaders (src/content/index.ts)", () => {
  it("getSiteConfig() retorna configuração do site válida", () => {
    const config = getSiteConfig()
    expect(config.name).toBe("Byte Criativo")
    expect(config.taxId).toBe("52.652.130/0001-02")
    expect(config.navigation.main.length).toBeGreaterThan(0)
    expect(config.footer.columns.length).toBeGreaterThanOrEqual(3)
  })

  it("getHomePage() retorna dados válidos das 6 seções da home", () => {
    const home = getHomePage()
    expect(home.hero.h1).toContain("Quem desenha o seu site")
    expect(home.salas.items.length).toBeGreaterThanOrEqual(2)
    expect(home.formaDePensar.principles).toHaveLength(3)
    expect(home.oQueFazemos.situations).toHaveLength(4)
    expect(home.comoAnda.steps).toHaveLength(5)
    expect(home.conversa.h2).toBe("Conte o que você quer construir;")
  })

  it("getServiceHub() retorna hub de serviços válido", () => {
    const hub = getServiceHub()
    expect(hub.intro.route).toBe("/servicos")
    expect(hub.situacoes).toHaveLength(4)
    expect(hub.capacidades).toHaveLength(3)
  })

  it("getAllServices() retorna os 7 serviços preservados", () => {
    const services = getAllServices()
    expect(services).toHaveLength(7)
  })

  it("getServiceBySlug() retorna o serviço específico ou undefined", () => {
    const siteService = getServiceBySlug("desenvolvimento-de-sites")
    expect(siteService).toBeDefined()
    expect(siteService?.title).toBe("Desenvolvimento de sites profissionais")

    const nonExistent = getServiceBySlug("servico-inexistente")
    expect(nonExistent).toBeUndefined()
  })

  it("getProcessoPage() retorna página de processo válida com 5 etapas", () => {
    const processo = getProcessoPage()
    expect(processo.etapas).toHaveLength(5)
    expect(processo.diagnostico.questions).toHaveLength(5)
  })

  it("getSobrePage() retorna página Sobre com 3 princípios", () => {
    const sobre = getSobrePage()
    expect(sobre.principios).toHaveLength(3)
    expect(sobre.empresa.cnpj).toBe("52.652.130/0001-02")
  })

  it("getContatoPage() retorna página de contato com caminhos e opções", () => {
    const contato = getContatoPage()
    expect(contato.projectTypeOptions).toHaveLength(6)
    expect(contato.caminhos.formulario.buttonLabel).toBe("Enviar mensagem")
  })

  it("getObrigadoPage() retorna página de confirmação", () => {
    const obrigado = getObrigadoPage()
    expect(obrigado.h1).toBe("Mensagem recebida.")
    expect(obrigado.proximosPassos.steps).toHaveLength(3)
  })

  it("getPrivacidadePage() retorna termos da política de privacidade", () => {
    const privacidade = getPrivacidadePage()
    expect(privacidade.responsavel.name).toBe("Byte Criativo")
    expect(privacidade.sections.length).toBeGreaterThanOrEqual(5)
  })

  it("getFaqItems() retorna perguntas e respostas frequentes", () => {
    const faqs = getFaqItems()
    expect(faqs.length).toBeGreaterThanOrEqual(4)
    for (const item of faqs) {
      expect(item.question.length).toBeGreaterThanOrEqual(3)
      expect(item.answer.length).toBeGreaterThanOrEqual(5)
    }
  })
})
