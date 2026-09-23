import type { ReactElement } from "react"
import { ConversaBand } from "@/components/patterns/conversa-band"
import { WhatsAppLink } from "@/components/patterns/whatsapp-link"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Text } from "@/components/ui/text"
import { Stack } from "@/components/ui/stack"
import type { HomePage, SiteConfig } from "@/content/schema"

const LINK_PRIVACIDADE = "política de privacidade"

function dividirAviso(formNotice: string): [string, string] {
  const partes = formNotice.split(LINK_PRIVACIDADE)
  if (partes.length !== 2) {
    throw new Error(
      `HomeConversa: conversa.formNotice precisa conter o trecho "${LINK_PRIVACIDADE}" exatamente uma vez; recebeu: "${formNotice}"`,
    )
  }
  return [partes[0]!, partes[1]!]
}

export function HomeConversa({
  conversa,
  site,
}: {
  conversa: HomePage["conversa"]
  site: SiteConfig
}): ReactElement {
  const [antesDoLink, depoisDoLink] = dividirAviso(conversa.formNotice)
  return (
    <ConversaBand
      id="conversa"
      variante="conversa"
      titulo={conversa.h2.replace(/;$/, "")}
      abertura={conversa.text}
      tituloCompromissos="Dois compromissos desde o início"
      compromissos={conversa.commitments.map(
        (c) => `${c.title} ${c.howToCheck}`,
      )}
      formulario={
        <Stack espaco={5} className="max-w-(--medida-max)">
          <Text medida className="text-body-lg">
            {conversa.whoConducts}
          </Text>

          <div className="flex flex-col gap-(--space-2)">
            {conversa.microcopy.map((micro) => (
              <Text
                key={micro}
                papel="caption"
                className="font-medium text-ink"
              >
                — {micro}
              </Text>
            ))}
          </div>

          <div className="flex flex-col gap-(--space-3) sm:flex-row sm:items-center">
            <Button href={conversa.fullFormLink.href}>
              Falar sobre meu projeto
            </Button>
            <WhatsAppLink
              aparencia="texto"
              rotulo={conversa.whatsappCtaLabel}
              mensagem={site.contact.defaultWhatsappMessage}
              location="conversa_home"
              context="home"
            />
          </div>

          <Text papel="caption" tom="muted">
            {antesDoLink}
            <TextLink href="/privacidade" variante="inline">
              {LINK_PRIVACIDADE}
            </TextLink>
            {depoisDoLink}
          </Text>
        </Stack>
      }
    />
  )
}
