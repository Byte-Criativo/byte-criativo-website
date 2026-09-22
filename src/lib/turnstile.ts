import "server-only"

const ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const ACTION = "lead_form"

/** Fail closed: no secret, missing token, expired token, or provider error. */
export async function verificarTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret || !token || token.length > 2048) return false

  try {
    const resposta = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    })
    if (!resposta.ok) return false
    const dados: unknown = await resposta.json()
    if (!dados || typeof dados !== "object") return false
    const validacao = dados as { success?: unknown; action?: unknown }
    return validacao.success === true && validacao.action === ACTION
  } catch {
    return false
  }
}
