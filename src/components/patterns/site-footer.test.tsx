import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SiteFooter } from "./site-footer"

const PROPS = {
  tagline: "Design e engenharia na mesma frase",
  razaoSocial: "Byte Criativo, design e engenharia de software.",
  cnpj: "CNPJ 52.652.130/0001-02",
  colunas: [
    {
      titulo: "Trabalhos",
      itens: [
        { rotulo: "Underground PB", href: "/portfolio/underground-pb" },
        { rotulo: "Festival Alumiô", href: "/portfolio/festival-alumio" },
        { rotulo: "Todos os trabalhos", href: "/portfolio" },
      ],
    },
    {
      titulo: "Serviços",
      itens: [
        {
          rotulo: "Desenvolvimento de sites",
          href: "/servicos/desenvolvimento-de-sites",
        },
      ],
    },
    {
      titulo: "Estúdio",
      itens: [
        { rotulo: "Processo", href: "/processo" },
        { rotulo: "Sobre", href: "/sobre" },
        { rotulo: "Contato", href: "/contato" },
        { rotulo: "Privacidade", href: "/privacidade" },
      ],
    },
  ],
  email: "contato@bcriativo.com",
  whatsapp: {
    rotulo: "WhatsApp +55 (83) 99125-3377",
    mensagem: "Olá!",
  },
  copyright: "© 2026 Byte Criativo",
}

describe("SiteFooter", () => {
  it("é o contentinfo e tem uma navegação chamada Rodapé", () => {
    render(<SiteFooter {...PROPS} />)
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(
      screen.getByRole("navigation", { name: "Rodapé" }),
    ).toBeInTheDocument()
  })

  it("a navegação é o destino do link Menu e recebe foco sem entrar no Tab", () => {
    render(<SiteFooter {...PROPS} />)
    const nav = screen.getByRole("navigation", { name: "Rodapé" })
    expect(nav).toHaveAttribute("id", "navegacao-rodape")
    expect(nav).toHaveAttribute("tabindex", "-1")
  })

  it("a tagline carrega o gancho de RC7 que leva o `;` a --accent em xl", () => {
    render(<SiteFooter {...PROPS} />)
    const tagline = screen.getByRole("heading", {
      level: 2,
      name: PROPS.tagline,
    })
    expect(tagline).toHaveClass("rodape-tagline")
    expect(tagline.querySelector(".semicolon-pequeno")).not.toBeNull()
  })

  it("cada coluna tem título h2", () => {
    render(<SiteFooter {...PROPS} />)
    for (const coluna of PROPS.colunas) {
      expect(
        screen.getByRole("heading", { level: 2, name: coluna.titulo }),
      ).toBeInTheDocument()
    }
  })

  it("a linha final traz e-mail, WhatsApp com o nome da RC5 e copyright", () => {
    render(<SiteFooter {...PROPS} />)
    expect(
      screen.getByRole("link", { name: "contato@bcriativo.com" }),
    ).toHaveAttribute("href", "mailto:contato@bcriativo.com")
    expect(
      screen.getByRole("link", {
        name: "WhatsApp +55 (83) 99125-3377 (abre em nova aba)",
      }),
    ).toHaveAccessibleName("WhatsApp +55 (83) 99125-3377 (abre em nova aba)")
    expect(screen.getByText("© 2026 Byte Criativo")).toBeInTheDocument()
  })

  // RC3: no celular a lista do rodapé é tocada com o polegar (44 px); a
  // partir de lg vale o mínimo de 24 px do 2.5.8, com o ponteiro.
  it("os links do rodapé têm 44 px de alvo abaixo de lg e 24 px a partir de lg", () => {
    render(<SiteFooter {...PROPS} />)
    const nav = screen.getByRole("navigation", { name: "Rodapé" })
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).toHaveClass("min-h-(--alvo-toque)")
      expect(link).toHaveClass("lg:min-h-(--alvo-min)")
    }
  })

  it("nenhum link do rodapé é marcado como página atual", () => {
    render(<SiteFooter {...PROPS} />)
    const nav = screen.getByRole("navigation", { name: "Rodapé" })
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current")
    }
  })

  it("não inventa link pendente: só renderiza o que recebe", () => {
    const { container } = render(<SiteFooter {...PROPS} />)
    expect(container.textContent).not.toMatch(
      /Goromax|Pomodoro|Instagram|LinkedIn/,
    )
  })
})
