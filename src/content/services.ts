export type ServicePage = {
  slug: string
  title: string
  seoTitle: string
  description: string
  eyebrow: string
  promise: string
  bestFor: string[]
  outcomes: string[]
  deliverables: string[]
  process: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const servicePages: ServicePage[] = [
  {
    slug: "desenvolvimento-de-sites",
    title: "Desenvolvimento de sites profissionais",
    seoTitle: "Desenvolvimento de Sites Profissionais",
    eyebrow: "Sites rápidos, claros e preparados para crescer",
    description:
      "Criamos sites institucionais, páginas comerciais e experiências web sob medida para empresas que precisam explicar valor, aparecer no Google e transformar visitas em conversas.",
    promise:
      "Um site bem construído não é só uma vitrine: ele organiza sua proposta, reduz dúvidas, sustenta campanhas e cria uma base confiável para novas oportunidades.",
    bestFor: [
      "Empresas que dependem de indicação, mas querem gerar demanda própria",
      "Negócios que têm um site antigo, lento ou desalinhado com a oferta atual",
      "Marcas que precisam apresentar serviços complexos com clareza",
    ],
    outcomes: [
      "Arquitetura de página orientada por objetivo comercial",
      "Conteúdo rastreável pelo Google e estruturado para leitura rápida",
      "Experiência responsiva, performática e fácil de evoluir",
    ],
    deliverables: [
      "Estrutura de páginas e jornada de navegação",
      "Interface responsiva com identidade da marca",
      "Implementação em front-end moderno",
      "Metadados SEO, Open Graph e sitemap atualizado",
    ],
    process: [
      "Diagnóstico de oferta, público e concorrentes diretos",
      "Definição de mapa do site, mensagens-chave e CTAs",
      "Design da experiência e desenvolvimento das páginas",
      "Publicação, revisão técnica e ajustes finais de performance",
    ],
    faqs: [
      {
        question: "O site já nasce preparado para SEO?",
        answer:
          "Sim. A estrutura técnica inclui metadados, hierarquia de conteúdo, URLs amigáveis e páginas rastreáveis. A evolução de ranqueamento depende também de conteúdo, autoridade e histórico do domínio.",
      },
      {
        question: "Vocês fazem apenas o layout?",
        answer:
          "Podemos atuar do planejamento à implementação. O ideal é unir estratégia, UI/UX, copy e desenvolvimento para evitar um site bonito que não comunica valor.",
      },
    ],
  },
  {
    slug: "sistemas-web-sob-medida",
    title: "Sistemas web sob medida",
    seoTitle: "Sistemas Web Sob Medida",
    eyebrow: "Ferramentas digitais para organizar a operação",
    description:
      "Desenvolvemos sistemas web, painéis, portais e fluxos internos para empresas que precisam reduzir retrabalho, conectar informações e operar com mais previsibilidade.",
    promise:
      "Quando planilhas e processos manuais começam a limitar o crescimento, um sistema sob medida ajuda a transformar conhecimento operacional em produto digital utilizável.",
    bestFor: [
      "Empresas com etapas manuais repetitivas",
      "Times que dependem de várias ferramentas desconectadas",
      "Negócios que precisam de painel, cadastro, portal ou fluxo próprio",
    ],
    outcomes: [
      "Fluxos digitais alinhados ao processo real da empresa",
      "Base técnica pronta para integrações e novas funcionalidades",
      "Interface simples para uso recorrente por equipes internas",
    ],
    deliverables: [
      "Mapeamento de regras, telas e permissões",
      "Protótipo ou desenho funcional das jornadas principais",
      "Desenvolvimento front-end e back-end conforme escopo",
      "Publicação e documentação essencial de uso",
    ],
    process: [
      "Entendimento do processo atual e dos gargalos",
      "Priorização do primeiro escopo funcional",
      "Construção incremental com validações por etapa",
      "Entrega assistida e planejamento das próximas evoluções",
    ],
    faqs: [
      {
        question: "Preciso ter o sistema todo desenhado antes de começar?",
        answer:
          "Não. O processo começa justamente com a organização do problema, dos fluxos e das prioridades para definir um primeiro escopo viável.",
      },
      {
        question: "Dá para integrar com ferramentas que já uso?",
        answer:
          "Na maioria dos casos, sim. Avaliamos APIs, permissões e limitações técnicas durante o diagnóstico para evitar promessas frágeis.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design para produtos digitais",
    seoTitle: "UI/UX Design para Sites e Sistemas",
    eyebrow: "Interfaces que reduzem dúvidas e conduzem ação",
    description:
      "Projetamos interfaces para sites, sistemas e produtos digitais com foco em clareza, consistência, conversão e facilidade de uso.",
    promise:
      "Design útil é o que ajuda alguém a entender, decidir e agir. A estética importa, mas ela precisa servir à jornada.",
    bestFor: [
      "Produtos digitais com baixa conversão ou muita dúvida do usuário",
      "Sistemas difíceis de usar por equipes internas",
      "Novas ideias que precisam sair do briefing e virar experiência navegável",
    ],
    outcomes: [
      "Jornadas mais claras para o usuário final",
      "Componentes visuais consistentes e reaproveitáveis",
      "Protótipos que reduzem risco antes do desenvolvimento",
    ],
    deliverables: [
      "Mapeamento de jornada e arquitetura de informação",
      "Wireframes ou protótipos de alta fidelidade",
      "Design responsivo das telas prioritárias",
      "Orientação para implementação fiel da interface",
    ],
    process: [
      "Levantamento de público, objetivo e fricções atuais",
      "Organização da jornada e das telas prioritárias",
      "Criação visual e refinamento com feedback",
      "Preparação para desenvolvimento",
    ],
    faqs: [
      {
        question: "UI/UX é necessário em projetos menores?",
        answer:
          "Sim, em escala adequada. Mesmo uma página simples precisa de hierarquia, mensagem clara e caminho de ação bem definido.",
      },
      {
        question: "Vocês também desenvolvem depois do design?",
        answer:
          "Sim. O desenvolvimento pode entrar no mesmo projeto para manter coerência entre estratégia, interface e implementação.",
      },
    ],
  },
  {
    slug: "landing-pages",
    title: "Landing pages para campanhas e lançamentos",
    seoTitle: "Landing Pages para Captação de Leads",
    eyebrow: "Páginas focadas em oferta, tráfego e conversão",
    description:
      "Criamos landing pages para campanhas, validação de ofertas, captação de leads e lançamentos, combinando copy, design e implementação rápida.",
    promise:
      "Uma landing page precisa responder rápido: o que é, para quem é, por que confiar e qual é o próximo passo.",
    bestFor: [
      "Campanhas de tráfego pago",
      "Lançamento de serviço, produto ou lista de espera",
      "Ofertas que precisam de uma página mais objetiva que o site completo",
    ],
    outcomes: [
      "Mensagem central clara para a oferta",
      "Blocos de prova, objeções e chamada para ação",
      "Estrutura pronta para mensuração de cliques e conversões",
    ],
    deliverables: [
      "Copy da página orientada por conversão",
      "Design responsivo da landing page",
      "Desenvolvimento e publicação",
      "Configuração de metadados e eventos essenciais",
    ],
    process: [
      "Entendimento da oferta e do público da campanha",
      "Organização da promessa, objeções e provas",
      "Design e desenvolvimento da página",
      "Revisão de CTA, responsividade e rastreamento",
    ],
    faqs: [
      {
        question: "Landing page substitui um site?",
        answer:
          "Não necessariamente. Ela é melhor quando existe uma oferta específica. Para presença institucional ampla, um site completo tende a funcionar melhor.",
      },
      {
        question: "Vocês configuram eventos de conversão?",
        answer:
          "Podemos preparar cliques e eventos importantes para integração com ferramentas como Google Tag Manager e plataformas de anúncio.",
      },
    ],
  },
  {
    slug: "design-de-produto",
    title: "Design de produto digital",
    seoTitle: "Design de Produto Digital",
    eyebrow: "Do problema ao escopo que faz sentido construir",
    description:
      "Ajudamos a estruturar produtos digitais, priorizar funcionalidades, organizar jornadas e transformar ideias em escopos mais claros para desenvolvimento.",
    promise:
      "Antes de investir em tecnologia, vale entender qual problema precisa ser resolvido, para quem, com qual prioridade e com qual primeira versão.",
    bestFor: [
      "Ideias de produto que ainda estão abstratas",
      "Empresas que querem digitalizar uma operação, mas não sabem por onde começar",
      "Projetos que precisam reduzir escopo sem perder valor",
    ],
    outcomes: [
      "Visão clara do primeiro produto viável",
      "Menos desperdício com funcionalidades pouco importantes",
      "Base para orçamento, cronograma e desenvolvimento",
    ],
    deliverables: [
      "Mapeamento de problema, público e proposta",
      "Priorização de funcionalidades",
      "Jornada e estrutura do produto",
      "Documento de escopo para desenvolvimento",
    ],
    process: [
      "Imersão no contexto do negócio",
      "Organização de hipóteses, usuários e objetivos",
      "Definição do MVP ou primeira versão",
      "Planejamento da execução",
    ],
    faqs: [
      {
        question: "Design de produto é só para startups?",
        answer:
          "Não. Qualquer empresa que cria uma solução digital própria se beneficia de priorização, escopo e clareza de jornada.",
      },
      {
        question: "Isso vem antes do desenvolvimento?",
        answer:
          "Geralmente sim. Essa etapa ajuda a evitar retrabalho, decisões soltas e investimento em funcionalidades sem prioridade.",
      },
    ],
  },
  {
    slug: "copywriting-para-web",
    title: "Copywriting para web",
    seoTitle: "Copywriting para Sites e Landing Pages",
    eyebrow: "Texto estratégico para explicar valor e conduzir ação",
    description:
      "Criamos e refinamos textos para sites, landing pages e produtos digitais com foco em clareza, posicionamento, objeções e conversão.",
    promise:
      "A interface guia o olhar, mas o texto ajuda a decisão. Copywriting bem feito torna a oferta mais fácil de entender e mais forte para vender.",
    bestFor: [
      "Sites que explicam pouco ou dependem demais de reunião para vender",
      "Landing pages com tráfego, mas baixa conversão",
      "Produtos digitais que precisam orientar melhor o usuário",
    ],
    outcomes: [
      "Mensagens mais diretas e alinhadas ao público",
      "CTAs e seções organizadas por intenção",
      "Menos ruído entre oferta, prova e ação",
    ],
    deliverables: [
      "Estrutura narrativa da página",
      "Textos para hero, seções, benefícios, prova e FAQ",
      "Revisão de microcopy em botões e fluxos",
      "Ajustes para SEO on-page quando aplicável",
    ],
    process: [
      "Entendimento da oferta, público e objeções",
      "Definição de mensagem principal e argumentos",
      "Redação da página ou revisão do texto atual",
      "Refinamento junto ao design e desenvolvimento",
    ],
    faqs: [
      {
        question: "Copywriting é diferente de texto institucional?",
        answer:
          "Sim. O texto institucional apresenta a empresa; copywriting organiza a mensagem para ajudar o visitante a entender valor e tomar uma decisão.",
      },
      {
        question: "Vocês escrevem junto com o design?",
        answer:
          "Sim. A melhor experiência nasce quando texto e interface são pensados juntos, não como camadas separadas no fim do projeto.",
      },
    ],
  },
]

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug)
}
