import { describe, it, expect } from "vitest"
import { getSafeRel, SAFE_EXTERNAL_REL } from "./link-security"

describe("getSafeRel", () => {
  it("não altera o rel quando o target não é _blank", () => {
    expect(getSafeRel(undefined, "author")).toBe("author")
    expect(getSafeRel("_self", undefined)).toBeUndefined()
  })

  it("adiciona noopener noreferrer em links _blank sem rel", () => {
    expect(getSafeRel("_blank")).toBe(SAFE_EXTERNAL_REL)
  })

  it("mescla com o rel existente sem duplicar tokens", () => {
    const rel = getSafeRel("_blank", "noopener author")
    const tokens = (rel ?? "").split(" ").sort()
    expect(tokens).toEqual(["author", "noopener", "noreferrer"])
  })
})
