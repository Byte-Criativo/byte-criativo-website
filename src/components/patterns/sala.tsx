import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export type SalaVariante = "hero" | "larga"

const VARIANTE: Record<SalaVariante, string> = {
  // Sala do hero: 7 das 12 colunas a partir de lg; sangra até as bordas no
  // celular (só abaixo de md, via max-md:, para não precisar "zerar" a
  // margem de volta com um mx-0 literal — a guarda de tokens não distingue
  // esse zero de um valor de espaçamento solto). Nunca anima na carga (é a
  // primeira dobra).
  hero: "max-md:-mx-(--grid-margin) lg:col-span-7",
  // Sala larga: largura total da tela, obra centralizada.
  larga: "w-full",
}

const RESPIRO: Record<SalaVariante, string> = {
  hero: "pt-(--space-5) md:pt-(--space-7) lg:pt-(--space-8)",
  larga: "pt-(--space-5) md:pt-(--space-7) lg:pt-(--space-8)",
}

/**
 * Sala: dois níveis, de propósito.
 *
 * 1. Moldura (este elemento): fora de `data-case`, então o `--bg` do véu
 *    resolve na cor da parede. Carrega `data-estado`.
 * 2. Superfície (`data-case`): troca as vars pela RC6. Não pode ganhar
 *    `transform`, `opacity` nem `z-index`, senão criaria contexto de
 *    empilhamento e o véu não conseguiria ficar entre ela e a obra.
 */
export function Sala({
  slug,
  variante = "larga",
  id,
  className,
  children,
}: {
  slug: string
  variante?: SalaVariante
  id?: string
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <div
      id={id}
      data-sala
      data-variante={variante}
      data-estado="projeto"
      className={cn("sala relative", VARIANTE[variante], className)}
    >
      <div
        data-case={slug}
        className={cn(
          "sala-superficie bg-bg pb-(--space-8)",
          RESPIRO[variante],
        )}
      >
        <div data-cavalete aria-hidden="true" className="sala-cavalete" />
        <div className="sala-obra mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin)">
          {children}
        </div>
      </div>
    </div>
  )
}
