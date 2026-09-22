import { z } from "zod"

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const Hex = z.string().regex(/^#[0-9a-fA-F]{6}$/)
const IsoDate = z.iso.date()

export const Evidence = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("footer-credit"),
    url: z.url(),
    text: z.string().min(3),
    checkedAt: IsoDate,
  }),
  z.object({
    kind: z.literal("repository"),
    ref: z.string().min(1),
    path: z.string().optional(),
  }),
  z.object({
    kind: z.literal("owner-statement"),
    note: z.string().min(3),
    confirmedAt: IsoDate,
  }),
])

export const ImageAsset = z.object({
  src: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
  caption: z.string().optional(),
  capturedAt: IsoDate,
  sourceUrl: z.url(),
  containsThirdParty: z
    .array(z.enum(["foto", "arte", "marca", "conteudo-usuario"]))
    .default([]),
})

// R36: as chaves de cor seguem as salas de src/styles/tokens.json
// (surface, surfaceAlt, ink, inkMuted, accent, accent2, ctaBg, ctaInk, easel).
// Só `accent2` é opcional, como no brief; `easel` é obrigatório porque a Sala
// sempre desenha o cavalete a partir de `room.easel` (globals.css fixa
// `--room-easel` por sala) — ver R42.
export const CaseTheme = z.object({
  surface: Hex,
  surfaceAlt: Hex,
  ink: Hex,
  inkMuted: Hex,
  accent: Hex,
  accent2: Hex.optional(),
  ctaBg: Hex,
  ctaInk: Hex,
  easel: Hex,
  displayFont: z.enum(["none", "anton", "barlow-condensed"]).default("none"),
  texture: z.enum(["none", "noise", "paper", "grain"]).default("none"),
})

export const ObservableFact = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  source: z.enum(["site", "sitemap", "repositorio", "headers"]),
  checkedAt: IsoDate,
})

export const CaseStudy = z
  .strictObject({
    slug: Slug,
    status: z.enum(["draft", "review", "published"]),
    order: z.number().int().positive(),
    title: z.string().min(2),
    subtitle: z.string().min(2),
    summary: z.string().max(160),
    projectType: z.string().min(2),
    liveUrl: z.url(),
    liveCheckedAt: IsoDate,
    role: z.object({
      disciplines: z.array(z.string().min(1)).min(1),
      evidence: z.array(Evidence).min(1),
    }),
    thirdPartyCredits: z.array(
      z.object({ item: z.string(), credit: z.string() }),
    ),
    needs: z.array(z.string().min(3)).min(3).max(5),
    uxDecisions: z
      .array(
        z.object({
          title: z.string(),
          problem: z.string(),
          decision: z.string(),
        }),
      )
      .min(2),
    engineering: z.array(
      z.object({
        name: z.string(),
        verified: z.literal(true),
        evidence: z.string().min(1),
      }),
    ),
    observableResults: z.array(ObservableFact).min(1),
    services: z.array(Slug).min(1),
    media: z.object({
      cover: ImageAsset,
      gallery: z.array(ImageAsset).min(3),
    }),
    theme: CaseTheme,
    permissions: z.object({ cleared: z.boolean(), notes: z.string() }),
    seo: z.object({
      title: z.string().max(60),
      description: z.string().max(160),
    }),
    updatedAt: IsoDate,
  })
  .refine((c) => c.status !== "published" || c.permissions.cleared, {
    message: "Case publicado exige permissões confirmadas",
    path: ["permissions", "cleared"],
  })

export type CaseStudyData = z.infer<typeof CaseStudy>

// ============================================================================
// Fase 8: Schemas tipados de conteúdo (copy-v1)
// ============================================================================

export const FaqItemSchema = z.strictObject({
  id: z.number().int().positive().optional(),
  question: z.string().min(3),
  answer: z.string().min(5),
})
export type FaqItem = z.infer<typeof FaqItemSchema>

export const NavItemSchema = z.strictObject({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional(),
})
export type NavItem = z.infer<typeof NavItemSchema>

export const FooterColumnSchema = z.strictObject({
  title: z.string().min(1),
  tagline: z.string().optional(),
  lines: z.array(z.string().min(1)).optional(),
  links: z.array(NavItemSchema).optional(),
})
export type FooterColumn = z.infer<typeof FooterColumnSchema>

