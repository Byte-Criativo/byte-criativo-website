import { HomePageSchema, type HomePage } from "./schema"

export const homePageRaw = {
  hero: {
    h1: "Software sob medida com design que diferencia;",
    apoio:
      "Somos uma software house que une design e desenvolvimento para criar sites, sistemas e produtos digitais sob medida. Da primeira ideia ao software em uso.",
    ctaPrimary: {
      label: "Falar sobre meu projeto",
      href: "/contato",
    },
    ctaSecondary: {
      label: "Ver projetos",
      href: "/portfolio",
    },
  },
  salas: {
    items: [
      {
        slug: "underground-pb",
        name: "Underground PB",
        type: "Plataforma cultural",
        phrase:
          "A cena independente da Paraíba em um só lugar: bandas, agenda, palcos, lançamentos e memória, aberta à comunidade com curadoria.",
        capabilities: [
          "Busca e filtros",
          "Mapa de palcos",
          "Contas com moderação",
          "Navegação em celular",
        ],
        image: {
          src: "/cases/underground-pb/home-1440.avif",
          alt: "Página inicial do Underground PB, com o Beco Underground em destaque e acesso à agenda",
        },
        liveUrl: "https://www.undergroundpb.com.br/",
        caseStudyUrl: "/portfolio/underground-pb",
        verso: {
          needs: {
            title: "O que o site reúne",
            text: "Bandas, shows, palcos, lançamentos, notícias e memória numa plataforma com envios sujeitos à curadoria e navegação em celular.",
          },
          inProduction: {
            title: "O que está no ar",
            items: [
              "Diretório de bandas com busca e filtros",
              "Agenda com acervo de shows",
              "Mapa de palcos com filtros por região e gênero",
              "Memória da cena por décadas e mural",
              "Contas de representantes de bandas, com moderação",
              "Tema claro e escuro; manifest e service worker",
            ],
          },
          tech: "htmx e MapLibre",
        },
      },
      {
        slug: "festival-alumio",
        name: "Festival Alumiô",
        type: "Site de festival",
        phrase:
          "A programação na mão, com a cor do Centro Histórico de João Pessoa: apresentações filtráveis, favoritos sem cadastro, circuito e memória.",
        capabilities: [
          "Programação filtrável",
          "Favoritos salvos no aparelho",
          "Circuito",
          "Memória visual",
        ],
        image: {
          src: "/cases/festival-alumio/home-1440.avif",
          alt: "Página inicial do Festival Alumiô 2026, com ilustração colorida do Centro Histórico e as datas do festival",
        },
        liveUrl: "https://www.festivalalumio.com.br/",
        caseStudyUrl: "/portfolio/festival-alumio",
        verso: {
          needs: {
            title: "O que o site apresenta",
            text: "Três dias de festival gratuito em vários palcos e casas do Centro Histórico, com programação e favoritos no próprio aparelho, sem cadastro.",
          },
          inProduction: {
            title: "O que está no ar",
            items: [
              "Programação filtrável por dia, artista e palco, com a contagem de resultados anunciada para leitores de tela",
              '"Minha programação": favoritos salvos no próprio aparelho, sem cadastro',
              "Circuito com os pontos do festival",
              "Memória com galeria ampliável e acessível",
              "Fonte em cada apresentação e data de atualização da agenda",
            ],
          },
          tech: "Next.js",
        },
      },
      {
        slug: "goromax",
        name: "GOROMAX",
        type: "Site de banda",
        phrase:
          "Identidade, música, agenda e imprensa em um site para a banda GOROMAX, com design, UI/UX, conteúdo e desenvolvimento pela Byte.",
        capabilities: [
          "Identidade visual",
          "Discografia",
          "Agenda de shows",
          "Acervo de imprensa",
        ],
        image: {
          src: "/cases/goromax/home-1440.avif",
          alt: "Página inicial da GOROMAX, com fotografia da banda e identidade em tons escuros e laranja",
        },
        liveUrl: "https://www.goromax.com.br/",
        caseStudyUrl: "/portfolio/goromax",
        verso: {
          needs: {
            title: "O que o site reúne",
            text: "A presença da banda em um endereço próprio: lançamentos, shows, história, imagens e contato para imprensa e produção.",
          },
          inProduction: {
            title: "O que está no ar",
            items: [
              "Discografia com acesso às plataformas de música",
              "Agenda e histórico de apresentações",
              "Galeria de fotos e vídeos",
              "Página de imprensa com links para os veículos originais",
            ],
          },
          tech: "imagens responsivas e páginas dedicadas à música e à imprensa",
        },
      },
      {
        slug: "carlos-ferrer",
        name: "Carlos Ferrer Online",
        type: "Projeto próprio · currículo e portfólio",
        phrase:
          "Projeto próprio: site-currículo e portfólio de Carlos Ferrer, com quatro eras da web e navegação em português e inglês.",
        capabilities: [
          "Quatro eras da web",
          "Currículo",
          "Português e inglês",
          "Projeto próprio",
        ],
        image: {
          src: "/cases/carlos-ferrer/home-1440.avif",
          alt: "Abertura do portfólio Carlos Ferrer Online",
        },
        liveUrl: "https://www.carlosferrer.online/",
        caseStudyUrl: "/portfolio/carlos-ferrer",
        verso: {
          needs: {
            title: "O que o projeto explora",
            text: "A mesma trajetória profissional em quatro linguagens visuais, com acesso a experiência, projetos e currículo.",
          },
          inProduction: {
            title: "O que está no ar",
            items: [
              "Versões inspiradas em 1997, 2004, 2012 e 2026",
              "Navegação em português e inglês",
              "Página dedicada ao currículo",
              "Projetos e experiência profissional",
            ],
          },
          tech: "Next.js, React e TypeScript, conforme declarado no site",
        },
      },
    ],
    footerLink: {
      label: "Ver todos os projetos",
      href: "/portfolio",
    },
    bridgeText: "Por trás de cada um, a mesma forma de pensar.",
  },
  formaDePensar: {
    h2: "Design não é acabamento;",
    lede: "É o jeito como um produto mostra o próprio valor para quem chega pela primeira vez.",
    typographicBlock: "pensar; desenhar; construir; evoluir;",
    accessibleTypographicBlock: "Pensar, desenhar, construir, evoluir.",
    manifesto:
      "Muitas vezes o site é a primeira conversa entre alguém e o seu negócio. Por isso, na Byte Criativo, quem desenha é quem programa, e o contexto vem antes do código. O escopo fica claro antes de começar e o trabalho continua depois da entrega. Cada decisão fechada; o projeto, sempre em aberto.",
    principles: [
      {
        title: "Diagnóstico antes do código",
        text: "Antes de qualquer tela vem o contexto: o que você vende, para quem e como a operação funciona hoje. Disso sai um escopo escrito.",
        whereAppears:
          "na etapa de diagnóstico, antes da definição de escopo e das telas.",
      },
      {
        title: "Design e engenharia na mesma mesa",
        text: "Quem desenha a interface é quem programa. A decisão visual já nasce sabendo como vai funcionar, e nada se perde num repasse. Quando o projeto pede outra especialidade, parceiros entram sob a mesma condução.",
        whereAppears:
          "na revisão conjunta de interface e implementação, sem repasse entre equipes.",
      },
      {
        title: "Feito para durar e evoluir",
        text: "Desempenho, busca, acessibilidade e segurança entram na estrutura desde o início, e não no fim. A entrega fecha uma etapa; o projeto continua.",
        whereAppears:
          "nas verificações de desempenho, acessibilidade e segurança de cada entrega.",
      },
    ],
    contrastPhrases: [
      "Sem repasse entre atendimento, designer e programador.",
      "Nenhum projeto sai de um modelo pronto.",
    ],
    cta: {
      label: "Ver como trabalhamos",
      href: "/processo",
    },
    bridgeText: "Do jeito de pensar para o que a Byte faz.",
  },
  oQueFazemos: {
    h2: "Design e código para o que seu negócio precisa",
    situations: [
      {
        title: "Sites e experiências digitais",
        phrase:
          "Para apresentar seu negócio e transformar interesse em conversa. Sites, landing pages e conteúdo com identidade própria.",
        links: [
          {
            label: "Desenvolvimento de sites",
            href: "/servicos/desenvolvimento-de-sites",
          },
          { label: "Landing pages", href: "/servicos/landing-pages" },
          {
            label: "Copywriting para web",
            href: "/servicos/copywriting-para-web",
          },
          {
            label: "Ver estudo de caso do Festival Alumiô",
            href: "/portfolio/festival-alumio",
          },
        ],
      },
      {
        title: "Sistemas e produtos",
        phrase:
          "Para organizar operações e conectar ferramentas. Sistemas web, plataformas, automações e integrações com as regras do seu negócio.",
        links: [
          {
            label: "Sistemas web sob medida",
            href: "/servicos/sistemas-web-sob-medida",
          },
          {
            label: "Automação e integrações",
            href: "/servicos/automacao-e-integracoes",
          },
          {
            label: "Ver estudo de caso do Underground PB",
            href: "/portfolio/underground-pb",
          },
        ],
      },
      {
        title: "Design e estratégia de produto",
        phrase:
          "Para decidir o que construir primeiro e como será usado. Jornadas, interfaces e protótipos que aproximam a ideia da implementação.",
        links: [
          { label: "Design de produto", href: "/servicos/design-de-produto" },
          { label: "UI/UX design", href: "/servicos/ui-ux-design" },
        ],
      },
    ],
    footerNote:
      "Não sabe por onde começar? Definir o escopo é a primeira parte do trabalho.",
    cta: {
      label: "Ver todos os serviços",
      href: "/servicos",
    },
    bridgeText: "Seja qual for o caminho, você sabe como o projeto anda.",
  },
  comoAnda: {
    h2: "Como um projeto anda por aqui",
    lede: "Você sabe o que acontece, o que recebe e quando decide.",
    steps: [
      {
        number: 1,
        title: "Conversa inicial.",
        description:
          "Você conta o contexto e responde algumas perguntas sobre o que está em jogo.",
        youReceive:
          "uma resposta honesta sobre se faz sentido seguir e qual seria o caminho.",
      },
      {
        number: 2,
        title: "Diagnóstico e escopo.",
        description:
          "Objetivo, público, o que já existe e o que é essencial na primeira entrega.",
        youReceive:
          "proposta escrita com escopo, etapas, prazo, investimento, riscos e o que fica de fora.",
      },
      {
        number: 3,
        title: "Desenho.",
        description:
          "Estrutura, texto e interface evoluem juntos, com validações curtas.",
        youReceive: "as telas principais para aprovar antes do código.",
      },
      {
        number: 4,
        title: "Construção.",
        description:
          "Quem desenhou programa. Você acompanha num endereço de teste desde cedo.",
        youReceive:
          "acesso ao endereço de teste para ver o projeto tomar forma.",
      },
      {
        number: 5,
        title: "Lançamento e evolução.",
        description: "Publicação, medição do que importa e ajustes.",
        youReceive:
          "documentação essencial e uma lista priorizada de melhorias.",
      },
    ],
    note: "Não precisa chegar com tudo definido.",
    cta: {
      label: "Ver como trabalhamos",
      href: "/processo",
    },
    bridgeText: "E quem conduz tudo isso?",
  },
  conversa: {
    h2: "Conte o que você quer construir;",
    text: "Algumas linhas bastam. A resposta vem de quem conduz o projeto, com perguntas e um caminho possível. Sem compromisso e sem proposta genérica.",
    whoConducts:
      "Do site institucional à ferramenta que organiza sua operação, design e desenvolvimento fazem parte do mesmo trabalho. Você acompanha as decisões e conversa diretamente com quem conduz o projeto.",
    commitments: [
      {
        title: "Quem desenha, programa.",
        howToCheck:
          "desde a primeira conversa, você fala com quem vai desenhar e programar o projeto.",
      },
      {
        title: "Escopo escrito antes do código.",
        howToCheck:
          "a proposta traz entregáveis, etapas, prazo, investimento e o que fica de fora.",
      },
    ],
    formNotice:
      "Seus dados são usados só para responder sobre o seu projeto. Leia a política de privacidade.",
    submitLabel: "Enviar mensagem",
    whatsappCtaLabel: "Chamar no WhatsApp",
    microcopy: [
      "Não precisa ter tudo definido.",
      "Proposta com escopo, prazo e investimento antes de começar.",
    ],
    fullFormLink: {
      label: "Prefere dar mais detalhes? Use o formulário completo",
      href: "/contato",
    },
  },
}

