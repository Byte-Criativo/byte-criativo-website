import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { POMODORO_PRIVACIDADE_SEO, pomodoroPrivacidade } from "./conteudo"

export const metadata: Metadata = buildMetadata({
  title: POMODORO_PRIVACIDADE_SEO.title,
  description: POMODORO_PRIVACIDADE_SEO.description,
  path: "/pomodoro/privacidade",
})

// Sem breadcrumbs e sem JSON-LD (especificação da tarefa 8.6 do plano Fase 8;
// a rota consta em ROUTES_WITHOUT_JSON_LD do contrato e2e).
export default function PomodoroPrivacidadePage() {
  return (
    <div className="relative">
      <section
        aria-labelledby="politica-titulo"
        className="pt-(--space-6) pb-(--space-8) lg:pt-(--space-8) lg:pb-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="politica-titulo">
              {pomodoroPrivacidade.h1}
            </Heading>
            <Text papel="lede" medida>
              {pomodoroPrivacidade.intro}
            </Text>
          </div>
        </Container>
      </section>

      <div className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)">
        <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
          {pomodoroPrivacidade.secoes.map((secao) => (
            <section
              key={secao.id}
              aria-labelledby={`${secao.id}-titulo`}
              className="flex max-w-(--medida-max) flex-col gap-(--space-4)"
            >
              <Heading nivel={2} id={`${secao.id}-titulo`}>
                {secao.titulo}
              </Heading>
              {secao.paragrafos.map((paragrafo) => (
                <Text key={paragrafo} medida>
                  {paragrafo}
                </Text>
              ))}
            </section>
          ))}
        </Container>
      </div>
    </div>
  )
}
