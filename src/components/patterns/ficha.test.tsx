import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Ficha } from "./ficha"

const BASE = {
  id: "ficha-festival-alumio",
  nome: "Festival Alumiô",
  tipo: "Site de festival",
  nivel: 2 as const,
  frase: "A programação na mão, com a cor do Centro Histórico de João Pessoa.",
  capacidades: ["Programação filtrável", "Favoritos salvos no aparelho"],
  estudoDeCasoHref: "/portfolio/festival-alumio",
  projetoNoArHref: "https://festivalalumio.com.br",
  sala: <div data-sala-de-teste>sala</div>,
}

describe("Ficha", () => {
  it("o article é nomeado pelo título do projeto", () => {
    render(<Ficha {...BASE} />)
    expect(
      screen.getByRole("article", { name: "Festival Alumiô" }),
    ).toBeInTheDocument()
  })

  it("os nomes dos links começam pelo texto visível e citam o projeto", () => {
    render(<Ficha {...BASE} />)
    expect(
      screen.getByRole("link", {
        name: "Ver estudo de caso do Festival Alumiô",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", {
        name: "Ver projeto no ar do Festival Alumiô (abre em nova aba)",
      }),
    ).toBeInTheDocument()
  })

  it("a cabeça vem antes da sala e o corpo depois", () => {
    const { container } = render(
      <Ficha {...BASE} controle={<button type="button">Frente</button>} />,
    )
    const filhos = [...(container.querySelector("article")?.children ?? [])]
    expect(filhos[0]).toHaveAttribute("data-parte", "cabeca")
    expect(filhos[1]).toHaveAttribute("data-parte", "sala")
    expect(filhos[2]).toHaveAttribute("data-parte", "corpo")
  })

  it("as capacidades formam uma lista nomeada", () => {
    render(<Ficha {...BASE} />)
    const lista = screen.getByRole("list", { name: "Capacidades" })
    expect(lista.querySelectorAll("li")).toHaveLength(2)
  })

  it("a contagem vira link de âncora para a próxima sala", () => {
    render(
      <Ficha
        {...BASE}
        contagem={{
          atual: 1,
          total: 3,
          proximo: { nome: "Underground PB", href: "#sala-underground-pb" },
        }}
      />,
    )
    expect(
      screen.getByRole("link", {
        name: "1 de 3: ir para o próximo trabalho, Underground PB",
      }),
    ).toBeInTheDocument()
  })

  it("na última sala a contagem é texto, com o contexto oculto", () => {
    render(<Ficha {...BASE} contagem={{ atual: 3, total: 3 }} />)
    expect(screen.queryByRole("link", { name: /3 de 3/ })).toBeNull()
    expect(screen.getByText("Trabalho", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("3 de 3")).toBeInTheDocument()
  })

  it("não renderiza nenhum rótulo de relação comercial ou de autoria", () => {
    const { container } = render(<Ficha {...BASE} />)
    expect(container.textContent).not.toMatch(/cliente|O que a Byte fez/i)
  })

  it("o nível do título muda sem mudar mais nada", () => {
    render(<Ficha {...BASE} nivel={3} />)
    expect(
      screen.getByRole("heading", { level: 3, name: "Festival Alumiô" }),
    ).toBeInTheDocument()
  })

  it("o article da Ficha nunca carrega data-case (RC6: fica sempre na parede)", () => {
    const { container } = render(<Ficha {...BASE} />)
    expect(container.querySelector("article")).not.toHaveAttribute("data-case")
  })
})
