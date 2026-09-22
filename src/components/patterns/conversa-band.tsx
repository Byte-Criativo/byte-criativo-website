import type { ReactElement, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/cn"
import { WhatsAppLink } from "./whatsapp-link"

type Comum = { id: string; titulo: string; className?: string }

export type ConversaBandProps = Comum &
  (
    | {
        variante: "chamada"
        frase?: string
        ctaHref: string
        ctaRotulo?: string
        whatsapp: {
          rotulo: string
          mensagem: string
          location: string
          context: string
        }
      }
    | {
        variante: "conversa"
        abertura: string
        tituloCompromissos: string
        compromissos: string[]
        formulario: ReactNode
      }
  )

/**
 * Banda de conversa em largura total, sempre no tema do verso: tudo dentro
 * dela resolve pelo verso, inclusive o anel de foco e as vars de mensagem.
 * No estudo de caso fica **fora** do `article[data-case]` (RC6).
 *
 * D3 continua aberta: não existe prop para retrato nem para o nome de quem
 * conduz, e nada disso é renderizado.
 */
export function ConversaBand(props: ConversaBandProps): ReactElement {
  const idTitulo = `${props.id}-titulo`

  return (
    <section
      id={props.id}
      aria-labelledby={idTitulo}
      data-surface="verso"
      className={cn(
        "w-full bg-bg py-(--space-8) text-ink md:py-(--space-9)",
        props.className,
      )}
    >
      <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
        {props.variante === "chamada" ? (
          <div className="flex flex-col gap-(--space-5) lg:col-span-8">
            <Heading nivel={2} id={idTitulo} semicolon>
              {props.titulo}
            </Heading>
            {props.frase ? <Text papel="lede">{props.frase}</Text> : null}
            <div className="flex flex-col gap-(--space-3) md:flex-row">
              <Button href={props.ctaHref}>
                {props.ctaRotulo ?? "Falar sobre um projeto"}
              </Button>
              <WhatsAppLink
                aparencia="botao"
                rotulo={props.whatsapp.rotulo}
                mensagem={props.whatsapp.mensagem}
                location={props.whatsapp.location}
                context={props.whatsapp.context}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-(--space-5) lg:col-span-5">
              <Heading nivel={2} id={idTitulo} semicolon>
                {props.titulo}
              </Heading>
              <Text papel="lede">{props.abertura}</Text>
              <Heading nivel={3}>{props.tituloCompromissos}</Heading>
              <ol className="flex flex-col gap-(--space-3) text-body">
                {props.compromissos.map((compromisso) => (
                  <li key={compromisso}>{compromisso}</li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              {props.formulario}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
