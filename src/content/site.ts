import { SiteConfigSchema, type SiteConfig } from "./schema"
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "@/lib/contact"

export const siteConfigRaw = {
  name: "Byte Criativo",
  tagline: "Design e engenharia na mesma frase;",
  description:
    "A Byte Criativo projeta e constrói sites, plataformas e sistemas sob medida. Design e engenharia decididos juntos desde o diagnóstico.",
  taxId: "52.652.130/0001-02",
  contact: {
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE_E164,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappDisplay: WHATSAPP_DISPLAY,
    defaultWhatsappMessage:
      "Olá! Vim pelo site da Byte Criativo e quero falar sobre um projeto.",
  },
  social: {
    instagram: INSTAGRAM_URL,
    linkedin: LINKEDIN_URL,
  },
  navigation: {
    main: [
      { label: "Trabalhos", href: "/portfolio" },
      { label: "Serviços", href: "/servicos" },
      { label: "Processo", href: "/processo" },
      { label: "Sobre", href: "/sobre" },
    ],
    mobile: [
      { label: "Trabalhos", href: "/portfolio" },
      { label: "Serviços", href: "/servicos" },
      { label: "Processo", href: "/processo" },
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "/contato" },
    ],
    primaryCta: {
      label: "Falar sobre um projeto",
      href: "/contato",
    },
  },
  footer: {
    columns: [
      {
        title: "Byte Criativo",
        tagline: "Design e engenharia na mesma frase;",
        lines: [
          "Byte Criativo, design e engenharia de software.",
          "CNPJ 52.652.130/0001-02",
        ],
      },
      {
        title: "Trabalhos",
        links: [
          { label: "Underground PB", href: "/portfolio/underground-pb" },
          { label: "Festival Alumiô", href: "/portfolio/festival-alumio" },
          { label: "Todos os trabalhos", href: "/portfolio" },
        ],
      },
      {
        title: "Serviços",
        links: [
          {
            label: "Desenvolvimento de sites",
            href: "/servicos/desenvolvimento-de-sites",
          },
          { label: "Landing pages", href: "/servicos/landing-pages" },
          {
            label: "Sistemas web sob medida",
            href: "/servicos/sistemas-web-sob-medida",
          },
          {
            label: "Automação e integrações",
            href: "/servicos/automacao-e-integracoes",
          },
          { label: "UI/UX design", href: "/servicos/ui-ux-design" },
          { label: "Design de produto", href: "/servicos/design-de-produto" },
          {
            label: "Copywriting para web",
            href: "/servicos/copywriting-para-web",
          },
        ],
      },
      {
        title: "Estúdio",
        links: [
          { label: "Processo", href: "/processo" },
          { label: "Sobre", href: "/sobre" },
          { label: "Contato", href: "/contato" },
          { label: "Privacidade", href: "/privacidade" },
        ],
      },
    ],
    copyright: "© 2026 Byte Criativo",
  },
}

export const siteConfig: SiteConfig = SiteConfigSchema.parse(siteConfigRaw)
