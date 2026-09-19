import "server-only"
import { z } from "zod"
import {
  SiteConfigSchema,
  HomePageSchema,
  ServiceHubSchema,
  ServiceDetailPageSchema,
  ProcessoPageSchema,
  SobrePageSchema,
  ContatoPageSchema,
  ObrigadoPageSchema,
  PrivacidadePageSchema,
  PortfolioPageSchema,
  FaqItemSchema,
  type SiteConfig,
  type HomePage,
  type ServiceHub,
  type ServiceDetailPage,
  type ProcessoPage,
  type SobrePage,
  type ContatoPage,
  type ObrigadoPage,
  type PrivacidadePage,
  type PortfolioPage,
  type FaqItem,
} from "./schema"
import { siteConfigRaw } from "./site"
import { homePageRaw } from "./home"
import { serviceHubRaw, servicePagesRaw } from "./services"
import {
  processoPageRaw,
  sobrePageRaw,
  contatoPageRaw,
  obrigadoPageRaw,
  privacidadePageRaw,
  portfolioPageRaw,
} from "./pages"
import { faqItemsRaw } from "./faq"

export function getSiteConfig(): SiteConfig {
  return SiteConfigSchema.parse(siteConfigRaw)
}

export function getHomePage(): HomePage {
  return HomePageSchema.parse(homePageRaw)
}

export function getServiceHub(): ServiceHub {
  return ServiceHubSchema.parse(serviceHubRaw)
}

export function getAllServices(): ServiceDetailPage[] {
  return z.array(ServiceDetailPageSchema).parse(servicePagesRaw)
}

export function getServiceBySlug(slug: string): ServiceDetailPage | undefined {
  const service = servicePagesRaw.find((s) => s.slug === slug)
  if (!service) return undefined
  return ServiceDetailPageSchema.parse(service)
}

export function getProcessoPage(): ProcessoPage {
  return ProcessoPageSchema.parse(processoPageRaw)
}

export function getSobrePage(): SobrePage {
  return SobrePageSchema.parse(sobrePageRaw)
}

export function getContatoPage(): ContatoPage {
  return ContatoPageSchema.parse(contatoPageRaw)
}

export function getObrigadoPage(): ObrigadoPage {
  return ObrigadoPageSchema.parse(obrigadoPageRaw)
}

export function getPrivacidadePage(): PrivacidadePage {
  return PrivacidadePageSchema.parse(privacidadePageRaw)
}

export function getPortfolioPage(): PortfolioPage {
  return PortfolioPageSchema.parse(portfolioPageRaw)
}

export function getFaqItems(): FaqItem[] {
  return z.array(FaqItemSchema).parse(faqItemsRaw)
}
