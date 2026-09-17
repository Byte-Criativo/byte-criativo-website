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
})
