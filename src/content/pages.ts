import {
  ProcessoPageSchema,
  SobrePageSchema,
  ContatoPageSchema,
  ObrigadoPageSchema,
  PrivacidadePageSchema,
  PortfolioPageSchema,
  type ProcessoPage,
  type SobrePage,
  type ContatoPage,
  type ObrigadoPage,
  type PrivacidadePage,
  type PortfolioPage,
} from "./schema"
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact"
import CaseUndergroundPB from "@/assets/case-undergroundpb-screenshot.webp"
import CaseFestivalAlumio from "@/assets/case-festival-alumio-screenshot.webp"
import type { StaticImageData } from "next/image"

// ============================================================================
// Processo Page Data
// ============================================================================

export const processoPageRaw = {
  seo: {
    title: "Processo de trabalho",
    seoTitle: "Processo: do diagnóstico à evolução | Byte Criativo",
    description:
      "Como um projeto anda na Byte Criativo: conversa, diagnóstico e escopo, desenho, construção e lançamento, com o que você recebe e decide em cada etapa.",
  },
  h1: "Como um projeto anda por aqui;",
  lede: "Antes de desenhar, vem o entendimento do que precisa acontecer. Antes de programar, escopo, prazo e investimento ficam fechados com você. O que você aprova é o que vai ao ar.",
  ondeSeCruzam: {
    h2: "Onde design, produto e engenharia se cruzam",
    text: "Aqui as etapas não passam de mão em mão. Quem faz o diagnóstico desenha as telas e escreve o código, então uma decisão tomada na primeira conversa chega inteira ao que vai ao ar. O desenho já considera como vai ser construído, e o código respeita o que foi desenhado.",
  },
  etapas: [
    {
      number: 1,
      title: "Conversa inicial",
      whatHappens:
        "Você conta o contexto e responde perguntas até ficar claro o que está em jogo.",
      youReceive:
        "Uma resposta honesta sobre se faz sentido seguir e qual seria o caminho. Se um template ou uma ferramenta pronta resolver, isso é dito.",
      yourParticipation:
        "Contar o que existe hoje, o que precisa mudar e se há uma data importante.",
    },
    {
      number: 2,
      title: "Diagnóstico e escopo",
      whatHappens:
        "Objetivo, público, o que já existe e o que é essencial na primeira entrega viram um escopo.",
      youReceive:
        "Proposta escrita com escopo, etapas, prazo, investimento, riscos e o que fica de fora.",
      yourParticipation:
        "Responder perguntas, apontar o que é essencial e aprovar a proposta.",
    },
    {
      number: 3,
      title: "Desenho",
      whatHappens:
        "Estrutura, texto e interface evoluem juntos, com validações curtas.",
      youReceive: "As telas principais para aprovar antes do código.",
      yourParticipation: "Dar retorno em cada validação e aprovar o desenho.",
    },
    {
      number: 4,
      title: "Construção",
      whatHappens:
        "Quem desenhou programa. O projeto vai para um endereço de teste desde cedo.",
      youReceive: "Acesso ao endereço de teste para acompanhar a construção.",
      yourParticipation:
        "Acompanhar, testar e enviar os textos, imagens e acessos que forem seus.",
      whereAppears:
        "O Underground PB funciona como app no celular (PWA), com página própria para quando a conexão cai (observado em 16/09/2026).",
    },
    {
      number: 5,
      title: "Lançamento e evolução",
      whatHappens: "Publicação, medição do que importa e ajustes.",
      youReceive: "Documentação essencial e uma lista priorizada de melhorias.",
      yourParticipation:
        "Aprovar a publicação e apontar o que observar depois.",
      whereAppears:
        "No Festival Alumiô, cada informação traz fonte e data de atualização (observado em 16/09/2026).",
    },
  ],
  diagnostico: {
    h2: "O diagnóstico",
    text: "O diagnóstico é a etapa em que o contexto vira escopo. Ele responde cinco perguntas:",
    questions: [
      "O que precisa acontecer, e por que agora?",
      "Para quem é o site, a plataforma ou o sistema?",
      "O que já existe e pode ser aproveitado?",
      "O que é essencial na primeira entrega?",
      "O que fica de fora, pelo menos por enquanto?",
    ],
    whatToBring: {
      h3: "O que ajuda trazer",
      items: [
        "O endereço do site ou o nome das ferramentas que você usa hoje.",
        "Exemplos de que você gosta ou não gosta.",
        "O que precisa mudar.",
        "Qualquer data importante.",
      ],
      note: "Não precisa chegar com tudo definido: organizar isso é parte do trabalho.",
    },
    whatComesOut: {
      h3: "O que sai do diagnóstico",
      text: "A proposta escrita da etapa 2, com escopo, etapas, prazo, investimento, riscos e o que fica de fora.",
    },
  },
  parceiros: {
    h2: "Parceiros e responsabilidade",
    text: "Uma pessoa conduz design e engenharia do começo ao fim. Quando o projeto pede outra especialidade ou mais mãos num prazo apertado, entram parceiros sob a mesma condução. Você continua falando com a mesma pessoa, e a responsabilidade pelo projeto continua com a Byte Criativo.",
  },
  depoisDaEntrega: {
    h2: "Depois da entrega",
    text: "A entrega fecha uma etapa, não o projeto. Depois do lançamento, o trabalho pode seguir: medir, corrigir e evoluir, com a prioridade definida junto com você.",
  },
  duvidas: [
    {
      question: "Quanto custa?",
      answer:
        "Depende do escopo. Um site de poucas páginas e um sistema com login e painéis são projetos muito diferentes. O trabalho começa por dimensionar: o essencial primeiro, o resto em fases. A proposta traz o investimento antes de começar.",
    },
    {
      question: "Quanto tempo leva?",
      answer:
        "Depende do escopo e do conteúdo pronto. A proposta traz etapas, datas e o que depende de você, como textos, fotos e aprovações.",
    },
    {
      question: "Prefiro um template ou uma plataforma pronta. Faz sentido?",
      answer:
        "Pode fazer. Se a prioridade é estar no ar rápido e com pouca verba, um template bem configurado pode ser a melhor escolha. Isso é dito na conversa. Sob medida faz sentido quando identidade, desempenho, regras específicas ou integrações pesam.",
    },
    {
      question: "O que acontece depois da entrega?",
      answer:
        "A entrega fecha uma etapa, e o projeto pode continuar com ajustes e novas funcionalidades, sempre com escopo e investimento combinados antes.",
    },
  ],
  ctaFinal: {
    h2: "Não precisa chegar com tudo definido;",
    text: "Organizar o contexto em escopo é a primeira parte do trabalho.",
    ctaPrimary: {
      label: "Falar sobre um projeto",
      href: "/contato?origem=processo",
    },
    ctaSecondary: {
      label: "Chamar no WhatsApp",
      whatsappMessage:
        "Olá! Vim pelo site da Byte Criativo e quero falar sobre um projeto.",
    },
  },
}

