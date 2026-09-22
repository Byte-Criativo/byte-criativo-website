import { describe, expect, it } from "vitest"
import { CaseStudy } from "./schema"

const image = {
  src: "/cases/underground-pb/home-1440.avif",
  alt: "Página inicial do Underground PB com o evento do dia em destaque",
  capturedAt: "2026-09-16",
  sourceUrl: "https://www.undergroundpb.com.br/",
}

const valid = {
  slug: "underground-pb",
  status: "published",
  order: 1,
  title: "Underground PB: a cena independente da Paraíba em um só lugar",
  subtitle:
    "Plataforma cultural com bandas, agenda, palcos, lançamentos e memória",
  summary:
    "Plataforma cultural aberta à comunidade, com curadoria e instalável como app.",
  projectType: "Plataforma cultural",
  liveUrl: "https://www.undergroundpb.com.br/",
  liveCheckedAt: "2026-09-16",
  role: {
    disciplines: ["ux", "ui", "desenvolvimento"],
    evidence: [{ kind: "repository", ref: "origin/master" }],
  },
  thirdPartyCredits: [
    { item: "Capas de bandas", credit: "Enviadas pelas próprias bandas" },
  ],
  needs: [
    "Reunir a cena",
    "Aceitar contribuições com curadoria",
    "Funcionar bem no celular",
  ],
  uxDecisions: [
    {
      title: "Evento do dia primeiro",
      problem: "Visitante quer saber o que tem hoje",
      decision: "Hero dinâmico",
    },
    {
      title: "Mapa e lista juntos",
      problem: "Achar palco por região",
      decision: "Lista sincronizada ao mapa",
    },
  ],
  engineering: [
    { name: "Django", verified: true, evidence: "requirements.txt" },
  ],
  observableResults: [
    {
      label: "Bandas no diretório",
      value: "88",
      source: "site",
      checkedAt: "2026-09-16",
    },
  ],
  services: ["sistemas-web-sob-medida"],
  media: { cover: image, gallery: [image, image, image] },
  // R36: cores da sala underground-pb em src/styles/tokens.json (tema claro
  // aprovado no G3), não os valores escuros do "Cartaz Vivo" da estratégia.
  theme: {
    surface: "#F4EFE7",
    surfaceAlt: "#EEE7DC",
    ink: "#111111",
    inkMuted: "#59544D",
    accent: "#E30613",
    accent2: "#B4050E",
    ctaBg: "#111111",
    ctaInk: "#F4EFE7",
    easel: "#111111",
  },
  permissions: { cleared: true, notes: "Autorizado pelo dono em 2026-09-20" },
  seo: {
    title: "Underground PB",
    description: "Estudo de caso da plataforma cultural Underground PB.",
  },
  updatedAt: "2026-09-16",
}

describe("CaseStudy", () => {
  it("aceita um case completo e autorizado", () => {
    expect(CaseStudy.safeParse(valid).success).toBe(true)
  })

  it("recusa case publicado sem permissões confirmadas", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      permissions: { cleared: false, notes: "" },
    })
    expect(result.success).toBe(false)
  })

  it("aceita rascunho sem permissões confirmadas", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      status: "draft",
      permissions: { cleared: false, notes: "" },
    })
    expect(result.success).toBe(true)
  })

  it("exige evidência do papel da Byte", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      role: { disciplines: ["ux"], evidence: [] },
    })
    expect(result.success).toBe(false)
  })

  it("não aceita campo de cliente nem de depoimento", () => {
    expect(CaseStudy.safeParse({ ...valid, client: "Alguém" }).success).toBe(
      false,
    )
    expect(
      CaseStudy.safeParse({ ...valid, testimonial: "Ótimo" }).success,
    ).toBe(false)
  })

  it("recusa tecnologia não verificada", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      engineering: [{ name: "Next.js", verified: false, evidence: "" }],
    })
    expect(result.success).toBe(false)
  })

  it("recusa cor fora do formato hexadecimal", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      theme: { ...valid.theme, ink: "branco" },
    })
    expect(result.success).toBe(false)
  })

  it("exige a cor do cavalete (easel) no tema", () => {
    const result = CaseStudy.safeParse({
      ...valid,
      theme: {
        surface: valid.theme.surface,
        surfaceAlt: valid.theme.surfaceAlt,
        ink: valid.theme.ink,
        inkMuted: valid.theme.inkMuted,
        accent: valid.theme.accent,
        accent2: valid.theme.accent2,
        ctaBg: valid.theme.ctaBg,
        ctaInk: valid.theme.ctaInk,
      },
    })
    expect(result.success).toBe(false)
  })
})

