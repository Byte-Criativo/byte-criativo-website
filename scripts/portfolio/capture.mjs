// scripts/portfolio/capture.mjs
// Uso: node scripts/portfolio/capture.mjs <slug> <url> [<url>...]
//
// Para cada URL x viewport, salva uma captura de viewport e uma de página
// inteira (sufixo "-full"), rolando a página até o fim antes da captura
// full-page para disparar imagens com lazy-load.
import { chromium } from "@playwright/test"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const [slug, ...urls] = process.argv.slice(2)
if (!slug || urls.length === 0) {
  console.error(
    "Uso: node scripts/portfolio/capture.mjs <slug> <url> [<url>...]",
  )
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const outDir = path.join(
  "docs",
  "research",
  "captures",
  `${today.slice(0, 7)}-${slug}`,
)
const viewports = [
  { name: "1440", width: 1440, height: 900, dpr: 2, isMobile: false },
  { name: "390", width: 390, height: 844, dpr: 3, isMobile: true },
]

// Seletores comuns de botões de banners de cookie/consentimento. Nenhum
// banner foi encontrado no site do Alumiô durante o reconhecimento, mas o
// dismiss fica aqui para não perder a captura caso um apareça (ex.: por
// geolocalização ou A/B test). isVisible() não espera, então checar todos
// os seletores é praticamente instantâneo quando não há banner.
const consentSelectors = [
  'button:has-text("Aceitar")',
  'button:has-text("Aceito")',
  'button:has-text("Concordo")',
  'button:has-text("Rejeitar")',
  'button:has-text("Recusar")',
  'button:has-text("Fechar")',
  '[aria-label="Fechar"]',
  "#onetrust-accept-btn-handler",
]

async function dismissConsentBanner(page) {
  for (const selector of consentSelectors) {
    const button = page.locator(selector).first()
    if (await button.isVisible().catch(() => false)) {
      await button.click({ timeout: 1000 }).catch(() => {})
      console.log(`  banner de consentimento fechado via "${selector}"`)
      await page.waitForTimeout(300)
      return true
    }
  }
  return false
}

async function scrollToBottomInSteps(page) {
  // A altura alvo é lida uma única vez, antes de rolar. Em algumas páginas
  // (ex.: /circuito), rolar dispara carregamento de mais itens e
  // document.documentElement.scrollHeight cresce a cada passo; reler o
  // alvo a cada iteração faz o loop perseguir uma meta que nunca para e
  // duplica seções inteiras na captura. Fixando o alvo no início, ainda
  // disparamos o lazy-load das imagens da página original sem essa fuga.
  const step = 600
  const targetHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  )
  const maxSteps = Math.ceil(targetHeight / step) + 2
  for (let i = 0; i < maxSteps; i++) {
    const scrollBottom = await page.evaluate((y) => {
      window.scrollBy(0, y)
      return window.scrollY + window.innerHeight
    }, step)
    await page.waitForTimeout(200)
    if (scrollBottom >= targetHeight) break
  }
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {})
  await page.waitForTimeout(500)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ channel: "chrome", headless: true })
const manifest = []
const failures = []

try {
  for (const url of urls) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
        locale: "pt-BR",
        timezoneId: "America/Fortaleza",
        reducedMotion: "reduce",
        colorScheme: "light",
      })
      try {
        const page = await context.newPage()
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(1500)
        await dismissConsentBanner(page)

        const pagePath = new URL(url).pathname.replace(/\/$/, "") || "/home"
        const base = pagePath.slice(1).replace(/\//g, "_")

        const file = `${base}-${vp.name}.png`
        await page.screenshot({ path: path.join(outDir, file) })
        manifest.push({
          file,
          url,
          viewport: `${vp.width}x${vp.height}`,
          dpr: vp.dpr,
          theme: "light",
          capturedAt: new Date().toISOString(),
          fullPage: false,
        })

        await scrollToBottomInSteps(page)
        const fullFile = `${base}-${vp.name}-full.png`
        // scale: "css" mantém a captura em pixels CSS (não multiplicados pelo
        // dpr). Sem isso, páginas altas em viewport mobile (dpr 3) passam do
        // limite de textura do Chromium (~16384px) e o PNG sai com blocos de
        // conteúdo corrompidos/repetidos. Como o arquivo sai em 1 px por
        // px CSS, a densidade real dessa captura é sempre 1x.
        await page.screenshot({
          path: path.join(outDir, fullFile),
          fullPage: true,
          scale: "css",
        })
        manifest.push({
          file: fullFile,
          url,
          viewport: `${vp.width}x${vp.height}`,
          dpr: 1,
          theme: "light",
          capturedAt: new Date().toISOString(),
          fullPage: true,
        })
      } catch (error) {
        failures.push({
          url,
          viewport: `${vp.width}x${vp.height}`,
          error: error.message,
        })
      } finally {
        await context.close()
      }
    }
  }
} finally {
  await browser.close()
}

await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
)
console.log(`${manifest.length} capturas em ${outDir}`)

if (failures.length > 0) {
  console.error(`${failures.length} falha(s) de captura:`)
  for (const failure of failures) {
    console.error(`  ${failure.url} (${failure.viewport}): ${failure.error}`)
  }
  process.exit(1)
}