export const processoPage: ProcessoPage =
  ProcessoPageSchema.parse(processoPageRaw)

// ============================================================================
// Sobre Page Data
// ============================================================================

export const sobrePageRaw = {
  seo: {
    title: "Sobre a Byte Criativo",
    seoTitle: "Sobre: quem desenha é quem programa | Byte Criativo",
    description:
      "A Byte Criativo é conduzida por quem desenha e programa cada projeto, com parceiros sob demanda. Conheça o modelo de trabalho, os princípios e a empresa.",
  },
  h1: "Você fala com quem desenha e programa;",
  lede: "A Byte Criativo é um estúdio de design e engenharia de software. Uma pessoa conduz cada projeto, da primeira conversa ao que vai ao ar, e parceiros entram quando o projeto pede outra especialidade.",
  quemConduz: {
    h2: "Quem conduz",
    text: "Trabalhar assim é uma escolha. A conversa, o desenho e o código ficam com a mesma pessoa. Assim, nada se perde entre entender o problema e construir a solução. Quando um projeto pede mais (fotografia, ilustração, uma especialidade técnica, mais mãos num prazo apertado), entram parceiros sob a mesma condução.",
  },
  trajetoria: {
    h2: "Por que a Byte trabalha assim",
    manifestoParagraphs: [
      "Muita empresa chega pedindo um site. Quase sempre precisa de mais: ser encontrada, entendida e escolhida, e ter uma operação que continue funcionando no dia seguinte ao lançamento.",
      "Por isso, na Byte Criativo, design e engenharia começam juntos. A forma de uma página decide o que alguém entende e se confia o bastante para seguir. O código decide se essa página abre rápido, aparece na busca e aguenta o uso real.",
      "Quando cada decisão fica com alguém diferente, sempre há tradução, e alguma coisa se perde nela. Aqui, quem desenha é quem programa.",
      "Antes do código vem o contexto: o que você vende, para quem, como a operação funciona hoje e o que precisa mudar. Disso sai um escopo com etapas, prazo e investimento. Você acompanha as decisões e sabe por que cada uma foi tomada.",
      "Nenhum projeto sai de um modelo pronto. Um festival no Centro Histórico, uma plataforma da cena musical e o site de uma banda pediram linguagens, estruturas e tecnologias diferentes.",
      "Design não é acabamento. É o jeito como um produto mostra o próprio valor para quem chega pela primeira vez.",
      "A entrega fecha uma etapa, não o projeto. Depois do lançamento, o trabalho segue: medir, corrigir, evoluir.",
      "Cada decisão fechada; o projeto, sempre em aberto.",
    ],
    cta: {
      label: "Ver todos os trabalhos",
      href: "/portfolio",
    },
  },
  principios: [
    {
      number: 1,
      title: "Diagnóstico antes do código.",
      description: "Contexto e escopo vêm antes de tela e código.",
    },
    {
      number: 2,
      title: "Design e engenharia na mesma mesa.",
      description:
        "Quem desenha programa, e parceiros entram sob a mesma condução.",
    },
    {
      number: 3,
      title: "Feito para durar e evoluir.",
      description:
        "Desempenho, busca, acessibilidade e segurança fazem parte da estrutura desde o início.",
    },
  ],
  parceiros: {
    h2: "Parceiros",
    text: "Parceiros entram em frentes específicas, quando o projeto pede. Você continua falando com a mesma pessoa, que responde pelo projeto inteiro.",
  },
  ondeEstamos: {
    h2: "Onde a Byte está",
    text: "O processo funciona à distância: conversas por vídeo, aprovações por link e o projeto num endereço de teste que você abre no seu celular.",
  },
  empresa: {
    h2: "A empresa",
    name: "Byte Criativo",
    cnpj: "52.652.130/0001-02",
  },
  ctaFinal: {
    h2: "Conte o que você quer construir;",
    ctaPrimary: {
      label: "Falar sobre um projeto",
      href: "/contato?origem=sobre",
    },
    ctaSecondary: {
      label: "Chamar no WhatsApp",
      whatsappMessage:
        "Olá! Li sobre a Byte Criativo e quero conversar sobre um projeto.",
    },
  },
}

