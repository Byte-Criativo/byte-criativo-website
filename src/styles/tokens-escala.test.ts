import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import tokens from "./tokens.json"

const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
)

function temDeclaracao(nome: string, valor: string | number): boolean {
  return css.includes(`${nome}: ${valor};`)
}

function blocoMedia(minWidth: string): string {
  const inicio = css.indexOf(`@media (min-width: ${minWidth})`)
  expect(inicio, `@media (min-width: ${minWidth}) ausente`).toBeGreaterThan(-1)
  return css.slice(inicio, css.indexOf("\n}", inicio))
}

// R52: normaliza espaços (indentação, quebras de linha) antes de comparar
// blocos CSS de mais de uma declaração, para que reformatação não derrube a
// suíte por diferença de indentação sem mudança de significado.
function normalizarEspacos(s: string): string {
  return s.replace(/\s+/g, " ").trim()
}

// R61: o invariante é o VALOR do token, não a grafia. `rgba(0,0,0,.18)` no
// JSON e `rgba(0, 0, 0, 0.18)` depois do prettier são o mesmo valor; uma
// comparação literal faria esta suíte e o `format:check` se excluírem.
function normalizarValor(valor: string): string {
  return valor
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/(^|[^0-9a-z.])\.(\d)/g, (_todo, antes, digito) => {
      return `${antes}0.${digito}`
    })
}

function valorDeclarado(nome: string): string | null {
  return new RegExp(`${nome}\\s*:\\s*([^;]+);`).exec(css)?.[1]?.trim() ?? null
}

describe("globals.css: escala de espaço", () => {
  it.each(Object.entries(tokens.space))(
    "%s vale exatamente o valor de tokens.json",
    (nome, valor) => {
      expect(temDeclaracao(nome, valor)).toBe(true)
    },
  )
})

describe("globals.css: raio, espessura de borda, camadas e foco", () => {
  it.each(Object.entries(tokens.radius))("--radius-%s", (nome, valor) => {
    expect(temDeclaracao(`--radius-${nome}`, valor)).toBe(true)
  })

  it.each(Object.entries(tokens.border))("--border-w-%s", (nome, valor) => {
    expect(temDeclaracao(`--border-w-${nome}`, valor)).toBe(true)
  })

  it.each(Object.entries(tokens.zIndex))("--z-%s", (nome, valor) => {
    expect(temDeclaracao(`--z-${nome}`, valor)).toBe(true)
  })

  it("expõe shadow.overlay pelo valor, não pela grafia (R61)", () => {
    const declarado = valorDeclarado("--shadow-overlay")
    expect(declarado, "--shadow-overlay ausente em globals.css").not.toBeNull()
    expect(normalizarValor(declarado ?? "")).toBe(
      normalizarValor(tokens.shadow.overlay),
    )
  })

  it("expõe focus.width, focus.offset e focus.haloWidth", () => {
    expect(temDeclaracao("--focus-width", tokens.focus.width)).toBe(true)
    expect(temDeclaracao("--focus-offset", tokens.focus.offset)).toBe(true)
    expect(temDeclaracao("--focus-halo-width", tokens.focus.haloWidth)).toBe(
      true,
    )
  })
})

describe("globals.css: grade e medida", () => {
  it("container, margem e medianiz do celular ficam no :root", () => {
    expect(
      temDeclaracao("--grid-container-max", tokens.grid.containerMax),
    ).toBe(true)
    expect(temDeclaracao("--grid-margin", tokens.grid.margin.mobile)).toBe(true)
    expect(temDeclaracao("--grid-gutter", tokens.grid.gutter.mobile)).toBe(true)
    expect(
      temDeclaracao("--medida-max", `${tokens.typography.measureMaxCh}ch`),
    ).toBe(true)
  })

  it("margem e medianiz de tablet entram em md e as de desktop em lg", () => {
    const md = blocoMedia(tokens.breakpoints.md)
    expect(md).toContain(`--grid-margin: ${tokens.grid.margin.tablet};`)
    expect(md).toContain(`--grid-gutter: ${tokens.grid.gutter.tablet};`)

    const lg = blocoMedia(tokens.breakpoints.lg)
    expect(lg).toContain(`--grid-margin: ${tokens.grid.margin.desktop};`)
    expect(lg).toContain(`--grid-gutter: ${tokens.grid.gutter.desktop};`)
  })
})

