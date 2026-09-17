import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export type EspacoPasso = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Classes literais: o Tailwind lê o código-fonte, então `gap-(--space-${n})`
// interpolado não seria encontrado pelo scanner.
const ESPACO_CLASSE: Record<EspacoPasso, string> = {
  1: "gap-(--space-1)",
  2: "gap-(--space-2)",
  3: "gap-(--space-3)",
  4: "gap-(--space-4)",
  5: "gap-(--space-5)",
  6: "gap-(--space-6)",
  7: "gap-(--space-7)",
  8: "gap-(--space-8)",
  9: "gap-(--space-9)",
  10: "gap-(--space-10)",
}

export function Stack({
  as: Tag = "div",
  espaco = 4,
  rotulo,
  className,
  children,
}: {
  as?: "div" | "ul" | "ol"
  espaco?: EspacoPasso
  rotulo?: string
  className?: string
  children: ReactNode
}): ReactElement {
  const ehLista = Tag === "ul" || Tag === "ol"
  return (
    <Tag
      aria-label={ehLista ? rotulo : undefined}
      className={cn("flex flex-col", ESPACO_CLASSE[espaco], className)}
    >
      {children}
    </Tag>
  )
}
