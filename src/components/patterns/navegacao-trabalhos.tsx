import type { ReactElement } from "react"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

/**
 * Navegação entre estudos de caso, na parede e fora de `article[data-case]`.
 * O bloco "Próximo trabalho" já leva ao case seguinte, então este padrão
 * nunca repete esse destino. O landmark só existe quando há mais de um link
 * — com dois trabalhos publicados (toda a v1 até D12), o "anterior" seria o
 * mesmo case do bloco, e sobra só "Ver todos os trabalhos".
 *
 * Nenhuma seta e nenhum ícone (RC8): o texto do link diz o sentido, e o nome
 * já inclui o projeto, sem complemento oculto.
 */
export function NavegacaoTrabalhos({
  anterior,
  todosHref,
  className,
}: {
  anterior?: { nome: string; href: string }
  todosHref: string
  className?: string
}): ReactElement {
  const caixa = cn(
    "mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin) py-(--space-6)",
    className,
  )

  const todos = (
    <TextLink href={todosHref} variante="acao">
      Ver todos os trabalhos
    </TextLink>
  )

  if (!anterior) {
    return <div className={caixa}>{todos}</div>
  }

  return (
    <nav aria-label="Outros trabalhos" className={caixa}>
      <ul className="flex flex-col gap-(--space-5) md:flex-row md:items-center md:gap-(--space-6)">
        <li>
          <TextLink href={anterior.href} variante="acao">
            {`Trabalho anterior: ${anterior.nome}`}
          </TextLink>
        </li>
        <li className="md:ml-auto">{todos}</li>
      </ul>
    </nav>
  )
}
