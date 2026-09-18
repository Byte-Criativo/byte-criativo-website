import type { ReactElement } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

export type LinkSituacao = {
  rotulo: string
  href: string
  complemento?: string
  externo?: boolean
}

export type ItemSituacao = {
  id: string
  situacao: string
  frase?: string
  links: LinkSituacao[]
}

/**
 * Índice tipográfico "situação → serviço → case", com réguas finas e nada
 * escondido em abas ou acordeões. Cada link diz o destino pelo próprio
 * texto — "Saiba mais" e "Clique aqui" são proibidos — e o separador `·` da
 * copy nunca é renderizado: cada destino é um item de lista.
 */
export function SituacaoServico({
  itens,
  ordenada = false,
  rodape,
  className,
}: {
  itens: ItemSituacao[]
  ordenada?: boolean
  rodape?: string
  className?: string
}): ReactElement {
  const Lista = ordenada ? "ol" : "ul"

  return (
    <div className={cn("flex flex-col gap-(--space-4)", className)}>
      <Lista className="flex flex-col">
        {itens.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-1 gap-(--grid-gutter) border-b-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-6) lg:grid-cols-12"
          >
            <Heading nivel={3} id={item.id} className="lg:col-span-5">
              {item.situacao}
            </Heading>
            <div className="flex flex-col gap-(--space-4) lg:col-span-6 lg:col-start-7">
              {item.frase ? <Text medida>{item.frase}</Text> : null}
              <ul className="flex flex-col gap-(--space-2)">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <TextLink
                      href={link.href}
                      variante="acao"
                      externo={link.externo}
                      complemento={link.complemento}
                    >
                      {link.rotulo}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </Lista>
      {rodape ? (
        <Text tom="muted" medida>
          {rodape}
        </Text>
      ) : null}
    </div>
  )
}
