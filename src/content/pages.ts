import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from "@/src/lib/contact"

export type MarketingCard = {
  title: string
  description: string
  meta?: string
  href?: string
  ctaLabel?: string
  tags?: string[]
  imageSrc?: string
  imageAlt?: string
}

export type MarketingSection = {
  eyebrow?: string
  title: string
  description?: string
  cards?: MarketingCard[]
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
  sections: MarketingSection[]
  finalCta: {
    title: string
    description: string
    buttonLabel: string
  }
}

export const pageRoutes = [
  "/sobre",
  "/servicos",
  "/sites-profissionais",
  "/sistemas-web",
  "/landing-pages",
  "/automacao-e-integracoes",
  "/portfolio",
  "/blog",
  "/contato",
] as const

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
    secondaryCtaHref: "/sites-profissionais",
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
            href: "/sites-profissionais",
            ctaLabel: "Ver sites profissionais",
          },
          {
            title: "Desenvolvimento de sistemas web",
            description:
              "Sistemas sob medida, painéis administrativos e plataformas para organizar processos e substituir controles improvisados.",
            href: "/sistemas-web",
            ctaLabel: "Ver sistemas web",
          },
          {
            title: "Landing pages de alta conversão",
            description:
              "Páginas para campanhas, anúncios, lançamentos e captação de leads com copy, design objetivo e CTAs claros.",
            href: "/landing-pages",
            ctaLabel: "Ver landing pages",
          },
          {
            title: "Automações e integrações",
            description:
              "Conexão entre ferramentas, formulários, APIs, planilhas, e-mails e fluxos internos para reduzir tarefas manuais.",
            href: "/automacao-e-integracoes",
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
  sitesProfissionais: {
    route: "/sites-profissionais",
    title: "Sites Profissionais",
    seoTitle: "Criação de Sites Profissionais para Empresas",
    description:
      "Criação de sites profissionais, responsivos e otimizados para SEO para empresas que precisam fortalecer sua presença digital.",
    eyebrow: "Criação de sites",
    heroTitle: "Site profissional para transmitir confiança e gerar contatos.",
    heroDescription:
      "Desenvolvemos sites para empresas com comunicação clara, estrutura semântica, performance e experiência responsiva. Um bom site apresenta sua oferta, ajuda o cliente a decidir e torna sua marca mais encontrável no Google.",
    primaryCtaLabel: "Solicitar site profissional",
    secondaryCtaLabel: "Ver portfólio",
    secondaryCtaHref: "/portfolio",
    sections: [
      {
        title: "O que um site profissional precisa entregar",
        cards: [
          {
            title: "Design responsivo",
            description:
              "Layout adaptado para desktop, tablet e mobile, com leitura confortável e navegação simples.",
          },
          {
            title: "SEO básico e semântica",
            description:
              "Títulos, metadados, hierarquia de conteúdo e URLs amigáveis para criar uma base rastreável.",
          },
          {
            title: "Performance",
            description:
              "Páginas leves e bem estruturadas para reduzir espera, melhorar experiência e apoiar campanhas.",
          },
          {
            title: "Comunicação clara",
            description:
              "Textos organizados para explicar serviços, diferenciais, provas e próximos passos sem ruído.",
          },
          {
            title: "Formulários e WhatsApp",
            description:
              "Caminhos diretos de contato para transformar visitantes interessados em conversas comerciais.",
          },
          {
            title: "Manutenção futura",
            description:
              "Base preparada para novas páginas, ajustes de conteúdo, SEO contínuo e melhorias de conversão.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Sua empresa precisa de uma presença digital mais profissional?",
      description:
        "A Byte Criativo cria sites com estrutura clara, boa performance e foco em conversão.",
      buttonLabel: "Pedir orçamento de site",
    },
  },
  sistemasWeb: {
    route: "/sistemas-web",
    title: "Sistemas Web Sob Medida",
    seoTitle: "Desenvolvimento de Sistema Web Sob Medida",
    description:
      "Desenvolvimento de sistemas web sob medida, software personalizado, painéis administrativos e plataformas para empresas.",
    eyebrow: "Software personalizado",
    heroTitle: "Sistemas web para organizar processos e reduzir retrabalho.",
    heroDescription:
      "Criamos sistemas web sob medida para empresas que precisam substituir planilhas, centralizar informações, controlar acessos e transformar processos manuais em fluxos digitais confiáveis.",
    primaryCtaLabel: "Planejar meu sistema",
    secondaryCtaLabel: "Ver automações",
    secondaryCtaHref: "/automacao-e-integracoes",
    sections: [
      {
        title: "Exemplos de sistemas que podemos desenvolver",
        cards: [
          {
            title: "Sistemas de cadastro",
            description:
              "Cadastros de clientes, produtos, equipes, documentos e informações críticas com organização e busca.",
          },
          {
            title: "Painéis administrativos",
            description:
              "Áreas internas para acompanhar dados, editar conteúdos, aprovar solicitações e gerenciar rotinas.",
          },
          {
            title: "Plataformas de gestão",
            description:
              "Fluxos personalizados para vendas, atendimento, operações, projetos, agenda ou prestação de serviços.",
          },
          {
            title: "Dashboards",
            description:
              "Visualização de indicadores, filtros e relatórios para apoiar decisões do dia a dia.",
          },
          {
            title: "Login e permissões",
            description:
              "Controle de acesso por perfil para proteger informações e separar responsabilidades.",
          },
          {
            title: "Integrações com APIs",
            description:
              "Conexão com ferramentas externas para pagamentos, CRM, agendas, formulários e outros sistemas.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Planilhas e controles manuais estão limitando sua operação?",
      description:
        "Vamos mapear o processo e definir um primeiro sistema viável para sua empresa.",
      buttonLabel: "Conversar sobre sistema web",
    },
  },
  landingPages: {
    route: "/landing-pages",
    title: "Landing Pages",
    seoTitle: "Criação de Landing Pages de Alta Conversão",
    description:
      "Criação de landing pages para campanhas, páginas de vendas, páginas de captura, anúncios e validação de ofertas.",
    eyebrow: "Páginas para campanha",
    heroTitle: "Landing pages focadas em oferta, tráfego e conversão.",
    heroDescription:
      "Desenvolvemos landing pages para campanhas, lançamentos, anúncios, captação de leads e validação de ofertas. A página é construída para responder rápido, reduzir dúvidas e conduzir o visitante para a ação.",
    primaryCtaLabel: "Criar landing page",
    secondaryCtaLabel: "Ver sites profissionais",
    secondaryCtaHref: "/sites-profissionais",
    sections: [
      {
        title: "Elementos essenciais de uma landing page",
        cards: [
          {
            title: "Estrutura de conversão",
            description:
              "Blocos organizados para promessa, benefício, prova, objeções e chamada para ação.",
          },
          {
            title: "Copywriting",
            description:
              "Texto claro para explicar a oferta, reforçar valor e orientar a decisão do visitante.",
          },
          {
            title: "Design objetivo",
            description:
              "Interface sem distrações, com hierarquia visual e foco no próximo passo.",
          },
          {
            title: "Formulários e CTAs",
            description:
              "Campos e botões bem posicionados para captação de leads, vendas ou conversas no WhatsApp.",
          },
          {
            title: "Velocidade",
            description:
              "Carregamento rápido para não desperdiçar tráfego pago nem prejudicar a experiência.",
          },
          {
            title: "Integrações",
            description:
              "Conexão com WhatsApp, e-mail, CRM ou ferramentas usadas na operação comercial.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Vai rodar uma campanha ou validar uma nova oferta?",
      description:
        "A Byte Criativo cria uma página de campanha com mensagem, design e tecnologia trabalhando juntos.",
      buttonLabel: "Solicitar landing page",
    },
  },
  automacaoIntegracoes: {
    route: "/automacao-e-integracoes",
    title: "Automação e Integrações",
    seoTitle: "Automação de Processos e Integração de Sistemas",
    description:
      "Automação de processos, integração com API, sistemas integrados e redução de tarefas manuais para empresas.",
    eyebrow: "Processos mais conectados",
    heroTitle: "Automações para economizar tempo e reduzir erros.",
    heroDescription:
      "A Byte Criativo ajuda empresas a conectar ferramentas digitais, automatizar tarefas repetitivas e criar fluxos mais previsíveis entre formulários, sistemas, planilhas, e-mails, agendas, CRMs e APIs.",
    primaryCtaLabel: "Automatizar processo",
    secondaryCtaLabel: "Ver sistemas web",
    secondaryCtaHref: "/sistemas-web",
    sections: [
      {
        title: "O que pode ser automatizado ou integrado",
        cards: [
          {
            title: "Formulários e cadastros",
            description:
              "Envio automático de dados, organização de leads e atualização de registros sem retrabalho.",
          },
          {
            title: "APIs externas",
            description:
              "Integrações com plataformas que já fazem parte da rotina da empresa.",
          },
          {
            title: "E-mails automáticos",
            description:
              "Notificações, confirmações, alertas e mensagens operacionais disparadas por eventos.",
          },
          {
            title: "Planilhas conectadas",
            description:
              "Fluxos que alimentam ou leem planilhas quando elas ainda fazem parte da operação.",
          },
          {
            title: "Pagamentos, agenda e CRM",
            description:
              "Conexões para reduzir etapas manuais entre venda, atendimento, cobrança e acompanhamento.",
          },
          {
            title: "Sistemas integrados",
            description:
              "Pontes entre ferramentas para centralizar dados e diminuir erros de digitação ou duplicidade.",
          },
        ],
      },
    ],
    finalCta: {
      title: "Qual tarefa repetitiva mais consome tempo hoje?",
      description:
        "Descreva o fluxo atual. A Byte Criativo avalia o que pode ser conectado, simplificado ou automatizado.",
      buttonLabel: "Mapear automação",
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
      "Conheça trabalhos e estruturas preparadas para sites, sistemas, produtos digitais e experiências web. Novos projetos serão adicionados conforme forem publicados.",
    primaryCtaLabel: "Quero um projeto assim",
    secondaryCtaLabel: "Ver serviços",
    secondaryCtaHref: "/servicos",
    sections: [
      {
        title: "Projetos em destaque",
        description:
          "A estrutura abaixo está preparada para receber novos cases com categoria, descrição, tecnologias, imagem, links e detalhes.",
        cards: [
          {
            title: "Underground PB",
            meta: "Plataforma cultural",
            description:
              "Produto digital para reunir bandas, eventos, notícias, agenda e memória da cena alternativa paraibana.",
            href: "https://www.undergroundpb.com.br/",
            ctaLabel: "Acessar projeto",
            tags: ["Next.js", "PWA", "Conteúdo editorial"],
            imageSrc: "/case-undergroundpb.png",
            imageAlt:
              "Preview do projeto Underground PB desenvolvido pela Byte Criativo",
          },
          {
            title: "Novos projetos em breve",
            meta: "Portfólio em evolução",
            description:
              "Em breve, novos projetos desenvolvidos pela Byte Criativo estarão disponíveis aqui.",
            tags: ["Sites", "Sistemas", "Landing pages"],
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
  blog: {
    route: "/blog",
    title: "Blog",
    seoTitle: "Blog sobre Sites, Sistemas Web e Automação",
    description:
      "Conteúdos da Byte Criativo sobre sites profissionais, landing pages, sistemas web sob medida, automação e estratégia digital.",
    eyebrow: "Conteúdo e SEO",
    heroTitle:
      "Ideias práticas para empresas que querem crescer com tecnologia.",
    heroDescription:
      "O blog da Byte Criativo será usado para explicar decisões digitais, orientar contratações e fortalecer a estratégia de SEO com conteúdos úteis para empresas.",
    primaryCtaLabel: "Sugerir pauta",
    secondaryCtaLabel: "Falar com a Byte",
    secondaryCtaHref: "/contato",
    sections: [
      {
        title: "Temas iniciais preparados",
        description:
          "A listagem já está pronta para evoluir para posts dinâmicos ou páginas individuais de artigos.",
        cards: [
          {
            title: "Por que sua empresa precisa de um site profissional?",
            meta: "Sites profissionais",
            description:
              "Como um site ajuda a transmitir confiança, organizar serviços e gerar contatos comerciais.",
            ctaLabel: "Em breve",
          },
          {
            title: "Diferença entre site institucional e landing page",
            meta: "Estratégia digital",
            description:
              "Quando usar cada formato e como escolher a estrutura certa para presença, campanha ou captação.",
            ctaLabel: "Em breve",
          },
          {
            title: "Quando vale a pena criar um sistema web sob medida?",
            meta: "Sistemas web",
            description:
              "Sinais de que planilhas, ferramentas soltas e processos manuais estão limitando a operação.",
            ctaLabel: "Em breve",
          },
          {
            title: "Como a automação pode reduzir tarefas manuais",
            meta: "Automação",
            description:
              "Exemplos de fluxos digitais que economizam tempo e reduzem erros em empresas.",
            ctaLabel: "Em breve",
          },
          {
            title:
              "O que observar antes de contratar uma empresa para seu site?",
            meta: "Contratação",
            description:
              "Critérios técnicos, estratégicos e comerciais para tomar uma decisão mais segura.",
            ctaLabel: "Em breve",
          },
        ],
      },
    ],
    finalCta: {
      title: "Quer transformar uma dúvida em conteúdo ou projeto?",
      description:
        "A Byte Criativo pode ajudar a organizar uma estratégia de presença digital e SEO para sua empresa.",
      buttonLabel: "Conversar sobre estratégia",
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
