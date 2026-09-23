import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { TagList } from "./tag"

export type FichaContagem = {
  atual: number
  total: number
  proximo?: { nome: string; href: string }
}

/**
 * Legenda de museu do trabalho exposto. Sempre na parede, fora da sala e
 * fora de `article[data-case]` (RC6): a Ficha usa `--ink-muted`, contorno
 * de capacidade e Tag, que não têm par calculado sobre a superfície.
 *
 * `estudoDeCasoHref` é opcional de propósito: a página de case só existe
 * depois do gate D5 (status "published"), então quem monta a Ficha omite o
 * link enquanto o estudo de caso 404aria.
 */
export function Ficha({
  id,
  nome,
  tipo,
  nivel,
  frase,
  capacidades,
  estudoDeCasoHref,
  projetoNoArHref,
  controle,
  sala,
  contagem,
  className,
}: {
  id: string
  nome: string
  tipo: string
  nivel: 2 | 3
  frase: string
  capacidades: string[]
  estudoDeCasoHref?: string
  projetoNoArHref?: string
  controle?: ReactNode
  sala: ReactNode
  contagem?: FichaContagem
  className?: string
}): ReactElement {
  const idTitulo = `${id}-titulo`

  return (
    <article
      aria-labelledby={idTitulo}
      className={cn("bg-bg text-ink", className)}
    >
      <div
        data-parte="cabeca"
        className="mx-auto flex w-full max-w-(--grid-container-max) flex-col gap-(--space-3) px-(--grid-margin) pb-(--space-4) sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex flex-col gap-(--space-3)">
          <Heading nivel={nivel} id={idTitulo} papel="h3" className="font-bold">
            {nome}
          </Heading>
          <Text papel="caption" tom="muted">
            {tipo}
          </Text>
        </div>
        {controle}
      </div>

      <div data-parte="sala">{sala}</div>

      <div
        data-parte="corpo"
        className="mx-auto flex w-full max-w-(--grid-container-max) flex-col gap-(--space-4) px-(--grid-margin) pt-(--space-5)"
      >
        <Text medida>{frase}</Text>

        <TagList itens={capacidades} />

        <div className="flex flex-wrap items-center gap-(--space-5)">
          {estudoDeCasoHref ? (
            <TextLink
              href={estudoDeCasoHref}
              variante="acao"
              complemento={`do ${nome}`}
            >
              Ver estudo de caso
            </TextLink>
          ) : null}
          {projetoNoArHref ? (
            <TextLink
              href={projetoNoArHref}
              variante="acao"
              externo
              complemento={`do ${nome}`}
            >
              Visitar site
            </TextLink>
          ) : null}
          {contagem ? (
            contagem.proximo ? (
              // O complemento aqui começa com pontuação (": ir para...")
              // colada ao texto visível, sem espaço — diferente do padrão
              // "do <nome>" acima, que precisa do espaço que o prop
              // `complemento` do TextLink sempre antepõe (via VisuallyHidden
              // separador). Por isso o contexto oculto entra como children
              // direto, com VisuallyHidden sem `separador` (RC5, R51: quem
              // decide se há espaço é sempre o VisuallyHidden, nunca um
              // `{" "}` manual — aqui a decisão é "sem espaço").
              <TextLink
                href={contagem.proximo.href}
                variante="acao"
                className="sm:ml-auto"
              >
                {`${contagem.atual} de ${contagem.total}`}
                <VisuallyHidden>
                  {`: ir para o próximo trabalho, ${contagem.proximo.nome}`}
                </VisuallyHidden>
              </TextLink>
            ) : (
              <Text papel="caption" tom="muted" className="sm:ml-auto">
                <VisuallyHidden>Trabalho </VisuallyHidden>
                {`${contagem.atual} de ${contagem.total}`}
              </Text>
            )
          ) : null}
        </div>
      </div>
    </article>
  )
}
