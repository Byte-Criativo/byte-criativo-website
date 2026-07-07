export const sectionIds = {
  cases: "cases",
  services: "services",
  process: "process",
  audience: "audience",
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
    label: "Processo",
    href: `/#${sectionIds.process}`,
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
    label: "PROCESSO",
    href: `/#${sectionIds.process}`,
  },
  {
    label: "DÚVIDAS",
    href: `/#${sectionIds.faq}`,
  },
] as const

export const heroContent = {
  eyebrow: "Software house para projetos sob medida",
  heading: "Sites, sistemas e produtos digitais para empresas que querem",
  highlight: " vender mais e operar melhor",
  description:
    "Unimos estratégia, UI/UX, desenvolvimento e copy para transformar ideias em experiências digitais rápidas, claras e prontas para crescer junto com o negócio.",
  ctaLabel: "Agendar diagnóstico gratuito",
  secondaryCtaLabel: "Ver serviços",
  secondaryCtaHref: `/#${sectionIds.services}`,
} as const

export const highlightCards = [
  {
    icon: "shapes",
    title: "Diagnóstico antes do código",
    description:
      "Entendemos objetivo, público, operação e restrições antes de propor a solução.",
  },
  {
    icon: "sparkle",
    title: "Entrega pensada para conversão",
    description:
      "Desenhamos jornadas, textos e interfaces para reduzir fricção e gerar contatos.",
  },
  {
    icon: "lifebuoy",
    title: "Base pronta para evoluir",
    description:
      "Seu produto nasce com estrutura para manutenção, melhorias e novas integrações.",
  },
] as const

export const featuredCase = {
  eyebrow: "Case autoral",
  title: "Underground PB",
  imageAlt: "Preview do site Underground PB",
  tags: ["Plataforma cultural", "Agenda & bandas", "PWA"],
  problem:
    "A cena alternativa paraibana precisava de um espaço próprio para reunir artistas, eventos, notícias e memória em uma experiência fácil de explorar.",
  solution:
    "Criamos uma plataforma cultural com catálogo de bandas, agenda de shows, conteúdo editorial, playlist integrada, cadastro de artistas e recursos de participação da comunidade.",
  result:
    "O projeto saiu de uma presença dispersa para um produto digital vivo, com descoberta organizada, navegação responsiva e base técnica preparada para novas frentes editoriais.",
  description:
    "Desenvolvido por mim, o Underground PB reúne a cena alternativa e independente da Paraíba em uma plataforma viva: catálogo de bandas, agenda de shows, notícias, memória da cena, playlist integrada, cadastro de artistas e contribuição para manter o projeto ativo. Um produto cultural pensado para descoberta, participação e fortalecimento da comunidade underground paraibana.",
  href: "https://www.undergroundpb.com.br/",
  linkLabel: "Acessar site",
} as const

export const audienceSectionTitle = {
  eyebrow: "Para quem fazemos",
  heading: "Projetos digitais para negócios que precisam sair do improviso",
} as const

export const audiences = [
  {
    title: "Empresas em crescimento",
    description:
      "Sites, sistemas internos e integrações para times que precisam organizar processos e vender com mais previsibilidade.",
  },
  {
    title: "Marcas lançando uma nova oferta",
    description:
      "Landing pages, páginas institucionais e jornadas de conversão para validar mercado, captar leads e explicar valor com clareza.",
  },
  {
    title: "Operações com gargalos manuais",
    description:
      "Produtos web e automações para substituir planilhas, retrabalho e ferramentas desconectadas.",
  },
] as const

export const services = [
  {
    icon: "code",
    title: "Desenvolvimento de sites",
    description:
      "Páginas rápidas, responsivas e preparadas para SEO, campanhas e conversão.",
    href: "/servicos/desenvolvimento-de-sites",
  },
  {
    icon: "database",
    title: "Sistemas web sob medida",
    description:
      "Ferramentas internas, painéis, portais e fluxos digitais para ganhar eficiência.",
    href: "/servicos/sistemas-web-sob-medida",
  },
  {
    icon: "browser",
    title: "UI/UX Design",
    description:
      "Interfaces claras, bonitas e desenhadas para reduzir dúvidas em cada etapa.",
    href: "/servicos/ui-ux-design",
  },
  {
    icon: "shapes",
    title: "Landing pages",
    description:
      "Páginas focadas em oferta, tráfego pago, captura de leads e lançamento.",
    href: "/servicos/landing-pages",
  },
  {
    icon: "strategy",
    title: "Design de Produto",
    description:
      "Estruturação de produto, jornada, escopo e priorização antes da construção.",
    href: "/servicos/design-de-produto",
  },
  {
    icon: "penNib",
    title: "Copywriting para web",
    description:
      "Textos diretos para explicar valor, sustentar confiança e conduzir à ação.",
    href: "/servicos/copywriting-para-web",
  },
] as const

export const servicesSectionTitle = {
  eyebrow: "Nossos Serviços",
  heading: "O que a Byte Criativo pode construir com você",
} as const

export const processSectionTitle = {
  eyebrow: "Processo",
  heading: "Um caminho claro do diagnóstico ao lançamento",
} as const

export const processSteps = [
  {
    title: "Diagnóstico",
    description:
      "Mapeamos objetivo, público, concorrência, operação atual e critérios de sucesso do projeto.",
  },
  {
    title: "Proposta e escopo",
    description:
      "Organizamos prioridades, entregáveis, prazo, investimento e riscos antes de começar.",
  },
  {
    title: "Design e desenvolvimento",
    description:
      "Construímos com acompanhamento próximo, decisões registradas e validações ao longo do caminho.",
  },
  {
    title: "Entrega e evolução",
    description:
      "Publicamos, testamos, medimos pontos críticos e deixamos uma base preparada para melhorias.",
  },
] as const

export const trustSectionTitle = {
  eyebrow: "Por que funciona",
  heading: "Menos improviso, mais clareza para decidir e vender",
} as const

export const trustSignals = [
  {
    value: "Estratégia + execução",
    label:
      "A mesma visão que define a jornada também cuida da interface, do código e da mensagem.",
  },
  {
    value: "SEO desde a base",
    label:
      "Metadados, performance, estrutura semântica e conteúdo rastreável entram no projeto desde o início.",
  },
  {
    value: "Contato direto",
    label:
      "Você conversa com quem entende do produto, do escopo e das decisões técnicas.",
  },
] as const

export const faqSectionTitle = {
  eyebrow: "FAQ",
  heading: "Dúvidas antes de começar",
} as const

export const ctaContent = {
  title: "Vamos entender qual solução faz sentido para o seu negócio?",
  description:
    "Conte em poucas linhas o que você quer vender, organizar ou lançar. A gente responde com próximos passos, caminhos possíveis e uma noção inicial de escopo.",
  buttonLabel: "Falar sobre meu projeto",
} as const