export const homePageData: HomePage = HomePageSchema.parse(homePageRaw)

// ----------------------------------------------------------------------------
// Exports legados preservados para compatibilidade
// ----------------------------------------------------------------------------

export const sectionIds = {
  cases: "cases",
  services: "services",
  process: "process",
  faq: "FAQ",
  contact: "contact",
} as const

export const navigationItems = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Contato", href: "/contato" },
] as const

export const footerNavigationItems = [
  { label: "INÍCIO", href: "/" },
  { label: "SOBRE", href: "/sobre" },
  { label: "SERVIÇOS", href: "/servicos" },
  { label: "PORTFÓLIO", href: "/portfolio" },
  { label: "CONTATO", href: "/contato" },
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
  imageAlt:
    "Página inicial do Underground PB, com destaque para shows e a cena independente da Paraíba",
  tags: ["Plataforma cultural", "Agenda & bandas", "Conteúdo editorial"],
  problem:
    "O site reúne artistas, eventos, notícias e memória da cena alternativa paraibana.",
  solution:
    "A plataforma apresenta catálogo de bandas, agenda de shows, conteúdo editorial, playlist integrada, cadastro de artistas e recursos de participação da comunidade.",
  result:
    "Bandas, shows, lançamentos, palcos e histórias da cena reunidos em um mesmo espaço, com caminhos para explorar e contribuir com o acervo.",
  description:
    "O Underground PB reúne a cena alternativa e independente da Paraíba em uma plataforma cultural: catálogo de bandas, agenda de shows, notícias, memória da cena, playlist integrada, cadastro de artistas e contribuição para manter o conteúdo ativo.",
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
