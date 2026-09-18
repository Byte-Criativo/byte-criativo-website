import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { instalarMatchMedia, type MatchMediaFalso } from "@/test/match-media"
import { VideoLoop } from "./video-loop"
import { VideoLoopIlha } from "./video-loop-ilha"

type Entrada = { isIntersecting: boolean; intersectionRatio: number }
type Callback = (entradas: Entrada[]) => void

const observadores: Callback[] = []

class ObservadorFalso {
  constructor(callback: Callback) {
    observadores.push(callback)
  }
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
}

let midia: MatchMediaFalso

function montar() {
  return render(
    <VideoLoopIlha
      poster="/videos/busca.jpg"
      fontes={[{ src: "/videos/busca.mp4", type: "video/mp4" }]}
      complemento="busca de bandas"
      width={1280}
      height={720}
    >
      {/* O poster de verdade chega do servidor por `children` (Media com
          next/image). Aqui basta um nó de DOM para provar que a ilha não
          troca nada antes da viewport. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/videos/busca.jpg" alt="" width={1280} height={720} />
    </VideoLoopIlha>,
  )
}

/** Dispara o observador mais recente: o efeito recria um a cada mudança. */
function viewport(fracao: number) {
  act(() => {
    observadores.at(-1)?.([
      { isIntersecting: fracao > 0, intersectionRatio: fracao },
    ])
  })
}

function economiaDeDados(ligada: boolean) {
  Object.defineProperty(navigator, "connection", {
    value: { saveData: ligada },
    configurable: true,
  })
}

describe("VideoLoop", () => {
  beforeEach(() => {
    observadores.length = 0
    document.documentElement.setAttribute("data-js", "")
    midia = instalarMatchMedia(() => false)
    vi.stubGlobal("IntersectionObserver", ObservadorFalso)
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
    HTMLMediaElement.prototype.pause = vi.fn()
  })

  afterEach(() => {
    midia.restaurar()
    vi.unstubAllGlobals()
    document.documentElement.removeAttribute("data-js")
    Reflect.deleteProperty(navigator, "connection")
  })

  it("começa no poster: nenhum byte de vídeo antes da viewport", () => {
    const { container } = montar()
    expect(container.querySelector("video")).toBeNull()
    expect(container.querySelector("img")).not.toBeNull()
  })

  it("perto da viewport troca o poster pelo vídeo, sem autoplay e sem controls", () => {
    const { container } = montar()
    viewport(0.1)
    const video = container.querySelector("video")
    expect(video).not.toBeNull()
    expect(video).not.toHaveAttribute("autoplay")
    expect(video).not.toHaveAttribute("controls")
    expect(video).toHaveAttribute("preload", "none")
    expect(video?.muted).toBe(true)
    expect(video?.loop).toBe(true)
    expect(video?.playsInline).toBe(true)
    expect(container.querySelectorAll("video source")).toHaveLength(1)
  })

  it("em repouso o botão oferece a ação seguinte, com o complemento oculto", () => {
    // R60: o estado de partida é o poster, então o rótulo na montagem é
    // "Reproduzir vídeo". R70: o complemento começa com dois-pontos e cola
    // na palavra anterior — nada de VisuallyHidden separador aqui.
    montar()
    const botao = screen.getByRole("button", {
      name: "Reproduzir vídeo: busca de bandas",
    })
    const recorte = botao.querySelector(".sr-only")
    expect(recorte?.textContent).toContain("busca de bandas")
    expect(
      botao.textContent?.replace(recorte?.textContent ?? "", ""),
    ).not.toContain("busca de bandas")
  })

  it("reproduzindo vira Pausar; pausar pela pessoa volta a Reproduzir, sem aria-pressed", async () => {
    montar()
    viewport(0.6)
    const pausar = screen.getByRole("button", {
      name: "Pausar vídeo: busca de bandas",
    })
    expect(pausar).not.toHaveAttribute("aria-pressed")
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()

    await userEvent.click(pausar)
    expect(
      screen.getByRole("button", { name: "Reproduzir vídeo: busca de bandas" }),
    ).toBeInTheDocument()
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it("quem pausou na mão continua pausado ao voltar à viewport", async () => {
    montar()
    viewport(0.6)
    await userEvent.click(
      screen.getByRole("button", { name: "Pausar vídeo: busca de bandas" }),
    )
    viewport(0)
    viewport(0.9)
    expect(
      screen.getByRole("button", { name: "Reproduzir vídeo: busca de bandas" }),
    ).toBeInTheDocument()
  })

  it("com movimento reduzido não troca o poster nem reproduz sozinho", () => {
    midia.restaurar()
    midia = instalarMatchMedia((consulta) =>
      consulta.includes("prefers-reduced-motion"),
    )
    const { container } = montar()
    viewport(0.6)
    // A consulta precisa ter sido feita de verdade: sem ela o teste passaria
    // vazio com um componente que nunca pergunta nada.
    expect(midia.consultas.join(" ")).toContain("prefers-reduced-motion")
    expect(container.querySelector("video")).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  it("com economia de dados não troca o poster nem reproduz sozinho", () => {
    economiaDeDados(true)
    const { container } = montar()
    viewport(0.6)
    expect(container.querySelector("video")).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  it("sem data-js na raiz a ilha não inicia a reprodução", () => {
    document.documentElement.removeAttribute("data-js")
    const { container } = montar()
    expect(observadores).toHaveLength(0)
    expect(container.querySelector("video")).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  it("a barra tem 44 px reservados desde o HTML e o botão só aparece com JS", () => {
    const { container } = montar()
    const barra = container.querySelector("[data-barra-video]")
    expect(barra).toHaveClass("min-h-(--alvo-toque)")
    const botao = container.querySelector("[data-barra-video] button")
    expect(botao?.className).toContain("hidden")
    expect(botao?.className).toContain("js:inline-flex")
  })

  // A figura Server: o que o HTML do servidor entrega antes de qualquer JS.
  describe("figura do servidor", () => {
    function montarFigura() {
      return render(
        <VideoLoop
          poster="/videos/busca.jpg"
          fontes={[{ src: "/videos/busca.mp4", type: "video/mp4" }]}
          descricao="O vídeo mostra a busca por banda."
          data="Captura de setembro de 2026."
          complemento="busca de bandas"
          width={1280}
          height={720}
        />,
      )
    }

    it("é uma figure com a descrição textual na legenda", async () => {
      const { container } = montarFigura()
      expect(container.querySelector("figure")).not.toBeNull()
      const legenda = await screen.findByText(
        "O vídeo mostra a busca por banda. Captura de setembro de 2026.",
      )
      expect(legenda.tagName).toBe("FIGCAPTION")
    })

    it("entrega o poster e a barra reservada, e nenhum byte de vídeo", async () => {
      const { container } = montarFigura()
      await screen.findByText(/O vídeo mostra a busca por banda\./)
      const poster = container.querySelector("img")
      expect(poster).not.toBeNull()
      // Decorativa: a descrição do loop já está na legenda, visível.
      expect(poster).toHaveAttribute("alt", "")
      expect(poster?.getAttribute("src")).toContain("busca.jpg")
      expect(container.querySelector("video")).toBeNull()
      expect(container.querySelector("[data-barra-video]")).toHaveClass(
        "min-h-(--alvo-toque)",
      )
    })
  })
})
