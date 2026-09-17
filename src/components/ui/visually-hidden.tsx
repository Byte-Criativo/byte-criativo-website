import type { ReactElement, ReactNode } from "react"

/**
 * Recorte acessível: some da tela, continua na árvore de acessibilidade.
 * Só complementa nome ou contexto (RC5); nada essencial para quem enxerga
 * pode viver só aqui.
 */
export function VisuallyHidden({
  as: Tag = "span",
  children,
}: {
  as?: "span" | "div"
  children: ReactNode
}): ReactElement {
  return <Tag className="sr-only">{children}</Tag>
}
