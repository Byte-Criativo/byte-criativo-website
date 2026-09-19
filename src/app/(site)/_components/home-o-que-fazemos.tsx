import type { ReactElement } from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { SituacaoServico } from "@/components/patterns/situacao-servico"
import type { HomePage } from "@/content/schema"

export function HomeOQueFazemos({
  oQueFazemos,
}: {
  oQueFazemos: HomePage["oQueFazemos"]
}): ReactElement {
  const itensSituacao = oQueFazemos.situations.map((sit, idx) => ({
    id: `situacao-${idx + 1}`,
    situacao: sit.title,
    frase: sit.phrase,
    links: sit.links.map((link) => ({
      rotulo: link.label,
      href: link.href,
    })),
  }))

  return (
    <section
      id="o-que-fazemos"
      aria-labelledby="o-que-fazemos-titulo"
      className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
    >
      <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
        <Heading nivel={2} id="o-que-fazemos-titulo">
          {oQueFazemos.h2}
        </Heading>

        <SituacaoServico
          itens={itensSituacao}
          rodape={oQueFazemos.footerNote}
        />

        <div className="flex flex-col gap-(--space-3) sm:flex-row sm:items-center sm:justify-between">
          <Button href={oQueFazemos.cta.href}>{oQueFazemos.cta.label}</Button>
          <Text papel="caption" tom="muted">
            {oQueFazemos.bridgeText}
          </Text>
        </div>
      </Container>
    </section>
  )
}
