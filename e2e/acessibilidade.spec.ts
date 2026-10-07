import { AxeBuilder } from "@axe-core/playwright"
import { test, expect } from "@playwright/test"
import { contrastRatio } from "../src/lib/contrast"
import { esperarAnimacoes } from "./esperar-animacoes"

// Tags do contrato de acessibilidade da Fase 6: WCAG 2.0 e 2.1 nível A/AA,
// mais WCAG 2.2 AA (owasp/best-practice ficam fora de propósito, para não
// travar o CI com regras sem consenso).
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

test.describe("Acessibilidade", () => {
  test("home não tem violações axe serious/critical", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" })
    await esperarAnimacoes(page)

    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()

    const seriousOrCritical = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    )

    if (seriousOrCritical.length > 0) {
      const details = seriousOrCritical
        .map((violation) => {
          const selectors = violation.nodes
            .map((node) => node.target.join(" "))
            .join(", ")
          return `- ${violation.id} (${violation.impact}): ${selectors}`
        })
        .join("\n")
      throw new Error(`Violações axe serious/critical na home:\n${details}`)
    }

    expect(seriousOrCritical).toEqual([])
  })

  // O verso nasce oculto (visibility: hidden), então a varredura acima nunca
  // o vê. E mesmo à mostra o axe não decide: o véu da sala (.sala::before) é
  // um pseudo-elemento sobre o fundo e o color-contrast sai "incompleto". Por
  // isso a medida é feita aqui: a cor computada de cada texto do verso contra
  // o fundo opaco da face.
  test("o texto do Verso das salas tem contraste AA sobre o fundo do verso", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" })
    await esperarAnimacoes(page)

    const botoes = await page.getByRole("button", { name: "Verso" }).all()
    for (const botao of botoes) await botao.click()
    // A face só conta depois do crossfade, quando já está opaca.
    await page.waitForFunction((total) => {
      const faces = [
        ...document.querySelectorAll<HTMLElement>(
          '[data-face="verso"][data-ativo="true"]',
        ),
      ]
      return (
        faces.length === total &&
        faces.every((face) => getComputedStyle(face).opacity === "1")
      )
    }, botoes.length)

    const textos = await page.evaluate(() => {
      const saida: Array<{ texto: string; cor: string; fundo: string }> = []
      for (const face of document.querySelectorAll('[data-face="verso"]')) {
        const fundo = getComputedStyle(face).backgroundColor
        const passos = document.createTreeWalker(face, NodeFilter.SHOW_TEXT)
        for (let no = passos.nextNode(); no; no = passos.nextNode()) {
          const texto = no.textContent?.trim()
          if (!texto || !no.parentElement) continue
          saida.push({
            texto: texto.slice(0, 40),
            cor: getComputedStyle(no.parentElement).color,
            fundo,
          })
        }
      }
      return saida
    })

    const paraHex = (rgb: string) =>
      `#${(rgb.match(/\d+/g) ?? [])
        .slice(0, 3)
        .map((canal) => Number(canal).toString(16).padStart(2, "0"))
        .join("")}`
    const reprovados = textos
      .map((t) => ({
        ...t,
        razao: contrastRatio(paraHex(t.cor), paraHex(t.fundo)),
      }))
      .filter((t) => t.razao < 4.5)
      .map(
        (t) => `${t.texto} (${t.cor} sobre ${t.fundo}: ${t.razao.toFixed(2)})`,
      )

    expect(textos.length).toBeGreaterThan(0)
    // A conta acima ignora o canal alfa: só vale com cores opacas.
    expect(
      textos.filter((t) => /rgba/.test(t.cor) || /rgba/.test(t.fundo)),
    ).toEqual([])
    expect(reprovados).toEqual([])
  })
})
