import { test, expect, type Page } from "@playwright/test"
import { deslocamentoDoCabecalho } from "../src/lib/rolagem/ancora"

/**
 * Inércia da roda (src/lib/rolagem). O Lenis só monta com mouse que paira e
 * sem movimento reduzido, depois do `load` e de um ocioso; o sinal de pronto
 * é a classe `lenis` que ele põe no <html>. Nada aqui espera tempo fixo: a
 * rolagem é amostrada quadro a quadro (rAF) e "assentou" é a mesma posição
 * por QUADROS_PARADOS quadros seguidos.
 *
 * A home fica de fora dos testes de roda: sem GPU (Chrome headless usa
 * SwiftShader) o globo fica estático e veta a inércia lá (ver ponte.ts).
 */

/** `window.find` (busca na página por script): fora do padrão, sem tipo. */
type JanelaComBusca = Window & { find?: (texto: string) => boolean }

type JanelaAmostrada = Window & {
  __amostras?: number[]
  __amostrando?: boolean
}

const QUADROS_PARADOS = 20

const projetoDesktop = (nome: string) => nome !== "mobile"

async function esperarInercia(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("lenis"),
  )
}

/**
 * Passa o `load` e um ocioso registrado depois do da ilha (os ociosos
 * rodam em ordem), e espera a rede assentar: se o motor fosse montar, o
 * chunk já teria baixado e a classe já estaria na raiz.
 */
async function passarOcioso(page: Page): Promise<void> {
  await page.waitForLoadState("load")
  await page.evaluate(
    () =>
      new Promise<void>((pronto) => {
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(() => pronto(), { timeout: 2000 })
        } else {
          window.setTimeout(pronto, 500)
        }
      }),
  )
  await page.waitForLoadState("networkidle")
}

async function comecarAmostras(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as JanelaAmostrada
    w.__amostras = []
    w.__amostrando = true
    const passo = () => {
      if (!w.__amostrando) return
      w.__amostras?.push(window.scrollY)
      requestAnimationFrame(passo)
    }
    requestAnimationFrame(passo)
  })
}

/**
 * Espera a página sair do lugar e parar; devolve as amostras. Parar é o
 * Lenis sem a classe `lenis-smooth` (que ele mantém enquanto anima) e a
 * mesma posição por QUADROS_PARADOS quadros: só os quadros parados podem
 * enganar sob carga, no fim da curva.
 */
async function esperarAssentar(page: Page): Promise<number[]> {
  await page.waitForFunction((n) => {
    if (document.documentElement.classList.contains("lenis-smooth")) {
      return false
    }
    const a = (window as JanelaAmostrada).__amostras ?? []
    if (!a.some((y) => y !== a[0])) return false
    const fim = a.slice(-n)
    return fim.length === n && fim.every((y) => y === fim[0])
  }, QUADROS_PARADOS)
  return pararAmostras(page)
}

/** Posição depois de QUADROS_PARADOS quadros sem mudar (sem exigir rolagem). */
async function esperarParado(page: Page): Promise<number> {
  await comecarAmostras(page)
  await page.waitForFunction((n) => {
    const fim = ((window as JanelaAmostrada).__amostras ?? []).slice(-n)
    return fim.length === n && fim.every((y) => y === fim[0])
  }, QUADROS_PARADOS)
  return (await pararAmostras(page)).at(-1) ?? 0
}

/** Espera `n` quadros e devolve as amostras (para "não se moveu"). */
async function esperarQuadros(page: Page, n = 30): Promise<number[]> {
  await page.waitForFunction(
    (q) => ((window as JanelaAmostrada).__amostras?.length ?? 0) >= q,
    n,
  )
  return pararAmostras(page)
}

async function pararAmostras(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const w = window as JanelaAmostrada
    w.__amostrando = false
    return w.__amostras ?? []
  })
}

