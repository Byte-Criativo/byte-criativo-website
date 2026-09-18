import type { ReactElement } from "react"
import { buttonClasses } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { textLinkClasses } from "@/components/ui/text-link"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/contact"
import { getSafeRel } from "@/lib/link-security"

export type WhatsAppAparencia = "botao" | "texto"

/**
 * Link para o WhatsApp com a mensagem do contexto já preenchida. A URL é
 * estática e nunca contém dado pessoal — a variante `montada`, que usa os
 * dados de quem preencheu o formulário, é outro componente
 * (`whatsapp-montado.tsx`) e só monta a URL no clique.
 *
 * Os três `data-*` são o contrato de evento do analytics: nome do evento,
 * lugar do controle e contexto da página. Nada além disso viaja aqui.
 */
export function WhatsAppLink({
  aparencia,
  rotulo,
  mensagem,
  location,
  context,
  className,
}: {
  aparencia: WhatsAppAparencia
  rotulo: string
  mensagem: string
  location: string
  context: string
  className?: string
}): ReactElement {
  const classes =
    aparencia === "botao"
      ? buttonClasses("primario", className)
      : textLinkClasses("acao", className)

  return (
    <a
      href={buildWhatsAppUrl(WHATSAPP_NUMBER, mensagem)}
      target="_blank"
      rel={getSafeRel("_blank")}
      data-evento="whatsapp_click"
      data-location={location}
      data-context={context}
      className={classes}
    >
      {aparencia === "botao" ? <Icon nome="whatsapp" /> : null}
      {rotulo}
      {/* RC5: o espaço que separa o texto visível do complemento é do
          próprio VisuallyHidden (`separador`) — uma quebra de linha do JSX
          não vira espaço e o nome sairia "Chamar no WhatsApp(abre em nova
          aba)". */}
      <VisuallyHidden separador>(abre em nova aba)</VisuallyHidden>
    </a>
  )
}
