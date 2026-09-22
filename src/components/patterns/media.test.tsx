import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Media } from "./media"

describe("Media", () => {
  it("captura leva alt, sizes e dimensões explícitas", () => {
    render(
      <Media
        tipo="captura"
        src="/capturas/underground-pb1440.png"
        width={1440}
        height={900}
        sizes="(min-width: 64rem) 58vw, 100vw"
        alt="Página inicial do Underground PB, com a agenda da cena independente da Paraíba em destaque"
      />,
    )
    const img = screen.getByRole("img", {
      name: /Página inicial do Underground PB/,
    })
    expect(img).toHaveAttribute("width", "1440")
    expect(img).toHaveAttribute("height", "900")
    expect(img).toHaveAttribute("sizes", "(min-width: 64rem) 58vw, 100vw")
  })

  it("decorativa sai da árvore de acessibilidade", () => {
    const { container } = render(
      <Media
        tipo="decorativa"
        src="/marca/wordmark.svg"
        width={96}
        height={24}
        sizes="96px"
        alt=""
      />,
    )
    expect(screen.queryByRole("img")).toBeNull()
    expect(container.querySelector("img")).toHaveAttribute("alt", "")
  })

  it("prioridade marca o LCP: carga imediata e prioridade alta", () => {
    const { container } = render(
      <Media
        tipo="captura"
        src="/capturas/alumio-1440.png"
        width={1440}
        height={1080}
        sizes="100vw"
        alt="Programação do Festival Alumiô no topo da página"
        prioridade
      />,
    )
    const img = container.querySelector("img")
    expect(img).toHaveAttribute("fetchpriority", "high")
    expect(img).toHaveAttribute("loading", "eager")
  })

  it("sem prioridade, carrega preguiçoso", () => {
    const { container } = render(
      <Media
        tipo="captura"
        src="/capturas/alumio-390.png"
        width={390}
        height={844}
        sizes="(min-width: 48rem) 33vw, 66vw"
        alt="Programação filtrável no celular"
      />,
    )
    expect(container.querySelector("img")).toHaveAttribute("loading", "lazy")
  })

  it("o tipo impede alt errado (conferido por tsc)", () => {
    const decorativaComTexto = (
      // @ts-expect-error decorativa só aceita alt vazio
      <Media
        tipo="decorativa"
        src="/a.png"
        width={1}
        height={1}
        sizes="1px"
        alt="texto"
      />
    )
    const capturaSemAlt = (
      // @ts-expect-error captura exige alt
      <Media tipo="captura" src="/a.png" width={1} height={1} sizes="1px" />
    )
    const capturaSemSizes = (
      // @ts-expect-error sizes é obrigatório em qualquer tipo
      <Media tipo="captura" src="/a.png" width={1} height={1} alt="texto" />
    )
    expect(decorativaComTexto).toBeDefined()
    expect(capturaSemAlt).toBeDefined()
    expect(capturaSemSizes).toBeDefined()
  })
})
