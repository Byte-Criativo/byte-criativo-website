"use client"

import { useEffect, useRef, useState, type ReactElement } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { cn } from "@/lib/cn"

const DURACAO_STATUS_MS = 5000

export type CopyEmailProps =
  | { variante: "email"; email: string; className?: string }
  | { variante: "mensagem"; mensagem: string; className?: string }

type Status =
  | { tipo: "vazio" }
  | { tipo: "copiado"; texto: string }
  | { tipo: "falha"; texto: string }

/**
 * Ilha da Clipboard API. **Por que precisa de JS:** copiar para a área de
 * transferência. **Sem JS:** o botão fica oculto (variante `js:`), o
 * endereço continua visível e selecionável e o `mailto` funciona.
 *
 * RC11: um único canal de anúncio — o texto de status visível, presente
 * desde a carga, com a linha reservada para não empurrar o layout. O rótulo
 * do botão nunca muda.
 */
export function CopyEmail(props: CopyEmailProps): ReactElement {
  const [status, setStatus] = useState<Status>({ tipo: "vazio" })
  const tempo = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (tempo.current) clearTimeout(tempo.current)
    },
    [],
  )

  const copiar = async () => {
    const conteudo = props.variante === "email" ? props.email : props.mensagem
    const sucesso =
      props.variante === "email" ? "E-mail copiado" : "Mensagem copiada"
    const falha =
      props.variante === "email"
        ? `Não deu para copiar. O e-mail é ${props.email}`
        : "Não deu para copiar. Selecione a mensagem e copie."

    if (tempo.current) clearTimeout(tempo.current)
    // RC11: para repetir a mesma mensagem, a região é esvaziada e preenchida
    // de novo no quadro seguinte.
    setStatus({ tipo: "vazio" })

    try {
      await navigator.clipboard.writeText(conteudo)
      setStatus({ tipo: "copiado", texto: sucesso })
      tempo.current = setTimeout(
        () => setStatus({ tipo: "vazio" }),
        DURACAO_STATUS_MS,
      )
    } catch {
      // A mensagem de falha é a única saída de quem não conseguiu copiar:
      // fica na tela, sem temporizador.
      setStatus({ tipo: "falha", texto: falha })
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-(--space-2) sm:flex-row sm:flex-wrap sm:items-center",
        props.className,
      )}
    >
      {props.variante === "email" ? (
        <>
          <Text>{props.email}</Text>
          <TextLink href={`mailto:${props.email}`} variante="acao">
            Escrever e-mail
          </TextLink>
        </>
      ) : (
        <Text papel="caption" tom="muted">
          Não abriu?
        </Text>
      )}

      <Button
        type="button"
        variante="contorno"
        onClick={copiar}
        // RC9: sem JS o botão não aparece; o endereço e o mailto continuam.
        className="hidden js:inline-flex"
      >
        <Icon nome="copiar" />
        {props.variante === "email" ? "Copiar e-mail" : "Copiar mensagem"}
      </Button>

      {/* Único canal de anúncio, presente desde a carga, com linha
          reservada para não empurrar o layout. */}
      <p
        role="status"
        className={cn(
          "min-h-(--space-5) basis-full text-caption",
          status.tipo === "copiado" ? "text-success-text" : "text-ink",
        )}
      >
        {status.tipo === "copiado" ? (
          <>
            <Icon nome="confirmado" className="inline" />
            {status.texto}
          </>
        ) : status.tipo === "falha" ? (
          status.texto
        ) : null}
      </p>
    </div>
  )
}
