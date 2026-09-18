import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, describe, expect, it } from "vitest"
import { GaleriaDialog, type ItemGaleria } from "./galeria-dialog"

// O jsdom não implementa showModal/close. O comportamento modal de verdade
// (inerte, Esc, foco circular) é do navegador e fica para o e2e do bloco L5;
// aqui só o contrato do componente é exercitado.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function abrir() {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function fechar() {
    this.removeAttribute("open")
    this.dispatchEvent(new Event("close"))
  }
})

const ITENS: ItemGaleria[] = [
  {
    id: "tela-1",
    legenda: "Busca por banda",
    ampliada: <p>tela 1 ampliada</p>,
  },
  { id: "tela-2", legenda: "Mapa de palcos", ampliada: <p>tela 2 ampliada</p> },
]

function montar() {
  return render(
    <GaleriaDialog itens={ITENS}>
      {ITENS.map((item) => (
        <figure key={item.id} data-galeria-item={item.id} className="relative">
          <figcaption>{item.legenda}</figcaption>
        </figure>
      ))}
    </GaleriaDialog>,
  )
}

describe("GaleriaDialog", () => {
  it("cria um gatilho por figura, nomeado pela legenda e dentro da própria figura do servidor", () => {
    montar()
    const primeiro = screen.getByRole("button", {
      name: "Ampliar imagem: Busca por banda",
    })
    const segundo = screen.getByRole("button", {
      name: "Ampliar imagem: Mapa de palcos",
    })
    expect(primeiro.closest('[data-galeria-item="tela-1"]')).not.toBeNull()
    expect(segundo.closest('[data-galeria-item="tela-2"]')).not.toBeNull()
  })

  it("abrir põe o foco em Fechar e nomeia o diálogo pela legenda visível", async () => {
    montar()
    await userEvent.click(
      screen.getByRole("button", { name: "Ampliar imagem: Busca por banda" }),
    )
    const dialogo = screen.getByRole("dialog")
    expect(dialogo).toHaveAccessibleName("Busca por banda")
    expect(
      within(dialogo).getByRole("button", { name: "Fechar" }),
    ).toHaveFocus()
  })

  it("trocar de imagem anuncia a nova legenda na região polida de dentro", async () => {
    montar()
    await userEvent.click(
      screen.getByRole("button", { name: "Ampliar imagem: Busca por banda" }),
    )
    const dialogo = screen.getByRole("dialog")
    await userEvent.click(
      within(dialogo).getByRole("button", { name: "Próxima imagem" }),
    )
    expect(within(dialogo).getByText("tela 2 ampliada")).toBeInTheDocument()
    // RC11: canal único, e ele vive DENTRO do diálogo (fora dele ficaria
    // inerte enquanto o modal está aberto).
    const vivas = screen.getAllByRole("status")
    expect(vivas).toHaveLength(1)
    const viva = vivas[0] ?? null
    expect(dialogo.contains(viva)).toBe(true)
    expect(viva).toHaveTextContent("Mapa de palcos")
  })

  it("na última imagem, Próxima leva à primeira: não há estado desabilitado", async () => {
    montar()
    await userEvent.click(
      screen.getByRole("button", { name: "Ampliar imagem: Mapa de palcos" }),
    )
    const dialogo = screen.getByRole("dialog")
    const proxima = within(dialogo).getByRole("button", {
      name: "Próxima imagem",
    })
    const anterior = within(dialogo).getByRole("button", {
      name: "Imagem anterior",
    })
    expect(proxima).not.toBeDisabled()
    expect(anterior).not.toBeDisabled()
    expect(proxima).not.toHaveAttribute("aria-disabled")
    await userEvent.click(proxima)
    expect(within(dialogo).getByText("tela 1 ampliada")).toBeInTheDocument()
  })

  it("as setas do teclado andam pela galeria dentro do diálogo", async () => {
    montar()
    await userEvent.click(
      screen.getByRole("button", { name: "Ampliar imagem: Busca por banda" }),
    )
    const dialogo = screen.getByRole("dialog")
    await userEvent.keyboard("{ArrowRight}")
    expect(within(dialogo).getByText("tela 2 ampliada")).toBeInTheDocument()
    await userEvent.keyboard("{ArrowLeft}")
    expect(within(dialogo).getByText("tela 1 ampliada")).toBeInTheDocument()
  })

  it("fechar devolve o foco ao gatilho que abriu", async () => {
    montar()
    const gatilho = screen.getByRole("button", {
      name: "Ampliar imagem: Mapa de palcos",
    })
    await userEvent.click(gatilho)
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Fechar",
      }),
    )
    expect(gatilho).toHaveFocus()
  })

  it("nenhum gatilho aponta para o diálogo com aria-controls", () => {
    montar()
    const botoes = screen.getAllByRole("button")
    expect(botoes.length).toBeGreaterThan(0)
    for (const botao of botoes) {
      expect(botao).not.toHaveAttribute("aria-controls")
    }
  })

  it("um único dialog por página, dentro da subárvore da galeria", () => {
    const { container } = montar()
    expect(document.querySelectorAll("dialog")).toHaveLength(1)
    expect(container.querySelectorAll("dialog")).toHaveLength(1)
  })

  it("o painel usa a camada de sobreposição e a sombra a partir de lg", () => {
    const { container } = montar()
    const classes = (
      container.querySelector("dialog")?.getAttribute("class") ?? ""
    )
      .split(/\s+/)
      .filter(Boolean)
    expect(classes.some((c) => c.includes("--z-overlay"))).toBe(true)
    const comSombra = classes.filter((c) => c.includes("--shadow-overlay"))
    expect(comSombra.length).toBeGreaterThan(0)
    expect(comSombra.some((c) => c.startsWith("lg:"))).toBe(true)
  })
})
