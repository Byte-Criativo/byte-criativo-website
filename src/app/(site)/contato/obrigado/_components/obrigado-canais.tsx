"use client"

import type { ReactElement } from "react"
import { useSearchParams } from "next/navigation"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { ContinuarConversa } from "@/components/patterns/continuar-conversa"

export type ObrigadoTextos = {
  whatsapp: { text: string; buttonLabel: string }
  email: { fallbackText: string; buttonLabel: string }
  direto: { text: string; linkLabel: string; linkHref: string }
}

/** Versão de acesso direto (sem `?canal=`): também é o fallback sem JS. */
export function AcessoDireto({
  texto,
  linkLabel,
  linkHref,
}: {
  texto: string
  linkLabel: string
  linkHref: string
}): ReactElement {
  return (
    <div className="flex flex-col gap-(--space-4)">
      <Text medida>{texto}</Text>
      <div>
        <TextLink href={linkHref} variante="acao">
          {linkLabel}
        </TextLink>
      </div>
    </div>
  )
}

/**
 * Filho mínimo que lê `?canal=` e `?envio=` no navegador, para a página
 * continuar estática (mesmo padrão da pré-seleção do LeadForm na
 * especificação de componentes). Sem canal, cai na versão de acesso direto
 * — a mesma que o servidor renderiza no fallback do `Suspense`.
 */
export function ObrigadoCanais({
  textos,
  mensagemGeral,
}: {
  textos: ObrigadoTextos
  mensagemGeral: string
}): ReactElement {
  const params = useSearchParams()
  const canal = params.get("canal")
  const envio = params.get("envio") ?? undefined

  if (canal === "whatsapp") {
    return (
      <ContinuarConversa
        canal="whatsapp"
        envio={envio}
        mensagemGeral={mensagemGeral}
        textos={{
          comDados: textos.whatsapp.text,
          semDados: textos.direto.text,
          rotuloWhatsApp: textos.whatsapp.buttonLabel,
        }}
      />
    )
  }

  if (canal === "email") {
    return (
      <ContinuarConversa
        canal="email"
        envio={envio}
        mensagemGeral={mensagemGeral}
        textos={{
          comDados: textos.email.fallbackText,
          semDados: textos.direto.text,
          rotuloWhatsApp: textos.email.buttonLabel,
        }}
      />
    )
  }

  return (
    <AcessoDireto
      texto={textos.direto.text}
      linkLabel={textos.direto.linkLabel}
      linkHref={textos.direto.linkHref}
    />
  )
}
