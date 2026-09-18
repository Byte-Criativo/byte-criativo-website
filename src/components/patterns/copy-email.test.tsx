import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CopyEmail } from "./copy-email"

const EMAIL = "contato@bcriativo.com"
const escrever = vi.fn(() => Promise.resolve())

beforeEach(() => {
  escrever.mockClear()
  escrever.mockImplementation(() => Promise.resolve())
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

/**
 * R66: a ordem importa. `userEvent.setup()` instala o próprio substituto de
 * área de transferência na view; o substituto do teste só recebe as chamadas
 * se entrar **depois** do setup — antes, o componente fala com o substituto
 * do user-event e `writeText` nunca é chamado.
 */
function usuario() {
  const u = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: escrever },
    configurable: true,
  })
  return u
}

describe("CopyEmail", () => {
  it("mostra o endereço, o mailto e o botão de copiar", () => {
    render(<CopyEmail variante="email" email={EMAIL} />)
    expect(screen.getByText(EMAIL)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Escrever e-mail" }),
    ).toHaveAttribute("href", `mailto:${EMAIL}`)
    expect(
      screen.getByRole("button", { name: "Copiar e-mail" }),
    ).toBeInTheDocument()
  })

  it("há um único canal de anúncio, vazio desde a carga", () => {
    render(<CopyEmail variante="email" email={EMAIL} />)
    const status = screen.getAllByRole("status")
    expect(status).toHaveLength(1)
    expect(status[0]?.textContent).toBe("")
  })

  it("copiar anuncia no status sem mudar o rótulo do botão", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    const botao = screen.getByRole("button", { name: "Copiar e-mail" })

    await u.click(botao)

    expect(escrever).toHaveBeenCalledWith(EMAIL)
    expect(screen.getByRole("status")).toHaveTextContent("E-mail copiado")
    expect(botao).toHaveAccessibleName("Copiar e-mail")
    expect(botao).toHaveFocus()
  })

  it("o status some depois de 5 s", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    await u.click(screen.getByRole("button", { name: "Copiar e-mail" }))
    await vi.advanceTimersByTimeAsync(5000)
    expect(screen.getByRole("status").textContent).toBe("")
  })

  it("falha ao copiar mostra o endereço na mensagem e não some com nada", async () => {
    escrever.mockRejectedValueOnce(new Error("negado"))
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    await u.click(screen.getByRole("button", { name: "Copiar e-mail" }))

    expect(screen.getByRole("status")).toHaveTextContent(
      `Não deu para copiar. O e-mail é ${EMAIL}`,
    )
    expect(screen.getByText(EMAIL)).toBeInTheDocument()

    // A mensagem de falha é a única saída de quem não conseguiu copiar: não
    // pode sumir sozinha.
    await vi.advanceTimersByTimeAsync(6000)
    expect(screen.getByRole("status")).toHaveTextContent("Não deu para copiar.")
  })

  it("o botão só aparece com JS", () => {
    render(<CopyEmail variante="email" email={EMAIL} />)
    const classes = screen.getByRole("button").className
    expect(classes).toContain("hidden")
    expect(classes).toContain("js:inline-flex")
  })

  it("a variante mensagem copia a mensagem e não mostra endereço", async () => {
    const u = usuario()
    const { container } = render(
      <CopyEmail variante="mensagem" mensagem="Olá! Sou Ana." />,
    )
    expect(screen.getByText("Não abriu?")).toBeInTheDocument()
    await u.click(screen.getByRole("button", { name: "Copiar mensagem" }))
    expect(escrever).toHaveBeenCalledWith("Olá! Sou Ana.")
    expect(screen.getByRole("status")).toHaveTextContent("Mensagem copiada")
    expect(container.textContent).not.toContain("@")
  })
})
