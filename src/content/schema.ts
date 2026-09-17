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
