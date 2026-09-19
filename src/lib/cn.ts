import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
// Papéis tipográficos definidos em tokens.json. Mantidos aqui como constante
// estática para não empacotar os 24 KB de tokens.json nos bundles de cliente.
// O teste src/lib/cn.test.ts garante sincronia com tokens.json.
export const TYPOGRAPHY_ROLES = [
  "display",
  "h1",
  "h2",
  "h3",
  "body",
  "lede",
  "caption",
  "label",
  "manifesto",
  "code",
] as const

// Sem esta extensão, o tailwind-merge de fábrica não reconhece os papéis
// tipográficos de tokens.json (`text-h1`, `text-body`...) como uma escala de
// tamanho de fonte: como o sufixo não bate com nenhuma palavra-chave nem
// comprimento conhecidos, ele cai no grupo de cor de texto (que aceita
// qualquer palavra, para suportar paletas customizadas) e passa a
// "conflitar" com classes de cor como `text-ink`/`text-ink-muted` — a
// última das duas apagaria a outra em vez de as duas conviverem. Registrar
// os nomes dos papéis na escala `text` do tema resolve a ambiguidade.
const twMergeCustom = extendTailwindMerge({
  extend: {
    theme: {
      text: [...TYPOGRAPHY_ROLES],
    },
  },
})

/**
 * Junta classes condicionais (clsx) e resolve conflitos de utilitário
 * Tailwind (tailwind-merge): a última classe do mesmo grupo vence, o que
 * permite a um consumidor sobrescrever o padrão de um componente pela prop
 * `className` sem precisar de `!important` nem de ordem de import.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMergeCustom(clsx(inputs))
}
