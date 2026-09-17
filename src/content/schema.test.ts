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