describe("globals.css: papéis tipográficos como utilitários", () => {
  it.each(Object.entries(tokens.typography.roles))(
    "text-%s traz tamanho, entrelinha, peso e tracking",
    (papel, valores) => {
      expect(temDeclaracao(`--text-${papel}`, valores.size)).toBe(true)
      expect(
        temDeclaracao(`--text-${papel}--line-height`, valores.lineHeight),
      ).toBe(true)
      expect(
        temDeclaracao(`--text-${papel}--font-weight`, valores.weight),
      ).toBe(true)
      expect(
        temDeclaracao(`--text-${papel}--letter-spacing`, valores.tracking),
      ).toBe(true)
    },
  )

  it("--font-mono aponta para a família mono dos tokens", () => {
    expect(css).toContain("--font-mono: var(--ff-mono)")
    expect(css).toContain(`"${tokens.typography.families.mono}"`)
  })
})

describe("globals.css: variantes customizadas", () => {
  it.each([
    ["ponteiro", "@media (hover: hover) and (pointer: fine)"],
    ["js", ":root[data-js] *"],
    ["sem-js", ":root:not([data-js]) *"],
    ["invoker", ":root[data-invoker] *"],
    ["hidratado", ":root[data-hidratado] *"],
  ])("define a variante %s", (nome, alvo) => {
    const linha = css
      .split("\n")
      .find((l) => l.startsWith(`@custom-variant ${nome} `))
    expect(linha, `@custom-variant ${nome} ausente`).toBeDefined()
    expect(linha).toContain(alvo)
  })
})

describe("globals.css: alvos e valores sem token", () => {
  it("declara os alvos da RC3 e o deslocamento do sublinhado", () => {
    expect(temDeclaracao("--alvo-min", "24px")).toBe(true)
    expect(temDeclaracao("--alvo-toque", "44px")).toBe(true)
    expect(temDeclaracao("--desloc-sublinhado", "5px")).toBe(true)
  })
})

