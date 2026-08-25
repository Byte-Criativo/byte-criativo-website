import { describe, expect, it } from "vitest"
import { buildLeadMessage } from "./lead"

describe("buildLeadMessage", () => {
  it("monta mensagem com nome, empresa e necessidade", () => {
    expect(
      buildLeadMessage({
        name: "Ana",
        company: "Padaria Real",
        need: "um site novo",
      }),
    ).toBe("Olá! Sou Ana, da empresa Padaria Real. Preciso de: um site novo")
  })

  it("omite a empresa quando vazia", () => {
    expect(
      buildLeadMessage({ name: "Ana", company: "  ", need: "um site novo" }),
    ).toBe("Olá! Sou Ana. Preciso de: um site novo")
  })
})
