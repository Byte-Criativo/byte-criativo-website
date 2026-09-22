import type { ReactElement } from "react"
import { cn } from "@/lib/cn"

export type ItemIndice = { id: string; rotulo: string }

/**
 * Coluna de `;` da home (só desktop). O invólucro é absoluto na margem
 * esquerda, fora da coluna de conteúdo, com `pointer-events: none`: não
 * empurra o hero e não cobre o texto (RC4). A caixa de --surface impede que
 * o glifo suma sobre as salas.
 *
 * **Exigência de quem monta a página:** o índice precisa de um ancestral
 * posicionado (`position: relative`, normalmente o `<main>` da home). Sem
 * ele o invólucro absoluto se prende ao bloco contendo inicial e a coluna
 * some do lugar. É dependência de composição, não de estilo do componente:
 * a Fase 8 monta a página e precisa declará-la.
 *
 * Aqui não há estado "atual": quem grava `aria-current` no link da seção
 * visível é a ilha SalaObserver, e sem JS nenhum item fica marcado.
 */
export function IndiceSemicolon({
  itens,
  className,
}: {
  itens: ItemIndice[]
  className?: string
}): ReactElement {
  return (
    <nav
      aria-label="Seções desta página"
      className={cn("indice-inv hidden lg:block", className)}
    >
      <ol className="indice-lista flex flex-col gap-(--space-1)">
        {itens.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              data-indice-link={item.id}
              className="indice-link flex size-(--space-7) items-center justify-center bg-surface"
            >
              <span data-glifo aria-hidden="true" className="indice-glifo">
                ;
              </span>
              <span className="indice-rotulo">{item.rotulo}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