export const sobrePage: SobrePage = SobrePageSchema.parse(sobrePageRaw)

// ============================================================================
// Contato Page Data
// ============================================================================

export const contatoPageRaw = {
  seo: {
    title: "Contato",
    seoTitle: "Contato: orçamento de site ou sistema | Byte Criativo",
    description:
      "Conte o que você quer construir: site, plataforma, sistema ou automação. Quem responde é quem conduz o projeto. Use o formulário, o WhatsApp ou o e-mail.",
  },
  h1: "Conte o que você quer construir;",
  apoio: "Quem responde é quem conduz o projeto.",
  caminhos: {
    formulario: {
      h2: "Pelo formulário",
      text: 'Algumas linhas bastam. Os campos com "(obrigatório)" são os únicos necessários.',
      privacyNotice:
        "Seus dados são usados só para responder sobre o seu projeto. Leia a política de privacidade.",
      buttonLabel: "Enviar mensagem",
      sendingLabel: "Enviando…",
      afterSendText:
        "Depois de enviar, você pode continuar pelo WhatsApp, se quiser.",
    },
    direto: {
      h2: "Prefere falar direto?",
      whatsapp: {
        label: "Chamar no WhatsApp",
        number: WHATSAPP_NUMBER,
        display: WHATSAPP_DISPLAY,
        message:
          "Olá! Vim pela página de contato da Byte Criativo e quero falar sobre um projeto.",
      },
      email: {
        label: "Escrever e-mail",
        address: CONTACT_EMAIL,
        copyLabel: "Copiar e-mail",
        copiedLabel: "E-mail copiado",
      },
    },
  },
  projectTypeOptions: [
    { value: "site", label: "Site ou landing page" },
    { value: "plataforma", label: "Plataforma ou produto digital" },
    { value: "sistema-interno", label: "Sistema interno" },
    { value: "automacao", label: "Automação ou integração" },
    { value: "cultural", label: "Projeto cultural ou evento" },
    { value: "ainda-nao-sei", label: "Ainda não sei" },
  ],
  deadlineOptions: ["Tenho uma data", "Nos próximos meses", "Sem pressa"],
  proximosPassos: {
    h2: "O que acontece depois",
    steps: [
      {
        number: 1,
        title: "Resposta.",
        description:
          "Quem conduz o projeto lê a sua mensagem e responde pelo canal que você escolheu.",
      },
      {
        number: 2,
        title: "Conversa inicial.",
        description: "Perguntas para entender o contexto e o que está em jogo.",
      },
      {
        number: 3,
        title: "Proposta.",
        description:
          "Escopo, etapas, prazo e investimento por escrito, antes de começar.",
      },
    ],
    link: {
      label: "Ver como um projeto anda",
      href: "/processo",
    },
  },
  faqs: [
    {
      question: "Preciso ter tudo definido?",
      answer:
        "Não. Pode chegar com uma ideia solta ou um problema de operação. Organizar isso em escopo é a primeira parte do trabalho.",
    },
    {
      question: "Quanto custa e quanto tempo leva?",
      answer:
        "Depende do escopo. Um site institucional e um sistema com login e painéis são projetos muito diferentes. Depois da primeira conversa, você recebe uma proposta com investimento, etapas e prazo.",
    },
    {
      question: "Quem faz o projeto? Há parceiros?",
      answer:
        "Uma pessoa desenha e programa cada projeto, e é ela quem responde esta mensagem. Quando o projeto pede outra especialidade ou mais mãos, entram parceiros sob a mesma condução.",
    },
    {
      question: "Atende em qualquer cidade?",
      answer:
        "Sim. O processo funciona à distância: conversas por vídeo, aprovações por link e o projeto num endereço de teste.",
    },
  ],
}

