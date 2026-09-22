import type { ReactElement, ReactNode } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

export type ItemFichaTecnica = { termo: string; descricao: string }

/**
 * Abertura do estudo de caso: primeiro filho do `<article data-case="…">`
 * (o `article` é da página, Fase 9). A imagem principal é o LCP do
 * template — entra sem animação de entrada e sem opacidade inicial.
 *
 * D5 continua aberta: "O que a Byte fez" e "Ano" não entram na ficha
 * técnica. O componente renderiza só os itens recebidos.
 */
export function CaseHero({
  titulo,
  subtitulo,
  imagem,
  fichaTecnica,
  projetoNoAr,
  className,
}: {
  titulo: string
  subtitulo: string
  imagem: ReactNode
  fichaTecnica: ItemFichaTecnica[]
  projetoNoAr: { nome: string; href: string }
  className?: string
}): ReactElement {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-(--grid-container-max) grid-cols-1 gap-(--grid-gutter) px-(--grid-margin) pt-(--space-6) md:pt-(--space-8) lg:grid-cols-12",
        className,
      )}
    >
      <div className="flex flex-col gap-(--space-4) lg:col-span-5">
        <Heading nivel={1} semicolon>
          {titulo}
        </Heading>
        <Text papel="lede" tom="muted" medida>
          {subtitulo}
        </Text>

        <dl className="flex flex-col gap-(--space-2)">
          {fichaTecnica.map((item) => (
            <div key={item.termo} className="flex gap-(--space-2)">
              <dt className="text-caption text-ink-muted">{item.termo}</dt>
              <dd className="text-caption text-ink">{item.descricao}</dd>
            </div>
          ))}
        </dl>

        <TextLink
          href={projetoNoAr.href}
          variante="acao"
          externo
          complemento={`do ${projetoNoAr.nome}`}
        >
          Ver projeto no ar
        </TextLink>
      </div>

      {/* LCP do template: sem animação de entrada e sem opacidade inicial. */}
      <div className="lg:col-span-7">{imagem}</div>
    </div>
  )
}
