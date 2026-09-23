// Produz apenas candidatos locais. Sem cópia para public/, commit ou publicação.
// Uso: node scripts/portfolio/refresh.mjs [--dry-run] [carlos-ferrer|goromax|underground-pb|festival-alumio]
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const projects = {
  "carlos-ferrer": [
    "https://www.carlosferrer.online/",
    "https://www.carlosferrer.online/1997",
  ],
  goromax: [
    "https://www.goromax.com.br/",
    "https://www.goromax.com.br/imprensa",
  ],
  "underground-pb": [
    "https://www.undergroundpb.com.br/",
    "https://www.undergroundpb.com.br/agenda/",
    "https://www.undergroundpb.com.br/palcos/",
  ],
  "festival-alumio": [
    "https://www.festivalalumio.com.br/",
    "https://www.festivalalumio.com.br/programacao",
    "https://www.festivalalumio.com.br/circuito",
  ],
}
const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const selected = args.filter((arg) => arg !== "--dry-run")
if (selected.some((slug) => !Object.hasOwn(projects, slug))) {
  console.error(`Projetos válidos: ${Object.keys(projects).join(", ")}`)
  process.exit(1)
}
const requestedFullPage = process.env.CASE_CAPTURE_FULL_PAGE ?? "true"
if (!["true", "false"].includes(requestedFullPage)) {
  console.error("CASE_CAPTURE_FULL_PAGE deve ser true ou false")
  process.exit(1)
}
const entries = selected.length ? [...new Set(selected)] : Object.keys(projects)
const script = fileURLToPath(new URL("./capture.mjs", import.meta.url))
let failed = false
for (const slug of entries) {
  const fullPage = slug === "carlos-ferrer" ? "false" : requestedFullPage
  console.log(`${slug} (fullPage=${fullPage}): ${projects[slug].join(", ")}`)
  if (dryRun) continue
  const result = spawnSync(
    process.execPath,
    [script, slug, ...projects[slug]],
    {
      stdio: "inherit",
      // O site pessoal inclui contato ao fim da página. Nunca capturá-lo
      // inteiro nesta rotina, mesmo se a variável global solicitar full-page.
      env: { ...process.env, CASE_CAPTURE_FULL_PAGE: fullPage },
    },
  )
  if (result.error || result.status !== 0) {
    failed = true
    console.error(
      `Falha em ${slug}; revisar o relatório antes de reutilizar capturas.`,
    )
  }
}
if (failed) process.exitCode = 1
