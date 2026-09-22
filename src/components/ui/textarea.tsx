import type { FormEventHandler, ReactElement } from "react"
import { cn } from "@/lib/cn"
import { CONTROLE_BASE, type ControleAria } from "./input"

export type { ControleAria }

export function Textarea({
  id,
  name,
  autoComplete,
  rows = 6,
  defaultValue,
  required,
  onInput,
  className,
  ...aria
}: ControleAria & {
  name: string
  autoComplete?: string
  rows?: number
  defaultValue?: string
  /** Contador do LeadForm: quem renderiza Textarea num Server Component
      não passa handler (ver C1 em button.tsx); a prop é opcional e só a
      ilha Client a usa. */
  onInput?: FormEventHandler<HTMLTextAreaElement>
  className?: string
}): ReactElement {
  return (
    <textarea
      id={id}
      name={name}
      autoComplete={autoComplete}
      rows={rows}
      defaultValue={defaultValue}
      required={required}
      onInput={onInput}
      aria-describedby={aria["aria-describedby"]}
      aria-invalid={aria["aria-invalid"]}
      // Sem maxlength: colar texto longo não pode cortar em silêncio; o
      // limite vira mensagem (especificação, Field/Acessibilidade).
      className={cn(CONTROLE_BASE, "min-h-(--space-10) resize-y", className)}
    />
  )
}
