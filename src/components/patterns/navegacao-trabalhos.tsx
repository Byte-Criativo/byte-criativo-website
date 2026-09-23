import type { ReactElement } from "react"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

/** Navegação ordenada entre cases, fora da paleta do projeto. */
export function NavegacaoTrabalhos({
  anterior,
  proximo,
  todosHref,
  className,
}: {
  anterior?: { nome: string; href: string }
  proximo?: { nome: string; href: string }
  todosHref: string
  className?: string
}): ReactElement {
  const caixa = cn(
    "mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin) py-(--space-6)",
    className,
  )

  const todos = (
    <TextLink href={todosHref} variante="acao">
      Ver todos os projetos
    </TextLink>
  )

  if (!anterior && !proximo) {
    return <div className={caixa}>{todos}</div>
  }

  return (
    <nav aria-label="Outros projetos" className={caixa}>
      <ul className="flex flex-col gap-(--space-5) md:flex-row md:items-center md:gap-(--space-6)">
        {anterior && (
          <li>
            <TextLink href={anterior.href} variante="acao">
              {`Projeto anterior: ${anterior.nome}`}
            </TextLink>
          </li>
        )}
        {proximo && (
          <li>
            <TextLink href={proximo.href} variante="acao">
              {`Próximo projeto: ${proximo.nome}`}
            </TextLink>
          </li>
        )}
        <li className="md:ml-auto">{todos}</li>
      </ul>
    </nav>
  )
}
