import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { instalarMatchMedia, type MatchMediaFalso } from "@/test/match-media"
import { SalaObserver } from "./sala-observer"

type Entrada = Pick<
  IntersectionObserverEntry,
  "target" | "isIntersecting" | "intersectionRatio"
>
type Callback = (entradas: Entrada[]) => void

class ObservadorFalso {
  static criados: ObservadorFalso[] = []
  readonly observados: Element[] = []
  readonly desobservados: Element[] = []
  desconectado = 0

  constructor(readonly callback: Callback) {
    ObservadorFalso.criados.push(this)
  }
  observe(alvo: Element): void {
    this.observados.push(alvo)
  }
  unobserve(alvo: Element): void {
    this.desobservados.push(alvo)
  }
  disconnect(): void {
    this.desconectado += 1
  }
}

function retangulo(top: number) {
  return () => ({ top, bottom: top + 600 }) as DOMRect
}

function prepararDom({ topSala = 2000, variante = "larga" } = {}): void {
  document.documentElement.setAttribute("data-js", "")
  document.body.innerHTML = `
    <div id="sala-1" data-sala data-variante="${variante}" data-estado="projeto"></div>
    <section id="trabalhos"></section>
    <section id="conversa"></section>
    <a href="#trabalhos" data-indice-link="trabalhos" class="indice-link"></a>
    <a href="#conversa" data-indice-link="conversa" class="indice-link"></a>
  `
  const sala = document.querySelector("#sala-1") as HTMLElement
  sala.getBoundingClientRect = retangulo(topSala)
}

let midia: MatchMediaFalso

// R65: o substituto de matchMedia é explícito e a resposta fica à vista.
// Sem isso, "com movimento reduzido a sala nunca passa por parede" passaria
// vazio contra um componente que nunca consultasse nada.
function movimentoReduzido(reduzido: boolean): void {
  midia.responder((consulta) =>
    reduzido ? consulta.includes("prefers-reduced-motion") : false,
  )
}

describe("SalaObserver", () => {
  beforeEach(() => {
    ObservadorFalso.criados.length = 0
    vi.stubGlobal("IntersectionObserver", ObservadorFalso)
    midia = instalarMatchMedia(() => false)
    prepararDom()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    midia.restaurar()
    document.documentElement.removeAttribute("data-js")
  })

  it("não renderiza nada", () => {
    const { container } = render(
      <SalaObserver salas={["sala-1"]} secoes={["trabalhos"]} />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("põe a sala abaixo da dobra no estado parede e devolve a projeto ao entrar", () => {
    render(<SalaObserver salas={["sala-1"]} secoes={["trabalhos"]} />)
    const sala = document.querySelector("#sala-1")
    expect(sala).toHaveAttribute("data-estado", "parede")

    ObservadorFalso.criados[0]?.callback([
      {
        target: sala as Element,
        isIntersecting: true,
        intersectionRatio: 0.45,
      },
    ])
    expect(sala).toHaveAttribute("data-estado", "projeto")
  })

  it("a volta acontece uma única vez: o alvo é desobservado", () => {
    render(<SalaObserver salas={["sala-1"]} />)
    const sala = document.querySelector("#sala-1") as Element
    const observador = ObservadorFalso.criados[0]

    observador?.callback([
      { target: sala, isIntersecting: true, intersectionRatio: 0.9 },
    ])
    expect(observador?.desobservados).toContain(sala)

    observador?.callback([
      { target: sala, isIntersecting: false, intersectionRatio: 0 },
    ])
    expect(sala).toHaveAttribute("data-estado", "projeto")
  })

  it("com movimento reduzido, a sala nunca passa pelo estado parede", () => {
    movimentoReduzido(true)
    render(<SalaObserver salas={["sala-1"]} />)
    expect(document.querySelector("#sala-1")).toHaveAttribute(
      "data-estado",
      "projeto",
    )
  })

  it("sala já visível na hidratação nunca passa pelo estado parede", () => {
    prepararDom({ topSala: 10 })
    render(<SalaObserver salas={["sala-1"]} />)
    expect(document.querySelector("#sala-1")).toHaveAttribute(
      "data-estado",
      "projeto",
    )
  })

  it("sala hero nunca passa pelo estado parede", () => {
    prepararDom({ variante: "hero" })
    render(<SalaObserver salas={["sala-1"]} />)
    expect(document.querySelector("#sala-1")).toHaveAttribute(
      "data-estado",
      "projeto",
    )
  })

  it("marca só a seção mais visível no link do índice", () => {
    render(<SalaObserver secoes={["trabalhos", "conversa"]} />)
    // A menos visível vem primeiro de propósito: quem escolher "a primeira
    // que intersecta" em vez de "a mais visível" marca a seção errada.
    ObservadorFalso.criados.at(-1)?.callback([
      {
        target: document.querySelector("#conversa") as Element,
        isIntersecting: true,
        intersectionRatio: 0.2,
      },
      {
        target: document.querySelector("#trabalhos") as Element,
        isIntersecting: true,
        intersectionRatio: 0.9,
      },
    ])
    expect(
      document.querySelector('[data-indice-link="trabalhos"]'),
    ).toHaveAttribute("aria-current", "true")
    expect(
      document.querySelector('[data-indice-link="conversa"]'),
    ).not.toHaveAttribute("aria-current")
  })

  it("Esc esconde o rótulo do link focado sem mover o foco", async () => {
    render(<SalaObserver secoes={["trabalhos"]} />)
    const link = document.querySelector(
      '[data-indice-link="trabalhos"]',
    ) as HTMLElement
    link.focus()
    await userEvent.keyboard("{Escape}")
    expect(link).toHaveAttribute("data-rotulo", "oculto")
    expect(link).toHaveFocus()
  })

  it("desmontar desconecta os observadores, sem vazamento", () => {
    const { unmount } = render(
      <SalaObserver salas={["sala-1"]} secoes={["trabalhos"]} />,
    )
    const criados = ObservadorFalso.criados.length
    expect(criados).toBeGreaterThan(0)
    unmount()
    expect(
      ObservadorFalso.criados.filter((o) => o.desconectado > 0),
    ).toHaveLength(criados)
  })
})
