import type { ReactElement } from "react"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

export type NivelTrilha = { rotulo: string; href?: string }

/**
 * Trilha visível só em rota de profundidade 2 (o JSON-LD `BreadcrumbList` é
 * gerado pela rota, independente deste componente). Fica na parede, acima do
 * CaseHero ou do H1 do serviço.
 *
 * O último nível nunca é link: é texto com `aria-current="page"`. O separador
 * é pontuação visual e sai da leitura, fora de qualquer link.
 */
export function Breadcrumbs({
  trilha,
  className,
}: {
  trilha: NivelTrilha[]
  className?: string
}): ReactElement {
  return (
    <nav
      aria-label="Caminho da página"
      className={cn("text-caption text-ink-muted", className)}
    >
      <ol className="flex flex-wrap items-center gap-(--space-2)">
        {trilha.map((nivel, indice) => (
          <li key={nivel.rotulo} className="flex items-center gap-(--space-2)">
            {indice > 0 ? (
              <span data-separador aria-hidden="true">
                ›
              </span>
            ) : null}
            {nivel.href ? (
              <TextLink
                href={nivel.href}
                variante="inline"
                className="inline-flex min-h-(--alvo-min) items-center text-caption"
              >
                {nivel.rotulo}
              </TextLink>
            ) : (
              <span aria-current="page" className="text-ink">
                {nivel.rotulo}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