export const contatoPage: ContatoPage = ContatoPageSchema.parse(contatoPageRaw)

// ============================================================================
// Obrigado Page Data
// ============================================================================

export const obrigadoPageRaw = {
  seo: {
    title: "Mensagem recebida",
    seoTitle: "Mensagem recebida | Byte Criativo",
    description:
      "Confirmação de envio do formulário de contato da Byte Criativo, com o que acontece depois e a opção de continuar a conversa agora pelo WhatsApp.",
  },
  h1: "Mensagem recebida.",
  canais: {
    whatsapp: {
      text: "Para continuar agora pelo WhatsApp, toque no botão. A mensagem vai com o que você escreveu.",
      buttonLabel: "Chamar no WhatsApp",
      supportText: "Não abriu? Copiar mensagem",
    },
    email: {
      textWithEmail:
        "A resposta vai para {email}. Se preferir adiantar, chame no WhatsApp.",
      fallbackText:
        "A resposta vai para o e-mail que você informou. Se preferir adiantar, chame no WhatsApp.",
      buttonLabel: "Chamar no WhatsApp",
    },
    direto: {
      text: "Se você enviou uma mensagem pelo formulário, ela chegou. A resposta vai pelo canal que você escolheu.",
      link: {
        label: "Ir para o início",
        href: "/",
      },
    },
  },
  proximosPassos: {
    h2: "O que acontece depois",
    steps: [
      {
        number: 1,
        title: "Resposta.",
        description:
          "Quem conduz o projeto lê a sua mensagem e responde pelo canal que você escolheu.",
      },
      {
        number: 2,
        title: "Conversa inicial.",
        description: "Perguntas para entender o contexto e o que está em jogo.",
      },
      {
        number: 3,
        title: "Proposta.",
        description:
          "Escopo, etapas, prazo e investimento por escrito, antes de começar.",
      },
    ],
    link: {
      label: "Enquanto isso, ver todos os trabalhos",
      href: "/portfolio",
    },
  },
}

export const obrigadoPage: ObrigadoPage =
  ObrigadoPageSchema.parse(obrigadoPageRaw)

// ============================================================================
// Privacidade Page Data (Port de docs/content/2026-09-privacidade-rascunho.md)
// ============================================================================

