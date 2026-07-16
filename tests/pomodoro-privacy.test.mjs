import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const html = readFileSync(
  ".next/server/pages/pomodoro/privacidade.html",
  "utf8",
)

test("publica a politica de privacidade do Pomodoro", () => {
  assert.match(html, /<h1>Política de Privacidade<\/h1>/)
  assert.match(html, /não coleta, transmite, vende nem compartilha/)
  assert.match(html, /O app não contém SDKs de anúncios/)
})

test("expõe metadados próprios para a política", () => {
  assert.match(
    html,
    /<title data-next-head="">Política de Privacidade do Pomodoro \| Byte Criativo<\/title>/,
  )
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/www\.bytecriativotech\.com\.br\/pomodoro\/privacidade"/,
  )
})
