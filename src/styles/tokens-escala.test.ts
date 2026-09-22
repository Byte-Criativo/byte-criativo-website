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

/**
 * Corpos balanceados de toda at-rule cujo cabeçalho é exatamente `cabecalho`.
 * Existe para afirmar "X vive dentro de Y" sem `[\s\S]*`: um regex frouxo
 * atravessa blocos e fica verde contra o defeito que nomeia (achado I5 do
 * gate B, mesma família do M5 da L3).
 */
function corposDaAtRule(cabecalho: string): string[] {
  const re = new RegExp(
    `${cabecalho.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`,
    "g",
  )
  const corpos: string[] = []
  let achado: RegExpExecArray | null
  while ((achado = re.exec(css)) !== null) {
    const inicio = achado.index + achado[0].length - 1
    let profundidade = 0
    for (let i = inicio; i < css.length; i += 1) {
      if (css[i] === "{") profundidade += 1
      else if (css[i] === "}") {
        profundidade -= 1
        if (profundidade === 0) {
          corpos.push(css.slice(inicio + 1, i))
          break
        }
      }
    }
  }
  return corpos
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
    // RC9: `invoker` exige as DUAS marcas. O cão de guarda de 4 s remove só
    // `data-js` e nunca `data-invoker`; sem `[data-js]` no seletor, uma
    // hidratação que falhou num navegador com Invoker Commands deixaria o
    // botão do menu na tela e o link "Menu" do rodapé escondido.
    ["invoker", ":root[data-js][data-invoker] *"],
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

  // I5: o escopo ao template de case é afirmado DENTRO do corpo do
  // @supports. Um `toContain` sobre a fatia inteira ficava verde com o
  // prefixo apagado, porque a mesma string sobrevive no bloco de movimento
  // reduzido — e a barra passaria a aparecer em todas as páginas.
  it("a barra de progresso só existe com suporte e só no template de case", () => {
    const suporte = corposDaAtRule("@supports (animation-timeline: scroll())")
    expect(suporte).toHaveLength(1)
    expect(suporte[0]).toMatch(
      /:root:has\(article\[data-case\]\) \.progresso-leitura \{[^}]*display: block;/,
    )
  })

  // I5: os dois seletores são obrigatórios — só `.progresso-leitura` perde em
  // especificidade para a regra do @supports e a barra continuaria animando.
  // A asserção fica presa a um corpo de declaração (`[^}]*`), senão casa
  // atravessando blocos e fica verde contra esse defeito exato.
  it("a barra sai com movimento reduzido, pelos dois seletores", () => {
    const reduzido = corposDaAtRule("@media (prefers-reduced-motion: reduce)")
    expect(
      reduzido.some((corpo) =>
        /\.progresso-leitura,\s*:root:has\(article\[data-case\]\) \.progresso-leitura \{[^}]*display: none;/.test(
          corpo,
        ),
      ),
      "nenhum bloco de movimento reduzido remove a barra pelos dois seletores",
    ).toBe(true)
  })

  it("a barra nasce escondida fora de qualquer condição", () => {
    expect(moldura).toMatch(/\n\.progresso-leitura \{\n\s*display: none;/)
  })

  // m1: com o header `static` em janela baixa não há ancestral posicionado, e
  // a barra absoluta caía no bloco contendo inicial — medido em Chrome real,
  // ela ia parar no fim da primeira tela, fora do header.
  it("em janela baixa a barra volta ao fluxo, dentro da caixa do header", () => {
    const baixas = corposDaAtRule("@media (max-height: 30rem)")
    expect(
      baixas.some((corpo) =>
        /:root:has\(article\[data-case\]\) \.progresso-leitura \{[^}]*position: static;/.test(
          corpo,
        ),
      ),
      "nenhum bloco de janela baixa devolve a barra ao fluxo",
    ).toBe(true)
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

  // I8/RC7: o glifo em 1,5 rem = 24 px é justamente o piso que autoriza
  // --accent no estado atual. Abaixo disso o laranja cheio deixaria de ser
  // permitido e a regra do item atual viraria uma violação silenciosa.
  it("RC7: o glifo fica no piso de 24 px que autoriza --accent", () => {
    expect(indice).toMatch(
      /\.indice-glifo \{[^}]*color: var\(--mark-rest\);[^}]*font-size: 1\.5rem;/,
    )
  })

  it("1.4.1: o item atual muda cor E forma, nunca só cor", () => {
    expect(indice).toMatch(
      /\.indice-link\[aria-current="true"\] \.indice-glifo\s*\{\s*color: var\(--accent\);\s*transform: scale\(/,
    )
  })

  // I5: a asserção do recorte fica presa ao corpo da própria `.indice-rotulo`
  // (`[^}]*`). Com `[\s\S]*?` ela alcançava o bloco [data-rotulo="oculto"] lá
  // embaixo e ficava verde depois de apagar o recorte — o rótulo passaria a
  // ficar visível sempre, inclusive sem JS.
  it("RC9: o rótulo é recorte em repouso e só vira visível sob :root[data-js]", () => {
    expect(indice).toMatch(
      /\n  \.indice-rotulo \{[^}]*position: absolute;[^}]*clip-path: inset\(50%\);[^}]*\}/,
    )
    expect(indice).toMatch(
      /:root\[data-js\] \.indice-link:focus-visible \.indice-rotulo\s*\{/,
    )
  })

  // I4 / RC2: o hover do rótulo era o único `:hover` cru da folha inteira. Em
  // aparelho de toque a partir de 64 rem o rótulo abria no toque e ficava
  // grudado, sem jeito de fechar.
  it("RC2: o rótulo só abre no hover com ponteiro fino", () => {
    const ponteiro = corposDaAtRule("@media (hover: hover) and (pointer: fine)")
    expect(
      ponteiro.some((corpo) =>
        corpo.includes(":root[data-js] .indice-link:hover .indice-rotulo"),
      ),
      "o hover do rótulo do índice não está dentro do @media de ponteiro fino",
    ).toBe(true)
  })

  it("RC2: nenhum :hover de globals.css vive fora do @media de ponteiro fino", () => {
    const dentro = corposDaAtRule(
      "@media (hover: hover) and (pointer: fine)",
    ).join("\n")
    const total = (css.match(/:hover/g) ?? []).length
    expect(total, "varredura vazia: não haveria o que provar").toBeGreaterThan(
      0,
    )
    expect((dentro.match(/:hover/g) ?? []).length).toBe(total)
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

describe("globals.css: SiteFooter", () => {
  // m4: o papel h3 passa de 24 px a partir de breakpoints.xl (--text-h3
  // chega a 25,3 px em 80 rem), e aí a RC7 autoriza o laranja cheio no `;`
  // da tagline. Abaixo disso continua --accent-text.
  it("RC7: o `;` da tagline vira --accent a partir de breakpoints.xl", () => {
    const xl = corposDaAtRule(`@media (min-width: ${tokens.breakpoints.xl})`)
    expect(
      xl.some((corpo) =>
        /\.rodape-tagline \.semicolon-pequeno \{[^}]*color: var\(--accent\);/.test(
          corpo,
        ),
      ),
      "nenhum bloco de breakpoints.xl leva o `;` da tagline do rodapé a --accent",
    ).toBe(true)
  })
})
