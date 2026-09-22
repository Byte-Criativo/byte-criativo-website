import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ESTADO_INICIAL_LEAD, ERRO_LEAD } from "@/lib/lead-form"

const { sendLeadEmail, redirecionar, deposis } = vi.hoisted(() => ({
  sendLeadEmail: vi.fn(),
  redirecionar: vi.fn(),
  deposis: vi.fn(),
}))

vi.mock("@/lib/email", () => ({ sendLeadEmail }))

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirecionar(url)
    throw new Error("NEXT_REDIRECT")
  },
}))

vi.mock("next/server", () => ({
  after: (callback: () => void) => {
    deposis(callback)
    callback()
  },
}))

import { submitLead } from "./actions"

const VALIDO: Record<string, string> = {
  nome: "Ana",
  tipo: "site",
  contexto: "Temos um site antigo e precisamos renovar.",
  canal: "email",
  whatsapp: "",
  email: "ana@exemplo.com",
  empresa: "",
  prazo: "",
  verificacao: "",
  carimbo: String(Date.now() - 60_000),
  origem: "",
  envio: "",
}

function formDataDe(campos: Record<string, string>): FormData {
  const formData = new FormData()
  for (const [campo, valor] of Object.entries(campos))
    formData.set(campo, valor)
  return formData
}

async function enviar(campos: Record<string, string>) {
  return submitLead(ESTADO_INICIAL_LEAD, formDataDe(campos))
}

