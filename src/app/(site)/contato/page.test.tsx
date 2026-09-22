import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ContatoPage, { metadata } from "./page"
import { getContatoPage } from "@/content"

const { busca } = vi.hoisted(() => ({ busca: { valor: "" } }))

// A ilha LeadForm lê `?tipo=`/`?origem=` num filho mínimo com Suspense.
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(busca.valor),
}))

// A página é exercida de verdade; a action fica de fora (testada em
// actions.test.ts) para o render não tocar provedor nem redirect.
vi.mock("./actions", () => ({
  submitLead: async () => ({
    status: "inicial" as const,
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
}))

const contato = getContatoPage()

describe("Página Contato (/contato)", () => {
  beforeEach(() => {
    busca.valor = ""
  })

  it("exporta metadata com seoTitle, description e canonical /contato", () => {
    expect(metadata.title).toEqual({ absolute: contato.seo.seoTitle })
    expect(metadata.description).toBe(contato.seo.description)
    expect(metadata.alternates?.canonical).toBe("/contato")
  })

  it("renderiza script ld+json com ContactPage, BreadcrumbList e FAQPage", () => {
    const { container } = render(<ContatoPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toContain("Organization")
    expect(tipos).toContain("WebSite")
    expect(tipos).toContain("ContactPage")
    expect(tipos).toContain("BreadcrumbList")
    expect(tipos).toContain("FAQPage")

    const faqNode = json["@graph"].find(
      (item: Record<string, unknown>) => item["@type"] === "FAQPage",
    )
    expect(faqNode.mainEntity).toHaveLength(contato.faqs.length)
  })

  it("renderiza breadcrumbs com Início e Contato como página atual", () => {
    render(<ContatoPage />)
    const nav = screen.getByRole("navigation", { name: "Caminho da página" })
    expect(within(nav).getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(within(nav).getByText("Contato")).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("renderiza exatamente um H1 com o apoio", () => {
    render(<ContatoPage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent("Conte o que você quer construir;")
    expect(screen.getByText(contato.apoio)).toBeInTheDocument()
  })

  it("renderiza os dois caminhos com formulário acessível e labels associados", () => {
    render(<ContatoPage />)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: contato.caminhos.formulario.h2,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: contato.caminhos.direto.h2,
      }),
    ).toBeInTheDocument()

    const nome = screen.getByLabelText("Seu nome (obrigatório)")
    expect(nome).toHaveAttribute("name", "nome")
    expect(nome).toHaveAttribute("autocomplete", "name")
    expect(nome).toBeRequired()

    const grupoTipo = screen.getByRole("radiogroup", {
      name: "O que você quer construir? (obrigatório)",
    })
    for (const opcao of contato.projectTypeOptions) {
      expect(
        within(grupoTipo).getByRole("radio", { name: opcao.label }),
      ).toBeInTheDocument()
    }

    const contexto = screen.getByLabelText(
      "Conte um pouco do contexto (obrigatório)",
    )
    expect(contexto).toHaveAttribute("name", "contexto")
    expect(screen.getByText("0 de 2.000 caracteres")).toBeInTheDocument()

    const grupoCanal = screen.getByRole("radiogroup", {
      name: "Como prefere continuar? (obrigatório)",
    })
    expect(
      within(grupoCanal).getByRole("radio", { name: "WhatsApp" }),
    ).toBeInTheDocument()
    expect(
      within(grupoCanal).getByRole("radio", { name: "E-mail" }),
    ).toBeInTheDocument()

    const whatsapp = screen.getByLabelText("Seu WhatsApp (obrigatório)")
    expect(whatsapp).toHaveAttribute("type", "tel")
    expect(whatsapp).toHaveAttribute("autocomplete", "tel")

    const email = screen.getByLabelText("Seu e-mail (obrigatório)")
    expect(email).toHaveAttribute("type", "email")
    expect(email).toHaveAttribute("autocomplete", "email")

    const empresa = screen.getByLabelText(
      "Empresa, marca ou projeto (opcional)",
    )
    expect(empresa).toHaveAttribute("autocomplete", "organization")
    expect(empresa).not.toBeRequired()

    const grupoPrazo = screen.getByRole("radiogroup", {
      name: "Tem prazo? (opcional)",
    })
    for (const prazo of contato.deadlineOptions) {
      expect(
        within(grupoPrazo).getByRole("radio", { name: prazo }),
      ).toBeInTheDocument()
    }
  })

  it("renderiza honeypot fora da ordem de tabulação e campos ocultos", () => {
    const { container } = render(<ContatoPage />)

    const honeypot = container.querySelector<HTMLInputElement>(
      'input[name="verificacao"]',
    )
    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute("tabindex", "-1")
    expect(honeypot).toHaveAttribute("autocomplete", "off")
    expect(honeypot?.closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true",
    )

    for (const oculto of ["carimbo", "origem", "envio"]) {
      const campo = container.querySelector<HTMLInputElement>(
        `input[type="hidden"][name="${oculto}"]`,
      )
      expect(campo, `campo oculto ${oculto}`).not.toBeNull()
    }
  })

  it("renderiza aviso de privacidade com link, botão de envio e regiões de anúncio", () => {
    const { container } = render(<ContatoPage />)

    const linkPrivacidade = screen.getByRole("link", {
      name: "política de privacidade",
    })
    expect(linkPrivacidade).toHaveAttribute("href", "/privacidade")

    const botao = screen.getByRole("button", { name: "Enviar mensagem" })
    expect(botao).toBeEnabled()
    expect(botao).toHaveAttribute("type", "submit")

    const status = container.querySelector("[aria-live='polite']")
    expect(status).not.toBeNull()
    expect(status?.textContent).toBe("")

    const alerta = container.querySelector("[role='alert']")
    expect(alerta).not.toBeNull()
    expect(alerta?.textContent).toBe("")

    expect(
      screen.getByText(contato.caminhos.formulario.afterSendText),
    ).toBeInTheDocument()
  })

  it("renderiza o caminho direto com WhatsApp, número e e-mail", () => {
    render(<ContatoPage />)

    const botaoWhatsapp = screen.getByRole("link", {
      name: /Chamar no WhatsApp/,
    })
    expect(botaoWhatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )

    const numero = screen.getByRole("link", {
      name: (_nome, elemento) =>
        elemento.textContent?.includes(
          contato.caminhos.direto.whatsapp.display,
        ) ?? false,
    })
    expect(numero).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    )

    expect(
      screen.getByText(contato.caminhos.direto.email.address),
    ).toBeInTheDocument()
    const mailto = screen.getByRole("link", { name: "Escrever e-mail" })
    expect(mailto).toHaveAttribute(
      "href",
      `mailto:${contato.caminhos.direto.email.address}`,
    )
    expect(
      screen.getByRole("button", { name: /Copiar e-mail/ }),
    ).toBeInTheDocument()
  })

  it("renderiza os próximos passos com link para o processo", () => {
    render(<ContatoPage />)
    const secao = screen.getByRole("region", {
      name: contato.proximosPassos.h2,
    })
    for (const step of contato.proximosPassos.steps) {
      expect(
        within(secao).getByText(new RegExp(step.title.replace(".", "\\."))),
      ).toBeInTheDocument()
      expect(within(secao).getByText(step.description)).toBeInTheDocument()
    }
    const link = within(secao).getByRole("link", {
      name: contato.proximosPassos.link.label,
    })
    expect(link).toHaveAttribute("href", "/processo")
  })

  it("renderiza as dúvidas antes de começar e nenhuma banda de CTA ao final", () => {
    render(<ContatoPage />)
    const secao = screen.getByRole("region", {
      name: "Dúvidas antes de começar",
    })
    for (const faq of contato.faqs) {
      expect(within(secao).getByText(faq.question)).toBeInTheDocument()
      expect(within(secao).getByText(faq.answer)).toBeInTheDocument()
    }

    expect(
      screen.queryByRole("link", { name: "Falar sobre um projeto" }),
    ).toBeNull()
  })
})
