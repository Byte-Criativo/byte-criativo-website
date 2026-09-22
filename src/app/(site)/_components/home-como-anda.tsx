import type { ReactElement } from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import type { HomePage } from "@/content/schema"

export function HomeComoAnda({
  comoAnda,
}: {
  comoAnda: HomePage["comoAnda"]
}): ReactElement {
  return (
    <section
      id="como-anda"
      aria-labelledby="como-anda-titulo"
      className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
    >
      <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
        <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
          <Heading nivel={2} id="como-anda-titulo">
            {comoAnda.h2}
          </Heading>
          <Text papel="lede" medida>
            {comoAnda.lede}
          </Text>
        </div>

        {/* 5 etapas numeradas */}
        <ol className="grid grid-cols-1 gap-(--grid-gutter) md:grid-cols-2 lg:grid-cols-5">
          {comoAnda.steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col gap-(--space-3) border-t-(length:--border-w-decorative) border-solid border-border-decorative pt-(--space-4)"
            >
              <span
                aria-hidden="true"
                className="text-h2 font-bold text-ink-muted"
              >
                0{step.number}
              </span>
              <Heading nivel={3} className="font-bold">
                {step.title}
              </Heading>
              <Text medida>{step.description}</Text>
              <Text papel="caption" tom="muted">
                <span className="font-semibold text-ink">Você recebe: </span>
                {step.youReceive}
              </Text>
            </li>
          ))}
        </ol>

        {/* Nota tranquilizadora */}
        <div className="border-l-(length:--border-w-control) border-solid border-ink pl-(--space-4)">
          <Text className="font-medium text-ink">{comoAnda.note}</Text>
        </div>

        {/* CTA e ponte */}
        <div className="flex flex-col gap-(--space-3) sm:flex-row sm:items-center sm:justify-between">
          <Button href={comoAnda.cta.href}>{comoAnda.cta.label}</Button>
          <Text papel="caption" tom="muted">
            {comoAnda.bridgeText}
          </Text>
        </div>
      </Container>
    </section>
  )
}
