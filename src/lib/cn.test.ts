import { describe, expect, it } from "vitest"
import { cn } from "./cn"

describe("cn", () => {
  it("junta classes e ignora falsy", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b")
  })

  it("deixa a última classe conflitante vencer", () => {
    expect(cn("bg-bg", "bg-surface")).toBe("bg-surface")
  })

  it("preserva utilitários com valor de token, que não conflitam entre si", () => {
    expect(cn("p-(--space-3)", "gap-(--space-2)")).toBe(
      "p-(--space-3) gap-(--space-2)",
    )
  })

  // Sem a extensão de tema em cn.ts, o tailwind-merge de fábrica não sabe
  // diferenciar o papel tipográfico (tamanho de fonte) do tom (cor de
  // texto): os dois usam o prefixo `text-` e, sem uma escala conhecida, o
  // papel cai no grupo de cor e "conflita" com o tom, apagando um dos dois.
  it("não deixa o papel tipográfico conflitar com o tom (cor) do texto", () => {
    expect(cn("text-body", "text-ink")).toBe("text-body text-ink")
    expect(cn("text-h1", "text-ink-muted")).toBe("text-h1 text-ink-muted")
  })
})
