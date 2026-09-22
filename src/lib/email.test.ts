import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONTACT_EMAIL } from "./contact"
import type { LeadParaEmail } from "./email"

const { enviar, Resend } = vi.hoisted(() => ({
  enviar: vi.fn(),
  Resend: vi.fn(),
}))

vi.mock("resend", () => ({ Resend }))

import { EMAIL_TIMEOUT_MS, LeadEmailError, sendLeadEmail } from "./email"

const LEAD: LeadParaEmail = {
  dados: {
    nome: "Ana",
    tipo: "site",
    contexto: "Temos um site antigo e precisamos renovar.",
    canal: "email",
    whatsapp: "",
    email: "ana@exemplo.com",
    empresa: "Padaria Real",
    prazo: "Tenho uma data",
  },
  tipoRotulo: "Site ou landing page",
  origem: "processo",
}

describe("sendLeadEmail", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_teste")
    enviar.mockReset()
    Resend.mockReset()
    Resend.mockImplementation(function () {
      return { emails: { send: enviar } }
    })
    enviar.mockResolvedValue({ data: { id: "1" }, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it("sem RESEND_API_KEY falha de forma tratada, sem construir o cliente", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    await expect(sendLeadEmail(LEAD)).rejects.toBeInstanceOf(LeadEmailError)
    expect(Resend).not.toHaveBeenCalled()
  })

  it("envia texto puro com os dados do lead, assunto pelo tipo e reply-to do lead", async () => {
    await sendLeadEmail(LEAD)
    expect(enviar).toHaveBeenCalledTimes(1)
    expect(enviar.mock.calls[0]?.[1]).toBeUndefined()
    const carga = enviar.mock.calls[0]?.[0] as Record<string, unknown>
    expect(carga.to).toBe(CONTACT_EMAIL)
    expect(carga.subject).toBe("Novo contato pelo site: Site ou landing page")
    expect(carga.replyTo).toBe("ana@exemplo.com")
    const corpo = carga.text as string
    for (const trecho of [
      "Nome: Ana",
      "O que quer construir: Site ou landing page",
      "Contexto: Temos um site antigo",
      "Canal preferido: E-mail",
      "E-mail: ana@exemplo.com",
      "Empresa: Padaria Real",
      "Prazo: Tenho uma data",
      "Origem: processo",
    ]) {
      expect(corpo).toContain(trecho)
    }
    // Texto puro, sem HTML montado a partir dos dados do lead.
    expect(corpo).not.toMatch(/<[a-z]+>/i)
  })

  it("usa o UUID do envio como chave de idempotência para retries", async () => {
    const lead = {
      ...LEAD,
      envio: "3f6f1c2a-7b8d-4e5f-9a0b-1c2d3e4f5a6b",
    }
    await sendLeadEmail(lead)
    await sendLeadEmail(lead)
    expect(enviar).toHaveBeenCalledTimes(2)
    expect(enviar.mock.calls[0]?.[1]).toEqual({
      idempotencyKey: `lead/${lead.envio}`,
    })
    expect(enviar.mock.calls[1]?.[1]).toEqual(enviar.mock.calls[0]?.[1])
  })

  it("no canal WhatsApp o corpo leva o número e não há reply-to", async () => {
    await sendLeadEmail({
      ...LEAD,
      dados: {
        ...LEAD.dados,
        canal: "whatsapp",
        whatsapp: "(83) 99125-3377",
        email: "",
        empresa: undefined,
        prazo: undefined,
      },
      origem: undefined,
    })
    const carga = enviar.mock.calls[0]?.[0] as Record<string, unknown>
    expect(carga.replyTo).toBeUndefined()
    const corpo = carga.text as string
    expect(corpo).toContain("WhatsApp: (83) 99125-3377")
    // Linhas vazias não viram rótulos órfãos.
    expect(corpo).not.toContain("Empresa:")
    expect(corpo).not.toContain("Prazo:")
    expect(corpo).not.toContain("Origem:")
  })

  it("erro do provedor vira LeadEmailError tratada", async () => {
    enviar.mockResolvedValue({
      data: null,
      error: { message: "domínio não verificado" },
    })
    await expect(sendLeadEmail(LEAD)).rejects.toThrow("domínio não verificado")
  })

  it("provedor sem resposta estoura o tempo limite", async () => {
    vi.useFakeTimers()
    enviar.mockReturnValue(new Promise(() => {}))
    const promessa = sendLeadEmail(LEAD)
    const espera = expect(promessa).rejects.toThrow("tempo esgotado")
    await vi.advanceTimersByTimeAsync(EMAIL_TIMEOUT_MS)
    await espera
  })
})
