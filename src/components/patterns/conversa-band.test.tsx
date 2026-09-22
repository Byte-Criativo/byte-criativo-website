import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ConversaBand } from "./conversa-band"

const WHATSAPP = {
  rotulo: "Chamar no WhatsApp",
  mensagem: "Olá!",
  location: "cta",
  context: "portfolio",
}

function chamada(extra?: { ctaRotulo?: string; frase?: string }) {
  return render(
    <ConversaBand
      variante="chamada"
      id="conversa"
      titulo="Seu negócio não tem nada a ver com música?"
      ctaHref="/contato?origem=portfolio"
      whatsapp={WHATSAPP}
      {...extra}
    />,
  )
}

function conversa() {
  return render(
    <ConversaBand
      variante="conversa"
      id="conversa"
      titulo="Conversa direta"
      abertura="Conte o que você quer construir."
      tituloCompromissos="O que você pode cobrar da Byte Criativo"
      compromissos={["Resposta em até um dia útil.", "Proposta com escopo."]}
      formulario={<form aria-label="Formulário curto" />}
    />,
  )
}

describe("ConversaBand", () => {
  it("é uma região nomeada pelo h2, com o ; fora do nome", () => {
    const { container } = chamada()
    expect(
      screen.getByRole("region", {
        name: "Seu negócio não tem nada a ver com música?",
      }),
    ).toBeInTheDocument()
    const pontuacao = container.querySelector("h2 [aria-hidden='true']")
    expect(pontuacao?.textContent).toBe(";")
  })

  it("a banda inteira resolve pelo tema do verso", () => {
    const { container } = chamada()
    expect(container.querySelector("section")).toHaveAttribute(
      "data-surface",
      "verso",
    )
  })

  it("chamada traz no máximo dois CTAs, com o vocabulário fixo e o destino recebido", () => {
    const padrao = chamada()
    expect(screen.getAllByRole("link")).toHaveLength(2)
    expect(
      screen.getByRole("link", { name: "Falar sobre um projeto" }),
    ).toHaveAttribute("href", "/contato?origem=portfolio")
    padrao.unmount()

    chamada({ ctaRotulo: "Ver todos os serviços" })
    expect(
      screen.getByRole("link", { name: "Ver todos os serviços" }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole("link")).toHaveLength(2)
  })

  it("conversa traz abertura, compromissos e o formulário recebido", () => {
    const { container } = conversa()
    expect(
      screen.getByText("Conte o que você quer construir."),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "O que você pode cobrar da Byte Criativo",
      }),
    ).toBeInTheDocument()
    const lista = container.querySelector("ol")
    expect(lista?.querySelectorAll("li")).toHaveLength(2)
    expect(
      screen.getByRole("form", { name: "Formulário curto" }),
    ).toBeInTheDocument()
  })

  it("não renderiza retrato nem nome de quem conduz (D3 aberta)", () => {
    const daChamada = chamada()
    expect(daChamada.container.querySelector("img")).toBeNull()
    daChamada.unmount()

    const daConversa = conversa()
    expect(daConversa.container.querySelector("img")).toBeNull()
  })

  it("a seção carrega o id recebido e é nomeada pelo h2, não por aria-label", () => {
    const { container } = chamada()
    const secao = container.querySelector("section")
    expect(secao).toHaveAttribute("id", "conversa")
    expect(secao).not.toHaveAttribute("aria-label")
    const alvo = secao?.getAttribute("aria-labelledby") ?? ""
    expect(alvo).not.toBe("")
    expect(document.getElementById(alvo)?.tagName).toBe("H2")
  })
})