export const privacidadePageRaw = {
  seo: {
    title: "Política de privacidade",
    seoTitle: "Política de privacidade | Byte Criativo",
    description:
      "Como a Byte Criativo trata os dados de quem visita o site ou envia uma mensagem: finalidades, bases legais, retenção, operadores e os seus direitos.",
  },
  title: "Política de privacidade do site da Byte Criativo",
  lastUpdated: "2026-09-16",
  responsavel: {
    name: "Byte Criativo",
    cnpj: "52.652.130/0001-02",
    email: CONTACT_EMAIL,
    text: "Esta política explica como a Byte Criativo trata os dados pessoais de quem visita o site www.bcriativo.com ou entra em contato por ele. A Byte Criativo é a controladora desses dados, nos termos da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, a LGPD).",
  },
  resumo: [
    "O site não usa cookies de publicidade nem de medição de audiência.",
    "A medição de audiência é agregada e não identifica você.",
    "Os dados do formulário servem para responder ao seu pedido e nunca vão para ferramentas de medição.",
    'Quando você toca em "Chamar no WhatsApp", a conversa passa a acontecer no WhatsApp, sob as regras do WhatsApp.',
    "Você pode pedir acesso, correção ou eliminação dos seus dados pelo canal de privacidade.",
    "A Byte Criativo não vende dados pessoais.",
  ],
  sections: [
    {
      id: "quem-e-responsavel",
      number: "1",
      title: "Quem é responsável pelos seus dados",
      content: [
        "Esta política explica como a Byte Criativo trata os dados pessoais de quem visita o site www.bcriativo.com ou entra em contato por ele. A Byte Criativo é a controladora desses dados, nos termos da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, a LGPD).",
        "Nome: Byte Criativo",
        "CNPJ: 52.652.130/0001-02",
        "E-mail: contato@bcriativo.com",
      ],
    },
    {
      id: "resumo",
      number: "2",
      title: "Resumo",
      content: [
        "O site não usa cookies de publicidade nem de medição de audiência.",
        "A medição de audiência é agregada e não identifica você.",
        "Os dados do formulário servem para responder ao seu pedido e nunca vão para ferramentas de medição.",
        'Quando você toca em "Chamar no WhatsApp", a conversa passa a acontecer no WhatsApp, sob as regras do WhatsApp.',
        "Você pode pedir acesso, correção ou eliminação dos seus dados pelo canal de privacidade.",
        "A Byte Criativo não vende dados pessoais.",
      ],
    },
    {
      id: "quais-dados-sao-tratados",
      number: "3",
      title: "Quais dados são tratados, para quê e com qual base legal",
      content:
        "Tratamos dados pessoais apenas nas hipóteses previstas na LGPD e para finalidades legítimas e informadas nesta política.",
      subsections: [
        {
          id: "navegacao-e-seguranca",
          number: "3.1",
          title: "Navegação e segurança do site",
          content: [
            "Dados: endereço IP, tipo de navegador e de dispositivo, data e hora do acesso, página acessada, página de origem e registros técnicos gerados pela hospedagem.",
            "Para quê: entregar as páginas, manter o site seguro, limitar tentativas repetidas de envio e investigar erros.",
            "Base legal: legítimo interesse (art. 7º, IX, da LGPD).",
            "Cuidado adicional: os registros técnicos do site não guardam o conteúdo do formulário nem o endereço IP completo junto com o pedido de contato.",
          ],
        },
        {
          id: "medicao-de-audiencia",
          number: "3.2",
          title: "Medição de audiência, sem cookies",
          content: [
            "Dados: página visitada, página de origem, país, tipo de dispositivo, sistema operacional e navegador; eventos de uso sem dado pessoal; métricas de desempenho.",
            "Como: sem cookies e sem identificador guardado no seu navegador. Os dados são vistos só de forma agregada.",
            "Para quê: entender quais páginas são úteis, medir o desempenho do site e melhorá-lo.",
            "Base legal: legítimo interesse (art. 7º, IX), com transparência e direito de oposição.",
          ],
        },
        {
          id: "formulario-de-contato",
          number: "3.3",
          title: "Formulário de contato",
          content: [
            "Dados que você informa: nome; tipo de projeto; o contexto que você escrever; canal preferido; número de WhatsApp ou e-mail, conforme o canal; e, se quiser, empresa, marca ou projeto e prazo.",
            "Para quê: responder ao seu pedido, entender o projeto e, se fizer sentido, preparar uma proposta.",
            "Base legal: procedimentos preliminares relacionados a contrato, a pedido do titular (art. 7º, V).",
            "Nunca: nome, e-mail, telefone ou texto do formulário são enviados a ferramentas de medição de audiência.",
          ],
        },
        {
          id: "whatsapp",
          number: "3.6",
          title: "WhatsApp",
          content: [
            'Os botões "Chamar no WhatsApp" abrem o WhatsApp com uma mensagem pronta. Nas páginas do site, essa mensagem não contém dados seus.',
            "A partir do momento em que você abre o WhatsApp, os dados da conversa passam a ser tratados também pelo WhatsApp, empresa do grupo Meta, conforme a política de privacidade do próprio WhatsApp.",
            "Base legal: procedimentos preliminares relacionados a contrato, a pedido do titular (art. 7º, V).",
          ],
        },
        {
          id: "o-que-o-site-nao-faz",
          number: "3.9",
          title: "O que o site não faz",
          content: [
            "Não usa cookies de publicidade, remarketing nem pixels de redes sociais.",
            "Não envia dados do formulário para ferramentas de medição.",
            "Não toma decisões automatizadas sobre você.",
            "Não vende nem aluga dados pessoais.",
          ],
        },
      ],
    },
    {
      id: "cookies-e-armazenamento",
      number: "4",
      title: "Cookies e armazenamento no navegador",
      content: [
        "Cookies de publicidade e de medição: o site não usa.",
        "Armazenamento de sessão: a origem da visita fica no armazenamento de sessão do navegador até você fechar a aba, só para acompanhar o formulário se você enviar.",
        "Conteúdo de outros sites: vídeos ou players de outros serviços só carregam depois que você clica, com aviso prévio.",
      ],
    },
    {
      id: "compartilhamento",
      number: "5",
      title: "Com quem os dados são compartilhados",
      content: [
        "A Byte Criativo usa fornecedores para hospedar o site, medir a audiência, enviar e-mails e proteger o formulário. Eles tratam os dados em nome da Byte Criativo, só para essas finalidades.",
        "Hospedagem e entrega do site: Vercel.",
        "Medição agregada sem cookies: Vercel Web Analytics e Speed Insights.",
        "WhatsApp: quando você inicia uma conversa.",
        "Autoridades: quando a lei ou ordem judicial exigir.",
      ],
    },
    {
      id: "direitos",
      number: "8",
      title: "Seus direitos",
      content: [
        "A LGPD (art. 18) garante a você, sem custo, o direito de pedir confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade, eliminação e revogação de consentimento.",
        'Para exercer seus direitos, escreva para contato@bcriativo.com com o assunto "Privacidade".',
      ],
    },
    {
      id: "seguranca",
      number: "9",
      title: "Segurança",
      content: [
        "A Byte Criativo adota medidas técnicas e administrativas para proteger os dados, entre elas conexão criptografada (HTTPS) em todo o site, validação no servidor e acesso restrito às contas.",
      ],
    },
    {
      id: "canal-de-privacidade",
      number: "10",
      title: "Canal de privacidade",
      content: [
        'Para exercer seus direitos ou tirar dúvidas sobre esta política, escreva para contato@bcriativo.com com o assunto "Privacidade".',
      ],
    },
  ],
}

