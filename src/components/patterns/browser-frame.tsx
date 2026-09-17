import type { ReactElement, ReactNode } from "react"
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
  return (
    <figure
      id={id}
      // A regra do HTML-AAM que deriva o nome do figure do figcaption tem
      // suporte inconsistente entre bibliotecas de nome acessível (inclusive
      // dom-accessibility-api, usada pelo Testing Library). aria-label
      // repete a legenda visível para o nome ficar determinístico sem
      // depender de um id gerado (BrowserFrame é Server Component: sem
      // hooks para gerar id estável).
      aria-label={legenda}
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
      <figcaption className="bg-bg px-(--space-3) py-(--space-2) text-caption text-ink-muted">
        {legenda}
      </figcaption>
    </figure>
  )
}
