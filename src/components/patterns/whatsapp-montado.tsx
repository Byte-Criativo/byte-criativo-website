"use client"

import type { ReactElement } from "react"
import { buttonClasses } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/contact"
import {
  montarMensagemContinuacao,
  type DadosContinuacao,
} from "@/lib/continuar-conversa"

/**
 * Variante `montada` do WhatsAppLink: é `<button>` porque executa uma ação
 * antes de navegar. Monta a mensagem com os dados recebidos por props **só
 * no clique** — nenhuma URL com dados existe num `href` renderizado. Não lê
 * armazenamento: quem lê é a ilha ContinuarConversa.
 */
export function WhatsAppMontado({
  dados,
  rotulo,
  location,
  context,
  className,
}: {
  dados: DadosContinuacao
  rotulo: string
  location: string
  context: string
  className?: string
}): ReactElement {
  return (
    <button
      type="button"
      data-evento="whatsapp_click"
      data-location={location}
      data-context={context}
      onClick={() => {
        const url = buildWhatsAppUrl(
          WHATSAPP_NUMBER,
          montarMensagemContinuacao(dados),
        )
        window.open(url, "_blank", "noopener,noreferrer")
      }}
      className={buttonClasses("primario", className)}
    >
      <Icon nome="whatsapp" />
      {rotulo}
    </button>
  )
}
