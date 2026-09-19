import { z } from "zod"
import {
  ServiceDetailPageSchema,
  ServiceHubSchema,
  type ServiceDetailPage,
  type ServiceHub,
} from "./schema"

export const serviceHubRaw = {
  intro: {
    route: "/servicos",
    title: "Serviços de desenvolvimento web, sistemas e design",
    seoTitle: "Desenvolvimento de sites, sistemas e design | Byte Criativo",
    description:
      "Sites, landing pages, sistemas web, automações, UI/UX, design de produto e copywriting, com design e engenharia decididos juntos desde o diagnóstico.",
    h1: "Sites, sistemas e design decididos na mesma mesa;",
    lede: "A Byte Criativo desenha e programa sites, plataformas e sistemas sob medida. Os serviços estão separados abaixo para facilitar a busca. Na prática, um projeto costuma cruzar mais de um, e quem conduz é a mesma pessoa.",
    anchorLinks: [
      { label: "Sites e experiências", href: "#sites-e-experiencias" },
      { label: "Sistemas e produtos", href: "#sistemas-e-produtos" },
      { label: "Design", href: "#design" },
    ],
  },
  situacoes: [
    {
      situation: "O site não acompanha o que a empresa virou.",
      targetAnchor: "#sites-e-experiencias",
      targetLabel: "Ir para Sites e experiências",
    },
    {
      situation: "A operação cabe em planilhas e grupos de WhatsApp.",
      targetAnchor: "#sistemas-e-produtos",
      targetLabel: "Ir para Sistemas e produtos",
    },
    {
      situation:
        "O evento, a banda ou o projeto cultural precisa de uma casa própria.",
      targetAnchor: "#sites-e-experiencias",
      targetLabel: "Ir para Sites e experiências",
    },
    {
      situation: "A ideia é boa, mas não está claro o que construir primeiro.",
      targetAnchor: "#design",
      targetLabel: "Ir para Design",
    },
  ],
  capacidades: [
    {
      id: "sites-e-experiencias",
      title: "Sites e experiências",
      text: "Para apresentar a empresa de hoje, explicar o que ela faz e levar a conversa adiante.",
      services: [
        {
          slug: "desenvolvimento-de-sites" as const,
          title: "Desenvolvimento de sites",
          description:
            "Sites de empresa e de marca que explicam o que você faz antes da primeira reunião.",
          href: "/servicos/desenvolvimento-de-sites",
        },
        {
          slug: "landing-pages" as const,
          title: "Landing pages",
          description:
            "Uma página para uma oferta, campanha ou lançamento, com uma ação principal.",
          href: "/servicos/landing-pages",
        },
      ],
      relatedCase: {
        title: "Festival Alumiô",
        slug: "festival-alumio",
        linkText: "Ver estudo de caso do Festival Alumiô",
      },
    },
    {
      id: "sistemas-e-produtos",
      title: "Sistemas e produtos",
      text: "Para a operação que não cabe mais em planilha e para produtos com contas, regras e fluxos próprios.",
      services: [
        {
          slug: "sistemas-web-sob-medida" as const,
          title: "Sistemas web sob medida",
          description:
            "Plataformas, painéis e portais feitos para o seu processo, começando pelo trecho que mais trava.",
          href: "/servicos/sistemas-web-sob-medida",
        },
        {
          slug: "automacao-e-integracoes" as const,
          title: "Automação e integrações",
          description:
            "As ferramentas que você já usa conversando entre si, sem copiar e colar.",
          href: "/servicos/automacao-e-integracoes",
        },
      ],
      relatedCase: {
        title: "Underground PB",
        slug: "underground-pb",
        linkText: "Ver estudo de caso do Underground PB",
      },
    },
    {
      id: "design",
      title: "Design",
      text: "Para decidir o que construir, como vai funcionar e o que cada tela diz. Aqui o desenho já nasce sabendo como vai ser programado.",
      services: [
        {
          slug: "ui-ux-design" as const,
          title: "UI/UX design",
          description:
            "Interface e fluxo decididos junto com o código, para quem usa entender e agir.",
          href: "/servicos/ui-ux-design",
        },
        {
          slug: "design-de-produto" as const,
          title: "Design de produto",
          description:
            "Diagnóstico, escopo e primeira versão: o que construir primeiro e o que pode esperar.",
          href: "/servicos/design-de-produto",
        },
        {
          slug: "copywriting-para-web" as const,
          title: "Copywriting para web",
          description:
            "Texto escrito junto com a interface, para a página explicar o valor sozinha.",
          href: "/servicos/copywriting-para-web",
        },
      ],
    },
  ],
  evolucaoContinua: {
    h2: "Evolução contínua",
    text: "A entrega fecha uma etapa, não o projeto. Depois do lançamento, o trabalho pode seguir com ajustes, novas páginas, melhorias de desempenho e novas funcionalidades, com a prioridade definida junto com você. Projetos que já estão no ar, feitos por outras pessoas, também podem ser avaliados para melhorias.",
    cta: {
      label: "Ver como um projeto anda depois da entrega",
      href: "/processo",
    },
  },
  ctaFinal: {
    h2: "Não sabe por onde começar? Conte o contexto.",
    text: 'No formulário, marque "Ainda não sei". Definir o escopo é a primeira parte do trabalho.',
    ctaPrimary: {
      label: "Falar sobre um projeto",
      href: "/contato?tipo=ainda-nao-sei&origem=servicos",
    },
    ctaSecondary: {
      label: "Chamar no WhatsApp",
      whatsappMessage:
        "Olá! Vi os serviços da Byte Criativo e quero falar sobre um projeto.",
    },
  },
}