import {
  FaqItemSchema,
  NavItemSchema,
  FooterColumnSchema,
  SiteConfigSchema,
  HomePageSchema,
  ServiceDetailPageSchema,
  ServiceHubSchema,
  ProcessoPageSchema,
  SobrePageSchema,
  ContatoPageSchema,
  ObrigadoPageSchema,
  PrivacidadePageSchema,
} from "./schema"
import { siteConfigRaw } from "./site"
import { homePageRaw } from "./home"
import { serviceHubRaw, servicePagesRaw } from "./services"
import {
  processoPageRaw,
  sobrePageRaw,
  contatoPageRaw,
  obrigadoPageRaw,
  privacidadePageRaw,
} from "./pages"
import { faqItemsRaw } from "./faq"

describe("FaqItemSchema", () => {
  it("aceita item válido", () => {
    const valid = {
      question: "Como funciona?",
      answer: "Funciona assim e assado.",
    }
    expect(FaqItemSchema.safeParse(valid).success).toBe(true)
  })

  it("aceita item com id opcional", () => {
    const validWithId = {
      id: 1,
      question: "Como funciona?",
      answer: "Funciona assim e assado.",
    }
    expect(FaqItemSchema.safeParse(validWithId).success).toBe(true)
  })

  it("recusa pergunta muito curta", () => {
    expect(
      FaqItemSchema.safeParse({ question: "Oi", answer: "Resposta longa" })
        .success,
    ).toBe(false)
  })

  it("recusa resposta muito curta", () => {
    expect(
      FaqItemSchema.safeParse({ question: "Qual o prazo?", answer: "Oi" })
        .success,
    ).toBe(false)
  })

  it("valida todos os itens em faqItemsRaw", () => {
    for (const item of faqItemsRaw) {
      expect(FaqItemSchema.safeParse(item).success).toBe(true)
    }
  })
})

describe("NavItemSchema e FooterColumnSchema", () => {
  it("valida NavItem com label e href", () => {
    expect(
      NavItemSchema.safeParse({ label: "Trabalhos", href: "/portfolio" })
        .success,
    ).toBe(true)
  })

  it("valida FooterColumn com title e links", () => {
    expect(
      FooterColumnSchema.safeParse({
        title: "Trabalhos",
        links: [{ label: "Underground PB", href: "/portfolio/underground-pb" }],
      }).success,
    ).toBe(true)
  })
})

