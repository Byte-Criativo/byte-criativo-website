import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BrowserFrame } from "./browser-frame"
import { Media } from "./media"

function renderFrame() {
  return render(
    <BrowserFrame
      dominio="festivalalumio.com.br"
      legenda="Topo da programação em festivalalumio.com.br, capturado em 12/09/2026"
    >
      <Media
        tipo="captura"
        src="/capturas/alumio-1440.png"
        width={1440}
        height={900}
        sizes="100vw"
        alt="Topo da programação do Festival Alumiô"
      />
    </BrowserFrame>,
  )
}

describe("BrowserFrame", () => {
  it("a legenda é visível e associada pela figure", () => {
    renderFrame()
    expect(
      screen.getByRole("figure", {
        name: /Topo da programação em festivalalumio.com.br/,
      }),
    ).toBeInTheDocument()
  })

  it("a barra é decorativa: fica fora da árvore de acessibilidade", () => {
    const { container } = renderFrame()
    const barra = container.querySelector("[data-barra]")
    expect(barra).toHaveAttribute("aria-hidden", "true")
    expect(barra?.textContent).toBe("festivalalumio.com.br")
  })

  it("o domínio quebra em vez de cortar em telas estreitas", () => {
    const { container } = renderFrame()
    expect(container.querySelector("[data-barra] span")).toHaveClass(
      "break-all",
    )
  })

  it("a moldura é CSS puro: nenhuma imagem além da captura", () => {
    const { container } = renderFrame()
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })

  it("usa o raio de radius.media do token", () => {
    const { container } = renderFrame()
    expect(container.querySelector("figure")).toHaveClass(
      "rounded-(--radius-media)",
    )
  })
})
