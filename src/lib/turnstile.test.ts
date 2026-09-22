import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

import { verificarTurnstile } from "./turnstile"

describe("verificarTurnstile", () => {
  const fetchOriginal = globalThis.fetch
  const secretOriginal = process.env.TURNSTILE_SECRET_KEY

  beforeEach(() => {
    process.env.TURNSTILE_SECRET_KEY = "segredo-teste"
  })

  afterEach(() => {
    globalThis.fetch = fetchOriginal
    if (secretOriginal === undefined) delete process.env.TURNSTILE_SECRET_KEY
    else process.env.TURNSTILE_SECRET_KEY = secretOriginal
  })

  it("falha fechado quando falta secret ou token", async () => {
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock
    delete process.env.TURNSTILE_SECRET_KEY
    expect(await verificarTurnstile("token")).toBe(false)
    process.env.TURNSTILE_SECRET_KEY = "segredo-teste"
    expect(await verificarTurnstile("")).toBe(false)
    expect(await verificarTurnstile("x".repeat(2049))).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("exige validação positiva para a ação correta", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, action: "lead_form" }),
    })
    globalThis.fetch = fetchMock
    expect(await verificarTurnstile("token-1")).toBe(true)
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    )
    expect(options.method).toBe("POST")
    const body = options.body as URLSearchParams
    expect(body.get("response")).toBe("token-1")
    expect(body.get("secret")).toBe("segredo-teste")
  })

  it.each([
    { success: false, action: "lead_form" },
    { success: true, action: "outra_acao" },
    { success: true },
  ])("rejeita resposta inválida: %j", async (dados) => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => dados,
    })
    expect(await verificarTurnstile("token")).toBe(false)
  })

  it("falha fechado se o provedor não responder", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("rede"))
    expect(await verificarTurnstile("token")).toBe(false)
  })
})
