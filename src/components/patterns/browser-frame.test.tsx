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
  it("a legenda é visível e associada pela figure via aria-labelledby (RC5: aria-label não vale sobre texto visível)", () => {
    const { container } = renderFrame()
    const figura = container.querySelector("figure")
    const legendaEl = container.querySelector("figcaption")
    // RC5: aria-label é proibido sobre elemento com texto visível — a
    // legenda É visível, então o nome tem que vir do próprio figcaption.
    expect(figura).not.toHaveAttribute("aria-label")
    expect(legendaEl).not.toBeNull()
    expect(legendaEl?.parentElement).toBe(figura)
    expect(legendaEl?.textContent).toBe(
      "Topo da programação em festivalalumio.com.br, capturado em 12/09/2026",
    )
    expect(figura).toHaveAttribute("aria-labelledby", legendaEl?.id)
    // Se o figcaption for apagado, esta consulta por role deixa de achar
    // nome nenhum e falha — diferente do aria-label solto, que sobrevivia
    // à remoção do figcaption.
    expect(
      screen.getByRole("figure", {
        name: /Topo da programação em festivalalumio.com.br/,
      }),
    ).toBe(figura)
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
