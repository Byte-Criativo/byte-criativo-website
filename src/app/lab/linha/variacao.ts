/** Variações do protótipo, escolhidas por `?v=`. Módulo sem "use client"
 * para poder ser usado pela página (servidor) e pela cena (cliente). */
export type Variacao = "base" | "contida" | "ousada"

export const VARIACOES: Variacao[] = ["base", "contida", "ousada"]

export function variacaoValida(valor: unknown): valor is Variacao {
  return typeof valor === "string" && (VARIACOES as string[]).includes(valor)
}
