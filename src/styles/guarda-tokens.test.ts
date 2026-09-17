import { readdirSync, readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const HEX = /#[0-9a-fA-F]{6}\b/
// Utilitários de espaço/tamanho com número solto: p-4, gap-6, min-h-10,
// max-w-3xl, text-2xl... Tokens entram como p-(--space-4), então o que vem
// depois do traço nunca é dígito.
const LITERAL =
  /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|h|size|min-h|min-w|max-w|max-h|top|bottom|left|right|inset|text|rounded|border|leading|tracking)-\[?\d/

export function violacoesDeToken(fonte: string): string[] {
  const achados: string[] = []
  for (const linha of fonte.split("\n")) {
    if (linha.trimStart().startsWith("//")) continue
    if (HEX.test(linha)) achados.push(`hex literal: ${linha.trim()}`)
    if (LITERAL.test(linha)) achados.push(`valor literal: ${linha.trim()}`)
  }
  return achados
}

function arquivosDeComponente(): string[] {
  const raiz = path.join(process.cwd(), "src/components")
  if (!existsSync(raiz)) return []
  return readdirSync(raiz, { recursive: true, encoding: "utf8" })
    .filter((nome) => nome.endsWith(".tsx") || nome.endsWith(".ts"))
    .map((nome) => path.join(raiz, nome))
}

describe("guarda de tokens: detector", () => {
  it("acusa hex literal", () => {
    expect(violacoesDeToken('const c = "bg-[#F65606]"')).toHaveLength(1)
  })

  it("acusa utilitário com número solto", () => {
    expect(violacoesDeToken('const c = "p-4 gap-2"')).toHaveLength(1)
  })

  it("aceita utilitário apoiado em token", () => {
    expect(
      violacoesDeToken('const c = "bg-bg p-(--space-5) gap-(--space-2)"'),
    ).toEqual([])
  })

  it("aceita utilitários de grade, que não são valor de design", () => {
    expect(
      violacoesDeToken('const c = "grid-cols-12 col-span-5 z-10"'),
    ).toEqual([])
  })
})

describe("guarda de tokens: src/components", () => {
  it("nenhum componente usa hex literal nem valor numérico solto", () => {
    const problemas = arquivosDeComponente().flatMap((arquivo) =>
      violacoesDeToken(readFileSync(arquivo, "utf8")).map(
        (achado) => `${path.relative(process.cwd(), arquivo)} — ${achado}`,
      ),
    )
    expect(problemas).toEqual([])
  })
})