function naoDecrescente(amostras: number[]): boolean {
  return amostras.every((y, i) => i === 0 || y >= (amostras[i - 1] ?? y))
}

async function rodarNoCentro(page: Page, dx: number, dy: number) {
  const { largura, altura } = await page.evaluate(() => ({
    largura: window.innerWidth,
    altura: window.innerHeight,
  }))
  await page.mouse.move(largura / 2, altura / 2)
  await page.mouse.wheel(dx, dy)
}

test.describe("Rolagem com inércia: onde liga", () => {
  test("CSS suave com JS; com mouse o Lenis monta depois do ocioso e tira o CSS suave", async ({
    page,
  }, info) => {
    await page.goto("/servicos", { waitUntil: "domcontentloaded" })
    const antes = await page.evaluate(() => ({
      lenis: document.documentElement.classList.contains("lenis"),
      comportamento: getComputedStyle(document.documentElement).scrollBehavior,
      atributo: document.documentElement.dataset.scrollBehavior,
    }))
    expect(antes.atributo).toBe("smooth")
    if (!antes.lenis) expect(antes.comportamento).toBe("smooth")

    if (!projetoDesktop(info.project.name)) return
    await esperarInercia(page)
    expect(
      await page.evaluate(() => ({
        versao: (window as Window & { lenisVersion?: string }).lenisVersion,
        comportamento: getComputedStyle(document.documentElement)
          .scrollBehavior,
      })),
    ).toEqual({ versao: "1.3.26", comportamento: "auto" })
  })

  test("celular: o chunk do Lenis nem baixa", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "só no projeto mobile")
    // Os chunks têm hash no nome: procura pelo conteúdo. A leitura do corpo
    // é assíncrona: as promessas ficam guardadas e a asserção espera todas.
    const leituras: Promise<string | null>[] = []
    page.on("response", (resposta) => {
      if (resposta.request().resourceType() !== "script") return
      leituras.push(
        resposta
          .text()
          .then((corpo) =>
            corpo.includes("lenisVersion") ? resposta.url() : null,
          )
          .catch(() => null),
      )
    })
    for (const rota of ["/", "/servicos"]) {
      await page.goto(rota)
      await passarOcioso(page)
      expect(
        await page.evaluate(() => ({
          versao: (window as Window & { lenisVersion?: string }).lenisVersion,
          lenis: document.documentElement.classList.contains("lenis"),
        })),
      ).toEqual({ versao: undefined, lenis: false })
    }
    const scriptsComLenis = (await Promise.all(leituras)).filter(Boolean)
    expect(leituras.length).toBeGreaterThan(0)
    expect(scriptsComLenis).toEqual([])
  })
})