export const SiteConfigSchema = z.strictObject({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  taxId: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  contact: z.strictObject({
    email: z.string().email(),
    phone: z.string().min(8),
    whatsappNumber: z.string().regex(/^\d+$/),
    whatsappDisplay: z.string().min(8),
    defaultWhatsappMessage: z.string().min(5),
  }),
  social: z.strictObject({
    instagram: z.string().url(),
    linkedin: z.string().url(),
  }),
  navigation: z.strictObject({
    main: z.array(NavItemSchema).min(1),
    mobile: z.array(NavItemSchema).min(1),
    primaryCta: NavItemSchema,
  }),
  footer: z.strictObject({
    columns: z.array(FooterColumnSchema).min(3),
    copyright: z.string().min(1),
  }),
})
export type SiteConfig = z.infer<typeof SiteConfigSchema>

// Slug de serviços (7 serviços preservados na Fase 8)
export const ServiceSlugSchema = z.enum([
  "desenvolvimento-de-sites",
  "landing-pages",
  "sistemas-web-sob-medida",
  "automacao-e-integracoes",
  "ui-ux-design",
  "design-de-produto",
  "copywriting-para-web",
])
export type ServiceSlug = z.infer<typeof ServiceSlugSchema>

// Home Page Schema (6 seções)
export const HomeSalaSchema = z.strictObject({
  slug: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  phrase: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
  image: z.strictObject({
    src: z.string().min(1),
    alt: z.string().min(1),
  }),
  liveUrl: z.string().url(),
  caseStudyUrl: z.string().min(1),
  verso: z.strictObject({
    needs: z.strictObject({
      title: z.string().min(1),
      text: z.string().min(1),
    }),
    inProduction: z.strictObject({
      title: z.string().min(1),
      items: z.array(z.string().min(1)).min(1),
    }),
    tech: z.string().min(1),
  }),
})
export type HomeSala = z.infer<typeof HomeSalaSchema>

export const HomePageSchema = z.strictObject({
  hero: z.strictObject({
    h1: z.string().min(5),
    apoio: z.string().min(10),
    ctaPrimary: NavItemSchema,
    ctaSecondary: NavItemSchema,
  }),
  salas: z.strictObject({
    items: z.array(HomeSalaSchema).min(2),
    footerLink: NavItemSchema,
    bridgeText: z.string().min(3),
  }),
  formaDePensar: z.strictObject({
    h2: z.string().min(3),
    lede: z.string().min(5),
    typographicBlock: z.string().min(3),
    accessibleTypographicBlock: z.string().min(3),
    manifesto: z.string().min(20),
    principles: z
      .array(
        z.strictObject({
          title: z.string().min(3),
          text: z.string().min(10),
          whereAppears: z.string().min(5),
        }),
      )
      .length(3),
    contrastPhrases: z.array(z.string().min(5)).min(2),
    cta: NavItemSchema,
    bridgeText: z.string().min(3),
  }),
  oQueFazemos: z.strictObject({
    h2: z.string().min(3),
    situations: z
      .array(
        z.strictObject({
          title: z.string().min(5),
          phrase: z.string().min(10),
          links: z.array(NavItemSchema).min(1),
        }),
      )
      .length(4),
    footerNote: z.string().min(5),
    cta: NavItemSchema,
    bridgeText: z.string().min(3),
  }),
  comoAnda: z.strictObject({
    h2: z.string().min(3),
    lede: z.string().min(5),
    steps: z
      .array(
        z.strictObject({
          number: z.number().int().positive(),
          title: z.string().min(3),
          description: z.string().min(10),
          youReceive: z.string().min(10),
        }),
      )
      .length(5),
    note: z.string().min(5),
    cta: NavItemSchema,
    bridgeText: z.string().min(3),
  }),
  conversa: z.strictObject({
    h2: z.string().min(3),
    text: z.string().min(10),
    whoConducts: z.string().min(15),
    commitments: z
      .array(
        z.strictObject({
          title: z.string().min(3),
          howToCheck: z.string().min(10),
        }),
      )
      .min(2),
    formNotice: z.string().min(10),
    submitLabel: z.string().min(2),
    whatsappCtaLabel: z.string().min(2),
    microcopy: z.array(z.string().min(3)).min(2),
    fullFormLink: NavItemSchema,
  }),
})
export type HomePage = z.infer<typeof HomePageSchema>

// Service Detail Page Schema
export const ServiceDetailPageSchema = z.strictObject({
  slug: ServiceSlugSchema,
  title: z.string().min(2),
  seoTitle: z.string().min(2),
  description: z.string().min(10),
  eyebrow: z.string().min(2),
  promise: z.string().min(10),
  quandoFazSentido: z.array(z.string().min(5)).min(2),
  oQueRecebe: z.array(z.string().min(5)).min(2),
  ondeFoiAplicado: z.strictObject({
    description: z.string().min(5),
    caseSlug: z.string().optional(),
    linkText: z.string().optional(),
    linkHref: z.string().optional(),
  }),
  comoConduzimos: z.array(z.string().min(5)).min(2),
  faqs: z.array(FaqItemSchema).min(1),
  whatsappMessage: z.string().min(10).max(250),
  servicosRelacionados: z.array(ServiceSlugSchema).min(1),
  bestFor: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  process: z.array(z.string()).optional(),
})
export type ServiceDetailPage = z.infer<typeof ServiceDetailPageSchema>

