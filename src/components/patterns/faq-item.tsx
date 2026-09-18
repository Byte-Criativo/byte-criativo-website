import type { ReactElement, ReactNode } from "react"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/cn"

/**
 * Disclosure nativo. Sem título dentro do `summary` (o papel de botão
 * apagaria o título) e sem o atributo `name`, para dar para comparar
 * respostas abertas ao mesmo tempo. A busca do navegador (Ctrl+F) abre o
 * item que contém o termo onde houver suporte.
 *
 * Nenhum ARIA manual: `details`/`summary` já anunciam estado e alvo. O sinal
 * + / − é decorativo e a troca acontece por CSS (`.faq-item` em
 * globals.css), não por JS — o componente é Server e não custa nada.
 */
export function FaqItem({
  pergunta,
  className,
  children,
}: {
  pergunta: string
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <details
      className={cn(
        "faq-item border-b-(length:--border-w-decorative) border-solid border-border-decorative",
        className,
      )}
    >
      <summary className="flex min-h-(--space-7) cursor-pointer items-center justify-between gap-(--space-4) py-(--space-4) text-h3 text-ink ponteiro:hover:underline ponteiro:hover:decoration-(length:--border-w-decorative)">
        {pergunta}
        <Icon nome="mais" className="faq-mais" />
        <Icon nome="menos" className="faq-menos" />
      </summary>
      <Text medida className="pb-(--space-4)">
        {children}
      </Text>
    </details>
  )
}
