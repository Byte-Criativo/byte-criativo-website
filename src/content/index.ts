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
  type CaseStudyData,
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
import { caseStudies } from "./cases"

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

// Os dados já chegam validados de ./cases (parse no módulo); aqui ficam só
// a ordenação por `order` e o filtro de publicação.
export function getAllCases(): CaseStudyData[] {
  return [...caseStudies].sort((a, b) => a.order - b.order)
}

export function getPublishedCases(): CaseStudyData[] {
  return getAllCases().filter((estudo) => estudo.status === "published")
}

export function getCaseBySlug(slug: string): CaseStudyData | undefined {
  return caseStudies.find((estudo) => estudo.slug === slug)
}
