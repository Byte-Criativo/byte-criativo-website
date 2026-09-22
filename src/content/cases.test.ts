import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { CaseStudy, type CaseStudyData } from "./schema"
import { caseStudies, caseStudiesRaw, publishedCaseEntries } from "./cases"
import { getAllCases, getCaseBySlug, getPublishedCases } from "./index"

// Guarda contra publicar case com mídia placeholder: um case PUBLICADO não
// pode ter srcs duplicados na galeria nem referenciar arquivo inexistente
// em public/. Recebe `existe` para ser testável sem depender do disco.
export function publishedMediaIssues(
  estudo: CaseStudyData,
  existe: (src: string) => boolean = (src) =>
    existsSync(join(process.cwd(), "public", src)),
): string[] {
  const problemas: string[] = []
  const vistos = new Set<string>()
  for (const imagem of estudo.media.gallery) {
    if (vistos.has(imagem.src)) {
      problemas.push(`src duplicado na galeria: ${imagem.src}`)
    }
    vistos.add(imagem.src)
  }
  const srcs = [
    estudo.media.cover.src,
    ...estudo.media.gallery.map((imagem) => imagem.src),
  ]
  for (const src of new Set(srcs)) {
    if (src.startsWith("/") && !existe(src)) {
      problemas.push(`arquivo ausente em public/: ${src}`)
    }
  }
  return problemas
}

describe("dados dos estudos de caso", () => {
  it("os dois cases reais passam na validação Zod", () => {
    expect(caseStudiesRaw).toHaveLength(2)
    for (const estudo of caseStudiesRaw) {
      const result = CaseStudy.safeParse(estudo)
      expect(result.success).toBe(true)
    }
  })

  it("os dois cases confirmados estão publicados com autorização registrada", () => {
    for (const estudo of caseStudies) {
      expect(estudo.status).toBe("published")
      expect(estudo.permissions.cleared).toBe(true)
      expect(estudo.permissions.notes).toContain("2026-09-22")
      expect(estudo.role.evidence).toContainEqual(
        expect.objectContaining({ kind: "owner-statement" }),
      )
    }
  })

  it("nenhum case pode ser publicado sem permissions.cleared (publish gate)", () => {
    for (const estudo of caseStudies) {
      const publicado = {
        ...estudo,
        status: "published",
        permissions: { cleared: false, notes: "" },
      }
      expect(CaseStudy.safeParse(publicado).success).toBe(false)
    }
  })

  it("campos de SEO respeitam os limites (title ≤ 60, description ≤ 160)", () => {
    for (const estudo of caseStudies) {
      expect(estudo.seo.title.length).toBeLessThanOrEqual(60)
      expect(estudo.seo.description.length).toBeLessThanOrEqual(160)
    }
  })

  it("cada case tem capa e galeria mínima de 3 imagens", () => {
    for (const estudo of caseStudies) {
      expect(estudo.media.cover.src).toMatch(/^\/cases\//)
      expect(estudo.media.gallery.length).toBeGreaterThanOrEqual(3)
    }
  })

  it("as galerias publicadas apontam para capturas distintas e presentes", () => {
    for (const estudo of caseStudies) {
      expect(publishedMediaIssues(estudo)).toEqual([])
    }
  })
})

describe("guarda de mídia de case publicado", () => {
  // Double: case de teste válido e publicado, derivado de um case real.
  function casePublicadoCom(srcs: string[]): CaseStudyData {
    const imagens = srcs.map((src, indice) => ({
      src,
      width: 1440,
      height: 900,
      alt: `Captura ${indice + 1} do case de teste`,
      capturedAt: "2026-09-16",
      sourceUrl: "https://www.undergroundpb.com.br/",
    }))
    const resultado = CaseStudy.parse({
      ...caseStudies[0],
      status: "published",
      permissions: { cleared: true, notes: "Autorizado em teste" },
      media: { cover: imagens[0], gallery: imagens },
    })
    return resultado
  }

  it("nenhum case publicado real tem problema de mídia", () => {
    for (const estudo of getPublishedCases()) {
      expect(publishedMediaIssues(estudo)).toEqual([])
    }
  })

  it("flagra srcs duplicados na galeria de um case publicado", () => {
    const estudo = casePublicadoCom([
      "/og-image.png",
      "/logoByte.png",
      "/og-image.png",
    ])
    const problemas = publishedMediaIssues(estudo)
    expect(problemas.some((p) => p.includes("duplicado"))).toBe(true)
  })

  it("flagra arquivo inexistente em public/ num case publicado", () => {
    const estudo = casePublicadoCom([
      "/cases/underground-pb/inexistente.avif",
      "/og-image.png",
      "/logoByte.png",
    ])
    const problemas = publishedMediaIssues(estudo)
    expect(problemas).toEqual([
      "arquivo ausente em public/: /cases/underground-pb/inexistente.avif",
    ])
  })

  it("aceita case publicado com 3 imagens distintas existentes em public/", () => {
    const estudo = casePublicadoCom([
      "/og-image.png",
      "/logoByte.png",
      "/MiniLogo.png",
    ])
    expect(publishedMediaIssues(estudo)).toEqual([])
  })
})

describe("loaders de cases", () => {
  it("getAllCases retorna os cases ordenados por `order`", () => {
    const ordens = getAllCases().map((estudo) => estudo.order)
    expect(ordens).toEqual([...ordens].sort((a, b) => a - b))
    expect(getAllCases().map((estudo) => estudo.slug)).toEqual([
      "underground-pb",
      "festival-alumio",
    ])
  })

  it("getPublishedCases e as entradas do sitemap contêm os dois cases", () => {
    expect(getPublishedCases().map((estudo) => estudo.slug)).toEqual([
      "underground-pb",
      "festival-alumio",
    ])
    expect(publishedCaseEntries.map((estudo) => estudo.slug)).toEqual([
      "underground-pb",
      "festival-alumio",
    ])
  })

  it("getCaseBySlug encontra o case e devolve undefined para slug desconhecido", () => {
    expect(getCaseBySlug("underground-pb")?.title).toContain("Underground PB")
    expect(getCaseBySlug("festival-alumio")?.title).toContain("Festival Alumiô")
    expect(getCaseBySlug("slug-inexistente")).toBeUndefined()
  })
})
