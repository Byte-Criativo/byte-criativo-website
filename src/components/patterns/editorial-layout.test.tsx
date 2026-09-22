import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  EditorialLayout,
  MarcadorNumerado,
  NotasMargem,
} from "./editorial-layout"

/** Classes de todos os nós, já sem o prefixo de variante (`lg:`, `md:`…). */
function classesDe(container: HTMLElement): string[] {
  const achadas: string[] = []
  for (const elemento of container.querySelectorAll("*")) {
    const bruto = elemento.getAttribute("class")
    if (!bruto) continue
    for (const classe of bruto.split(/\s+/)) {
      if (classe) achadas.push(classe.split(":").pop() ?? classe)
    }
  }
  return achadas
}

describe("EditorialLayout", () => {
  it("é um article em grade de 12 colunas", () => {
    const { container } = render(
      <EditorialLayout>
        <p>corpo</p>
      </EditorialLayout>,
    )
    const artigo = container.querySelector("article")
    expect(artigo).not.toBeNull()
    expect(artigo).toHaveClass("lg:grid-cols-12")
  })

  it("a variante fica no DOM: com-notas por padrão, texto quando pedida", () => {
    const padrao = render(
      <EditorialLayout>
        <p>corpo</p>
      </EditorialLayout>,
    )
    expect(padrao.container.querySelector("article")).toHaveAttribute(
      "data-variante",
      "com-notas",
    )
    padrao.unmount()

    const texto = render(
      <EditorialLayout variante="texto">
        <p>texto legal</p>
      </EditorialLayout>,
    )
    expect(texto.container.querySelector("article")).toHaveAttribute(
      "data-variante",
      "texto",
    )
  })

  it("as notas ficam numa lista ordenada, depois da figura no DOM", () => {
    const { container } = render(
      <EditorialLayout>
        <figure>figura</figure>
        <NotasMargem>
          <li>1. No topo da página, a busca por banda.</li>
        </NotasMargem>
        <p>texto seguinte</p>
      </EditorialLayout>,
    )
    const filhos = [...(container.querySelector("article")?.children ?? [])]
    expect(filhos[0]?.tagName).toBe("FIGURE")
    expect(filhos[1]?.tagName).toBe("OL")
    expect(filhos[2]?.tagName).toBe("P")
    expect(filhos[1]?.querySelectorAll("li")).toHaveLength(1)
  })

  it("o marcador numerado é duplicata visual: fica fora da árvore e não vira alvo", () => {
    const { container } = render(<MarcadorNumerado numero={1} />)
    const marcador = screen.getByText("1")
    expect(marcador).toHaveAttribute("aria-hidden", "true")
    expect(marcador.closest("a")).toBeNull()
    expect(marcador.closest("button")).toBeNull()
    expect(container.querySelector("a")).toBeNull()
    expect(container.querySelector("button")).toBeNull()
  })

  it("nenhuma classe de reordenação visual é usada", () => {
    const { container } = render(
      <EditorialLayout>
        <figure>figura</figure>
        <NotasMargem>
          <li>nota</li>
        </NotasMargem>
        <p>corpo</p>
      </EditorialLayout>,
    )
    const reordenacao = classesDe(container).filter((classe) =>
      /^order-(?:\d+|first|last|none)$/.test(classe),
    )
    expect(reordenacao).toEqual([])
  })
})