test.describe("Rolagem com inércia: roda do mouse", () => {
  test.beforeEach(({}, info) => {
    test.skip(!projetoDesktop(info.project.name), "inércia só com mouse")
  })

  test("um clique de roda desliza por vários quadros, sempre para baixo, e assenta", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await esperarInercia(page)
    await comecarAmostras(page)
    const t0 = Date.now()
    await rodarNoCentro(page, 0, 100)
    const amostras = await esperarAssentar(page)
    const duracao = Date.now() - t0

    const final = amostras.at(-1) ?? 0
    expect(final).toBeGreaterThan(95)
    expect(final).toBeLessThan(105)
    const intermediarios = new Set(amostras.filter((y) => y > 0 && y < final))
    expect(intermediarios.size).toBeGreaterThanOrEqual(3)
    expect(naoDecrescente(amostras)).toBe(true)
    // Assenta em ~1 s (mais a janela de quadros parados e a folga do CI).
    expect(duracao).toBeLessThan(4000)
  })

  test("movimento reduzido: sem Lenis, a roda move a página nativamente", async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/servicos")
    await passarOcioso(page)
    expect(
      await page.evaluate(() => ({
        lenis: document.documentElement.classList.contains("lenis"),
        versao: (window as Window & { lenisVersion?: string }).lenisVersion,
        comportamento: getComputedStyle(document.documentElement)
          .scrollBehavior,
      })),
    ).toEqual({ lenis: false, versao: undefined, comportamento: "auto" })

    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 100)
    const amostras = await esperarAssentar(page)
    expect(amostras.at(-1)).toBe(100)
    // No Chromium a roda nativa é um degrau só (de 0 direto para 100); o
    // Firefox anima a roda por conta própria (preferência do navegador).
    if (browserName === "chromium") {
      expect(amostras.filter((y) => y > 0 && y < 100)).toEqual([])
    }
  })

  test("PgDn e Espaço rolam; PgDn no meio da inércia não é puxado de volta", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await esperarInercia(page)

    await comecarAmostras(page)
    await page.keyboard.press("PageDown")
    const depoisDoPgDn = (await esperarAssentar(page)).at(-1) ?? 0
    expect(depoisDoPgDn).toBeGreaterThan(0)

    await comecarAmostras(page)
    await page.keyboard.press(" ")
    expect((await esperarAssentar(page)).at(-1) ?? 0).toBeGreaterThan(
      depoisDoPgDn,
    )

    // A rolagem suave do teclado no Chrome não para com um `scrollTo`
    // instantâneo: por isso esperar o Espaço assentar antes de voltar ao topo.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
    expect(await esperarParado(page)).toBe(0)
    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 100)
    // A tecla no meio da inércia (não antes de a roda chegar ao Lenis).
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("lenis-smooth"),
    )
    await page.keyboard.press("PageDown")
    const amostras = await esperarAssentar(page)
    expect(naoDecrescente(amostras)).toBe(true)
    // O PgDn anda quase uma janela: muito além dos 100 px da roda.
    expect(amostras.at(-1) ?? 0).toBeGreaterThan(300)
  })

  // Rolagem nativa no meio da inércia (busca na página, foco, scrollIntoView,
  // scrollTo de outro código): a posição nativa vale, a inércia não puxa de
  // volta para o destino dela. A conferência é depois de assentar, com o alvo
  // na tela (no Firefox a busca rola fora da chamada).
  for (const caso of ["scrollIntoView", "focus", "find"] as const) {
    test(`${caso}() no meio da inércia: a página fica no alvo`, async ({
      page,
    }) => {
      await page.goto("/servicos")
      await esperarInercia(page)
      test.skip(
        caso === "find" &&
          !(await page.evaluate(
            () => typeof (window as JanelaComBusca).find === "function",
          )),
        "sem window.find",
      )
      for (let i = 0; i < 5; i += 1) await rodarNoCentro(page, 0, 100)
      await page.waitForFunction(() =>
        document.documentElement.classList.contains("lenis-smooth"),
      )
      await page.evaluate((c) => {
        const titulos = document.querySelectorAll("main h2")
        const titulo = titulos[titulos.length - 1]
        if (!(titulo instanceof HTMLElement)) throw new Error("sem h2")
        titulo.dataset.alvoTeste = ""
        if (c === "scrollIntoView") {
          titulo.scrollIntoView({ block: "start", behavior: "instant" })
        } else if (c === "focus") {
          const links = document.querySelectorAll<HTMLElement>("main a[href]")
          const link = links[links.length - 1]
          if (!link) throw new Error("sem link")
          delete titulo.dataset.alvoTeste
          link.dataset.alvoTeste = ""
          link.focus()
        } else {
          ;(window as JanelaComBusca).find?.(
            titulo.textContent?.trim().slice(0, 30) ?? "",
          )
        }
      }, caso)
      const final = await esperarParado(page)
      // Bem além do destino da inércia (5 × 100 px), com o alvo na tela.
      expect(final).toBeGreaterThan(1000)
      const caixa = await page.locator("[data-alvo-teste]").boundingBox()
      const altura = page.viewportSize()?.height ?? 0
      expect(caixa?.y ?? -1).toBeGreaterThanOrEqual(0)
      expect((caixa?.y ?? altura) + (caixa?.height ?? 0)).toBeLessThanOrEqual(
        altura,
      )
    })
  }

  test("âncora interrompida pela roda ainda leva o foco ao destino", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await esperarInercia(page)
    await page
      .getByRole("navigation", { name: "Capacidades rápidas" })
      .locator('a[href="#design"]')
      .click()
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("lenis-smooth"),
    )
    await rodarNoCentro(page, 0, 100)
    await esperarParado(page)
    expect(
      await page.evaluate(() => {
        const alvo = document.getElementById("design")
        return {
          foco: document.activeElement === alvo,
          anel: alvo?.matches(":focus-visible"),
        }
      }),
    ).toEqual({ foco: true, anel: false })
  })

  test("roda com Shift e roda horizontal rolam a tabela de /privacidade sem mover a página", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/privacidade")
    await esperarInercia(page)
    const tabela = page.locator("[data-lenis-prevent-horizontal]").first()
    // Hoje as tabelas cabem em qualquer largura (o texto quebra); o
    // invólucro rola na horizontal só quando o conteúdo passa da largura
    // (zoom alto, coluna nova). Força esse caso para exercitar o gesto.
    await tabela.evaluate((el) => {
      const conteudo = el.firstElementChild
      if (conteudo instanceof HTMLElement) conteudo.style.minWidth = "200%"
    })
    expect(await tabela.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(
      true,
    )
    await tabela.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    )
    const caixa = await tabela.boundingBox()
    if (!caixa) throw new Error("tabela sem caixa")
    // O Firefox ainda acerta 1 px depois do `scrollIntoView`.
    const yAntes = await esperarParado(page)

    await page.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2)
    await comecarAmostras(page)
    await page.mouse.wheel(120, 0)
    await expect
      .poll(() => tabela.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0)
    expect(new Set(await esperarQuadros(page))).toEqual(new Set([yAntes]))

    await tabela.evaluate((el) => {
      el.scrollLeft = 0
    })
    await comecarAmostras(page)
    await page.keyboard.down("Shift")
    await page.mouse.wheel(0, 120)
    await page.keyboard.up("Shift")
    await expect
      .poll(() => tabela.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(0)
    expect(new Set(await esperarQuadros(page))).toEqual(new Set([yAntes]))
  })
})

