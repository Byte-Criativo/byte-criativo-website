import { useId, type ReactElement, type ReactNode } from "react"
import { cn } from "@/lib/cn"

export function PhoneFrame({
  legenda,
  id,
  className,
  children,
}: {
  legenda: string
  id?: string
  className?: string
  children: ReactNode
}): ReactElement {
  // Ver o comentário equivalente em browser-frame.tsx: RC5 proíbe
  // aria-label sobre elemento com texto visível, então o nome do figure
  // vem do figcaption via aria-labelledby (useId funciona em Server
  // Component, sem precisar de contador em módulo).
  const idLegenda = `${useId()}-legenda`

  return (
    <figure
      id={id}
      aria-labelledby={idLegenda}
      className={cn(
        "rounded-(--radius-phone) border-(length:--border-w-easel) border-solid border-ink bg-bg p-(--space-2)",
        className,
      )}
    >
      {children}
      <figcaption
        id={idLegenda}
        className="px-(--space-2) pt-(--space-2) text-caption text-ink-muted"
      >
        {legenda}
      </figcaption>
    </figure>
  )
}
