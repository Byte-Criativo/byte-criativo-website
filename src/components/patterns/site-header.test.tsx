import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SiteHeader, type ItemNavegacao } from "./site-header"

const usePathname = vi.hoisted(() => vi.fn(() => "/"))
vi.mock("next/navigation", () => ({ usePathname }))

const NAVEGACAO: ItemNavegacao[] = [
  { rotulo: "Trabalhos", href: "/portfolio", secao: "/portfolio" },
  { rotulo: "Serviços", href: "/servicos", secao: "/servicos" },
  { rotulo: "Processo", href: "/processo" },
  { rotulo: "Sobre", href: "/sobre" },
]

function montar() {
  return render(
    <SiteHeader
      navegacao={NAVEGACAO}
      wordmark={<svg aria-hidden="true" focusable="false" />}
      menu={<button type="button">Menu</button>}
    />,
  )
}

describe("SiteHeader", () => {
  it("é o único banner e traz uma navegação chamada Principal", () => {
    montar()
    expect(screen.getAllByRole("banner")).toHaveLength(1)
    expect(
      screen.getByRole("navigation", { name: "Principal" }),
    ).toBeInTheDocument()
  })

  it("o wordmark leva para a home com nome que começa pela marca", () => {
    montar()
    expect(
      screen.getByRole("link", { name: "Byte Criativo, página inicial" }),
    ).toHaveAttribute("href", "/")
  })

  it("traz os quatro destinos e o CTA para /contato", () => {
    montar()
    for (const item of NAVEGACAO) {
      expect(screen.getByRole("link", { name: item.rotulo })).toHaveAttribute(
        "href",
        item.href,
      )
    }
    expect(
      screen.getByRole("link", { name: "Falar sobre um projeto" }),
    ).toHaveAttribute("href", "/contato")
  })

  it("em /contato o CTA continua visível e marcado como página atual", () => {
    usePathname.mockReturnValue("/contato")
    try {
      montar()
      expect(
        screen.getByRole("link", { name: "Falar sobre um projeto" }),
      ).toHaveAttribute("aria-current", "page")
    } finally {
      usePathname.mockReturnValue("/")
    }
  })

  it("a barra de progresso é decorativa e não é landmark nem controle", () => {
    const { container } = montar()
    const barra = container.querySelector("[data-progresso]")
    expect(barra).toHaveAttribute("aria-hidden", "true")
    expect(barra?.tagName).toBe("DIV")
    expect(barra).not.toHaveAttribute("role")
    // O gancho de CSS precisa ser o mesmo que globals.css estiliza.
    expect(barra).toHaveClass("progresso-leitura")
  })

  it("o header carrega o gancho que a janela baixa desafixa", () => {
    const { container } = montar()
    expect(container.querySelector("[data-site-header]")).not.toBeNull()
  })

  it("o gatilho do menu chega pela prop e fica no header", () => {
    montar()
    expect(
      screen.getByRole("button", { name: "Menu" }).closest("header"),
    ).not.toBeNull()
  })
})
