import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Grade da arquitetura visual: 4 colunas no celular, 8 no tablet e 12 no
 * desktop. A ordem do DOM é sempre a ordem visual: nenhum consumidor pode
 * usar `order-*` para reordenar leitura (checklist 3.1, item 4).
 */
export function Grid({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section"
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <Tag
      className={cn(
        "grid grid-cols-4 gap-(--grid-gutter) md:grid-cols-8 lg:grid-cols-12",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
