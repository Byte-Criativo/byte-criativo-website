import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getContatoPage } from "@/content"
import { CHAVE_CONTINUACAO } from "@/lib/continuar-conversa"

const { busca, acao } = vi.hoisted(() => ({
  busca: { valor: "" },
  acao: {
    chamadas: 0,
    ultimoFormData: null as FormData | null,
    envios: [] as string[],
    impl: async (): Promise<unknown> => ({
      status: "inicial",
      erros: {},
      valores: {
        nome: "",
        tipo: "",
        contexto: "",
        canal: "",
        whatsapp: "",
        email: "",
        empresa: "",
        prazo: "",
      },
    }),
  },
}))

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(busca.valor),
}))

vi.mock("../actions", () => ({
  submitLead: (_prev: unknown, formData: FormData) => {
    acao.chamadas += 1
    acao.ultimoFormData = formData
    acao.envios.push(String(formData.get("envio")))
    return acao.impl()
  },
}))

import { LeadForm } from "./lead-form"

const contato = getContatoPage()

const VALORES_SERVIDOR = {
  nome: "Ana",
  tipo: "site",
  contexto: "Temos um site antigo e precisamos renovar.",
  canal: "email",
  whatsapp: "",
  email: "ana@exemplo.com",
  empresa: "",
  prazo: "",
}

