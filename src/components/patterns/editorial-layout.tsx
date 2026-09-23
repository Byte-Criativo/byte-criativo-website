import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export type EditorialVariante = "com-notas" | "texto"

/**
 * Grade editorial do corpo do case e das páginas legais. Três faixas: coluna
 * de texto com medida de até 68 caracteres, margem de notas ao lado da
 * figura a partir de lg, e figuras que podem sangrar até 12 colunas.
 *
 * A ordem do DOM é a de leitura (figura → notas → texto seguinte). A grade
 * só posiciona: nenhuma regra `order` muda a leitura (checklist 3.1,
 * item 4).
 */
export function EditorialLayout({
  variante = "com-notas",
  className,
  children,
}: {
  variante?: EditorialVariante
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <article
      data-variante={variante}
      className={cn(
        "mx-auto grid w-full max-w-(--grid-container-max) grid-cols-1 gap-(--grid-gutter) px-(--grid-margin) md:grid-cols-8 lg:grid-cols-12",
        "[&>*]:md:col-span-8 [&>*]:lg:col-span-7",
        // Na variante "texto" não há margem de notas: a figura acompanha a
        // mesma coluna do texto em vez de sangrar.
        variante === "com-notas" && "[&>figure]:lg:col-span-10",
        className,
      )}
    >
      {children}
    </article>
  )
}

export function NotasMargem({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return (
    <ol className="flex flex-col gap-(--space-4) text-caption text-ink-muted lg:col-span-3">
      {children}
    </ol>
  )
}

/**
 * Marcador sobre a captura. É duplicata visual da nota em texto, por isso
 * fica fora da árvore de acessibilidade — e não é link nem botão, para não
 * criar alvo minúsculo sobre a imagem.
 */
export function MarcadorNumerado({
  numero,
  className,
}: {
  numero: number
  className?: string
}): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-(--space-5) items-center justify-center rounded-(--radius-tag) border-(length:--border-w-focus) border-solid border-bg bg-ink text-caption text-bg",
        className,
      )}
    >
      {numero}
    </span>
  )
}
