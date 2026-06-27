export const sectionIds = {
  cases: "cases",
  services: "services",
  faq: "FAQ",
  contact: "contact",
} as const

export const navigationItems = [
  {
    label: "Cases",
    href: `/#${sectionIds.cases}`,
  },
  {
    label: "Serviços",
    href: `/#${sectionIds.services}`,
  },
  {
    label: "FAQ",
    href: `/#${sectionIds.faq}`,
  },
] as const

export const footerNavigationItems = [
  {
    label: "CASES",
    href: `/#${sectionIds.cases}`,
  },
  {
    label: "SERVIÇOS",
    href: `/#${sectionIds.services}`,
  },
  {
    label: "DÚVIDAS",
    href: `/#${sectionIds.faq}`,
  },
] as const

export const heroContent = {
  heading: "Software sob medida para marcas que querem",
  highlight: " crescer com tecnologia",
  description:
    "Unimos estratégia, design e desenvolvimento para criar produtos digitais elegantes, rápidos e preparados para evoluir com a sua empresa.",
  ctaLabel: "Comece seu projeto",
} as const

export const highlightCards = [
  {
    icon: "shapes",
    title: "Estratégia Multidisciplinar",
    description:
      "Contamos com especialistas em programação, design, UI/UX e copywriting.",
  },
  {
    icon: "sparkle",
    title: "Soluções Sob Medida",
    description:
      "Nosso compromisso é encontrar a solução perfeita para o seu desafio.",
  },
  {
    icon: "lifebuoy",
    title: "Suporte Evolutivo",
    description:
      "Após a entrega do seu projeto, desfrute da tranquilidade com nosso suporte contínuo.",
  },
] as const

export const featuredCase = {
  eyebrow: "Case autoral",
  title: "Underground PB",
  imageAlt: "Preview do site Underground PB",
  tags: ["Plataforma cultural", "Agenda & bandas", "PWA"],
  description:
    "Desenvolvido por mim, o Underground PB reúne a cena alternativa e independente da Paraíba em uma plataforma viva: catálogo de bandas, agenda de shows, notícias, memória da cena, playlist integrada, cadastro de artistas e contribuição para manter o projeto ativo. Um produto cultural pensado para descoberta, participação e fortalecimento da comunidade underground paraibana.",
  href: "https://www.undergroundpb.com.br/",
  linkLabel: "Acessar site",
} as const

export const services = [
  {
    icon: "code",
    title: "Front-end",
    description:
      "Garanta um site deslumbrante e eficiente que cativa à primeira vista.",
  },
  {
    icon: "database",
    title: "Back-end",
    description:
      "Integrações estáveis, dados bem estruturados e bases técnicas prontas para crescer.",
  },
  {
    icon: "browser",
    title: "UI/UX Design",
    description:
      "Interfaces claras, bonitas e desenhadas para reduzir fricção em cada jornada.",
  },
  {
    icon: "shapes",
    title: "Design Gráfico",
    description:
      "Crie uma identidade visual que ressoa perfeitamente com a essência da sua marca.",
  },
  {
    icon: "strategy",
    title: "Design de Produto",
    description:
      "Desenvolvemos produtos com coesão impecável, cada um refletindo harmonia e propósito.",
  },
  {
    icon: "penNib",
    title: "Copywriting",
    description:
      "Textos diretos e estratégicos para comunicar valor e conduzir à ação.",
  },
] as const

export const servicesSectionTitle = {
  eyebrow: "Nossos Serviços",
  heading: "O que oferecemos?",
} as const

export const faqSectionTitle = {
  eyebrow: "FAQ",
  heading: "Dúvidas",
} as const

export const ctaContent = {
  title: "Vamos transformar sua ideia em produto?",
  description:
    "Conte o que você precisa. A gente te ajuda a desenhar o melhor caminho para tirar sua solução do papel.",
  buttonLabel: "Enviar mensagem",
} as const