async function preencherValido(
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> {
  await user.type(screen.getByLabelText("Seu nome (obrigatório)"), "Ana")
  await user.click(screen.getByRole("radio", { name: "Site ou landing page" }))
  await user.type(
    screen.getByLabelText("Conte um pouco do contexto (obrigatório)"),
    "Temos um site antigo e precisamos renovar.",
  )
  await user.click(screen.getByRole("radio", { name: "E-mail" }))
  await user.type(
    screen.getByLabelText("Seu e-mail (obrigatório)"),
    "ana@exemplo.com",
  )
}

describe("LeadForm (ilha)", () => {
  beforeEach(() => {
    busca.valor = ""
    acao.chamadas = 0
    acao.envios = []
    sessionStorage.clear()
    acao.impl = async () => ({
      status: "inicial",
      erros: {},
      valores: {
        nome: "",
        tipo: "",
        contexto: "",
        canal: "",
        whatsapp: "",
        email: "",
        empresa: "",
        prazo: "",
      },
    })
  })

  it("renderiza honeypot fora da tabulação, campos ocultos e carimbo preenchido", () => {
    const { container } = render(<LeadForm contato={contato} />)
    const honeypot = container.querySelector<HTMLInputElement>(
      'input[name="verificacao"]',
    )
    expect(honeypot).toHaveAttribute("tabindex", "-1")
    expect(honeypot?.closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )
    const carimbo = container.querySelector<HTMLInputElement>(
      'input[name="carimbo"]',
    )
    expect(Number(carimbo?.value)).toBeGreaterThan(0)
    expect(
      container.querySelector('input[type="hidden"][name="envio"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('input[type="hidden"][name="origem"]'),
    ).not.toBeNull()
  })

  it("validação síncrona: erros por campo, resumo com foco e action nem é chamada", async () => {
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(await screen.findByText("Faltou o seu nome.")).toBeInTheDocument()

    const nome = screen.getByLabelText("Seu nome (obrigatório)")
    expect(nome).toHaveAttribute("aria-invalid", "true")
    expect(nome.getAttribute("aria-describedby")).toContain("nome-erro")

    // Com dois ou mais erros, o foco vai para o resumo.
    const tituloResumo = screen.getByText(/^Antes de enviar, confira/)
    expect(tituloResumo.parentElement).toHaveFocus()
    expect(screen.getByRole("link", { name: "Seu nome" })).toBeInTheDocument()

    expect(acao.chamadas).toBe(0)
    expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull()
  })

  it("com um erro só, o foco vai para o campo e não há resumo", async () => {
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.clear(screen.getByLabelText("Seu nome (obrigatório)"))
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(await screen.findByText("Faltou o seu nome.")).toBeInTheDocument()
    expect(screen.getByLabelText("Seu nome (obrigatório)")).toHaveFocus()
    expect(screen.queryByText(/^Antes de enviar, confira/)).toBeNull()
    expect(acao.chamadas).toBe(0)
  })

  it("campo com erro revalida ao sair dele e perde o erro quando corrigido", async () => {
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    expect(await screen.findByText("Faltou o seu nome.")).toBeInTheDocument()

    await user.type(screen.getByLabelText("Seu nome (obrigatório)"), "Ana")
    await user.tab()
    await waitFor(() =>
      expect(screen.queryByText("Faltou o seu nome.")).toBeNull(),
    )
  })

  it("envio válido grava a chave de continuação sem e-mail nem telefone", async () => {
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    await waitFor(() => expect(acao.chamadas).toBe(1))

    const bruto = sessionStorage.getItem(CHAVE_CONTINUACAO)
    expect(bruto).not.toBeNull()
    const dados = JSON.parse(bruto ?? "{}") as Record<string, unknown>
    expect(dados.nome).toBe("Ana")
    expect(dados.tipo).toBe("Site ou landing page")
    expect(dados.contexto).toContain("site antigo")
    expect(typeof dados.envio).toBe("string")
    // O identificador gravado é o mesmo do campo oculto enviado à action
    // (depois da resposta o React reseta os campos não controlados ao
    // `defaultValue`, então a prova é no FormData que a action recebeu).
    expect(acao.ultimoFormData?.get("envio")).toBe(dados.envio)
    // LGPD: e-mail e telefone nunca são gravados.
    expect(bruto).not.toMatch(/@|ana@exemplo/)
    expect(Object.keys(dados).sort()).toEqual([
      "contexto",
      "envio",
      "gravadoEm",
      "nome",
      "tipo",
    ])
  })

  it("erro vindo do servidor aparece no campo e apaga a chave", async () => {
    acao.impl = async () => ({
      status: "erro",
      erros: { contexto: "Conte um pouco mais, nem que seja uma frase." },
      valores: VALORES_SERVIDOR,
    })
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(
      await screen.findByText("Conte um pouco mais, nem que seja uma frase."),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull(),
    )
    // Nada é apagado: o que a pessoa digitou continua nos campos.
    expect(
      screen.getByLabelText("Conte um pouco do contexto (obrigatório)"),
    ).toHaveValue("Temos um site antigo e precisamos renovar.")
  })

  it("falha de envio mostra o Notice no contêiner de alerta, com o WhatsApp montado só no clique", async () => {
    const abrir = vi.fn()
    vi.stubGlobal("open", abrir)
    acao.impl = async () => ({
      status: "fallback",
      erros: {},
      valores: VALORES_SERVIDOR,
    })
    const user = userEvent.setup()
    const { container } = render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    const alerta = await screen.findByRole("alert")
    expect(alerta).toHaveTextContent("A mensagem não foi enviada.")
    expect(alerta).toHaveTextContent(
      "O que você escreveu continua aqui. Tente de novo ou fale direto pelo WhatsApp.",
    )

    // O fallback sem JS tem URL genérica, sem os dados do formulário.
    const hrefSemJs = container
      .querySelector('a[href*="wa.me"]')
      ?.getAttribute("href")
    expect(hrefSemJs).toContain("https://wa.me/")
    expect(decodeURIComponent(hrefSemJs ?? "")).not.toContain("Ana")
    expect(decodeURIComponent(hrefSemJs ?? "")).not.toContain("ana@exemplo")

    const botaoWhatsApp = screen.getByRole("button", {
      name: "Chamar no WhatsApp",
    })
    await user.click(botaoWhatsApp)
    expect(abrir).toHaveBeenCalledTimes(1)
    const url = abrir.mock.calls[0]?.[0] as string
    expect(url).toContain("https://wa.me/5583991253377?text=")
    expect(decodeURIComponent(url)).toContain("Ana")

    // O texto fixo some enquanto há mensagem, sem sair do DOM.
    expect(
      screen.getByText(contato.caminhos.formulario.afterSendText).parentElement,
    ).toHaveAttribute("hidden")
    await waitFor(() =>
      expect(sessionStorage.getItem(CHAVE_CONTINUACAO)).toBeNull(),
    )
  })

  it("o carimbo sobrevive ao reset dos campos e vai preenchido nos reenvios", async () => {
    // Fallback: o estado devolvido repõe os valores (como no fluxo real de
    // falha) e o formulário continua preenchido para o reenvio.
    acao.impl = async () => ({
      status: "fallback",
      erros: {},
      valores: VALORES_SERVIDOR,
    })
    const user = userEvent.setup()
    const { container } = render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await waitFor(() => expect(acao.chamadas).toBe(1))

    // O reset que o React faz depois da action esvazia campos com
    // `defaultValue` (como `envio`); o carimbo, propositalmente sem
    // `defaultValue`, fica — regravá-lo no envio faria todo envio com JS
    // parecer "rápido demais" para o servidor.
    const carimbo = container.querySelector<HTMLInputElement>(
      'input[name="carimbo"]',
    )
    expect(Number(carimbo?.value)).toBeGreaterThan(0)
    expect(
      container.querySelector<HTMLInputElement>('input[name="envio"]')?.value,
    ).toBe("")

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await waitFor(() => expect(acao.chamadas).toBe(2))
    expect(Number(acao.ultimoFormData?.get("carimbo"))).toBeGreaterThan(0)
    expect(acao.envios[1]).toBe(acao.envios[0])
  })

  it("cria outra chave quando os dados mudam depois de um fallback", async () => {
    acao.impl = async () => ({
      status: "fallback",
      erros: {},
      valores: VALORES_SERVIDOR,
    })
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await screen.findByText("A mensagem não foi enviada.")

    const email = screen.getByLabelText("Seu e-mail (obrigatório)")
    await user.clear(email)
    await user.type(email, "nova@exemplo.com")
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await waitFor(() => expect(acao.chamadas).toBe(2))
    expect(acao.envios[0]).toMatch(/^[0-9a-f-]{36}$/)
    expect(acao.envios[1]).not.toBe(acao.envios[0])
  })

  it("durante o envio o status anuncia Enviando… e o botão continua focável", async () => {
    // A promise é resolvida ao fim do teste: uma action que nunca resolve
    // deixa o isPending vazar para os testes seguintes.
    let concluir: (estado: unknown) => void = () => {}
    acao.impl = () =>
      new Promise((resolve) => {
        concluir = resolve
      })
    const user = userEvent.setup()
    render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))

    expect(await screen.findByText("Enviando…")).toBeInTheDocument()
    const botao = screen.getByRole("button", { name: "Enviar mensagem" })
    expect(botao).toHaveAttribute("aria-disabled", "true")
    expect(botao).not.toBeDisabled()

    concluir({ status: "fallback", erros: {}, valores: VALORES_SERVIDOR })
    await screen.findByText("A mensagem não foi enviada.")
  })

  it("segundo envio pendente é ignorado mesmo sem passar pelo clique do botão", async () => {
    // Enter num Input dispara o submit sem passar pelo guarda do onClick:
    // o guarda vive também no onSubmit.
    let concluir: (estado: unknown) => void = () => {}
    acao.impl = () =>
      new Promise((resolve) => {
        concluir = resolve
      })
    const user = userEvent.setup()
    const { container } = render(<LeadForm contato={contato} />)
    await preencherValido(user)
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }))
    await screen.findByText("Enviando…")
    expect(acao.chamadas).toBe(1)

    const form = container.querySelector("form")
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)
    await waitFor(() => expect(acao.chamadas).toBe(1))

    concluir({ status: "fallback", erros: {}, valores: VALORES_SERVIDOR })
    await screen.findByText("A mensagem não foi enviada.")
  })

  it("pré-seleção por ?tipo= e ?origem= no navegador", async () => {
    busca.valor = "tipo=plataforma&origem=sobre"
    const { container } = render(<LeadForm contato={contato} />)

    await waitFor(() =>
      expect(
        screen.getByRole("radio", { name: "Plataforma ou produto digital" }),
      ).toBeChecked(),
    )
    const origem = container.querySelector<HTMLInputElement>(
      'input[name="origem"]',
    )
    expect(origem?.value).toBe("sobre")
  })

  it("?tipo= fora das opções não marca nada", () => {
    busca.valor = "tipo=loja"
    render(<LeadForm contato={contato} />)
    for (const opcao of contato.projectTypeOptions) {
      expect(screen.getByRole("radio", { name: opcao.label })).not.toBeChecked()
    }
  })

  it("contador acompanha a digitação e anuncia ao passar do marco", async () => {
    const user = userEvent.setup()
    const { container } = render(<LeadForm contato={contato} />)
    const contexto = screen.getByLabelText(
      "Conte um pouco do contexto (obrigatório)",
    )

    await user.type(contexto, "cinco")
    expect(screen.getByText("5 de 2.000 caracteres")).toBeInTheDocument()

    await user.click(contexto)
    await user.paste("x".repeat(1_800))
    const regiaoOculta = container.querySelector(
      'span.sr-only[aria-live="polite"]',
    )
    await waitFor(() =>
      expect(regiaoOculta?.textContent).toBe("1.805 de 2.000 caracteres"),
    )
  })
})