// Service Hub Schema
export const ServiceHubSchema = z.strictObject({
  intro: z.strictObject({
    route: z.string().min(1),
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
    h1: z.string().min(2),
    lede: z.string().min(10),
    anchorLinks: z.array(NavItemSchema).min(3),
  }),
  situacoes: z
    .array(
      z.strictObject({
        situation: z.string().min(5),
        targetAnchor: z.string().min(1),
        targetLabel: z.string().min(2),
      }),
    )
    .length(4),
  capacidades: z
    .array(
      z.strictObject({
        id: z.string().min(1),
        title: z.string().min(2),
        text: z.string().min(10),
        services: z
          .array(
            z.strictObject({
              slug: ServiceSlugSchema,
              title: z.string().min(2),
              description: z.string().min(10),
              href: z.string().min(1),
            }),
          )
          .min(1),
        relatedCase: z
          .strictObject({
            title: z.string().min(2),
            slug: z.string().min(1),
            linkText: z.string().min(2),
          })
          .optional(),
      }),
    )
    .length(3),
  evolucaoContinua: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
    cta: NavItemSchema,
  }),
  ctaFinal: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
    ctaPrimary: NavItemSchema,
    ctaSecondary: z.strictObject({
      label: z.string().min(2),
      whatsappMessage: z.string().min(10),
    }),
  }),
})
export type ServiceHub = z.infer<typeof ServiceHubSchema>

// Processo Page Schema
export const ProcessoEtapaSchema = z.strictObject({
  number: z.number().int().positive(),
  title: z.string().min(2),
  whatHappens: z.string().min(10),
  youReceive: z.string().min(10),
  yourParticipation: z.string().min(10),
  whereAppears: z.string().optional(),
})
export type ProcessoEtapa = z.infer<typeof ProcessoEtapaSchema>

export const ProcessoPageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  h1: z.string().min(2),
  lede: z.string().min(10),
  ondeSeCruzam: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  etapas: z.array(ProcessoEtapaSchema).length(5),
  diagnostico: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
    questions: z.array(z.string().min(5)).min(3),
    whatToBring: z.strictObject({
      h3: z.string().min(2),
      items: z.array(z.string().min(3)).min(2),
      note: z.string().min(5),
    }),
    whatComesOut: z.strictObject({
      h3: z.string().min(2),
      text: z.string().min(10),
    }),
  }),
  parceiros: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  depoisDaEntrega: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  duvidas: z.array(FaqItemSchema).min(3),
  ctaFinal: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
    ctaPrimary: NavItemSchema,
    ctaSecondary: z.strictObject({
      label: z.string().min(2),
      whatsappMessage: z.string().min(10),
    }),
  }),
})
export type ProcessoPage = z.infer<typeof ProcessoPageSchema>

// Sobre Page Schema
export const SobrePageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  h1: z.string().min(2),
  lede: z.string().min(10),
  quemConduz: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  trajetoria: z.strictObject({
    h2: z.string().min(2),
    manifestoParagraphs: z.array(z.string().min(10)).min(3),
    cta: NavItemSchema,
  }),
  principios: z
    .array(
      z.strictObject({
        number: z.number().int().positive(),
        title: z.string().min(2),
        description: z.string().min(10),
      }),
    )
    .length(3),
  parceiros: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  ondeEstamos: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
  }),
  empresa: z.strictObject({
    h2: z.string().min(2),
    name: z.string().min(2),
    cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  }),
  ctaFinal: z.strictObject({
    h2: z.string().min(2),
    ctaPrimary: NavItemSchema,
    ctaSecondary: z.strictObject({
      label: z.string().min(2),
      whatsappMessage: z.string().min(10),
    }),
  }),
})
export type SobrePage = z.infer<typeof SobrePageSchema>

