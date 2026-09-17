import type { ReactElement } from "react"
import { cn } from "@/lib/cn"
import { alerta } from "./icons/alerta"
import { ampliar } from "./icons/ampliar"
import { atencao } from "./icons/atencao"
import { confirmado } from "./icons/confirmado"
import { copiar } from "./icons/copiar"
import { email } from "./icons/email"
import { fechar } from "./icons/fechar"
import { mais } from "./icons/mais"
import { menos } from "./icons/menos"
import { pausar } from "./icons/pausar"
import { reproduzir } from "./icons/reproduzir"
import { whatsapp } from "./icons/whatsapp"

const TRACADOS = {
  alerta,
  atencao,
  confirmado,
  whatsapp,
  mais,
  menos,
  fechar,
  ampliar,
  reproduzir,
  pausar,
  email,
  copiar,
} as const

export type IconeNome = keyof typeof TRACADOS

/**
 * SVG inline de 24 × 24 com traço em `border.control` e cor herdada do
 * texto. Decorativo por padrão: nunca é o único nome de um controle
 * (checklist 3.1, item 10).
 */
export function Icon({
  nome,
  titulo,
  className,
}: {
  nome: IconeNome
  titulo?: string
  className?: string
}): ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ strokeWidth: "var(--border-w-control)" }}
      role={titulo ? "img" : undefined}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {titulo ? <title>{titulo}</title> : null}
      {TRACADOS[nome]}
    </svg>
  )
}
