import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ESPERA_HIDRATACAO_MS, SCRIPT_MARCADOR_JS } from "./marcador-js"

function rodar(): void {
  new Function(SCRIPT_MARCADOR_JS)()
}

describe("script marcador de JS", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.documentElement.removeAttribute("data-js")
    document.documentElement.removeAttribute("data-invoker")
    document.documentElement.removeAttribute("data-hidratado")
    document.body.innerHTML = ""
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("grava data-js na raiz", () => {
    rodar()
    expect(document.documentElement).toHaveAttribute("data-js")
  })

  it("grava data-invoker só quando há Invoker Commands", () => {
    rodar()
    expect(document.documentElement).not.toHaveAttribute("data-invoker")

    Object.defineProperty(HTMLButtonElement.prototype, "commandForElement", {
      value: null,
      configurable: true,
    })
    document.documentElement.removeAttribute("data-js")
    rodar()
    expect(document.documentElement).toHaveAttribute("data-invoker")

    // @ts-expect-error limpeza do stub
    delete HTMLButtonElement.prototype.commandForElement
  })

  it("remove data-js quando a hidratação não acontece em 4 s", () => {
    rodar()
    window.dispatchEvent(new Event("load"))
    vi.advanceTimersByTime(ESPERA_HIDRATACAO_MS)
    expect(document.documentElement).not.toHaveAttribute("data-js")
  })

  it("mantém data-js quando a raiz já está hidratada", () => {
    rodar()
    document.documentElement.setAttribute("data-hidratado", "")
    window.dispatchEvent(new Event("load"))
    vi.advanceTimersByTime(ESPERA_HIDRATACAO_MS)
    expect(document.documentElement).toHaveAttribute("data-js")
  })

  it("com diálogo aberto, espera o close para decidir", () => {
    const dialogo = document.createElement("dialog")
    dialogo.setAttribute("open", "")
    document.body.append(dialogo)

    rodar()
    window.dispatchEvent(new Event("load"))
    vi.advanceTimersByTime(ESPERA_HIDRATACAO_MS)
    expect(document.documentElement).toHaveAttribute("data-js")

    dialogo.dispatchEvent(new Event("close"))
    expect(document.documentElement).not.toHaveAttribute("data-js")
  })
})
