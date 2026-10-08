import { afterEach, describe, expect, it } from "vitest"
import { alvoDoClique, deslocamentoDoCabecalho } from "./ancora"

const ENDERECO = {
  origin: "https://bytecriativo.com.br",
  pathname: "/servicos",
  search: "",
}

function link(href: string, atributos: Record<string, string> = {}) {
  const a = document.createElement("a")
  a.href = new URL(href, `${ENDERECO.origin}${ENDERECO.pathname}`).href
  for (const [nome, valor] of Object.entries(atributos)) {
    a.setAttribute(nome, valor)
  }
  const filho = document.createElement("span")
  filho.textContent = "texto"
  a.append(filho)
  document.body.append(a)
  return { a, filho }
}

function clique(
  target: EventTarget | null,
  extra: Partial<{
    defaultPrevented: boolean
    button: number
    ctrlKey: boolean
    metaKey: boolean
    shiftKey: boolean
    altKey: boolean
  }> = {},
) {
  return {
    defaultPrevented: false,
    button: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    target,
    ...extra,
  }
}

afterEach(() => {
  document.body.innerHTML = ""
})

describe("alvoDoClique", () => {
  it("devolve o id de uma âncora do mesmo documento", () => {
    const { a } = link("#sala-catalogo")
    expect(alvoDoClique(clique(a), ENDERECO)).toBe("sala-catalogo")
  })

  it("acha o link pelo filho clicado (texto dentro do <a>)", () => {
    const { filho } = link("#conteudo")
    expect(alvoDoClique(clique(filho), ENDERECO)).toBe("conteudo")
  })

  it("aceita o caminho completo da página atual com hash", () => {
    const { a } = link("/servicos#manutencao")
    expect(alvoDoClique(clique(a), ENDERECO)).toBe("manutencao")
  })

  it("decodifica o fragmento", () => {
    const { a } = link("#sala-ac%C3%BAstica")
    expect(alvoDoClique(clique(a), ENDERECO)).toBe("sala-acústica")
  })

  it("fica com o id cru quando o fragmento não decodifica", () => {
    const { a } = link("#100%")
    expect(alvoDoClique(clique(a), ENDERECO)).toBe("100%")
  })

  it("recusa quem já chamou preventDefault (resumo de erros do formulário)", () => {
    const { a } = link("#nome")
    expect(
      alvoDoClique(clique(a, { defaultPrevented: true }), ENDERECO),
    ).toBeNull()
  })

  it("recusa botão do meio e botão direito", () => {
    const { a } = link("#x")
    expect(alvoDoClique(clique(a, { button: 1 }), ENDERECO)).toBeNull()
    expect(alvoDoClique(clique(a, { button: 2 }), ENDERECO)).toBeNull()
  })

  it.each(["ctrlKey", "metaKey", "shiftKey", "altKey"] as const)(
    "recusa clique com %s",
    (tecla) => {
      const { a } = link("#x")
      expect(alvoDoClique(clique(a, { [tecla]: true }), ENDERECO)).toBeNull()
    },
  )

  it("recusa target diferente de _self e aceita _self", () => {
    expect(
      alvoDoClique(clique(link("#x", { target: "_blank" }).a), ENDERECO),
    ).toBeNull()
    expect(
      alvoDoClique(clique(link("#x", { target: "_self" }).a), ENDERECO),
    ).toBe("x")
  })

  it("recusa link de download", () => {
    const { a } = link("#x", { download: "" })
    expect(alvoDoClique(clique(a), ENDERECO)).toBeNull()
  })

  it("recusa outro caminho, outra query e outra origem", () => {
    expect(alvoDoClique(clique(link("/portfolio#x").a), ENDERECO)).toBeNull()
    expect(alvoDoClique(clique(link("?aba=2#x").a), ENDERECO)).toBeNull()
    expect(
      alvoDoClique(clique(link("https://exemplo.com/servicos#x").a), ENDERECO),
    ).toBeNull()
  })

  it("recusa hash vazio e link sem hash", () => {
    expect(alvoDoClique(clique(link("#").a), ENDERECO)).toBeNull()
    expect(alvoDoClique(clique(link("/servicos").a), ENDERECO)).toBeNull()
  })

  it("recusa clique fora de link", () => {
    const div = document.createElement("div")
    document.body.append(div)
    expect(alvoDoClique(clique(div), ENDERECO)).toBeNull()
    expect(alvoDoClique(clique(null), ENDERECO)).toBeNull()
  })
})

describe("deslocamentoDoCabecalho", () => {
  it("lê o scroll-padding-top computado em px", () => {
    expect(deslocamentoDoCabecalho("80px")).toBe(80)
    expect(deslocamentoDoCabecalho("117.5px")).toBe(117.5)
    expect(deslocamentoDoCabecalho("16px")).toBe(16)
  })

  it("auto, vazio ou inválido valem zero", () => {
    expect(deslocamentoDoCabecalho("auto")).toBe(0)
    expect(deslocamentoDoCabecalho("")).toBe(0)
  })
})
