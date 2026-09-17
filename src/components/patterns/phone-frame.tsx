import type { ReactElement, ReactNode } from "react"
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
  return (
    <figure
      id={id}
      // Ver o comentário equivalente em browser-frame.tsx: aria-label
      // repete a legenda visível porque a naming rule do figure via
      // figcaption (HTML-AAM) não tem suporte garantido, e PhoneFrame é
      // Server Component (sem hooks para gerar id estável para
      // aria-labelledby).
      aria-label={legenda}
      className={cn(
        "rounded-(--radius-phone) border-(length:--border-w-easel) border-solid border-ink bg-bg p-(--space-2)",
        className,
      )}
    >
      {children}
      <figcaption className="px-(--space-2) pt-(--space-2) text-caption text-ink-muted">
        {legenda}
      </figcaption>
    </figure>
  )
}
