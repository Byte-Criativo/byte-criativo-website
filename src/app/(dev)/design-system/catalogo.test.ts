import { describe, expect, it } from "vitest"
import { catalogoDisponivel, NAVEGACAO } from "./catalogo"

describe("catálogo", () => {
  it("fica indisponível na produção da Vercel", () => {
    expect(catalogoDisponivel({ VERCEL_ENV: "production" })).toBe(false)
  })

  it("continua disponível em preview, em desenvolvimento e no CI", () => {
    expect(catalogoDisponivel({ VERCEL_ENV: "preview" })).toBe(true)
    expect(catalogoDisponivel({ VERCEL_ENV: "development" })).toBe(true)
    expect(catalogoDisponivel({})).toBe(true)
  })

  it("a navegação usa os quatro rótulos reais da copy v1", () => {
    expect(NAVEGACAO.map((item) => item.rotulo)).toEqual([
      "Projetos",
      "Serviços",
      "Como trabalhamos",
      "Sobre",
    ])
  })
})