describe("globals.css: RC7, o ponto e vírgula é pontuação", () => {
  it("usa --accent a partir de 24 px, --accent-text abaixo e --ink na sala", () => {
    const normalizado = normalizarEspacos(css)
    expect(normalizado).toContain(
      normalizarEspacos(".semicolon { color: var(--accent); }"),
    )
    expect(normalizado).toContain(
      normalizarEspacos(".semicolon-pequeno { color: var(--accent-text); }"),
    )
    expect(css).toMatch(
      /\[data-case\] \.semicolon,\s*\[data-case\] \.semicolon-pequeno \{\s*color: var\(--ink\);/,
    )
  })
})

describe("globals.css: momento orquestrado da sala", () => {
  // M5 (gate B): a fatia precisa parar antes do bloco do FrenteVerso —
  // sem o limite superior, o `opacity: 0` do crossfade de [data-face]
  // satisfazia a asserção do véu por acidente, e a suíte não pegava a
  // regressão de verdade.
  const inicioSala = css.indexOf("/* Sala")
  const inicioFrenteVerso = css.indexOf("/* FrenteVerso")
  const sala = css.slice(inicioSala, inicioFrenteVerso)

  it("a fatia da Sala termina antes do bloco do FrenteVerso", () => {
    expect(inicioSala).toBeGreaterThan(-1)
    expect(inicioFrenteVerso).toBeGreaterThan(inicioSala)
    expect(sala).not.toContain("FrenteVerso")
    expect(sala).not.toContain("[data-face]")
  })

  it("o véu anima só opacity e a obra só transform", () => {
    expect(sala).toMatch(/\.sala::before[\s\S]*opacity: 0;/)
    expect(sala).toMatch(
      /transition:\s*opacity var\(--dur-slow\) var\(--ease-museum\)/,
    )
    expect(sala).toMatch(
      /transition:\s*transform var\(--dur-slow\) var\(--ease-museum\)/,
    )
  })

  it("nada anima cor, largura, altura ou espaçamento", () => {
    expect(sala).not.toContain("transition: background-color")
    expect(sala).not.toMatch(
      /transition:[^;]*\b(width|height|margin|padding|top|left)\b/,
    )
  })

  it("o véu usa --bg (a parede)", () => {
    expect(sala).toContain("background: var(--bg)")
  })

  // M6 (gate B): "var(--room-easel) aparece em algum lugar do arquivo" não
  // prova que o cavalete é desenhado com border (a técnica que sobrevive a
  // cores forçadas) — afirma as duas declarações de borda de verdade.
  it("o cavalete é desenhado com border-w-easel e --room-easel nas duas linhas (sobrevive a cores forçadas)", () => {
    expect(sala).toMatch(
      /\.sala-cavalete\s*\{[^}]*border-top:\s*var\(--border-w-easel\)\s*solid\s*var\(--room-easel\);/,
    )
    expect(sala).toMatch(
      /\.sala-cavalete::after\s*\{[^}]*border-left:\s*var\(--border-w-easel\)\s*solid\s*var\(--room-easel\);/,
    )
  })
})

describe("globals.css: momento orquestrado do FrenteVerso", () => {
  const frenteVerso = css.slice(css.indexOf("/* FrenteVerso"))

  // I4 (gate B): o escopo `:root[data-js]` é o que mantém o verso
  // alcançável sem JS (RC9) — sem ele nada garante que as regras de
  // opacidade/deslocamento só valem depois da hidratação.
  it("a troca de face só vale com JS: as duas regras ficam sob :root[data-js]", () => {
    expect(frenteVerso).toContain(":root[data-js] [data-face] {")
    expect(frenteVerso).toContain(
      ':root[data-js] [data-face][data-ativo="false"] {',
    )
  })

  // M7 (gate B): o catálogo de motion pede crossfade (--ease-in-out) MAIS
  // deslocamento de --space-3 (--ease-museum) — só o crossfade existia.
  it("crossfade em --ease-in-out e deslocamento de --space-3 em --ease-museum", () => {
    expect(frenteVerso).toMatch(
      /transition:[\s\S]*?opacity var\(--dur-base\) var\(--ease-in-out\)/,
    )
    expect(frenteVerso).toMatch(
      /transition:[\s\S]*?transform var\(--dur-base\) var\(--ease-museum\)/,
    )
    expect(frenteVerso).toContain("transform: translateY(0);")
    expect(frenteVerso).toContain("transform: translateY(var(--space-3));")
  })

  it("movimento reduzido zera o deslocamento (troca instantânea, sem deslocamento)", () => {
    const reduzido = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
      css.indexOf("/* Sala"),
    )
    expect(reduzido).toMatch(
      /:root\[data-js\] \[data-face\]\s*\{\s*transform: translateY\(0\);/,
    )
  })

  // I2 (gate B, RC10): bg-ink/text-bg do botão pressionado não é desenhado
  // em forced-colors — a regra precisa mirar exatamente
  // [data-controle-frente-verso] button[aria-pressed="true"] e usar as
  // cores de sistema Highlight/HighlightText, nunca um valor de marca.
  it("RC10: o botão pressionado usa Highlight/HighlightText em forced-colors", () => {
    expect(frenteVerso).toMatch(
      /@media \(forced-colors: active\)\s*\{\s*\[data-controle-frente-verso\] button\[aria-pressed="true"\]\s*\{\s*background-color:\s*Highlight;\s*color:\s*HighlightText;/,
    )
  })
})

describe("globals.css: RC4, foco não obscurecido", () => {
  const moldura = css.slice(css.indexOf("/* SiteHeader"))

  it("a raiz reserva a altura do header no scroll-padding-top", () => {
    expect(css).toMatch(/scroll-padding-top:\s*calc\(/)
  })

  it("o header é fixo por padrão, pela classe de componente", () => {
    expect(moldura).toMatch(
      /\[data-site-header\]\s*\{\s*position: sticky;\s*top: 0;/,
    )
  })

  it("em janela de até 30 rem o header deixa de ser fixo", () => {
    expect(moldura).toContain("@media (max-height: 30rem)")
    expect(moldura).toMatch(/\[data-site-header\]\s*\{\s*position: static;/)
  })

  it("a barra de progresso só existe com suporte e só no template de case", () => {
    expect(moldura).toContain("@supports (animation-timeline: scroll())")
    expect(moldura).toContain(":root:has(article[data-case])")
  })

  it("a barra sai com movimento reduzido", () => {
    expect(moldura).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.progresso-leitura[\s\S]*display: none/,
    )
  })

  it("a barra nasce escondida fora de qualquer condição", () => {
    expect(moldura).toMatch(/\n\.progresso-leitura \{\n\s*display: none;/)
  })
})

describe("globals.css: diálogo modal trava a rolagem sem mover o layout", () => {
  const moldura = css.slice(css.indexOf("/* SiteHeader"))

  it("html:has(dialog[open]) trava a rolagem e reserva a calha da barra", () => {
    expect(moldura).toMatch(
      /html:has\(dialog\[open\]\)\s*\{\s*overflow: hidden;\s*scrollbar-gutter: stable;/,
    )
  })
})

describe("globals.css: IndiceSemicolon", () => {
  const indice = css.slice(css.indexOf("/* IndiceSemicolon"))

  it("o invólucro fica fora do fluxo e não intercepta ponteiro; só o link intercepta", () => {
    expect(indice).toMatch(
      /\.indice-inv\s*\{[\s\S]*?position: absolute;[\s\S]*?pointer-events: none;/,
    )
    expect(indice).toMatch(/\.indice-link\s*\{\s*pointer-events: auto;/)
  })

  it("1.4.1: o item atual muda cor E forma, nunca só cor", () => {
    expect(indice).toMatch(
      /\.indice-link\[aria-current="true"\] \.indice-glifo\s*\{\s*color: var\(--accent\);\s*transform: scale\(/,
    )
  })

  it("RC9: o rótulo é recorte em repouso e só vira visível sob :root[data-js]", () => {
    expect(indice).toMatch(
      /\.indice-rotulo\s*\{[\s\S]*?position: absolute;[\s\S]*?clip-path: inset\(50%\);/,
    )
    expect(indice).toMatch(
      /:root\[data-js\] \.indice-link:hover \.indice-rotulo,\s*:root\[data-js\] \.indice-link:focus-visible \.indice-rotulo\s*\{/,
    )
  })

  it("1.4.13: o Esc devolve o rótulo ao recorte por data-rotulo", () => {
    expect(indice).toMatch(
      /\.indice-link\[data-rotulo="oculto"\] \.indice-rotulo\s*\{[\s\S]*?position: absolute;[\s\S]*?clip-path: inset\(50%\);/,
    )
  })

  it("RC10: em cores forçadas o item atual usa Highlight", () => {
    expect(indice).toMatch(
      /@media \(forced-colors: active\)\s*\{\s*\.indice-link\[aria-current="true"\] \.indice-glifo\s*\{\s*color: Highlight;/,
    )
  })

  it("em janela de até 30 rem a lista solta do sticky", () => {
    expect(indice).toMatch(
      /@media \(max-height: 30rem\)\s*\{\s*\.indice-lista\s*\{\s*position: static;/,
    )
  })
})
