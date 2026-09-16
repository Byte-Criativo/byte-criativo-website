import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/src/lib/contact"
import CaseUndergroundPB from "@/src/assets/case-undergroundpb-screenshot.webp"
import CaseFestivalAlumio from "@/src/assets/case-festival-alumio-screenshot.webp"
import type { StaticImageData } from "next/image"

export type MarketingCard = {
  title: string
  description: string
  meta?: string
  href?: string
  ctaLabel?: string
  tags?: string[]
  imageSrc?: string | StaticImageData
  imageAlt?: string
}

export type MarketingSection = {
  eyebrow?: string
  title: string
  description?: string
  cards?: MarketingCard[]
  columns?: 2 | 3
  orderedItems?: string[]
}

export type MarketingPageContent = {
  route: string
  title: string
  seoTitle: string
  description: string
  eyebrow: string
  heroTitle: string
  heroDescription: string
  primaryCtaLabel: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  whatsappMessage: string
  sections: MarketingSection[]
  finalCta: {
    title: string
    description: string
    buttonLabel: string
  }
}

export const pagesContent = {
  sobre: {
    route: "/sobre",
    title: "Sobre a Byte Criativo",
    seoTitle: "Sobre a Byte Criativo | Software House",
    description:
      "Conheça a Byte Criativo, software house que une desenvolvimento web, estratégia digital e atendimento próximo para criar soluções sob medida.",
    eyebrow: "Quem somos",
    heroTitle:
      "Criamos soluções digitais úteis, sustentáveis e alinhadas ao negócio.",
    heroDescription:
      "A Byte Criativo nasceu para ajudar empresas, profissionais e projetos a transformar ideias em sites, sistemas e ferramentas digitais funcionais. Antes de propor tecnologia, entendemos o problema, o público e o objetivo comercial.",
    primaryCtaLabel: "Conversar com a Byte Criativo",
    secondaryCtaLabel: "Ver serviços",
    secondaryCtaHref: "/servicos",
    whatsappMessage:
      "Olá! Li sobre a Byte Criativo e quero conversar sobre um projeto.",
    sections: [
      {
        title: "Desenvolvimento com visão estratégica",
        description:
          "Unimos desenvolvimento web, UX/UI, performance e conteúdo para entregar soluções que não dependem apenas de aparência. O foco é construir uma presença digital clara, rápida, confiável e preparada para evoluir.",
        cards: [
          {
            title: "Proximidade no atendimento",
            description:
              "Cada projeto começa com escuta ativa para entender contexto, orçamento, prioridades e restrições reais.",
          },
          {
            title: "Capacidade técnica",
            description:
              "Trabalhamos com bases sólidas de front-end, back-end, SEO técnico, integrações e manutenção.",
          },
          {
            title: "Solução antes de ferramenta",
            description:
              "A recomendação nasce do problema do cliente, não de uma tecnologia escolhida antes do diagnóstico.",
          },
        ],
      },
      {
        title: "O que orienta nosso trabalho",
        orderedItems: [
          "Entender o objetivo comercial antes de definir páginas, telas ou funcionalidades.",
          "Criar interfaces responsivas, claras e fáceis de manter.",
          "Organizar conteúdo, performance e SEO desde a estrutura inicial.",
          "Construir uma base técnica que permita melhorias futuras sem retrabalho desnecessário.",
        ],
      },
    ],
    finalCta: {
      title: "Tem uma ideia ou problema digital para resolver?",
      description:
        "Conte o contexto. A Byte Criativo ajuda a transformar necessidade, operação e estratégia em um caminho técnico viável.",
      buttonLabel: "Iniciar conversa",
    },
  },
  servicos: {
    route: "/servicos",
    title: "Serviços da Byte Criativo",
    seoTitle: "Serviços de Desenvolvimento Web, Sites e Sistemas",
    description:
      "Serviços da Byte Criativo: criação de sites profissionais, sistemas web, landing pages, automações, integrações e consultoria técnica.",
    eyebrow: "Nossos serviços",
    heroTitle: "Sites, sistemas e soluções digitais para empresas.",
    heroDescription:
      "A Byte Criativo planeja, desenvolve e evolui projetos digitais com foco em clareza, performance, conversão e manutenção sustentável.",
    primaryCtaLabel: "Solicitar orçamento",
    secondaryCtaLabel: "Ver páginas específicas",
    secondaryCtaHref: "/servicos/desenvolvimento-de-sites",
    whatsappMessage:
      "Olá! Vi os serviços da Byte Criativo e quero falar sobre um projeto.",
    sections: [
      {
        title: "Principais frentes de atuação",
        description:
          "Cada serviço pode ser contratado de forma independente ou combinado em um projeto completo, conforme o momento do negócio.",
        cards: [
          {
            title: "Criação de sites profissionais",
            description:
              "Sites institucionais responsivos, rápidos e preparados para apresentar sua empresa, gerar confiança e receber contatos qualificados.",
            href: "/servicos/desenvolvimento-de-sites",
            ctaLabel: "Ver sites profissionais",
          },
          {
            title: "Desenvolvimento de sistemas web",
            description:
              "Sistemas sob medida, painéis administrativos e plataformas para organizar processos e substituir controles improvisados.",
            href: "/servicos/sistemas-web-sob-medida",
            ctaLabel: "Ver sistemas web",
          },
          {
            title: "Landing pages de alta conversão",
            description:
              "Páginas para campanhas, anúncios, lançamentos e captação de leads com copy, design objetivo e CTAs claros.",
            href: "/servicos/landing-pages",
            ctaLabel: "Ver landing pages",
          },
          {
            title: "Automações e integrações",
            description:
              "Conexão entre ferramentas, formulários, APIs, planilhas, e-mails e fluxos internos para reduzir tarefas manuais.",
            href: "/servicos/automacao-e-integracoes",
            ctaLabel: "Ver automações",
          },
          {
            title: "Manutenção e evolução",
            description:
              "Melhorias em projetos existentes, ajustes técnicos, novas páginas, refatorações pontuais e acompanhamento de performance.",
          },
          {
            title: "Consultoria técnica",
            description:
              "Apoio para escolher arquitetura, priorizar escopo, avaliar riscos e transformar uma demanda digital em plano de execução.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Não sabe qual serviço combina com sua demanda?",
      description:
        "Explique o que precisa desenvolver ou melhorar. A Byte Criativo ajuda a organizar o escopo e indicar o melhor caminho.",
      buttonLabel: "Falar sobre minha demanda",
    },
  },
  portfolio: {
    route: "/portfolio",
    title: "Portfólio",
    seoTitle: "Portfólio de Sites, Sistemas e Projetos Digitais",
    description:
      "Portfólio da Byte Criativo com projetos de sites, sistemas web, produtos digitais, landing pages e soluções sob medida.",
    eyebrow: "Projetos",
    heroTitle:
      "Projetos digitais desenvolvidos com estratégia e cuidado técnico.",
    heroDescription:
      "Conheça projetos desenvolvidos pela Byte Criativo para conectar pessoas, valorizar iniciativas e criar experiências digitais.",
    primaryCtaLabel: "Quero um projeto assim",
    secondaryCtaLabel: "Ver serviços",
    secondaryCtaHref: "/servicos",
    whatsappMessage:
      "Olá! Vi os trabalhos da Byte Criativo e quero falar sobre um projeto.",
    sections: [
      {
        title: "Projetos em destaque",
        description:
          "Explore os projetos e acesse os sites para conhecer cada experiência.",
        columns: 2,
        cards: [
          {
            title: "Underground PB",
            meta: "Plataforma cultural",
            description:
              "Plataforma cultural que reúne bandas, agenda de shows, lançamentos, notícias, palcos e memória da cena independente da Paraíba.",
            href: "https://www.undergroundpb.com.br/",
            ctaLabel: "Acessar projeto",
            tags: [
              "Plataforma cultural",
              "Agenda de shows",
              "Conteúdo editorial",
            ],
            imageSrc: CaseUndergroundPB,
            imageAlt:
              "Página inicial do Underground PB, com destaque para shows e a cena independente da Paraíba",
          },
          {
            title: "Festival Alumiô",
            meta: "Site de festival",
            description:
              "Site do Festival Alumiô, encontro de música e arte no Centro Histórico de João Pessoa. Reúne programação, locais do circuito, memória do festival e orientações para o público.",
            href: "https://www.festivalalumio.com.br/",
            ctaLabel: "Acessar projeto",
            tags: ["Festival cultural", "Programação", "Circuito cultural"],
            imageSrc: CaseFestivalAlumio,
            imageAlt:
              "Página inicial do Festival Alumiô 2026, com identidade colorida, datas e chamada Vem alumiar o Centro",
          },
        ],
      },
    ],
    finalCta: {
      title: "Quer aparecer aqui com um projeto bem resolvido?",
      description:
        "Vamos entender seu objetivo e construir uma solução digital com estratégia, experiência e base técnica.",
      buttonLabel: "Começar meu projeto",
    },
  },
  contato: {
    route: "/contato",
    title: "Contato",
    seoTitle: "Contato | Solicite um Orçamento",
    description:
      "Entre em contato com a Byte Criativo para solicitar orçamento de site, sistema web, landing page, automação ou projeto digital sob medida.",
    eyebrow: "Vamos conversar",
    heroTitle: "Conte brevemente o que você precisa desenvolver.",
    heroDescription:
      "A Byte Criativo analisa sua demanda e propõe uma solução digital adequada ao seu momento, orçamento e objetivo. Você pode enviar uma ideia inicial, um problema operacional ou um projeto que precisa evoluir.",
    primaryCtaLabel: "Falar pelo WhatsApp",
    secondaryCtaLabel: "Enviar e-mail",
    secondaryCtaHref: `mailto:${CONTACT_EMAIL}`,
    whatsappMessage:
      "Olá! Vim pela página de contato da Byte Criativo e quero falar sobre um projeto.",
    sections: [
      {
        title: "O que enviar no primeiro contato",
        cards: [
          {
            title: "Objetivo do projeto",
            description:
              "Explique se precisa vender mais, organizar processos, lançar uma campanha, modernizar um site ou criar uma ferramenta.",
          },
          {
            title: "Contexto atual",
            description:
              "Conte se já existe site, sistema, planilha, marca, domínio, conteúdo ou ferramenta em uso.",
          },
          {
            title: "Prioridade e prazo",
            description:
              "Informe o que é essencial na primeira entrega e se existe alguma data importante.",
          },
        ],
      },
      {
        title: "Informações de contato",
        cards: [
          {
            title: "WhatsApp",
            description: WHATSAPP_DISPLAY,
          },
          {
            title: "E-mail comercial",
            description: CONTACT_EMAIL,
          },
          {
            title: "Atendimento",
            description:
              "Projetos para empresas, profissionais e iniciativas digitais em todo o Brasil.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Pronto para organizar sua demanda?",
      description:
        "Envie uma mensagem com o que precisa desenvolver. A resposta já vem com próximos passos possíveis.",
      buttonLabel: "Solicitar orçamento",
    },
  },
} satisfies Record<string, MarketingPageContent>