export const privacidadePage: PrivacidadePage =
  PrivacidadePageSchema.parse(privacidadePageRaw)

// ============================================================================
// Portfolio Hub Data (copy v1, seção 2.1 — versão publicável sem a Goromax,
// D12 pendente; as salas são as de home.salas.items)
// ============================================================================

export const portfolioPageRaw = {
  seo: {
    title: "Trabalhos",
    seoTitle: "Trabalhos: portfólio de sites e plataformas | Byte Criativo",
    description:
      "Estudos de caso de projetos no ar: o contexto, o que cada um precisava e as decisões de design e de código por trás de cada tela.",
  },
  h1: "Cada projeto com a própria identidade;",
  intro: [
    "Os trabalhos publicados nasceram na cena cultural da Paraíba: um festival no Centro Histórico e uma plataforma da música independente. Cada um tinha muita informação para organizar, gente de verdade usando e uma identidade que não podia se perder na tela.",
    "Em cada estudo você vê o contexto, o que precisava funcionar e as decisões de design e de código.",
  ],
  ctaFinal: {
    h2: "Seu negócio não tem nada a ver com música?",
    text: "O desafio costuma ser parecido: muita coisa para mostrar, pouca atenção disponível e uma marca que precisa ser reconhecida.",
    ctaPrimary: {
      label: "Falar sobre um projeto",
      href: "/contato?origem=portfolio",
    },
    ctaSecondary: {
      label: "Chamar no WhatsApp",
      whatsappMessage:
        "Olá! Vi os trabalhos da Byte Criativo e quero falar sobre um projeto.",
    },
  },
}

export const portfolioPage: PortfolioPage =
  PortfolioPageSchema.parse(portfolioPageRaw)

// ============================================================================
// Exports legados preservados para compatibilidade retroativa
// ============================================================================

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
