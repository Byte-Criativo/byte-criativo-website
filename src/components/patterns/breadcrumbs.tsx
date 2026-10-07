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
 *
 * A trilha fica sempre numa linha: quebrada, a segunda linha começava com um
 * "›" órfão. Quem cede é o nível atual, truncado com reticências — ele
 * repete o H1 logo abaixo, e o texto inteiro continua no DOM.
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
      <ol className="flex items-center gap-(--space-2)">
        {trilha.map((nivel, indice) => (
          <li
            key={nivel.rotulo}
            className={cn(
              "flex items-center gap-(--space-2)",
              // `overflow-hidden` zera o mínimo automático do item flex: é ele
              // que deixa o nível atual encolher (a guarda de tokens não
              // aceita o `0` de `min-w-0`).
              nivel.href ? "flex-none" : "overflow-hidden",
            )}
          >
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
              <span aria-current="page" className="truncate text-ink">
                {nivel.rotulo}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
