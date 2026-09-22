import type { ReactElement, ReactNode } from "react"
import { Icon, type IconeNome } from "@/components/ui/icon"
import { cn } from "@/lib/cn"

export type NoticeTipo = "erro" | "aviso"

const COR: Record<NoticeTipo, string> = {
  erro: "text-danger-text",
  aviso: "text-warning-text",
}

// 1.4.1: cada tipo tem traçado próprio. Se os dois usassem o mesmo ícone, a
// diferença entre erro e aviso passaria a viver só na cor.
const ICONE: Record<NoticeTipo, IconeNome> = {
  erro: "alerta",
  aviso: "atencao",
}

const FILETE: Record<NoticeTipo, string> = {
  erro: "border-l-danger-text",
  aviso: "border-l-warning-text",
}

/**
 * Bloco de mensagem em fluxo (nunca fixo). Entra dentro do contêiner
 * `role="alert"` do LeadForm sem papel próprio: a região viva já existe
 * vazia desde a carga, e uma região aninhada quebraria a RC11.
 *
 * Depende de `--surface-muted` e das vars de mensagem, que a sala não
 * reescreve: nunca fica dentro de `article[data-case]` (RC6).
 */
export function Notice({
  tipo,
  primeiraFrase,
  children,
  acao,
  className,
}: {
  tipo: NoticeTipo
  primeiraFrase: string
  children?: ReactNode
  acao?: ReactNode
  className?: string
}): ReactElement {
  return (
    <div
      className={cn(
        "flex gap-(--space-3) border-l-(length:--border-w-easel) border-solid bg-surface-muted p-(--space-4) md:p-(--space-5)",
        FILETE[tipo],
        className,
      )}
    >
      <span className={COR[tipo]}>
        <Icon nome={ICONE[tipo]} />
      </span>
      <div className="flex flex-col gap-(--space-3) text-body">
        <p>
          <span className={COR[tipo]}>{primeiraFrase}</span>
          {children ? <span className="text-ink"> {children}</span> : null}
        </p>
        {acao}
      </div>
    </div>
  )
}
