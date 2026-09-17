import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Icon } from "./icon"
import type { ControleAria } from "./input"
import { Text } from "./text"

export type FieldAria = ControleAria

/**
 * Contêiner de campo: label visível acima do controle, ajuda antes do
 * controle (nunca em placeholder), erro abaixo e contador por último.
 * O filho é uma função para receber os atributos ARIA já montados: assim
 * nenhum consumidor consegue apontar `aria-describedby` para um id que não
 * está no DOM (RC11).
 */
export function Field({
  id,
  label,
  obrigatorio,
  tipo = "campo",
  ajuda,
  erro,
  contador,
  className,
  children,
}: {
  id: string
  label: string
  obrigatorio: boolean
  tipo?: "campo" | "opcoes"
  ajuda?: string
  erro?: string
  contador?: string
  className?: string
  children: (aria: FieldAria) => ReactNode
}): ReactElement {
  const idAjuda = `${id}-ajuda`
  const idErro = `${id}-erro`
  const idContador = `${id}-contador`

  const descrito = [
    erro ? idErro : null,
    ajuda ? idAjuda : null,
    contador ? idContador : null,
  ]
    .filter((valor): valor is string => valor !== null)
    .join(" ")

  const aria: FieldAria = {
    id,
    required: obrigatorio,
    ...(descrito.length > 0 ? { "aria-describedby": descrito } : {}),
    ...(erro ? { "aria-invalid": true as const } : {}),
  }

  const textoRotulo = `${label} ${obrigatorio ? "(obrigatório)" : "(opcional)"}`
  const classesRotulo = "text-label text-ink"

  const Caixa = tipo === "opcoes" ? "fieldset" : "div"

  return (
    <Caixa className={cn("flex flex-col gap-(--space-2)", className)}>
      {tipo === "opcoes" ? (
        <legend className={classesRotulo}>{textoRotulo}</legend>
      ) : (
        <label htmlFor={id} className={classesRotulo}>
          {textoRotulo}
        </label>
      )}

      {ajuda ? (
        <Text id={idAjuda} papel="caption" tom="muted">
          {ajuda}
        </Text>
      ) : null}

      {children(aria)}

      {erro ? (
        <p
          id={idErro}
          className="flex items-start gap-(--space-2) text-caption text-danger-text"
        >
          <Icon nome="alerta" />
          {erro}
        </p>
      ) : null}

      {contador ? (
        <Text
          id={idContador}
          papel="caption"
          tom="muted"
          className="tabular-nums"
        >
          {contador}
        </Text>
      ) : null}
    </Caixa>
  )
}
