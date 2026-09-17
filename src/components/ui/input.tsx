import type { ReactElement } from "react"
import { cn } from "@/lib/cn"

export type ControleAria = {
  id: string
  required: boolean
  "aria-describedby"?: string
  "aria-invalid"?: true
}

export const CONTROLE_BASE =
  "w-full rounded-(--radius-tag) border-(length:--border-w-control) border-solid border-border-control bg-surface px-(--space-3) py-(--space-2) text-body text-ink aria-invalid:border-danger-text"

export function Input({
  id,
  name,
  tipo = "text",
  autoComplete,
  inputMode,
  defaultValue,
  required,
  className,
  ...aria
}: ControleAria & {
  name: string
  tipo?: "text" | "tel" | "email"
  /** 1.3.5: obrigatório em todo dado pessoal. */
  autoComplete: string
  inputMode?: "text" | "tel" | "email"
  defaultValue?: string
  className?: string
}): ReactElement {
  return (
    <input
      id={id}
      name={name}
      type={tipo}
      autoComplete={autoComplete}
      inputMode={inputMode}
      defaultValue={defaultValue}
      required={required}
      aria-describedby={aria["aria-describedby"]}
      aria-invalid={aria["aria-invalid"]}
      className={cn(CONTROLE_BASE, "min-h-(--space-7)", className)}
    />
  )
}
