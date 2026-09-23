import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TextLink } from "./text-link"

describe("TextLink", () => {
  it("link interno usa next/link e não abre em nova aba", () => {
    render(
      <TextLink href="/portfolio" variante="acao">
        Ver todos os projetos
      </TextLink>,
    )
    const link = screen.getByRole("link", { name: "Ver todos os projetos" })
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
        Visitar site
      </TextLink>,
    )
    const link = screen.getByRole("link", {
      name: "Visitar site do Festival Alumiô (abre em nova aba)",
    })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("o marcador de link externo fica fora do nome acessível", () => {
    render(
      <TextLink href="https://exemplo.com" externo>
        Visitar site
      </TextLink>,
    )
    expect(screen.getByText("↗", { exact: false })).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  // M1: espaço comum (U+0020) antes do ↗ deixa o glifo quebrar sozinho para
  // a linha seguinte, separado da palavra anterior. U+00A0 (espaço não
  // separável) impede a quebra ali.
  it("M1: o ↗ usa espaço não separável (U+00A0), não espaço comum", () => {
    render(
      <TextLink href="https://exemplo.com" externo>
        Visitar site
      </TextLink>,
    )
    const marcador = screen.getByText("↗", { exact: false })
    expect(marcador.textContent).toBe(" ↗")
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
        Projetos
      </TextLink>,
    )
    expect(screen.getByRole("link", { name: "Projetos" })).toHaveAttribute(
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

  // I1 / RC2: "o foco visível repete o feedback do hover". Cada variante
  // precisa do par focus-visible: idêntico ao ponteiro:hover: existente,
  // porque quem navega por teclado num dispositivo híbrido (touch + mouse)
  // nunca aciona a media query pointer: fine.
  it("I1: acao e inline repetem no foco a mesma espessura de sublinhado do hover", () => {
    render(
      <TextLink href="/servicos" variante="acao">
        Ver todos os serviços
      </TextLink>,
    )
    expect(screen.getByRole("link")).toHaveClass(
      "focus-visible:decoration-(length:--border-w-focus)",
    )

    render(
      <TextLink href="/privacidade" variante="inline">
        política de privacidade
      </TextLink>,
    )
    expect(
      screen.getByRole("link", { name: "política de privacidade" }),
    ).toHaveClass("focus-visible:decoration-(length:--border-w-focus)")
  })

  it("I1: navegacao repete no foco o mesmo sublinhado fino do hover (não o de aria-current)", () => {
    render(
      <TextLink href="/portfolio" variante="navegacao">
        Projetos
      </TextLink>,
    )
    const link = screen.getByRole("link", { name: "Projetos" })
    expect(link).toHaveClass("focus-visible:underline")
    expect(link).toHaveClass(
      "focus-visible:decoration-(length:--border-w-decorative)",
    )
  })

  // M6: "Modificador externo: vale para acao e inline; nunca para
  // navegacao" (especificação). tsc (npm run typecheck) falha com "Unused
  // '@ts-expect-error' directive" se o tipo voltar a aceitar a combinação.
  it("M6: variante navegacao com externo não compila (tipo mais estrito)", () => {
    render(
      // @ts-expect-error externo nunca vale para a variante navegacao.
      <TextLink href="/portfolio" variante="navegacao" externo>
        Projetos
      </TextLink>,
    )
  })
})
