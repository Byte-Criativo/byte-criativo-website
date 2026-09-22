import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SituacaoServico, type ItemSituacao } from "./situacao-servico"

const ITENS: ItemSituacao[] = [
  {
    id: "site-antigo",
    situacao: "O site não acompanha o que a empresa virou.",
    frase: "Estrutura, texto e tela decididos juntos.",
    links: [
      { rotulo: "Ir para Sites e experiências", href: "#sites-e-experiencias" },
      {
        rotulo: "Ver estudo de caso",
        href: "/portfolio/festival-alumio",
        complemento: "do Festival Alumiô",
      },
    ],
  },
  {
    id: "planilhas",
    situacao: "A operação cabe em planilhas e grupos de WhatsApp.",
    links: [
      { rotulo: "Ir para Sistemas e produtos", href: "#sistemas-e-produtos" },
    ],
  },
]

describe("SituacaoServico", () => {
  it("cada situação é um h3 com os destinos em lista", () => {
    const padrao = render(<SituacaoServico itens={ITENS} />)
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "O site não acompanha o que a empresa virou.",
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole("list")).toHaveLength(3)
    expect(padrao.container.querySelector("ol")).toBeNull()
  })

  it("cada link diz o destino pelo próprio texto", () => {
    render(<SituacaoServico itens={ITENS} />)
    expect(
      screen.getByRole("link", { name: "Ir para Sites e experiências" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", {
        name: "Ver estudo de caso do Festival Alumiô",
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /Saiba mais/i })).toBeNull()
    expect(screen.queryByRole("link", { name: /Clique aqui/i })).toBeNull()
  })

  it("o separador · da copy não é renderizado", () => {
    const { container } = render(<SituacaoServico itens={ITENS} />)
    expect(container.textContent).not.toContain("·")
  })

  it("ordenada troca ul por ol sem mudar mais nada", () => {
    const { container } = render(<SituacaoServico itens={ITENS} ordenada />)
    expect(container.querySelector("ol")).not.toBeNull()
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "O site não acompanha o que a empresa virou.",
      }),
    ).toBeInTheDocument()
  })

  it("o rodapé opcional aparece depois da lista", () => {
    const { container } = render(
      <SituacaoServico
        itens={ITENS}
        rodape="Não sabe por onde começar? Definir o escopo é a primeira parte do trabalho."
      />,
    )
    const rodape = screen.getByText(/Não sabe por onde começar\?/)
    const lista = container.querySelector("ul, ol")
    expect(lista).not.toBeNull()
    expect(
      (lista?.compareDocumentPosition(rodape) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it("os links têm alvo de 44 px", () => {
    render(<SituacaoServico itens={ITENS} />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(3)
    for (const link of links) {
      expect(link).toHaveClass("min-h-(--alvo-toque)")
    }
  })
})
