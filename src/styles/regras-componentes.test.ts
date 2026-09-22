import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Contrato das regras de `globals.css` que sustentam comportamento de
 * componente — e que nenhum teste de render alcança, porque o jsdom não
 * aplica folha de estilo.
 *
 * As regras são lidas como regras (seletor + corpo), nunca como um recorte
 * de texto delimitado por comentário: reformatar, reordenar ou renomear um
 * comentário não pode fazer uma checagem parar de casar em silêncio. O
 * casamento também é sempre da regra mais interna (`[^{}]`), então nada
 * atravessa blocos — um `[\s\S]*` entre duas âncoras ficaria verde contra o
 * próprio defeito que nomeia.
 */
const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
)

type Regra = { seletores: string[]; corpo: string }

function regras(fonte: string): Regra[] {
  const limpo = fonte.replace(/\/\*[\s\S]*?\*\//g, " ")
  return [...limpo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((achado) => ({
    seletores: (achado[1] ?? "")
      .split(",")
      .map((seletor) => seletor.replace(/\s+/g, " ").trim())
      .filter(Boolean),
    corpo: achado[2] ?? "",
  }))
}

const REGRAS = regras(css)

/** Seletor sem espaços, para casar a mesma regra escrita de qualquer jeito. */
function semEspacos(seletor: string): string {
  return seletor.replace(/\s+/g, "").toLowerCase()
}

function regrasPara(casa: (seletor: string) => boolean): Regra[] {
  return REGRAS.filter((regra) => regra.seletores.some(casa))
}

/** Último valor declarado de `propriedade` entre as regras que casam. */
function valorDe(
  casa: (seletor: string) => boolean,
  propriedade: string,
): string | null {
  const padrao = new RegExp(
    `(?:^|[;{]|\\s)${propriedade}\\s*:\\s*([^;}]+)`,
    "i",
  )
  let valor: string | null = null
  for (const regra of regrasPara(casa)) {
    const achado = padrao.exec(regra.corpo)
    if (achado?.[1]) valor = achado[1].trim()
  }
  return valor
}

describe("globals.css: FaqItem", () => {
  it("a abertura animada só existe onde ::details-content existe", () => {
    expect(css).toMatch(/@supports\s+selector\s*\(\s*::details-content\s*\)/)
  })

  it("o sinal troca por display, nunca por cor", () => {
    expect(
      valorDe(
        (s) => s.includes(".faq-item[open]") && s.includes(".faq-mais"),
        "display",
      ),
    ).toBe("none")
    expect(
      valorDe(
        (s) =>
          s.includes(".faq-item") &&
          !s.includes("[open]") &&
          s.includes(".faq-menos"),
        "display",
      ),
    ).toBe("none")
    const menosAberto = valorDe(
      (s) => s.includes(".faq-item[open]") && s.includes(".faq-menos"),
      "display",
    )
    expect(menosAberto).not.toBeNull()
    expect(menosAberto).not.toBe("none")
  })

  it("só a opacidade anima: a altura nunca entra na transição", () => {
    const conteudo = regrasPara((s) => s.includes("::details-content"))
    expect(conteudo.length).toBeGreaterThan(0)
    expect(
      valorDe((s) => s.includes(".faq-item::details-content"), "opacity"),
    ).toBe("0")
    expect(
      valorDe((s) => s.includes(".faq-item[open]::details-content"), "opacity"),
    ).toBe("1")
    for (const regra of conteudo) {
      expect(regra.corpo).not.toMatch(
        /(?:^|[;{\s])(?:height|max-height|block-size|max-block-size)\s*:/i,
      )
      const transicao = /transition[^:]*:\s*([^;}]+)/i.exec(regra.corpo)?.[1]
      if (transicao) {
        expect(transicao).not.toMatch(/height|block-size|grid-template|all\b/i)
      }
    }
  })
})

describe("globals.css: diálogo modal", () => {
  const travaDeRolagem = (seletor: string) =>
    semEspacos(seletor).includes("html:has(dialog[open])")

  it("a rolagem da página trava enquanto um diálogo está aberto", () => {
    expect(regrasPara(travaDeRolagem).length).toBeGreaterThan(0)
    const overflow =
      valorDe(travaDeRolagem, "overflow") ??
      valorDe(travaDeRolagem, "overflow-y") ??
      valorDe(travaDeRolagem, "overflow-block")
    expect(overflow).toMatch(/hidden|clip/i)
  })

  it("a goteira da barra de rolagem fica reservada, para o layout não pular", () => {
    const goteira = valorDe((seletor) => {
      const normalizado = semEspacos(seletor)
      return (
        normalizado === "html" ||
        normalizado === ":root" ||
        normalizado.startsWith("html:has(dialog[open])")
      )
    }, "scrollbar-gutter")
    expect(goteira).toMatch(/stable/i)
  })

  it("o ::backdrop é opaco em --bg, com Canvas como alternativa", () => {
    const comBackdrop = regrasPara((seletor) =>
      semEspacos(seletor).includes("::backdrop"),
    )
    expect(comBackdrop.length).toBeGreaterThan(0)
    const corpo = comBackdrop.map((regra) => regra.corpo).join(" ")
    const fundos = [
      ...corpo.matchAll(/background(?:-color)?\s*:\s*([^;}]+)/gi),
    ].map((achado) => (achado[1] ?? "").trim())
    expect(fundos.length).toBeGreaterThan(0)
    expect(fundos.some((valor) => /var\(\s*--bg\b/.test(valor))).toBe(true)
    // `::backdrop` só herda custom properties a partir do Safari 17.4: sem a
    // cor de sistema como alternativa, o fundo fica transparente lá.
    expect(corpo).toMatch(/\bcanvas\b/i)
  })

  it("a camada do ::backdrop vem de zIndex.overlay, nunca de número solto", () => {
    const camada = valorDe(
      (seletor) => semEspacos(seletor).includes("::backdrop"),
      "z-index",
    )
    expect(camada).toMatch(/var\(\s*--z-overlay\b/)
  })
})

describe("globals.css: gatilho da galeria", () => {
  it("cobre a figura inteira sem mudar a caixa dela", () => {
    const casa = (seletor: string) => semEspacos(seletor) === ".galeria-gatilho"
    expect(regrasPara(casa).length).toBeGreaterThan(0)
    expect(valorDe(casa, "position")).toBe("absolute")
    expect(valorDe(casa, "inset")).toBe("0")
  })
})

describe("globals.css: LeadForm, campo de contato pelo canal", () => {
  // O jsdom não aplica folha de estilo: sem esta checagem, a revelação por
  // `:has()` (e o fallback dos dois campos visíveis) não teria dono.
  const escondeEmail = (seletor: string) => {
    const normalizado = semEspacos(seletor)
    return (
      normalizado.includes(
        '.lead-form:has([name="canal"][value="whatsapp"]:checked)',
      ) && normalizado.includes('[data-campo="email"]')
    )
  }
  const escondeWhatsapp = (seletor: string) => {
    const normalizado = semEspacos(seletor)
    return (
      normalizado.includes(
        '.lead-form:has([name="canal"][value="email"]:checked)',
      ) && normalizado.includes('[data-campo="whatsapp"]')
    )
  }

  it("o campo de e-mail some quando o canal marcado é WhatsApp, e vice-versa", () => {
    expect(regrasPara(escondeEmail).length).toBeGreaterThan(0)
    expect(valorDe(escondeEmail, "display")).toBe("none")
    expect(regrasPara(escondeWhatsapp).length).toBeGreaterThan(0)
    expect(valorDe(escondeWhatsapp, "display")).toBe("none")
  })

  it("sem canal marcado nenhum dos dois campos some (fallback sem :has())", () => {
    const algumaRegraTocaOsCampos = regrasPara(
      (seletor) =>
        semEspacos(seletor).includes("[data-campo=") &&
        !semEspacos(seletor).includes(":has("),
    )
    expect(algumaRegraTocaOsCampos).toHaveLength(0)
  })
})
