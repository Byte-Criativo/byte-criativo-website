import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { contrastRatio } from "@/lib/contrast"
import { lightTheme, palette, requiredPairs, rooms, versoTheme } from "./tokens"
import tokensJson from "./tokens.json"

const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
)

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, `bloco ${selector} ausente em globals.css`).toBeGreaterThan(-1)
  const end = css.indexOf("}", start)
  return css.slice(start, end)
}

function parseHexVars(source: string): Record<string, string> {
  const vars: Record<string, string> = {}
  const re = /(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) {
    const name = match[1]
    const hex = match[2]
    if (name && hex) vars[name] = hex.toLowerCase()
  }
  return vars
}

function requireVar(theme: Record<string, string>, name: string): string {
  const value = theme[name]
  if (!value) throw new Error(`variável ${name} ausente`)
  return value
}

const roomSlugs = Object.keys(rooms)

describe("tokens de cor: contraste mínimo", () => {
  it.each(requiredPairs)("$name atende ao mínimo de contraste", (pair) => {
    expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(pair.min)
  })
})

describe("tokens de cor: sincronia dos temas com o CSS", () => {
  it("tema claro do TS é igual ao :root do CSS (mesmos 19 nomes e hex)", () => {
    const root = parseHexVars(block(":root"))
    const names = Object.keys(lightTheme).sort()
    expect(names.length).toBe(19)
    expect(Object.keys(root).sort()).toEqual(names)
    for (const name of names) {
      expect(root[name], name).toBe(requireVar(lightTheme, name).toLowerCase())
    }
  })

  it('tema do verso do TS é igual ao bloco [data-surface="verso"] do CSS (mesmos 19 nomes e hex)', () => {
    const verso = parseHexVars(block('[data-surface="verso"]'))
    const names = Object.keys(versoTheme).sort()
    expect(names.length).toBe(19)
    expect(Object.keys(verso).sort()).toEqual(names)
    for (const name of names) {
      expect(verso[name], name).toBe(requireVar(versoTheme, name).toLowerCase())
    }
  })
})

describe("tokens de cor: sincronia das salas com o CSS", () => {
  const roomVarMap: Array<[cssVar: string, tokenKey: string]> = [
    ["--bg", "surface"],
    ["--ink", "ink"],
    ["--ink-muted", "inkMuted"],
    ["--action-bg", "ctaBg"],
    ["--action-bg-hover", "ctaBg"],
    ["--action-ink", "ctaInk"],
    ["--room-easel", "easel"],
  ]

  it.each(roomSlugs)(
    '[data-case="%s"] mapeia as vars a partir de tokens.json',
    (slug) => {
      const roomTokens = rooms[slug]
      if (!roomTokens) throw new Error(`sala ausente: ${slug}`)
      const roomBlock = parseHexVars(block(`[data-case="${slug}"]`))
      for (const [cssVar, tokenKey] of roomVarMap) {
        expect(roomBlock[cssVar], `${slug} ${cssVar}`).toBe(
          requireVar(roomTokens, tokenKey).toLowerCase(),
        )
      }
    },
  )

  it.each(roomSlugs)(
    '[data-case="%s"] [data-bloco="alt"] mapeia --bg a partir de surfaceAlt',
    (slug) => {
      const roomTokens = rooms[slug]
      if (!roomTokens) throw new Error(`sala ausente: ${slug}`)
      const altBlock = parseHexVars(
        block(`[data-case="${slug}"] [data-bloco="alt"]`),
      )
      expect(altBlock["--bg"]).toBe(
        requireVar(roomTokens, "surfaceAlt").toLowerCase(),
      )
    },
  )
})

describe("tokens de cor: regra do foco duplo", () => {
  function assertDoubleFocus(
    ring: string,
    halo: string,
    backgrounds: string[],
  ): void {
    expect(contrastRatio(ring, halo)).toBeGreaterThanOrEqual(3)
    for (const bg of backgrounds) {
      const ratioRingBg = contrastRatio(ring, bg)
      const ratioHaloBg = contrastRatio(halo, bg)
      expect(Math.max(ratioRingBg, ratioHaloBg)).toBeGreaterThanOrEqual(3)
    }
  }

  it("tema claro: anel × halo e o maior de anel/halo × --bg cumprem o mínimo de 3", () => {
    assertDoubleFocus(
      requireVar(lightTheme, "--focus-ring"),
      requireVar(lightTheme, "--focus-halo"),
      [requireVar(lightTheme, "--bg")],
    )
  })

  it("verso: anel × halo e o maior de anel/halo × --bg cumprem o mínimo de 3", () => {
    assertDoubleFocus(
      requireVar(versoTheme, "--focus-ring"),
      requireVar(versoTheme, "--focus-halo"),
      [requireVar(versoTheme, "--bg")],
    )
  })

  it.each(roomSlugs)(
    "sala %s: anel e halo do tema base cumprem o mínimo sobre surface e surfaceAlt",
    (slug) => {
      const roomEntry =
        tokensJson.color.rooms[slug as keyof typeof tokensJson.color.rooms]
      if (!roomEntry) throw new Error(`sala ausente em tokens.json: ${slug}`)
      const baseTheme = roomEntry.base === "verso" ? versoTheme : lightTheme
      const roomTokens = rooms[slug]
      if (!roomTokens) throw new Error(`sala ausente: ${slug}`)
      assertDoubleFocus(
        requireVar(baseTheme, "--focus-ring"),
        requireVar(baseTheme, "--focus-halo"),
        [
          requireVar(roomTokens, "surface"),
          requireVar(roomTokens, "surfaceAlt"),
        ],
      )
    },
  )
})

describe("tokens de cor: palette", () => {
  it("expõe as primitivas de tokens.json", () => {
    expect(palette.white).toBe("#FFFFFF")
    expect(palette.black).toBe("#000000")
    expect(palette["signal-ink"]).toBe("#B83F00")
  })
})