export const serviceHubData: ServiceHub = ServiceHubSchema.parse(serviceHubRaw)

export const servicePagesRaw = [
  {
    slug: "desenvolvimento-de-sites" as const,
    title: "Desenvolvimento de sites profissionais",
    seoTitle: "Criação de sites profissionais sob medida | Byte Criativo",
    eyebrow: "Sites de empresa e de marca",
    description:
      "Sites de empresa e de marca desenhados e programados pela mesma pessoa: estrutura, texto, interface e código pensados juntos, rápidos no celular.",
    promise:
      "Sites de empresa e de marca que explicam o que você faz antes da primeira reunião. Estrutura, texto, interface e código são decididos juntos, por quem desenha e programa.",
    whatsappMessage:
      "Olá! Vi a página de sites da Byte Criativo e quero conversar sobre um site para o meu negócio.",
    quandoFazSentido: [
      "O site não mostra o que a empresa virou, ou ainda apresenta a oferta de alguns anos atrás.",
      "A empresa vive de indicação e precisa de um site que explique o serviço sem você presente.",
      "O serviço é complexo e precisa ser entendido em poucos minutos.",
      "A marca tem identidade forte, mas o site parece um tema qualquer.",
    ],
    oQueRecebe: [
      "Estrutura de páginas e caminho de navegação definidos a partir do que você vende e para quem.",
      "Interface com a identidade da marca, desenhada para o celular desde o início.",
      "Site implementado e publicado, com títulos, descrições, dados estruturados e sitemap.",
      "Quando já existe um site: mapa das páginas atuais e redirecionamentos, para não perder o que já aparece na busca.",
      "Base técnica pronta para receber novas páginas sem refazer o que existe.",
    ],
    ondeFoiAplicado: {
      description:
        "Festival Alumiô: site de festival com programação filtrável por dia, palco e artista e favoritos salvos no aparelho, sem cadastro.",
      caseSlug: "festival-alumio",
      linkText: "Ver estudo de caso do Festival Alumiô",
      linkHref: "/portfolio/festival-alumio",
    },
    comoConduzimos: [
      "Antes da interface, o que o visitante precisa entender e fazer em cada página.",
      "Texto e layout evoluem juntos, para a página não depender de texto provisório.",
      "Desenvolvimento num endereço de teste que você acompanha.",
      "Publicação com revisão de desempenho, acessibilidade e busca.",
    ],
    faqs: [
      {
        question: "O site já nasce preparado para aparecer no Google?",
        answer:
          "A estrutura técnica entra desde o início: títulos, descrições, hierarquia de conteúdo, endereços legíveis e páginas rastreáveis. A posição na busca também depende de conteúdo, autoridade e histórico do domínio, e isso ninguém garante.",
      },
      {
        question:
          "Já tenho um site. Vou perder o que ele já conquistou na busca?",
        answer:
          "A troca começa pelo mapa das páginas atuais. Endereços que já recebem visitas são mantidos ou redirecionados para a página nova equivalente, para reduzir a perda na busca.",
      },
      {
        question: "A Byte Criativo faz só o layout?",
        answer:
          "Dá para contratar só o design. Mas o ponto forte está em fazer as duas coisas: quem desenha é quem programa, e nada se perde entre o desenho e o código.",
      },
      {
        question: "Quanto custa um site?",
        answer:
          "Depende do número de páginas, do conteúdo pronto e das funcionalidades. A proposta traz escopo, etapas, prazo e investimento antes de começar.",
      },
    ],
    servicosRelacionados: [
      "landing-pages" as const,
      "copywriting-para-web" as const,
    ],
    bestFor: [
      "O site não mostra o que a empresa virou, ou ainda apresenta a oferta de alguns anos atrás.",
      "A empresa vive de indicação e precisa de um site que explique o serviço sem você presente.",
      "O serviço é complexo e precisa ser entendido em poucos minutos.",
      "A marca tem identidade forte, mas o site parece um tema qualquer.",
    ],
    outcomes: [
      "Estrutura de páginas e caminho de navegação definidos a partir do que você vende e para quem.",
      "Interface com a identidade da marca, desenhada para o celular desde o início.",
      "Site implementado e publicado, com títulos, descrições, dados estruturados e sitemap.",
    ],
    deliverables: [
      "Estrutura de páginas e jornada de navegação",
      "Interface responsiva com identidade da marca",
      "Implementação em front-end moderno",
      "Metadados SEO, Open Graph e sitemap atualizado",
    ],
    process: [
      "Antes da interface, o que o visitante precisa entender e fazer em cada página.",
      "Texto e layout evoluem juntos, para a página não depender de texto provisório.",
      "Desenvolvimento num endereço de teste que você acompanha.",
      "Publicação com revisão de desempenho, acessibilidade e busca.",
    ],
  },
  {
    slug: "landing-pages" as const,
    title: "Landing pages para campanhas e lançamentos",
    seoTitle: "Landing pages para campanhas e lançamentos | Byte Criativo",
    eyebrow: "Uma página, uma ação clara",
    description:
      "Landing pages para uma oferta, campanha ou lançamento, com texto, design e código feitos juntos, uma ação principal clara e carregamento leve no celular.",
    promise:
      "Uma página para uma oferta específica precisa responder rápido: o que é, para quem é, por que confiar e qual é o próximo passo. Texto, design e código saem da mesma mão.",
    whatsappMessage:
      "Olá! Vi a página de landing pages da Byte Criativo. Tenho uma campanha ou lançamento e quero conversar sobre uma página.",
    quandoFazSentido: [
      "Campanhas com anúncio pago, que precisam de uma página de destino objetiva.",
      "Lançamento de serviço, produto ou lista de espera.",
      "Uma oferta que se perde no meio do site completo.",
    ],
    oQueRecebe: [
      "Texto da página, da promessa às dúvidas e à ação principal.",
      "Design responsivo, pensado primeiro para o celular.",
      "Página implementada e publicada.",
      "Cliques e envios importantes preparados para medição, combinados com você e sem dados pessoais na ferramenta de medição.",
    ],
    ondeFoiAplicado: {
      description:
        "Ainda não há um estudo de caso de landing page publicado aqui. Os princípios são os mesmos dos trabalhos no ar: uma pergunta principal por página, prova antes do pedido e carregamento leve no celular.",
      linkText: "Ver todos os trabalhos",
      linkHref: "/portfolio",
    },
    comoConduzimos: [
      "Entender a oferta, o público e de onde vem o tráfego.",
      "Organizar promessa, dúvidas e provas antes do layout.",
      "Desenhar e programar a página.",
      "Revisar a ação principal, a versão de celular e a medição antes de publicar.",
    ],
    faqs: [
      {
        question: "Landing page substitui um site?",
        answer:
          "Não necessariamente. Ela funciona melhor para uma oferta específica. Para apresentar a empresa inteira, um site completo tende a funcionar melhor.",
      },
      {
        question: "Dá para medir o resultado da campanha?",
        answer:
          "Sim. Os cliques e envios que importam são preparados para a ferramenta de medição. Se houver anúncios, a plataforma de anúncio só recebe dados com o consentimento de quem visita.",
      },
      {
        question: "Quanto tempo leva?",
        answer:
          "Depende de a oferta e o texto já estarem definidos. A proposta traz as datas e o que depende de você, como textos, imagens e aprovações.",
      },
    ],
    servicosRelacionados: [
      "desenvolvimento-de-sites" as const,
      "copywriting-para-web" as const,
    ],
    bestFor: [
      "Campanhas com anúncio pago, que precisam de uma página de destino objetiva.",
      "Lançamento de serviço, produto ou lista de espera.",
      "Uma oferta que se perde no meio do site completo.",
    ],
    outcomes: [
      "Texto da página, da promessa às dúvidas e à ação principal.",
      "Design responsivo, pensado primeiro para o celular.",
      "Página implementada e publicada.",
    ],
    deliverables: [
      "Copywriting focado em conversão",
      "Design responsivo otimizado para mobile",
      "Página implementada e integrada",
      "Configuração de eventos de analytics sem cookies",
    ],
    process: [
      "Entender a oferta, o público e de onde vem o tráfego.",
      "Organizar promessa, dúvidas e provas antes do layout.",
      "Desenhar e programar a página.",
      "Revisar a ação principal, a versão de celular e a medição antes de publicar.",
    ],
  },
  {
    slug: "sistemas-web-sob-medida" as const,
    title: "Sistemas web e plataformas sob medida",
    seoTitle: "Sistemas web e plataformas sob medida | Byte Criativo",
    eyebrow: "Operação digital sob medida",
    description:
      "Sistemas web, painéis, portais e plataformas feitos para o seu processo, começando pelo trecho da operação que mais trava, com design e código juntos.",
    promise:
      "Quando a operação cabe em planilhas, grupos de WhatsApp e ferramentas que não conversam, um sistema feito para o seu processo devolve o controle. O trabalho começa pelo trecho que mais trava.",
    whatsappMessage:
      "Olá! Vi a página de sistemas sob medida da Byte Criativo e quero conversar sobre um sistema para a minha operação.",
    quandoFazSentido: [
      "Etapas manuais se repetem todo dia, com risco de erro.",
      "A informação está espalhada em planilhas e conversas, sem um lugar confiável.",
      "O negócio precisa de cadastro, painel, portal, área com login ou fluxo de aprovação próprio.",
      "Uma plataforma aberta ao público precisa de contas, contribuições e moderação.",
    ],
    oQueRecebe: [
      "Mapa de regras, telas e permissões do processo.",
      "Desenho das jornadas principais para aprovar antes do código.",
      "Sistema desenvolvido, da interface ao servidor, conforme o escopo, e publicado.",
      "Documentação essencial de uso.",
    ],
    ondeFoiAplicado: {
      description:
        "Underground PB: contas de representantes de bandas, comentários moderados, busca, filtros, mapa de palcos e instalação como app (observado em 16/09/2026).",
      caseSlug: "underground-pb",
      linkText: "Ver estudo de caso do Underground PB",
      linkHref: "/portfolio/underground-pb",
    },
    comoConduzimos: [
      "Entender o processo atual e onde ele trava.",
      "Escolher um primeiro escopo que já resolva algo de verdade.",
      "Construir em etapas, com validação a cada entrega.",
      "Entregar com acompanhamento e uma lista priorizada das próximas evoluções.",
    ],
    faqs: [
      {
        question: "Preciso ter o sistema todo desenhado antes de começar?",
        answer:
          "Não. O processo começa justamente pela organização do problema, dos fluxos e das prioridades, para definir um primeiro escopo viável.",
      },
      {
        question: "Dá para integrar com ferramentas que já uso?",
        answer:
          "Na maioria dos casos, sim. APIs, permissões e limites técnicos são avaliados no diagnóstico, para não prometer uma integração que não se sustenta.",
      },
      {
        question: "Um sistema pronto, por assinatura, não resolve?",
        answer:
          "Às vezes resolve, e isso é dito na conversa. Sistema sob medida faz sentido quando regras específicas, integrações ou o jeito de trabalhar da empresa não cabem numa ferramenta pronta.",
      },
    ],
    servicosRelacionados: [
      "automacao-e-integracoes" as const,
      "design-de-produto" as const,
    ],
    bestFor: [
      "Etapas manuais se repetem todo dia, com risco de erro.",
      "A informação está espalhada em planilhas e conversas, sem um lugar confiável.",
      "O negócio precisa de cadastro, painel, portal, área com login ou fluxo de aprovação próprio.",
      "Uma plataforma aberta ao público precisa de contas, contribuições e moderação.",
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
      "Entender o processo atual e onde ele trava.",
      "Escolher um primeiro escopo que já resolva algo de verdade.",
      "Construir em etapas, com validação a cada entrega.",
      "Entregar com acompanhamento e uma lista priorizada das próximas evoluções.",
    ],
  },
  {
    slug: "automacao-e-integracoes" as const,
    title: "Automação de processos e integração de sistemas",
    seoTitle: "Automação de processos e integrações | Byte Criativo",
    eyebrow: "Processos conectados sem tarefas manuais",
    description:
      "Automação de tarefas repetitivas e integração entre formulários, planilhas, e-mails, agendas, CRMs e APIs, para as ferramentas que você usa conversarem.",
    promise:
      "Quando a rotina depende de copiar e colar entre ferramentas, conectar as pontas costuma custar menos que um sistema novo. O ponto de partida são as ferramentas que você já usa.",
    whatsappMessage:
      "Olá! Vi a página de automações da Byte Criativo e quero conversar sobre conectar as ferramentas que uso.",
    quandoFazSentido: [
      "A mesma informação é digitada em duas ou mais ferramentas.",
      "Avisos, confirmações e relatórios dependem de alguém lembrar de mandar.",
      "As ferramentas atuais funcionam bem, só não conversam entre si.",
    ],
    oQueRecebe: [
      "Mapa do fluxo atual e dos pontos onde a informação se perde.",
      "Integrações com APIs, planilhas, e-mails, agendas e CRMs.",
      "Rotinas automáticas de avisos e atualizações.",
      "Documentação essencial de como o fluxo funciona.",
    ],
    ondeFoiAplicado: {
      description:
        "Ainda não há um estudo de caso de automação publicado aqui. Antes de propor qualquer integração, o diagnóstico confere o que cada ferramenta permite: APIs, permissões e limites de uso. Assim, nenhuma conexão é prometida sem se sustentar.",
      linkText: "Ver todos os trabalhos",
      linkHref: "/portfolio",
    },
    comoConduzimos: [
      "Entender o processo e as ferramentas atuais.",
      "Escolher o fluxo que mais toma tempo.",
      "Implementar em partes, testando cada uma antes de ligar a próxima.",
      "Ajustar depois de ver o fluxo funcionando no dia a dia.",
    ],
    faqs: [
      {
        question: "Preciso trocar as ferramentas que já uso?",
        answer:
          "Na maioria dos casos, não. A automação aproveita o que já funciona e conecta as pontas, desde que as ferramentas tenham APIs ou formatos de exportação utilizáveis.",
      },
      {
        question: "Automação serve para empresa pequena?",
        answer:
          "Sim. Quanto menor a empresa, mais pesa o tempo gasto com tarefa repetida. Um fluxo simples já faz diferença.",
      },
      {
        question: "Automação ou sistema sob medida?",
        answer:
          "Se as ferramentas atuais resolvem o trabalho e só não conversam, automação. Se o processo não cabe em nenhuma delas, um sistema. O diagnóstico ajuda a decidir, e às vezes o caminho é começar pela automação.",
      },
    ],
    servicosRelacionados: [
      "sistemas-web-sob-medida" as const,
      "design-de-produto" as const,
    ],
    bestFor: [
      "A mesma informação é digitada em duas ou mais ferramentas.",
      "Avisos, confirmações e relatórios dependem de alguém lembrar de mandar.",
      "As ferramentas atuais funcionam bem, só não conversam entre si.",
    ],
    outcomes: [
      "Fluxos automáticos entre as ferramentas que você já usa",
      "Menos erros de digitação e retrabalho",
      "Dados centralizados para decidir com mais segurança",
    ],
    deliverables: [
      "Mapeamento do fluxo atual e dos pontos de fricção",
      "Integrações com APIs, planilhas, e-mails e CRMs",
      "Automação de notificações e rotinas operacionais",
      "Documentação essencial de uso",
    ],
    process: [
      "Entender o processo e as ferramentas atuais.",
      "Escolher o fluxo que mais toma tempo.",
      "Implementar em partes, testando cada uma antes de ligar a próxima.",
      "Ajustar depois de ver o fluxo funcionando no dia a dia.",
    ],
  },
  {
    slug: "ui-ux-design" as const,
    title: "UI/UX design para sites e sistemas",
    seoTitle: "UI/UX design para sites e sistemas | Byte Criativo",
    eyebrow: "Interfaces desenhadas por quem programa",
    description:
      "UI/UX design feito por quem também programa: fluxo, interface e texto decididos junto com o código, para quem usa entender, decidir e agir sem ajuda.",
    promise:
      "Na Byte Criativo, design não é acabamento: é o jeito como um produto mostra o próprio valor. Quem desenha a interface também escreve o código, então cada decisão visual já nasce sabendo como vai funcionar.",
    whatsappMessage:
      "Olá! Vi a página de UI/UX da Byte Criativo e quero conversar sobre a interface de um produto.",
    quandoFazSentido: [
      "Muita gente chega à página e não entende o que fazer.",
      "A equipe evita usar um sistema interno, ou usa errado.",
      "Uma ideia precisa sair do documento e virar tela navegável.",
    ],
    oQueRecebe: [
      "Mapa da jornada e organização do conteúdo (arquitetura de informação).",
      "Wireframes e telas das jornadas prioritárias, para aprovar antes do código.",
      "Design responsivo com componentes reaproveitáveis.",
      "Implementação fiel, quando o desenvolvimento entra no mesmo projeto.",
    ],
    ondeFoiAplicado: {
      description:
        "Festival Alumiô: filtros de programação com contagem acessível para leitores de tela e favoritos sem cadastro. Underground PB: busca, filtros e mapa de palcos.",
      caseSlug: "festival-alumio",
      linkText: "Ver estudo de caso do Festival Alumiô",
      linkHref: "/portfolio/festival-alumio",
    },
    comoConduzimos: [
      "Levantar quem usa, o que precisa fazer e onde trava hoje.",
      "Organizar a jornada e as telas prioritárias.",
      "Desenhar e validar com você em ciclos curtos.",
      "Implementar, ou preparar a implementação, com acessibilidade conferida.",
    ],
    faqs: [
      {
        question: "UI/UX vale a pena em projeto pequeno?",
        answer:
          "Sim, na escala certa. Mesmo uma página simples precisa de hierarquia, mensagem clara e um caminho de ação bem definido.",
      },
      {
        question: "A Byte Criativo também desenvolve depois do design?",
        answer:
          "Sim, e esse é o caminho recomendado: a mesma pessoa que desenhou implementa, e a interface chega ao ar como foi aprovada.",
      },
      {
        question: "O que é UI e o que é UX?",
        answer:
          "UX é o caminho: o que a pessoa precisa fazer e em que ordem. UI é a interface: o que ela vê e toca em cada tela. Um não funciona bem sem o outro.",
      },
    ],
    servicosRelacionados: [
      "design-de-produto" as const,
      "copywriting-para-web" as const,
      "desenvolvimento-de-sites" as const,
    ],
    bestFor: [
      "Muita gente chega à página e não entende o que fazer.",
      "A equipe evita usar um sistema interno, ou usa errado.",
      "Uma ideia precisa sair do documento e virar tela navegável.",
    ],
    outcomes: [
      "Mapa da jornada e organização do conteúdo (arquitetura de informação).",
      "Wireframes e telas das jornadas prioritárias, para aprovar antes do código.",
      "Design responsivo com componentes reaproveitáveis.",
    ],
    deliverables: [
      "Fluxo de navegação e mapa de jornadas",
      "Wireframes e protótipos de alta fidelidade",
      "Design system com tokens e componentes",
      "Especificação técnica para desenvolvimento",
    ],
    process: [
      "Levantar quem usa, o que precisa fazer e onde trava hoje.",
      "Organizar a jornada e as telas prioritárias.",
      "Desenhar e validar com você em ciclos curtos.",
      "Implementar, ou preparar a implementação, com acessibilidade conferida.",
    ],
  },
  {
    slug: "design-de-produto" as const,
    title: "Design de produto digital: do problema à primeira versão",
    seoTitle: "Design de produto digital: escopo e MVP | Byte Criativo",
    eyebrow: "Do problema à primeira versão",
    description:
      "Design de produto para definir o que construir primeiro: problema, público, prioridades e o escopo da primeira versão (MVP), antes de investir em código.",
    promise:
      "Antes de construir tudo, a menor versão que prova a ideia. Design de produto organiza problema, público e prioridades num escopo que dá para construir e que aguenta a segunda versão.",
    whatsappMessage:
      "Olá! Vi a página de design de produto da Byte Criativo e quero ajuda para definir o que construir primeiro.",
    quandoFazSentido: [
      "Uma ideia parece boa nas conversas, mas ainda não diz o que construir primeiro.",
      "A empresa quer digitalizar uma operação e não sabe por onde começar.",
      "O escopo ficou grande demais para o orçamento e precisa ser cortado sem perder valor.",
    ],
    oQueRecebe: [
      "Mapa do problema, do público e da proposta.",
      "Funcionalidades priorizadas: o que entra agora e o que espera.",
      "Jornada e estrutura da primeira versão.",
      "Documento de escopo que serve de base para orçamento, cronograma e desenvolvimento.",
    ],
    ondeFoiAplicado: {
      description:
        "Underground PB: bandas, agenda, palcos, lançamentos, notícias, memória e mural reunidos numa só plataforma, com contas e moderação (observado em 16/09/2026).",
      caseSlug: "underground-pb",
      linkText: "Ver estudo de caso do Underground PB",
      linkHref: "/portfolio/underground-pb",
    },
    comoConduzimos: [
      "Imersão no contexto e em quem vai usar.",
      "Hipóteses e objetivos: o que precisa ser verdade para a ideia funcionar.",
      "Definição da primeira versão e do que fica para depois.",
      "Plano de execução em etapas.",
    ],
    faqs: [
      {
        question: "Design de produto é só para startup?",
        answer:
          "Não. Qualquer empresa que cria uma solução digital própria ganha com prioridade clara, escopo definido e uma jornada organizada.",
      },
      {
        question: "Isso vem antes do desenvolvimento?",
        answer:
          "Em geral, sim. Essa etapa evita retrabalho, decisões soltas e investimento em funcionalidades sem prioridade.",
      },
      {
        question: "O que é MVP?",
        answer:
          "É a sigla em inglês para a primeira versão viável de um produto. É a menor versão que pessoas reais já conseguem usar e que ensina o que construir em seguida.",
      },
    ],
    servicosRelacionados: [
      "ui-ux-design" as const,
      "sistemas-web-sob-medida" as const,
    ],
    bestFor: [
      "Uma ideia parece boa nas conversas, mas ainda não diz o que construir primeiro.",
      "A empresa quer digitalizar uma operação e não sabe por onde começar.",
      "O escopo ficou grande demais para o orçamento e precisa ser cortado sem perder valor.",
    ],
    outcomes: [
      "Mapa do problema, do público e da proposta.",
      "Funcionalidades priorizadas: o que entra agora e o que espera.",
      "Jornada e estrutura da primeira versão.",
    ],
    deliverables: [
      "Mapa do problema, público e proposta de valor",
      "Matriz de priorização de funcionalidades",
      "Jornada do usuário e wireframes do MVP",
      "Documento de escopo e cronograma de execução",
    ],
    process: [
      "Imersão no contexto e em quem vai usar.",
      "Hipóteses e objetivos: o que precisa ser verdade para a ideia funcionar.",
      "Definição da primeira versão e do que fica para depois.",
      "Plano de execução em etapas.",
    ],
  },
  {
    slug: "copywriting-para-web" as const,
    title: "Copywriting para web: texto pensado junto com a interface",
    seoTitle: "Copywriting para sites e landing pages | Byte Criativo",
    eyebrow: "Texto pensado junto com a interface",
    description:
      "Copywriting para web escrito junto com a interface: mensagem principal, seções, dúvidas e botões pensados com o layout, para a página explicar o valor sozinha.",
    promise:
      "A interface guia o olhar; o texto ajuda a decidir. Aqui o texto nasce com o layout, e não depois dele. Cada seção diz uma coisa, e cada botão diz o que acontece ao clicar.",
    whatsappMessage:
      "Olá! Vi a página de textos para web da Byte Criativo e quero conversar sobre os textos do meu site.",
    quandoFazSentido: [
      "O site explica pouco e a venda depende demais de reunião.",
      "A landing page recebe visitas, mas quase ninguém age.",
      "O produto digital deixa quem usa em dúvida sobre o próximo passo.",
    ],
    oQueRecebe: [
      "Estrutura da página: a ordem em que as ideias aparecem.",
      "Textos de abertura, seções, provas e dúvidas frequentes.",
      "Microcopy de botões, formulários, erros e confirmações.",
      "Ajustes de título e descrição para a busca, quando fizer sentido.",
    ],
    ondeFoiAplicado: {
      description:
        "Ainda não há um estudo de caso de copywriting publicado aqui. O próprio site da Byte Criativo segue estas regras: um vocabulário único de ações e mensagens de erro que dizem o que fazer.",
      linkText: "Ver todos os trabalhos",
      linkHref: "/portfolio",
    },
    comoConduzimos: [
      "Entender a oferta, o público e as objeções.",
      "Definir a mensagem principal e os argumentos.",
      "Escrever a página ou revisar o texto atual.",
      "Ajustar o texto junto com o design e o desenvolvimento.",
    ],
    faqs: [
      {
        question: "Copywriting é diferente de texto institucional?",
        answer:
          "Sim. O texto institucional apresenta a empresa. Copywriting organiza a mensagem para ajudar quem visita a entender o valor e tomar uma decisão.",
      },
      {
        question: "O texto é escrito junto com o design?",
        answer:
          "Sim. A página funciona melhor quando texto e interface são pensados juntos, e não como camadas separadas no fim do projeto.",
      },
    ],
    servicosRelacionados: [
      "ui-ux-design" as const,
      "landing-pages" as const,
      "desenvolvimento-de-sites" as const,
    ],
    bestFor: [
      "O site explica pouco e a venda depende demais de reunião.",
      "A landing page recebe visitas, mas quase ninguém age.",
      "O produto digital deixa quem usa em dúvida sobre o próximo passo.",
    ],
    outcomes: [
      "Estrutura da página: a ordem em que as ideias aparecem.",
      "Textos de abertura, seções, provas e dúvidas frequentes.",
      "Microcopy de botões, formulários, erros e confirmações.",
    ],
    deliverables: [
      "Hierarquia de mensagens da página",
      "Redação completa de títulos, seções e chamadas",
      "Microcopy de botões, feedbacks e formulários",
      "Metadados otimizados para mecanismos de busca",
    ],
    process: [
      "Entender a oferta, o público e as objeções.",
      "Definir a mensagem principal e os argumentos.",
      "Escrever a página ou revisar o texto atual.",
      "Ajustar o texto junto com o design e o desenvolvimento.",
    ],
  },
]

export const servicePages: ServiceDetailPage[] = z
  .array(ServiceDetailPageSchema)
  .parse(servicePagesRaw)

export type ServicePage = ServiceDetailPage

export function getServicePage(slug: string): ServiceDetailPage | undefined {
  return servicePages.find((service) => service.slug === slug)
}
