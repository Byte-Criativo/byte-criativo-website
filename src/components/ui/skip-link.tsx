import type { ReactElement, ReactNode } from "react"

/**
 * Primeiro elemento focável da página. Fora da tela por deslocamento (nunca
 * `display: none`), aparece no canto superior esquerdo ao receber foco,
 * acima de tudo (`--z-skip`). Destino padrão: `main#conteudo`, que tem
 * `tabIndex={-1}` para receber o foco sem virar controle.
 */
export function SkipLink({
  destino = "conteudo",
  children = "Pular para o conteúdo",
}: {
  destino?: string
  children?: ReactNode
}): ReactElement {
  return (
    <a
      href={`#${destino}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-(--space-4) focus:left-(--space-4) focus:z-(--z-skip) focus:rounded-(--radius-tag) focus:bg-action focus:px-(--space-4) focus:py-(--space-3) focus:text-label focus:text-on-action"
    >
      {children}
    </a>
  )
}
