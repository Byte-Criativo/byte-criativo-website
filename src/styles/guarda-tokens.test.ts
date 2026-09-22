import { readdirSync, readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const HEX = /#[0-9a-fA-F]{6}\b/
// Utilitários de espaço/tamanho com número solto (padding, margin, gap,
// largura, altura, alvo mínimo, texto, borda, arredondamento, entrelinha,
// tracking, espaço entre filhos, translação, duração, opacidade, sombra).
// Tokens entram como um valor entre parênteses referenciando uma variável
// CSS, então o que vem depois do traço nunca é dígito.
// M4: espaço entre filhos, translação, duração do motion e sombra também
// têm token (space.*, motion.duration.*, shadow.*) e entram na lista; só
// opacidade não tem token dedicado ainda, mas entra por precaução (0/100
// como valores binários já bastam para o v1, ver FrenteVerso).
const LITERAL =
  /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-h|min-w|max-w|max-h|top|bottom|left|right|inset|text|rounded|border|leading|tracking|translate-x|translate-y|duration|opacity|shadow)-\[?\d/

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

// M3: o scanner de conteúdo do Tailwind lê o arquivo inteiro em busca de
// candidatos de classe — comentário, string ou código, tanto faz — e não
// sabe que uma string aqui é dado de teste. Uma fixture escrita como texto
// literal completo (prefixo + traço + número, ou o padrão de valor
// arbitrário de cor) virava um utilitário real no CSS de produção,
// incluindo um hex da marca dentro de `bg-[#...]`. Por isso, nesta suíte:
// (a) nenhuma fixture nem comentário reproduz um candidato completo como
// texto contíguo — números entram por interpolação de template literal
// (`` `p-${4}` ``) e exemplos em prosa usam hífen tipográfico (‑, U+2011,
// visualmente idêntico ao hífen comum) em vez do hífen ASCII; (b) depois de
// qualquer mudança aqui, `npm run build` seguido de uma varredura do CSS
// gerado por "F65606" deve voltar vazio.
describe("guarda de tokens: detector", () => {
  it("acusa hex literal", () => {
    // Exemplo ilustrativo: bg‑[#F65606] (hífen tipográfico de propósito).
    const hexLiteral = `bg-[#${"F65606"}]`
    expect(violacoesDeToken(`const c = "${hexLiteral}"`)).toHaveLength(1)
  })

  it("acusa utilitário com número solto", () => {
    // Exemplo ilustrativo: p‑4 gap‑2 (hífen tipográfico de propósito).
    const utilitarios = `p-${4} gap-${2}`
    expect(violacoesDeToken(`const c = "${utilitarios}"`)).toHaveLength(1)
  })

  it("aceita utilitário apoiado em token", () => {
    const utilitarios = `bg-bg p-(--space-${5}) gap-(--space-${2})`
    expect(violacoesDeToken(`const c = "${utilitarios}"`)).toEqual([])
  })

  it("aceita utilitários de grade, que não são valor de design", () => {
    const utilitarios = `grid-cols-${12} col-span-${5} z-${10}`
    expect(violacoesDeToken(`const c = "${utilitarios}"`)).toEqual([])
  })

  // M4: famílias que também têm token (espaço entre filhos, translação,
  // duração do motion e sombra) mas não entravam na regex original.
  it("acusa outras famílias com token: espaço entre filhos, translação, duração, opacidade, sombra", () => {
    const casos = [
      `space-x-${4}`,
      `space-y-${2}`,
      `translate-x-${2}`,
      `translate-y-${4}`,
      `duration-${300}`,
      `opacity-${50}`,
      `shadow-${1}`,
    ]
    for (const caso of casos) {
      expect(
        violacoesDeToken(`const c = "${caso}"`).length,
        `deveria acusar: ${caso}`,
      ).toBeGreaterThan(0)
    }
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
