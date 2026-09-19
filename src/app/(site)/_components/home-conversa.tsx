import type { ReactElement } from "react"
import { ConversaBand } from "@/components/patterns/conversa-band"
import { WhatsAppLink } from "@/components/patterns/whatsapp-link"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Text } from "@/components/ui/text"
import { Stack } from "@/components/ui/stack"
import type { HomePage, SiteConfig } from "@/content/schema"

export function HomeConversa({
  conversa,
  site,
}: {
  conversa: HomePage["conversa"]
  site: SiteConfig
}): ReactElement {
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
              Falar sobre um projeto
            </Button>
            <WhatsAppLink
              aparencia="botao"
              rotulo={conversa.whatsappCtaLabel}
              mensagem={site.contact.defaultWhatsappMessage}
              location="conversa_home"
              context="home"
            />
          </div>

          <div>
            <TextLink href={conversa.fullFormLink.href} variante="acao">
              {conversa.fullFormLink.label}
            </TextLink>
          </div>

          <Text papel="caption" tom="muted">
            {conversa.formNotice}{" "}
            <TextLink href="/privacidade" variante="inline">
              política de privacidade
            </TextLink>
            .
          </Text>
        </Stack>
      }
    />
  )
}
