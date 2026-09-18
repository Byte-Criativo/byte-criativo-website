import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import type { DadosContinuacao } from "@/lib/continuar-conversa"
import { WhatsAppMontado } from "./whatsapp-montado"

const DADOS: DadosContinuacao = {
  envio: "e1",
  gravadoEm: 1_700_000_000_000,
  nome: "Ana",
  tipo: "Um site",
  contexto: "Programação do festival.",
}

function montar() {
  return render(
    <WhatsAppMontado
      dados={DADOS}
      rotulo="Chamar no WhatsApp"
      location="obrigado"
      context="continuar"
    />,
  )
}

describe("WhatsAppMontado", () => {
  it("é um botão, não um link: a URL com dados nunca é renderizada", async () => {
    const abrir = vi.spyOn(window, "open").mockImplementation(() => null)
    const { container } = montar()

    expect(
      screen.getByRole("button", { name: "Chamar no WhatsApp" }),
    ).toBeInTheDocument()
    expect(container.querySelector("a[href*='wa.me']")).toBeNull()

    await userEvent.click(screen.getByRole("button"))

    // Nem depois do clique a URL com dados entra no DOM.
    expect(container.innerHTML).not.toContain("wa.me")
    expect(container.innerHTML).not.toContain("Programação do festival.")

    abrir.mockRestore()
  })

  it("monta a URL com os dados só no clique e abre em nova aba", async () => {
    const abrir = vi.spyOn(window, "open").mockImplementation(() => null)

    montar()
    await userEvent.click(screen.getByRole("button"))

    const [url, alvo, recursos] = abrir.mock.calls[0] ?? []
    expect(String(url)).toContain("https://wa.me/5583991253377")
    expect(decodeURIComponent(String(url))).toContain("Ana")
    expect(alvo).toBe("_blank")
    expect(String(recursos)).toContain("noopener")

    abrir.mockRestore()
  })

  it("carrega os dados do evento sem nenhum dado pessoal", () => {
    montar()
    const botao = screen.getByRole("button")
    const dados = [...botao.attributes]
      .map((atributo) => atributo.name)
      .filter((nome) => nome.startsWith("data-"))
      .sort()
    expect(dados).toEqual(["data-context", "data-evento", "data-location"])
    expect(botao).toHaveAttribute("data-evento", "whatsapp_click")
  })
})