test.describe("Rolagem com inércia: âncoras", () => {
  test.beforeEach(({}, info) => {
    test.skip(!projetoDesktop(info.project.name), "inércia só com mouse")
  })

  for (const janela of [
    { nome: "desktop", width: 1440, height: 900 },
    { nome: "estreita com mouse", width: 390, height: 844 },
    { nome: "baixa (até 30 rem)", width: 1440, height: 450 },
  ]) {
    test(`/servicos, ${janela.nome}: a âncora pousa abaixo do header, sem voltar, e leva o foco`, async ({
      page,
      browserName,
    }) => {
      await page.setViewportSize({ width: janela.width, height: janela.height })
      await page.goto("/servicos")
      await esperarInercia(page)

      await comecarAmostras(page)
      await page
        .getByRole("navigation", { name: "Capacidades rápidas" })
        .locator('a[href="#design"]')
        .click()
      const amostras = await esperarAssentar(page)
      // Nunca "chega e volta": a curva só anda para baixo.
      expect(naoDecrescente(amostras)).toBe(true)
      expect(new Set(amostras).size).toBeGreaterThan(3)

      const pouso = await page.evaluate(() => {
        const alvo = document.getElementById("design")
        if (!alvo) throw new Error("sem #design")
        const raiz = document.documentElement
        return {
          topo: alvo.getBoundingClientRect().top,
          padding: getComputedStyle(raiz).scrollPaddingTop,
          margem: Number.parseFloat(getComputedStyle(alvo).scrollMarginTop),
          noLimite:
            window.scrollY >= raiz.scrollHeight - window.innerHeight - 1,
          hash: window.location.hash,
          foco: document.activeElement === alvo,
          anel: alvo.matches(":focus-visible"),
        }
      })
      const esperado =
        deslocamentoDoCabecalho(pouso.padding) + (pouso.margem || 0)
      if (!pouso.noLimite)
        expect(Math.abs(pouso.topo - esperado)).toBeLessThan(2)
      expect(pouso.hash).toBe("#design")
      expect(pouso.foco).toBe(true)
      // Clique de mouse: sem anel de foco (visual idêntico ao de hoje).
      expect(pouso.anel).toBe(false)

      // O próximo Tab parte do destino, e o tabindex temporário sai. O
      // WebKit usa Option+Tab para incluir links (como nos outros specs).
      await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab")
      expect(
        await page.evaluate(() => {
          const alvo = document.getElementById("design")
          const ativo = document.activeElement
          if (!alvo || !ativo) return null
          return {
            depois:
              alvo.contains(ativo) ||
              Boolean(
                alvo.compareDocumentPosition(ativo) &
                Node.DOCUMENT_POSITION_FOLLOWING,
              ),
            tabindex: alvo.getAttribute("tabindex"),
          }
        }),
      ).toEqual({ depois: true, tabindex: null })
    })
  }

  test("índice de ; na home pousa a sala abaixo do header", async ({
    page,
  }) => {
    await page.goto("/")
    // A home decide entre inércia e nativo pelo globo: com aceleração ele
    // anima e a inércia monta; sem (headless, CI) fica estático e veta.
    // Espera o globo fechar a decisão: estático desde o início, ou animado
    // com o custo dos primeiros quadros já medido (`custoInicial`), que é
    // quando ele ainda poderia cair para o estático e vetar a inércia.
    await page.waitForFunction(
      () => {
        const dados =
          document.querySelector<HTMLCanvasElement>(
            ".home-hero canvas",
          )?.dataset
        return (
          dados?.modo === "estatico" ||
          (dados?.modo === "animado" && dados.custoInicial !== undefined)
        )
      },
      undefined,
      { timeout: 20_000 },
    )
    const estatico = await page.evaluate(
      () =>
        document.querySelector<HTMLCanvasElement>(".home-hero canvas")?.dataset
          .modo === "estatico",
    )
    if (estatico) await passarOcioso(page)
    else await esperarInercia(page)
    const comInercia = await page.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    )
    expect(comInercia).toBe(!estatico)

    // O índice só aparece depois que o hero sai inteiro da tela.
    await page.evaluate(() => {
      const hero = document.querySelector(".home-hero")
      if (!hero) throw new Error("sem hero")
      window.scrollTo({
        top: window.scrollY + hero.getBoundingClientRect().bottom + 10,
        behavior: "instant",
      })
    })
    const link = page.locator('.indice-lista a[href="#forma-de-pensar"]')
    await expect(link).toBeVisible()
    await comecarAmostras(page)
    await link.click()
    const amostras = await esperarAssentar(page)
    expect(naoDecrescente(amostras)).toBe(true)
    const pouso = await page.evaluate(() => {
      const alvo = document.getElementById("forma-de-pensar")
      if (!alvo) throw new Error("sem #forma-de-pensar")
      return {
        topo: alvo.getBoundingClientRect().top,
        padding: getComputedStyle(document.documentElement).scrollPaddingTop,
        margem: Number.parseFloat(getComputedStyle(alvo).scrollMarginTop),
        foco: document.activeElement === alvo,
        hash: window.location.hash,
      }
    })
    expect(
      Math.abs(
        pouso.topo -
          deslocamentoDoCabecalho(pouso.padding) -
          (pouso.margem || 0),
      ),
    ).toBeLessThan(2)
    expect(pouso.hash).toBe("#forma-de-pensar")
    // O foco vai junto só com a inércia; no nativo, o fragmento move o
    // ponto de partida do Tab, como hoje.
    if (comInercia) expect(pouso.foco).toBe(true)
  })
})

