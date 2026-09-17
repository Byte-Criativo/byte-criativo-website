import type { ReactElement } from "react"
import { cn } from "@/lib/cn"
import type { FieldAria } from "./field"

export type RadioOpcao = { valor: string; rotulo: string }

/**
 * Grupo de rádio nativo. O nome do grupo vem da `legend` do Field; o nome de
 * cada opção vem do `label` que envolve o controle. Tab entra e sai do
 * grupo; as setas movem e marcam — comportamento nativo garantido pelo
 * `name` compartilhado, conferido em navegador real no e2e da L5.3.
 */
export function RadioGroup({
  name,
  opcoes,
  defaultValue,
  colunas = 1,
  aria,
}: {
  name: string
  opcoes: RadioOpcao[]
  defaultValue?: string
  colunas?: 1 | 2
  aria: FieldAria
}): ReactElement {
  return (
    <div
      className={cn(
        "grid gap-(--space-2)",
        colunas === 2 ? "md:grid-cols-2" : "grid-cols-1",
      )}
    >
      {opcoes.map((opcao) => (
        <label
          key={opcao.valor}
          className="flex min-h-(--alvo-toque) items-center gap-(--space-2) text-body text-ink"
        >
          {/* Especificação, Field › Estados, "Inválido": aria-invalid="true"
              no controle — em opcoes, em cada Radio. */}
          <input
            type="radio"
            name={name}
            value={opcao.valor}
            defaultChecked={defaultValue === opcao.valor}
            required={aria.required}
            aria-invalid={aria["aria-invalid"]}
            aria-describedby={aria["aria-describedby"]}
            className="accent-ink"
          />
          {opcao.rotulo}
        </label>
      ))}
    </div>
  )
}