describe("SiteConfigSchema", () => {
  it("aceita a configuração real de siteConfigRaw", () => {
    expect(SiteConfigSchema.safeParse(siteConfigRaw).success).toBe(true)
  })

  it("recusa CNPJ em formato inválido", () => {
    const invalid = {
      ...siteConfigRaw,
      taxId: "12345678000199",
    }
    expect(SiteConfigSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa e-mail de contato inválido", () => {
    const invalid = {
      ...siteConfigRaw,
      contact: {
        ...siteConfigRaw.contact,
        email: "nao-e-email",
      },
    }
    expect(SiteConfigSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa colunas de rodapé insuficientes", () => {
    const invalid = {
      ...siteConfigRaw,
      footer: {
        ...siteConfigRaw.footer,
        columns: siteConfigRaw.footer.columns.slice(0, 2),
      },
    }
    expect(SiteConfigSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("HomePageSchema", () => {
  it("aceita os dados da home de homePageRaw", () => {
    expect(HomePageSchema.safeParse(homePageRaw).success).toBe(true)
  })

  it("recusa formaDePensar com quantidade incorreta de princípios", () => {
    const invalid = {
      ...homePageRaw,
      formaDePensar: {
        ...homePageRaw.formaDePensar,
        principles: homePageRaw.formaDePensar.principles.slice(0, 2),
      },
    }
    expect(HomePageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa comoAnda sem exatamente 5 passos", () => {
    const invalid = {
      ...homePageRaw,
      comoAnda: {
        ...homePageRaw.comoAnda,
        steps: homePageRaw.comoAnda.steps.slice(0, 4),
      },
    }
    expect(HomePageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa oQueFazemos sem exatamente 4 situações", () => {
    const invalid = {
      ...homePageRaw,
      oQueFazemos: {
        ...homePageRaw.oQueFazemos,
        situations: homePageRaw.oQueFazemos.situations.slice(0, 3),
      },
    }
    expect(HomePageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("ServiceDetailPageSchema", () => {
  it("valida todas as 7 páginas de serviço reais em servicePagesRaw", () => {
    expect(servicePagesRaw).toHaveLength(7)
    for (const service of servicePagesRaw) {
      const result = ServiceDetailPageSchema.safeParse(service)
      expect(result.success).toBe(true)
    }
  })

  it("recusa slug não pertencente aos 7 preservados", () => {
    const invalid = {
      ...servicePagesRaw[0],
      slug: "consultoria-avulsa",
    }
    expect(ServiceDetailPageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa serviço sem faqs", () => {
    const invalid = {
      ...servicePagesRaw[0],
      faqs: [],
    }
    expect(ServiceDetailPageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa mensagem de WhatsApp muito curta", () => {
    const invalid = {
      ...servicePagesRaw[0],
      whatsappMessage: "Oi",
    }
    expect(ServiceDetailPageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("ServiceHubSchema", () => {
  it("aceita o hub real de serviceHubRaw", () => {
    expect(ServiceHubSchema.safeParse(serviceHubRaw).success).toBe(true)
  })

  it("recusa hub com menos de 4 situações", () => {
    const invalid = {
      ...serviceHubRaw,
      situacoes: serviceHubRaw.situacoes.slice(0, 3),
    }
    expect(ServiceHubSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa hub com quantidade diferente de 3 capacidades", () => {
    const invalid = {
      ...serviceHubRaw,
      capacidades: serviceHubRaw.capacidades.slice(0, 2),
    }
    expect(ServiceHubSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("ProcessoPageSchema", () => {
  it("aceita a página real de processoPageRaw", () => {
    expect(ProcessoPageSchema.safeParse(processoPageRaw).success).toBe(true)
  })

  it("recusa processo com número de etapas diferente de 5", () => {
    const invalid = {
      ...processoPageRaw,
      etapas: processoPageRaw.etapas.slice(0, 4),
    }
    expect(ProcessoPageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa processo com menos de 3 dúvidas", () => {
    const invalid = {
      ...processoPageRaw,
      duvidas: processoPageRaw.duvidas.slice(0, 2),
    }
    expect(ProcessoPageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("SobrePageSchema", () => {
  it("aceita a página real de sobrePageRaw", () => {
    expect(SobrePageSchema.safeParse(sobrePageRaw).success).toBe(true)
  })

  it("recusa sobre com número de princípios diferente de 3", () => {
    const invalid = {
      ...sobrePageRaw,
      principios: sobrePageRaw.principios.slice(0, 2),
    }
    expect(SobrePageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa sobre com CNPJ em formato incorreto", () => {
    const invalid = {
      ...sobrePageRaw,
      empresa: {
        ...sobrePageRaw.empresa,
        cnpj: "123",
      },
    }
    expect(SobrePageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("ContatoPageSchema", () => {
  it("aceita a página real de contatoPageRaw", () => {
    expect(ContatoPageSchema.safeParse(contatoPageRaw).success).toBe(true)
  })

  it("recusa contato com e-mail inválido nos caminhos diretos", () => {
    const invalid = {
      ...contatoPageRaw,
      caminhos: {
        ...contatoPageRaw.caminhos,
        direto: {
          ...contatoPageRaw.caminhos.direto,
          email: {
            ...contatoPageRaw.caminhos.direto.email,
            address: "invalido",
          },
        },
      },
    }
    expect(ContatoPageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa contato com menos de 3 opções de tipo de projeto", () => {
    const invalid = {
      ...contatoPageRaw,
      projectTypeOptions: contatoPageRaw.projectTypeOptions.slice(0, 2),
    }
    expect(ContatoPageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("ObrigadoPageSchema", () => {
  it("aceita a página real de obrigadoPageRaw", () => {
    expect(ObrigadoPageSchema.safeParse(obrigadoPageRaw).success).toBe(true)
  })

  it("recusa obrigado sem passos de próximos passos completos (exige 3)", () => {
    const invalid = {
      ...obrigadoPageRaw,
      proximosPassos: {
        ...obrigadoPageRaw.proximosPassos,
        steps: obrigadoPageRaw.proximosPassos.steps.slice(0, 2),
      },
    }
    expect(ObrigadoPageSchema.safeParse(invalid).success).toBe(false)
  })
})

describe("PrivacidadePageSchema", () => {
  it("aceita a página real de privacidadePageRaw", () => {
    expect(PrivacidadePageSchema.safeParse(privacidadePageRaw).success).toBe(
      true,
    )
  })

  it("recusa privacidade com menos de 5 seções", () => {
    const invalid = {
      ...privacidadePageRaw,
      sections: privacidadePageRaw.sections.slice(0, 4),
    }
    expect(PrivacidadePageSchema.safeParse(invalid).success).toBe(false)
  })

  it("recusa tabela com linha de tamanho diferente das colunas", () => {
    const invalid = {
      ...privacidadePageRaw,
      sections: [
        ...privacidadePageRaw.sections.slice(0, 4),
        {
          id: "secao-extra",
          number: "5",
          title: "Seção extra",
          blocks: [
            {
              type: "table",
              caption: "Tabela inválida",
              columns: ["Versão", "Data", "O que mudou"],
              rows: [["1.0", "16 de setembro de 2026"]],
            },
          ],
        },
      ],
    }
    expect(PrivacidadePageSchema.safeParse(invalid).success).toBe(false)
  })
})