test.describe("Rolagem com inércia: diálogos e troca de rota", () => {
  test.beforeEach(({}, info) => {
    test.skip(!projetoDesktop(info.project.name), "inércia só com mouse")
  })

  test("menu aberto: a roda não move a página; fechado, volta a deslizar", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/servicos")
    await esperarInercia(page)
    await page.getByRole("button", { name: "Menu", exact: true }).click()
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible()
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("lenis-stopped"),
    )

    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 300)
    expect(new Set(await esperarQuadros(page))).toEqual(new Set([0]))

    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden()
    await page.waitForFunction(
      () => !document.documentElement.classList.contains("lenis-stopped"),
    )
    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 100)
    const amostras = await esperarAssentar(page)
    expect(amostras.at(-1) ?? 0).toBeGreaterThan(95)
    expect(
      new Set(amostras.filter((y) => y > 0 && y < 95)).size,
    ).toBeGreaterThan(2)
  })

  test("galeria aberta: a roda não move a página", async ({ page }) => {
    await page.goto("/portfolio/underground-pb")
    await esperarInercia(page)
    await page
      .getByRole("button", { name: /Ampliar imagem:/ })
      .first()
      .click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("lenis-stopped"),
    )
    const y = await page.evaluate(() => window.scrollY)
    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 300)
    expect(new Set(await esperarQuadros(page))).toEqual(new Set([y]))
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toBeHidden()
  })

  test("galeria aberta e Voltar do navegador: a roda volta a deslizar", async ({
    page,
  }) => {
    await page.goto("/portfolio")
    await esperarInercia(page)
    await page
      .getByRole("link", { name: "Ver estudo de caso do Underground PB" })
      .click()
    await expect(page).toHaveURL(/\/portfolio\/underground-pb$/)
    await page
      .getByRole("button", { name: /Ampliar imagem:/ })
      .first()
      .click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.waitForFunction(() =>
      document.documentElement.classList.contains("lenis-stopped"),
    )
    // O diálogo sai do DOM aberto, sem `close()`.
    await page.goBack()
    await expect(page).toHaveURL(/\/portfolio$/)
    await page.waitForFunction(
      () => !document.documentElement.classList.contains("lenis-stopped"),
    )
    const y = await esperarParado(page)
    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 100)
    const amostras = await esperarAssentar(page)
    expect(amostras.at(-1) ?? 0).toBeGreaterThan(y + 95)
  })

  test("troca de rota: chega no topo e a próxima roda parte do topo", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await esperarInercia(page)
    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 300)
    const longe = (await esperarAssentar(page)).at(-1) ?? 0
    expect(longe).toBeGreaterThan(250)

    await page
      .getByRole("banner")
      .getByRole("link", { name: "Projetos", exact: true })
      .click()
    await expect(page).toHaveURL(/\/portfolio$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

    await comecarAmostras(page)
    await rodarNoCentro(page, 0, 100)
    const amostras = await esperarAssentar(page)
    expect(naoDecrescente(amostras)).toBe(true)
    expect(amostras.at(-1) ?? 0).toBeGreaterThan(95)
    expect(Math.max(...amostras)).toBeLessThan(105)
  })

  test("troca de rota no meio da inércia: fica no topo, sem puxão de volta", async ({
    page,
  }) => {
    await page.goto("/servicos")
    await esperarInercia(page)
    await rodarNoCentro(page, 0, 600)
    await page
      .getByRole("banner")
      .getByRole("link", { name: "Projetos", exact: true })
      .click()
    await expect(page).toHaveURL(/\/portfolio$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await comecarAmostras(page)
    expect(new Set(await esperarQuadros(page))).toEqual(new Set([0]))
  })
})