// Contato Page Schema
export const ContatoPageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  h1: z.string().min(2),
  apoio: z.string().min(5),
  caminhos: z.strictObject({
    formulario: z.strictObject({
      h2: z.string().min(2),
      text: z.string().min(5),
      privacyNotice: z.string().min(10),
      buttonLabel: z.string().min(2),
      sendingLabel: z.string().min(2),
      afterSendText: z.string().min(10),
    }),
    direto: z.strictObject({
      h2: z.string().min(2),
      whatsapp: z.strictObject({
        label: z.string().min(2),
        number: z.string().regex(/^\d+$/),
        display: z.string().min(8),
        message: z.string().min(10),
      }),
      email: z.strictObject({
        label: z.string().min(2),
        address: z.string().email(),
        copyLabel: z.string().min(2),
        copiedLabel: z.string().min(2),
      }),
    }),
  }),
  projectTypeOptions: z
    .array(
      z.strictObject({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(3),
  deadlineOptions: z.array(z.string().min(1)).min(2),
  proximosPassos: z.strictObject({
    h2: z.string().min(2),
    steps: z
      .array(
        z.strictObject({
          number: z.number().int().positive(),
          title: z.string().min(2),
          description: z.string().min(5),
        }),
      )
      .length(3),
    link: NavItemSchema,
  }),
  faqs: z.array(FaqItemSchema).min(3),
})
export type ContatoPage = z.infer<typeof ContatoPageSchema>

// Obrigado Page Schema
export const ObrigadoPageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  h1: z.string().min(2),
  canais: z.strictObject({
    whatsapp: z.strictObject({
      text: z.string().min(5),
      buttonLabel: z.string().min(2),
      supportText: z.string().min(5),
    }),
    email: z.strictObject({
      textWithEmail: z.string().min(5),
      fallbackText: z.string().min(5),
      buttonLabel: z.string().min(2),
    }),
    direto: z.strictObject({
      text: z.string().min(5),
      link: NavItemSchema,
    }),
  }),
  proximosPassos: z.strictObject({
    h2: z.string().min(2),
    steps: z
      .array(
        z.strictObject({
          number: z.number().int().positive(),
          title: z.string().min(2),
          description: z.string().min(5),
        }),
      )
      .length(3),
    link: NavItemSchema,
  }),
})
export type ObrigadoPage = z.infer<typeof ObrigadoPageSchema>

// Portfolio Hub Schema (copy v1, seção 2.1; as salas vêm de home.salas.items)
export const PortfolioPageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  h1: z.string().min(2),
  intro: z.array(z.string().min(10)).min(1),
  ctaFinal: z.strictObject({
    h2: z.string().min(2),
    text: z.string().min(10),
    ctaPrimary: NavItemSchema,
    ctaSecondary: z.strictObject({
      label: z.string().min(2),
      whatsappMessage: z.string().min(10),
    }),
  }),
})
export type PortfolioPage = z.infer<typeof PortfolioPageSchema>

// Privacidade Page Schema (port de docs/content/2026-09-privacidade-rascunho.md)
export const PrivacidadeBlockSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("paragraph"),
    text: z.string().min(1),
  }),
  z.strictObject({
    type: z.literal("list"),
    title: z.string().min(1).optional(),
    ordered: z.boolean().default(false),
    items: z.array(z.string().min(1)).min(1),
  }),
  z
    .strictObject({
      type: z.literal("table"),
      caption: z.string().min(1),
      columns: z.array(z.string().min(1)).min(1),
      rows: z.array(z.array(z.string().min(1)).min(1)).min(1),
    })
    .refine(
      (table) => table.rows.every((row) => row.length === table.columns.length),
      { message: "Cada linha da tabela deve ter uma célula por coluna" },
    ),
])
export type PrivacidadeBlock = z.infer<typeof PrivacidadeBlockSchema>

export const PrivacidadeSubsectionSchema = z.strictObject({
  id: z.string().min(1),
  number: z.string().min(1),
  title: z.string().min(1),
  blocks: z.array(PrivacidadeBlockSchema).min(1),
})

export const PrivacidadeSectionSchema = z
  .strictObject({
    id: z.string().min(1),
    number: z.string().min(1),
    title: z.string().min(1),
    blocks: z.array(PrivacidadeBlockSchema).min(1).optional(),
    subsections: z.array(PrivacidadeSubsectionSchema).min(1).optional(),
  })
  .refine(
    (section) =>
      section.blocks !== undefined || section.subsections !== undefined,
    {
      message: "Seção precisa de blocos de conteúdo ou de subseções",
    },
  )

export const PrivacidadePageSchema = z.strictObject({
  seo: z.strictObject({
    title: z.string().min(2),
    seoTitle: z.string().min(2),
    description: z.string().min(10),
  }),
  title: z.string().min(2),
  lastUpdated: z.string().min(4),
  sections: z.array(PrivacidadeSectionSchema).min(5),
})
export type PrivacidadePage = z.infer<typeof PrivacidadePageSchema>
