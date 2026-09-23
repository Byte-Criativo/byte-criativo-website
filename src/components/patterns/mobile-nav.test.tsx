import { BrandLogo } from "./brand-logo"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { instalarMatchMedia, type MatchMediaFalso } from "@/test/match-media"
import { MobileNav } from "./mobile-nav"

const usePathname = vi.hoisted(() => vi.fn(() => "/"))
vi.mock("next/navigation", () => ({ usePathname }))

beforeAll(() => {
  // jsdom não implementa o top layer: basta refletir o atributo `open`. O
  // comportamento modal de verdade (foco preso e Esc) só pode ser provado
  // em navegador real; o retorno ao gatilho usa o evento `close`.
  HTMLDialogElement.prototype.showModal = function abrir() {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function fechar() {
    this.removeAttribute("open")
    this.dispatchEvent(new Event("close"))
  }
})

let midia: MatchMediaFalso | null = null

afterEach(() => {
  midia?.restaurar()
  midia = null
  usePathname.mockReturnValue("/")
})

// R65: o substituto de matchMedia entra aqui, explícito, com a resposta à
// vista — nunca como stub global no vitest.setup.ts.
function comLarguraDeCelular(): MatchMediaFalso {
  midia = instalarMatchMedia(() => false)
  return midia
}

const NAVEGACAO = [
  { rotulo: "Projetos", href: "/portfolio", secao: "/portfolio" },
  { rotulo: "Serviços", href: "/servicos", secao: "/servicos" },
  { rotulo: "Como trabalhamos", href: "/processo" },
  { rotulo: "Sobre", href: "/sobre" },
  { rotulo: "Contato", href: "/contato" },
]

function elemento() {
  return (
    <MobileNav
      navegacao={NAVEGACAO}
      whatsapp={{ rotulo: "Chamar no WhatsApp", mensagem: "Olá!" }}
      emailHref="mailto:contato@bcriativo.com"
      wordmark={<BrandLogo />}
    />
  )
}

function montar() {
  comLarguraDeCelular()
  return render(elemento())
}

describe("MobileNav", () => {
  it("sem JS, o link Menu leva à navegação do rodapé e some quando o botão aparece", () => {
    montar()
    const link = screen.getByRole("link", { name: "Menu" })
    expect(link).toHaveAttribute("href", "#navegacao-rodape")
    expect(link.className).toContain("invoker:hidden")
    expect(link.className).toContain("hidratado:hidden")
  })

  it("o botão anuncia diálogo, sem aria-controls nem aria-expanded", () => {
    montar()
    const botao = screen.getByRole("button", { name: "Menu" })
    expect(botao).toHaveAttribute("aria-haspopup", "dialog")
    expect(botao).not.toHaveAttribute("aria-controls")
    expect(botao).not.toHaveAttribute("aria-expanded")
    expect(botao).toHaveAttribute("command", "show-modal")
    expect(botao).toHaveAttribute("commandfor", "menu-principal")
  })

  // O React 19.3 não conhece os Invoker Commands: a prop em camelCase faz
  // ele reclamar em todo render ("React does not recognize the `commandFor`
  // prop…") e sair no HTML do servidor como `commandFor=`. O parser de HTML
  // salva o comportamento, mas o atributo precisa ir em minúsculas.
  it("o atributo do Invoker Command chega ao HTML do servidor em minúsculas", () => {
    const html = renderToStaticMarkup(elemento())
    expect(html).toContain('commandfor="menu-principal"')
    expect(html).toContain('command="show-modal"')
    expect(html).toContain('command="close"')
    expect(html).not.toContain("commandFor")
  })

  it("o botão só aparece com data-invoker ou depois da hidratação", () => {
    montar()
    const classes = screen.getByRole("button", { name: "Menu" }).className
    expect(classes).toContain("hidden")
    expect(classes).toContain("invoker:inline-flex")
    expect(classes).toContain("hidratado:inline-flex")
  })

  it("acionar Menu abre o diálogo nomeado Menu, com a navegação Principal e os cinco destinos", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))

    const dialogo = screen.getByRole("dialog", { name: "Menu" })
    expect(dialogo).toHaveAttribute("open")
    const nav = within(dialogo).getByRole("navigation", { name: "Principal" })
    expect(within(nav).getAllByRole("link")).toHaveLength(5)
    expect(
      within(dialogo).getByRole("link", { name: "Falar sobre meu projeto" }),
    ).toBeInTheDocument()
    expect(
      within(dialogo).getByRole("link", {
        name: "Chamar no WhatsApp (abre em nova aba)",
      }),
    ).toBeInTheDocument()
    expect(
      within(dialogo).getByRole("link", { name: "Escrever e-mail" }),
    ).toBeInTheDocument()
  })

  // RC3: no celular os destinos da folha são os alvos principais da página;
  // 48 px é o piso da especificação para eles.
  it("os links da folha têm os 48 px de alvo da RC3", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const nav = within(screen.getByRole("dialog")).getByRole("navigation", {
      name: "Principal",
    })
    for (const link of within(nav).getAllByRole("link")) {
      expect(link).toHaveClass("min-h-(--space-7)")
    }
  })

  // O evento `close` também devolve o foco ao gatilho, inclusive no WebKit.
  it("Fechar menu fecha o diálogo", async () => {
    montar()
    const gatilho = screen.getByRole("button", { name: "Menu" })
    await userEvent.click(gatilho)
    await userEvent.click(screen.getByRole("button", { name: "Fechar menu" }))
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    )
    expect(gatilho).toHaveFocus()
  })

  it("clicar em qualquer link da folha fecha o menu", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const dialogo = screen.getByRole("dialog")
    await userEvent.click(within(dialogo).getByRole("link", { name: "Sobre" }))
    expect(dialogo).not.toHaveAttribute("open")
  })

  it("a marca do menu retorna para a home e fecha o diálogo, inclusive na própria home", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const dialogo = screen.getByRole("dialog")
    const inicio = within(dialogo).getByRole("link", {
      name: "Byte Criativo, página inicial",
    })
    expect(inicio).toHaveAttribute("href", "/")
    expect(inicio.querySelector("img")).toHaveAttribute("src", "/logoByte.png")
    await userEvent.click(inicio)
    expect(dialogo).not.toHaveAttribute("open")
  })

  it("concluir uma navegação fecha o menu", async () => {
    const { rerender } = montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    usePathname.mockReturnValue("/sobre")
    rerender(elemento())
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    )
  })

  it("cruzar a largura de breakpoints.lg fecha o menu", async () => {
    const consulta = comLarguraDeCelular()
    render(elemento())
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    expect(screen.getByRole("dialog")).toHaveAttribute("open")

    // A ilha precisa consultar a largura de verdade: a resposta muda e o
    // evento `change` é disparado na mesma lista que ela assinou.
    expect(consulta.consultas).toContain("(min-width: 64rem)")
    consulta.responder((media) => media === "(min-width: 64rem)")

    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    )
  })

  it("Tab no último elemento foca o primeiro elemento, e Shift+Tab no primeiro foca o último", async () => {
    montar()
    await userEvent.click(screen.getByRole("button", { name: "Menu" }))
    const dialogo = screen.getByRole("dialog")
    const inicio = within(dialogo).getByRole("link", {
      name: "Byte Criativo, página inicial",
    })
    const ultimoLink = within(dialogo).getByRole("link", {
      name: "Escrever e-mail",
    })

    ultimoLink.focus()
    expect(ultimoLink).toHaveFocus()

    await userEvent.keyboard("{Tab}")
    expect(inicio).toHaveFocus()

    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    expect(ultimoLink).toHaveFocus()
  })
})
