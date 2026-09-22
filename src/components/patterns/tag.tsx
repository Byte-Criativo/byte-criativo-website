import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Item de capacidade observada no site no ar. Não é filtro, link nem botão:
 * a borda não pode parecer botão (sem altura de alvo, sem peso 600, sem
 * sombra) e o item nunca entra na ordem de Tab. Depende de
 * `--border-control`, que a sala não reescreve: nunca fica sobre a
 * superfície de uma sala (RC6).
 */
export function Tag({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <li
      className={cn(
        "rounded-(--radius-tag) border-(length:--border-w-decorative) border-solid border-border-control px-(--space-2) py-(--space-1) text-caption text-ink",
        className,
      )}
    >
      {children}
    </li>
  )
}

export function TagList({
  itens,
  rotulo = "Capacidades",
  className,
}: {
  itens: string[]
  rotulo?: string
  className?: string
}): ReactElement {
  return (
    <ul
      aria-label={rotulo}
      className={cn("flex flex-wrap gap-(--space-2)", className)}
    >
      {itens.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </ul>
  )
}
