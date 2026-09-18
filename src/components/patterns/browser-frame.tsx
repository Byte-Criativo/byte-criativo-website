import { useId, type ReactElement, type ReactNode } from "react"
import { cn } from "@/lib/cn"

/**
 * Moldura de navegador em CSS puro: barra com o domínio real do projeto
 * (decorativa, porque a legenda repete a informação) e legenda visível que
 * diz o ponto da tela, o domínio e a data da captura.
 */
export function BrowserFrame({
  dominio,
  legenda,
  id,
  className,
  children,
}: {
  dominio: string
  legenda: string
  id?: string
  className?: string
  children: ReactNode
}): ReactElement {
  // RC5 proíbe aria-label sobre elemento com texto visível (a legenda É
  // visível): o nome do figure precisa vir do próprio figcaption.
  // useId() funciona em Server Component (não depende de estado/efeito) e
  // dá um id estável por posição na árvore, sem contador em módulo (que
  // vazaria entre requisições concorrentes).
  const idLegenda = `${useId()}-legenda`

  return (
    <figure
      id={id}
      aria-labelledby={idLegenda}
      className={cn(
        "overflow-hidden rounded-(--radius-media) border-(length:--border-w-decorative) border-solid border-border-decorative",
        className,
      )}
    >
      <div
        data-barra
        aria-hidden="true"
        className="flex min-h-(--space-6) items-center border-b-(length:--border-w-decorative) border-solid border-border-decorative bg-bg px-(--space-3) py-(--space-2) text-caption text-ink-muted"
      >
        <span className="break-all">{dominio}</span>
      </div>
      {children}
      <figcaption
        id={idLegenda}
        className="bg-bg px-(--space-3) py-(--space-2) text-caption text-ink-muted"
      >
        {legenda}
      </figcaption>
    </figure>
  )
}
