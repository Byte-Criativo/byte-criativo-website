import type { ReactElement } from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import type { HomePage } from "@/content/schema"

export function HomeFormaDePensar({
  formaDePensar,
}: {
  formaDePensar: HomePage["formaDePensar"]
}): ReactElement {
  return (
    <section
      id="forma-de-pensar"
      aria-labelledby="forma-de-pensar-titulo"
      className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
    >
      <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
        {/* Cabeçalho da seção */}
        <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
          <Heading nivel={2} id="forma-de-pensar-titulo" semicolon>
            {formaDePensar.h2.replace(/;$/, "")}
          </Heading>
          <Text papel="lede" medida>
            {formaDePensar.lede}
          </Text>
        </div>

        {/* Bloco tipográfico do manifesto */}
        <div className="text-manifesto font-bold tracking-tight text-ink">
          <VisuallyHidden>
            {formaDePensar.accessibleTypographicBlock}
          </VisuallyHidden>
          <span aria-hidden="true">{formaDePensar.typographicBlock}</span>
        </div>

        {/* Texto do manifesto */}
        <div className="max-w-(--medida-max)">
          <Text medida className="text-body-lg">
            {formaDePensar.manifesto}
          </Text>
        </div>

        {/* Três princípios */}
        <div className="grid grid-cols-1 gap-(--grid-gutter) md:grid-cols-3">
          {formaDePensar.principles.map((principio) => (
            <div
              key={principio.title}
              className="flex flex-col gap-(--space-3) border-t-(length:--border-w-decorative) border-solid border-border-decorative pt-(--space-4)"
            >
              <Heading nivel={3} className="font-bold">
                {principio.title}
              </Heading>
              <Text medida>{principio.text}</Text>
              <Text papel="caption" tom="muted">
                <span className="font-semibold text-ink">Onde aparece: </span>
                {principio.whereAppears}
              </Text>
            </div>
          ))}
        </div>

        {/* Frases de contraste */}
        <div className="flex flex-col gap-(--space-2) border-l-(length:--border-w-control) border-solid border-ink pl-(--space-4)">
          {formaDePensar.contrastPhrases.map((frase) => (
            <Text key={frase} className="font-medium text-ink">
              {frase}
            </Text>
          ))}
        </div>

        {/* CTA e ponte */}
        <div className="flex flex-col gap-(--space-3) sm:flex-row sm:items-center sm:justify-between">
          <Button href={formaDePensar.cta.href}>
            {formaDePensar.cta.label}
          </Button>
          <Text papel="caption" tom="muted">
            {formaDePensar.bridgeText}
          </Text>
        </div>
      </Container>
    </section>
  )
}
