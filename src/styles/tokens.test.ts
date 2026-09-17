import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { contrastRatio } from "@/lib/contrast"
import {
  lightTheme,
  palette,
  requiredPairs,
  resolveContrastMin,
  resolveRoomColor,
  rooms,
  versoTheme,
} from "./tokens"
import tokensJson from "./tokens.json"

const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
)

// `indexOf` pega a primeira ocorrência do seletor: o `:root` de topo precisa
// aparecer antes do `:root` aninhado em `@media (prefers-reduced-motion)`
// para que este helper resolva o bloco certo.
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

describe("tokens de cor: salas conhecidas", () => {
  it("rooms tem exatamente as 3 salas de tokens.json (nenhum it.each abaixo roda vazio)", () => {
    expect(roomSlugs.length).toBe(3)
    expect([...roomSlugs].sort()).toEqual(
      ["festival-alumio", "goromax", "underground-pb"].sort(),
    )
  })
})

describe("tokens de cor: validação do mínimo de contraste", () => {
  it("aceita 3 e 4,5 e devolve o mesmo valor", () => {
    expect(resolveContrastMin("par de teste", 3)).toBe(3)
    expect(resolveContrastMin("par de teste", 4.5)).toBe(4.5)
  })

  it("rejeita um mínimo que não seja 3 nem 4,5", () => {
    expect(() => resolveContrastMin("par de teste", 4)).toThrow(
      'Par "par de teste": min inválido 4 (esperado 3 ou 4,5)',
    )
  })
})

