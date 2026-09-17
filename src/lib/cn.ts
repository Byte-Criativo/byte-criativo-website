import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Junta classes condicionais (clsx) e resolve conflitos de utilitário
 * Tailwind (tailwind-merge): a última classe do mesmo grupo vence, o que
 * permite a um consumidor sobrescrever o padrão de um componente pela prop
 * `className` sem precisar de `!important` nem de ordem de import.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
