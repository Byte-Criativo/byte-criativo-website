export const sectionIds = {
  cases: "cases",
  services: "services",
  process: "process",
  faq: "FAQ",
  contact: "contact",
} as const

export const navigationItems = [
  {
    label: "Início",
    href: "/",
  },
  {
    label: "Sobre",
    href: "/sobre",
  },
  {
    label: "Serviços",
    href: "/servicos",
  },
  {
    label: "Portfólio",
    href: "/portfolio",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contato",
    href: "/contato",
  },
] as const

export const footerNavigationItems = [
  {
    label: "INÍCIO",
    href: "/",
  },
  {
    label: "SOBRE",
    href: "/sobre",
  },
  {
    label: "SERVIÇOS",
    href: "/servicos",
  },
  {
    label: "PORTFÓLIO",
    href: "/portfolio",
  },
  {
    label: "BLOG",
    href: "/blog",
  },
  {
    label: "CONTATO",
    href: "/contato",
  },
] as const

export const heroContent = {
  eyebrow: "software house · design e engenharia",
  heading: "Sites e sistemas sob medida para vender mais e operar melhor",
  description:
    "A Byte Criativo planeja, desenha e desenvolve o projeto inteiro com o mesmo time. Você conversa direto com quem decide e escreve o código.",
  ctaLabel: "Falar sobre meu projeto",
  secondaryCtaLabel: "Ver projetos",
  secondaryCtaHref: "/portfolio",
} as const

export const featuredCase = {
  eyebrow: "prova de trabalho",
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
    "Desenvolvido por nós, o Underground PB reúne a cena alternativa e independente da Paraíba em uma plataforma viva: catálogo de bandas, agenda de shows, notícias, memória da cena, playlist integrada, cadastro de artistas e contribuição para manter o projeto ativo. Um produto cultural pensado para descoberta, participação e fortalecimento da comunidade underground paraibana.",
  href: "https://www.undergroundpb.com.br/",
  linkLabel: "Acessar site",
} as const

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
  {
    icon: "plugs",
    title: "Automação e integrações",
    description:
      "Conexões entre ferramentas, APIs e planilhas para reduzir tarefas manuais.",
    href: "/servicos/automacao-e-integracoes",
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

export const whyUsSectionTitle = {
  eyebrow: "diferenciais",
  heading: "Por que a Byte Criativo",
} as const

export const whyUs = [
  {
    title: "Diagnóstico antes do código",
    description:
      "Entendemos objetivo, público e operação antes de propor qualquer solução.",
  },
  {
    title: "SEO, performance e segurança desde a base",
    description:
      "Não são extras: entram na estrutura do projeto no primeiro dia.",
  },
  {
    title: "Contato direto",
    description:
      "Quem responde sua mensagem é quem projeta e desenvolve, então nada se perde no caminho.",
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
} as const