describe("tokens de cor: resolveRoomColor cai para o tema base da sala", () => {
  it("usa o token da sala quando a chave existe", () => {
    const fixture = {
      color: {
        primitive: { tinta: "#111111", parede: "#F4EFE7" },
        themes: {
          light: { "--ink": "tinta", "--bg": "parede" },
          verso: { "--ink": "tinta", "--bg": "parede" },
        },
        rooms: {
          sala: { base: "light" as const, tokens: { surface: "#F4EFE7" } },
        },
      },
      pairs: [],
    }

    expect(resolveRoomColor(fixture, "sala", "surface")).toBe("#F4EFE7")
  })

  it("cai para a variável --<chave> do tema base quando a sala não publica a chave", () => {
    const fixture = {
      color: {
        primitive: { tinta: "#111111", parede: "#F4EFE7" },
        themes: {
          light: { "--ink": "tinta", "--bg": "parede" },
          verso: { "--ink": "tinta", "--bg": "parede" },
        },
        rooms: {
          sala: { base: "light" as const, tokens: { surface: "#F4EFE7" } },
        },
      },
      pairs: [],
    }

    // "ink" não existe em `sala.tokens`: cai para `--ink` do tema `light`.
    expect(resolveRoomColor(fixture, "sala", "ink")).toBe("#111111")
  })

  it("lança um erro claro quando a sala não existe no fixture", () => {
    const fixture = {
      color: {
        primitive: {},
        themes: { light: {}, verso: {} },
        rooms: {},
      },
      pairs: [],
    }

    expect(() => resolveRoomColor(fixture, "sala-inexistente", "ink")).toThrow(
      "sala ausente em tokens.json: sala-inexistente",
    )
  })
})

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

  it.each(roomSlugs)(
    '[data-case="%s"] define --focus-ring e --focus-halo com os valores do tema base da sala',
    (slug) => {
      const roomEntry =
        tokensJson.color.rooms[slug as keyof typeof tokensJson.color.rooms]
      if (!roomEntry) throw new Error(`sala ausente em tokens.json: ${slug}`)
      const baseTheme = roomEntry.base === "verso" ? versoTheme : lightTheme
      const roomBlock = parseHexVars(block(`[data-case="${slug}"]`))
      expect(roomBlock["--focus-ring"], `${slug} --focus-ring`).toBe(
        requireVar(baseTheme, "--focus-ring").toLowerCase(),
      )
      expect(roomBlock["--focus-halo"], `${slug} --focus-halo`).toBe(
        requireVar(baseTheme, "--focus-halo").toLowerCase(),
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
    "sala %s: anel e halo definidos no CSS da sala cumprem o mínimo sobre surface e surfaceAlt",
    (slug) => {
      // Lê --focus-ring/--focus-halo do bloco [data-case] do CSS (não do
      // tema base em memória): é o CSS da sala que corre em produção, e é
      // ele que o teste de sincronia acima já garante bater com o tema
      // base — aqui validamos o contrato de contraste sobre esses valores.
      const roomBlock = parseHexVars(block(`[data-case="${slug}"]`))
      const roomTokens = rooms[slug]
      if (!roomTokens) throw new Error(`sala ausente: ${slug}`)
      assertDoubleFocus(
        requireVar(roomBlock, "--focus-ring"),
        requireVar(roomBlock, "--focus-halo"),
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

// A partir daqui: invariantes de globals.css que só existiam nos gates
// descartáveis da Fase 6 (gate-6.2.mjs via gate-lib.mjs#checkTokenCss).
// Portadas para cá para sobreviver depois que os gates forem descartados.

describe("tokens de cor: guarda de não-vacuidade", () => {
  it("requiredPairs tem pelo menos 86 pares (tokens.json não encolheu)", () => {
    expect(requiredPairs.length).toBeGreaterThanOrEqual(86)
  })
})

describe("globals.css: @theme inline expõe as cores para o Tailwind", () => {
  it("define --color-<nome> para as 19 vars de tema + --color-action, --color-on-action e --font-sans", () => {
    const themeInline = block("@theme inline")
    const names = Object.keys(lightTheme)
    expect(names.length).toBe(19)
    for (const varName of names) {
      const nome = varName.replace(/^--/, "")
      expect(themeInline, `--color-${nome}`).toContain(
        `--color-${nome}: var(${varName})`,
      )
    }
    expect(themeInline).toContain("--color-action: var(--action-bg)")
    expect(themeInline).toContain("--color-on-action: var(--action-ink)")
    expect(themeInline).toContain(
      "--font-sans: var(--ff-sans), ui-sans-serif, system-ui, sans-serif",
    )
  })
})

describe("globals.css: prefers-reduced-motion zera as durações", () => {
  it("o bloco @media (prefers-reduced-motion: reduce) zera --dur-instant, --dur-fast, --dur-base e --dur-slow", () => {
    const mediaStart = css.indexOf("@media (prefers-reduced-motion: reduce)")
    expect(
      mediaStart,
      "bloco @media (prefers-reduced-motion: reduce) ausente",
    ).toBeGreaterThan(-1)
    const rootStart = css.indexOf(":root {", mediaStart)
    expect(
      rootStart,
      ":root aninhado em prefers-reduced-motion ausente",
    ).toBeGreaterThan(-1)
    const rootEnd = css.indexOf("}", rootStart)
    const nestedRoot = css.slice(rootStart, rootEnd)
    for (const varName of [
      "--dur-instant",
      "--dur-fast",
      "--dur-base",
      "--dur-slow",
    ]) {
      const re = new RegExp(`${varName}:\\s*([^;]+);`)
      const match = re.exec(nestedRoot)
      expect(match, `${varName} ausente em prefers-reduced-motion`).not.toBe(
        null,
      )
      const value = match?.[1] ?? ""
      expect(
        Number.parseFloat(value),
        `${varName} deveria zerar, valor encontrado: ${value}`,
      ).toBe(0)
    }
  })
})

describe("globals.css: :focus-visible dentro de @layer base", () => {
  it("outline usa border.focus em --focus-ring e o halo usa --focus-halo", () => {
    const layerStart = css.indexOf("@layer base {")
    expect(layerStart, "@layer base ausente em globals.css").toBeGreaterThan(-1)
    const focusStart = css.indexOf(":focus-visible {", layerStart)
    expect(
      focusStart,
      ":focus-visible dentro de @layer base ausente",
    ).toBeGreaterThan(-1)
    const focusEnd = css.indexOf("}", focusStart)
    const focusBlock = css.slice(focusStart, focusEnd)

    const outlineWidth = tokensJson.border.focus
    expect(focusBlock).toContain(
      `outline: ${outlineWidth} solid var(--focus-ring)`,
    )
    expect(focusBlock).toMatch(/box-shadow:[^;]*var\(--focus-halo\)/)
  })
})
