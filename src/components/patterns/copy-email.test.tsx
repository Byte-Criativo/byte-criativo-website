import { act, render, screen } from "@testing-library/react"
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

  // A linha do status existe reservada desde a carga: anunciar não pode
  // empurrar o que está abaixo.
  it("a linha do status é reservada desde a carga", () => {
    render(<CopyEmail variante="email" email={EMAIL} />)
    expect(screen.getByRole("status")).toHaveClass("min-h-(--space-5)")
  })

  it("copiar anuncia no status sem mudar o rótulo do botão", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    const botao = screen.getByRole("button", { name: "Copiar e-mail" })

    await u.click(botao)

    expect(escrever).toHaveBeenCalledWith(EMAIL)
    // `findBy*`: o anúncio chega depois da promessa da área de transferência,
    // e afirmar de forma síncrona logo após o clique é uma corrida que fica
    // vermelha sob carga.
    expect(await screen.findByText("E-mail copiado")).toHaveAttribute(
      "role",
      "status",
    )
    expect(botao).toHaveAccessibleName("Copiar e-mail")
    expect(botao).toHaveFocus()
  })

  // "Confirmação com ícone e texto, nunca só cor": o ícone e a cor de sucesso
  // andam juntos, e nenhum dos dois sozinho basta.
  it("a confirmação tem ícone e cor de sucesso", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    await u.click(screen.getByRole("button", { name: "Copiar e-mail" }))

    const status = await screen.findByText("E-mail copiado")
    expect(status.querySelector("svg")).not.toBeNull()
    expect(status).toHaveClass("text-success-text")
  })

  // RC11: para repetir a **mesma** mensagem, a região é esvaziada e
  // preenchida de novo — um leitor de tela não anuncia texto que não mudou.
  it("a segunda cópia esvazia o anúncio antes de repetir o mesmo texto", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    const botao = screen.getByRole("button", { name: "Copiar e-mail" })

    await u.click(botao)
    await screen.findByText("E-mail copiado")

    // A segunda cópia fica pendente de propósito: é o único instante em que
    // dá para ver a região já esvaziada e ainda não preenchida.
    let liberar: () => void = () => {}
    escrever.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          liberar = resolve
        }),
    )

    await u.click(botao)
    expect(screen.getByRole("status").textContent).toBe("")

    liberar()
    expect(await screen.findByText("E-mail copiado")).toBeInTheDocument()
  })

  it("o status some depois de 5 s, e não antes", async () => {
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    await u.click(screen.getByRole("button", { name: "Copiar e-mail" }))
    await screen.findByText("E-mail copiado")

    // O limite é fechado pelos dois lados: só por cima, qualquer duração
    // menor (500 ms, por exemplo) passaria. A folga de 1 s existe porque
    // `shouldAdvanceTime` também adianta o relógio falso com o tempo real —
    // encostar em 4999 tornaria o caso instável. O `act` é obrigatório: sem
    // ele o React ainda não aplicou o esvaziamento quando a asserção roda, e
    // a checagem "ainda está lá" passaria por acidente.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000)
    })
    expect(screen.getByRole("status")).toHaveTextContent("E-mail copiado")

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
    expect(screen.getByRole("status").textContent).toBe("")
  })

  it("falha ao copiar mostra o endereço na mensagem e não some com nada", async () => {
    escrever.mockRejectedValueOnce(new Error("negado"))
    const u = usuario()
    render(<CopyEmail variante="email" email={EMAIL} />)
    await u.click(screen.getByRole("button", { name: "Copiar e-mail" }))

    expect(
      await screen.findByText(`Não deu para copiar. O e-mail é ${EMAIL}`),
    ).toHaveAttribute("role", "status")
    expect(screen.getByText(EMAIL)).toBeInTheDocument()

    // A mensagem de falha é a única saída de quem não conseguiu copiar: não
    // pode sumir sozinha. `act` pelo mesmo motivo do teste dos 5 s.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000)
    })
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
    expect(await screen.findByText("Mensagem copiada")).toHaveAttribute(
      "role",
      "status",
    )
    expect(container.textContent).not.toContain("@")
  })
})