describe("submitLead", () => {
  beforeEach(() => {
    sendLeadEmail.mockReset()
    redirecionar.mockReset()
    deposis.mockReset()
    sendLeadEmail.mockResolvedValue(undefined)
    vi.spyOn(console, "info").mockImplementation(() => {})
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("honeypot preenchido: sucesso genérico, sem enviar e sem avisar o robô", async () => {
    await expect(
      enviar({ ...VALIDO, verificacao: "preenchido por robô" }),
    ).rejects.toThrow("NEXT_REDIRECT")
    // O descarte ecoa o canal válido: a resposta não pode ser
    // distinguível da resposta legítima (revisão, IMPORTANT 1).
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado?canal=email")
    expect(sendLeadEmail).not.toHaveBeenCalled()
    // A spec registra só a contagem dos descartes pelo honeypot.
    expect(console.info).toHaveBeenCalledWith(
      "envio de lead descartado pelo honeypot",
    )
  })

  it("honeypot sem canal válido redireciona para a obrigado sem canal", async () => {
    await expect(
      enviar({ ...VALIDO, canal: "pombo-correio", verificacao: "x" }),
    ).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado")
    expect(sendLeadEmail).not.toHaveBeenCalled()
  })

  it("envio rápido demais pelo carimbo: sucesso genérico sem enviar e sem log", async () => {
    await expect(
      enviar({ ...VALIDO, carimbo: String(Date.now()) }),
    ).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado?canal=email")
    expect(sendLeadEmail).not.toHaveBeenCalled()
    // Só o honeypot entra na contagem (spec, LeadForm › Estados › Sucesso).
    expect(console.info).not.toHaveBeenCalled()
  })

  it("carimbo vazio (sem JS) não bloqueia o envio", async () => {
    await expect(enviar({ ...VALIDO, carimbo: "" })).rejects.toThrow(
      "NEXT_REDIRECT",
    )
    expect(sendLeadEmail).toHaveBeenCalledTimes(1)
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado?canal=email")
  })

  it("erros de validação voltam por campo, com valores preservados e sem envio", async () => {
    const estado = await enviar({ ...VALIDO, nome: "", tipo: "loja" })
    expect(estado.status).toBe("erro")
    expect(estado.erros.nome).toBe(ERRO_LEAD.nomeVazio)
    expect(estado.erros.tipo).toBe(ERRO_LEAD.tipoNaoEscolhido)
    expect(estado.valores.contexto).toBe(VALIDO.contexto)
    expect(estado.valores.email).toBe(VALIDO.email)
    expect(redirecionar).not.toHaveBeenCalled()
    expect(sendLeadEmail).not.toHaveBeenCalled()
  })

  it("sucesso redireciona para /contato/obrigado com canal e identificador de envio", async () => {
    const envio = "3f6f1c2a-7b8d-4e5f-9a0b-1c2d3e4f5a6b"
    await expect(enviar({ ...VALIDO, envio })).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith(
      `/contato/obrigado?canal=email&envio=${envio}`,
    )
    expect(sendLeadEmail).toHaveBeenCalledTimes(1)
    const lead = sendLeadEmail.mock.calls[0]?.[0] as {
      dados: { nome: string; canal: string }
      tipoRotulo: string
      envio: string
    }
    expect(lead.dados.nome).toBe("Ana")
    expect(lead.tipoRotulo).toBe("Site ou landing page")
    expect(lead.envio).toBe(envio)
  })

  it("sucesso sem identificador (sem JS) redireciona só com o canal", async () => {
    await expect(enviar(VALIDO)).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado?canal=email")
    expect(sendLeadEmail.mock.calls[0]?.[0]).not.toHaveProperty("envio")
  })

  it("sucesso pelo canal WhatsApp ecoa canal=whatsapp no redirect", async () => {
    await expect(
      enviar({
        ...VALIDO,
        canal: "whatsapp",
        whatsapp: "(83) 99125-3377",
        email: "",
      }),
    ).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith(
      "/contato/obrigado?canal=whatsapp",
    )
    expect(sendLeadEmail).toHaveBeenCalledTimes(1)
  })

  it("a origem vai para o e-mail do lead, truncada em 200 caracteres", async () => {
    await expect(enviar({ ...VALIDO, origem: "processo" })).rejects.toThrow(
      "NEXT_REDIRECT",
    )
    expect(sendLeadEmail.mock.calls[0]?.[0]).toMatchObject({
      origem: "processo",
    })

    sendLeadEmail.mockClear()
    await expect(
      enviar({ ...VALIDO, origem: `utm=${"x".repeat(500)}` }),
    ).rejects.toThrow("NEXT_REDIRECT")
    const lead = sendLeadEmail.mock.calls[0]?.[0] as { origem: string }
    expect(lead.origem).toHaveLength(200)
  })

  it("identificador de envio fora do formato não é ecoado no redirect", async () => {
    await expect(
      enviar({ ...VALIDO, envio: `não é uuid ${"x".repeat(500)}` }),
    ).rejects.toThrow("NEXT_REDIRECT")
    expect(redirecionar).toHaveBeenCalledWith("/contato/obrigado?canal=email")
    expect(sendLeadEmail.mock.calls[0]?.[0]).not.toHaveProperty("envio")
  })

  it("rejeita identificador com aparência de UUID mas versão incorreta", async () => {
    await expect(
      enviar({ ...VALIDO, envio: "3f6f1c2a-7b8d-1e5f-9a0b-1c2d3e4f5a6b" }),
    ).rejects.toThrow("NEXT_REDIRECT")
    expect(sendLeadEmail.mock.calls[0]?.[0]).not.toHaveProperty("envio")
  })

  it("whatsapp e e-mail longos demais são inválidos; empresa é truncada", async () => {
    const whatsappLongo = await enviar({
      ...VALIDO,
      canal: "whatsapp",
      whatsapp: `(83) 99125-3377 ramal ${"1".repeat(30)}`,
      email: "",
    })
    expect(whatsappLongo.erros.whatsapp).toBe(ERRO_LEAD.whatsappInvalido)

    const emailLongo = await enviar({
      ...VALIDO,
      email: `${"a".repeat(250)}@ex.com`,
    })
    expect(emailLongo.erros.email).toBe(ERRO_LEAD.emailInvalido)

    // Empresa não tem mensagem de erro na copy: truncada em silêncio.
    await expect(
      enviar({ ...VALIDO, empresa: "E".repeat(150) }),
    ).rejects.toThrow("NEXT_REDIRECT")
    const lead = sendLeadEmail.mock.calls.at(-1)?.[0] as {
      dados: { empresa?: string }
    }
    expect(lead.dados.empresa).toHaveLength(100)
  })

  it("falha do provedor vira estado fallback, sem redirect e sem perder valores", async () => {
    sendLeadEmail.mockRejectedValue(new Error("provedor fora"))
    const estado = await enviar(VALIDO)
    expect(estado.status).toBe("fallback")
    expect(estado.erros).toEqual({})
    expect(estado.valores.nome).toBe("Ana")
    expect(redirecionar).not.toHaveBeenCalled()
  })

  it("sem RESEND_API_KEY o envio falha tratado e cai no fallback", async () => {
    // A env ausente é tratada dentro de sendLeadEmail (ver email.test.ts);
    // aqui a action só precisa não vazar a exceção.
    sendLeadEmail.mockRejectedValue(new Error("RESEND_API_KEY não configurada"))
    const estado = await enviar(VALIDO)
    expect(estado.status).toBe("fallback")
  })

  it("os registros de servidor não levam dados pessoais", async () => {
    sendLeadEmail.mockRejectedValue(new Error("provedor fora"))
    await enviar(VALIDO)
    const registros = [
      ...vi.mocked(console.info).mock.calls,
      ...vi.mocked(console.error).mock.calls,
    ]
    expect(registros.length).toBeGreaterThan(0)
    const texto = JSON.stringify(registros)
    expect(texto).not.toContain("Ana")
    expect(texto).not.toContain("ana@exemplo.com")
    expect(texto).not.toContain(VALIDO.contexto)
  })
})
