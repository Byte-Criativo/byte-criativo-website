import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TextLink } from "./text-link"

describe("TextLink", () => {
  it("link interno usa next/link e não abre em nova aba", () => {
    render(
      <TextLink href="/portfolio" variante="acao">
        Ver todos os trabalhos
      </TextLink>,
    )
    const link = screen.getByRole("link", { name: "Ver todos os trabalhos" })
    expect(link).toHaveAttribute("href", "/portfolio")
    expect(link).not.toHaveAttribute("target")
    expect(link).not.toHaveAttribute("rel")
  })

  it("link externo abre em nova aba com rel seguro e anuncia isso", () => {
    render(
      <TextLink
        href="https://festivalalumio.com.br"
        variante="acao"
        externo
        complemento="do Festival Alumiô"
      >
        Ver projeto no ar
      </TextLink>,
    )
    const link = screen.getByRole("link", {
      name: "Ver projeto no ar do Festival Alumiô (abre em nova aba)",
    })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("o marcador de link externo fica fora do nome acessível", () => {
    render(
      <TextLink href="https://exemplo.com" externo>
        Ver projeto no ar
      </TextLink>,
    )
    expect(screen.getByText("↗", { exact: false })).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  // R51: assertiva com toHaveAccessibleName sobre o nome completo, não só
  // um trecho — pega o bug de concatenar texto visível e complemento sem
  // espaço (dom-accessibility-api não junta nós de texto com espaço).
  it("o nome começa pelo texto visível e inclui o complemento com espaço (RC5)", () => {
    render(
      <TextLink
        href="/portfolio/festival-alumio"
        complemento="do Festival Alumiô"
      >
        Ver estudo de caso
      </TextLink>,
    )
    expect(screen.getByRole("link")).toHaveAccessibleName(
      "Ver estudo de caso do Festival Alumiô",
    )
  })

  it("acao mantém 44 px de altura mínima", () => {
    render(
      <TextLink href="/servicos" variante="acao">
        Ver todos os serviços
      </TextLink>,
    )
    expect(screen.getByRole("link")).toHaveClass("min-h-(--alvo-toque)")
  })

  it("navegacao marca a página atual com aria-current", () => {
    render(
      <TextLink href="/portfolio" variante="navegacao" aria-current="page">
        Trabalhos
      </TextLink>,
    )
    expect(screen.getByRole("link", { name: "Trabalhos" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("inline herda o tamanho do texto e fica sublinhado em repouso", () => {
    render(
      <TextLink href="/privacidade" variante="inline">
        política de privacidade
      </TextLink>,
    )
    const link = screen.getByRole("link")
    expect(link).toHaveClass("underline")
    expect(link.className).not.toContain("text-label")
  })
})
