import { render, screen } from "@testing-library/react"
import { StrictMode } from "react"
import { beforeEach, describe, expect, it } from "vitest"
import {
  gravarDadosContinuacao,
  type DadosContinuacao,
} from "@/lib/continuar-conversa"
import { ContinuarConversa } from "./continuar-conversa"

const DADOS: DadosContinuacao = {
  envio: "e1",
  gravadoEm: 1_700_000_000_000,
  nome: "Ana",
  tipo: "Um site",
  contexto: "Programação do festival.",
}

const TEXTOS = {
  comDados:
    "Para continuar agora pelo WhatsApp, toque no botão. A mensagem vai com o que você escreveu.",
  semDados:
    "Se você enviou uma mensagem pelo formulário, ela chegou. A resposta vai pelo canal que você escolheu.",
  rotuloWhatsApp: "Chamar no WhatsApp",
}

describe("ContinuarConversa", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("sem chave, mostra a versão sem dados com o link de mensagem geral", () => {
    render(
      <ContinuarConversa
        canal="whatsapp"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(screen.getByText(TEXTOS.semDados)).toBeInTheDocument()
    expect(
      screen.getByRole("link", {
        name: "Chamar no WhatsApp (abre em nova aba)",
      }),
    ).toBeInTheDocument()
    expect(screen.queryByText("Não abriu?")).toBeNull()
  })

  it("com chave e identificador que bate, mostra a versão com dados", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <ContinuarConversa
        canal="whatsapp"
        envio="e1"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(screen.getByText(TEXTOS.comDados)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Chamar no WhatsApp" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Não abriu?")).toBeInTheDocument()
  })

  it("a leitura é única: a chave é apagada mesmo quando os dados servem", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <ContinuarConversa
        canal="whatsapp"
        envio="e1"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(screen.getByText(TEXTOS.comDados)).toBeInTheDocument()
    expect(sessionStorage.length).toBe(0)
  })

  it("identificador diferente descarta e apaga a chave", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <ContinuarConversa
        canal="whatsapp"
        envio="outro"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(screen.getByText(TEXTOS.semDados)).toBeInTheDocument()
    expect(sessionStorage.length).toBe(0)
  })

  it("o canal e-mail não oferece Copiar mensagem", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <ContinuarConversa
        canal="email"
        envio="e1"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Chamar no WhatsApp" }),
    ).toBeInTheDocument()
    expect(screen.queryByText("Não abriu?")).toBeNull()
  })

  it("StrictMode executa a montagem duas vezes e os dados continuam de pé", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <StrictMode>
        <ContinuarConversa
          canal="whatsapp"
          envio="e1"
          mensagemGeral="Olá!"
          textos={TEXTOS}
        />
      </StrictMode>,
    )
    expect(screen.getByText(TEXTOS.comDados)).toBeInTheDocument()
  })

  it("pagehide descarta o estado e volta à versão sem dados", () => {
    gravarDadosContinuacao(DADOS)
    render(
      <ContinuarConversa
        canal="whatsapp"
        envio="e1"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    window.dispatchEvent(new Event("pagehide"))
    expect(screen.getByText(TEXTOS.semDados)).toBeInTheDocument()
  })

  it("a caixa reserva altura para não empurrar a seção seguinte", () => {
    const { container } = render(
      <ContinuarConversa
        canal="whatsapp"
        mensagemGeral="Olá!"
        textos={TEXTOS}
      />,
    )
    expect(container.firstElementChild).toHaveClass("min-h-(--space-10)")
  })
})
