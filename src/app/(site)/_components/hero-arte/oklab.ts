/**
 * Conversão de cor CSS (hex) para OKLab, no cliente. O shader recebe as
 * cores já em OKLab e mistura nesse espaço, convertendo para sRGB uma única
 * vez por pixel — assim os gradientes não ficam lamacentos no meio.
 */

export type Oklab = [number, number, number]

function canalLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function hexParaOklab(hex: string): Oklab {
  const limpo = hex.trim().replace("#", "")
  const cheio =
    limpo.length === 3
      ? limpo
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : limpo
  const n = Number.parseInt(cheio, 16)
  if (cheio.length !== 6 || Number.isNaN(n)) {
    throw new Error(`cor inválida para o shader: "${hex}"`)
  }
  const r = canalLinear(((n >> 16) & 255) / 255)
  const g = canalLinear(((n >> 8) & 255) / 255)
  const b = canalLinear((n & 255) / 255)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

/** Lê uma variável CSS da raiz e devolve a cor em OKLab. */
export function variavelParaOklab(nome: string, reserva: string): Oklab {
  const valor = getComputedStyle(document.documentElement)
    .getPropertyValue(nome)
    .trim()
  return hexParaOklab(valor || reserva)
}
