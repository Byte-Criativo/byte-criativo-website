import { describe, expect, it } from "vitest"
import { contrastRatio, relativeLuminance } from "./contrast"

describe("contrastRatio", () => {
  it("preto sobre branco é 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5)
  })

  it("é simétrico", () => {
    expect(contrastRatio("#595959", "#FFFFFF")).toBeCloseTo(
      contrastRatio("#FFFFFF", "#595959"),
      10,
    )
  })

  it("grafite sobre branco fica perto de 7:1", () => {
    const ratio = contrastRatio("#595959", "#FFFFFF")
    expect(ratio).toBeGreaterThan(6.95)
    expect(ratio).toBeLessThan(7.05)
  })

  it("laranja da marca sobre branco reprova texto normal", () => {
    const ratio = contrastRatio("#F65606", "#FFFFFF")
    expect(ratio).toBeGreaterThan(3.3)
    expect(ratio).toBeLessThan(4.5)
  })

  it("rejeita cor em formato inválido", () => {
    expect(() => relativeLuminance("laranja")).toThrow("Cor inválida")
  })
})
