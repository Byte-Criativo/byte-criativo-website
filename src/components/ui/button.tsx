import type { Route } from "next"
import Link from "next/link"
import type { MouseEventHandler, ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

// Invoker Commands (commandFor/command) ainda não estão tipados pelo
// @types/react instalado (19.2.17).
declare module "react" {
  // A mesclagem de declaração exige a mesma aridade genérica da interface
  // original; T não é usado no corpo, só na assinatura.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    commandFor?: string
    command?: string
  }
}

export type ButtonVariante = "primario" | "contorno"

const BASE =
  "inline-flex items-center justify-center gap-(--space-2) rounded-(--radius-tag) border-(length:--border-w-control) border-solid px-(--space-5) text-label no-underline transition-colors duration-(--dur-fast)"

const VARIANTE: Record<ButtonVariante, string> = {
  // Borda transparente no primário: some no tema normal e reaparece em
  // cores forçadas, onde o fundo não é desenhado (RC10).
  primario:
    "min-h-(--space-7) border-transparent bg-action text-on-action ponteiro:hover:bg-action-bg-hover",
  // Contorno não troca de fundo no hover: o sublinhado do rótulo vale
  // também dentro do case e no bloco data-bloco="alt".
  contorno:
    "min-h-(--alvo-toque) border-ink bg-bg text-ink ponteiro:hover:underline ponteiro:hover:decoration-(length:--border-w-focus)",
}

export function buttonClasses(
  variante: ButtonVariante = "primario",
  className?: string,
): string {
  return cn(BASE, VARIANTE[variante], className)
}

type ButtonComum = {
  variante?: ButtonVariante
  id?: string
  className?: string
  children: ReactNode
}

type ButtonAcao = ButtonComum & {
  type: "button" | "submit"
  /** RC11: o rótulo não muda; "Enviando…" vai para o texto de status ao lado. */
  enviando?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  commandfor?: string
  command?: string
  "aria-haspopup"?: "dialog"
  href?: never
}

type ButtonNavegacao = ButtonComum & {
  href: string
  "aria-current"?: "page"
  type?: never
}

export type ButtonProps = ButtonAcao | ButtonNavegacao

export function Button(props: ButtonProps): ReactElement {
  const { variante = "primario", id, className, children } = props

  if ("href" in props && props.href !== undefined) {
    return (
      <Link
        id={id}
        href={props.href as Route}
        aria-current={props["aria-current"]}
        className={buttonClasses(variante, className)}
      >
        {children}
      </Link>
    )
  }

  const { type, enviando = false, onClick, commandfor, command } = props

  return (
    <button
      id={id}
      type={type}
      // Nunca `disabled`: o botão continua focável e anunciado; o segundo
      // acionamento é ignorado no handler (especificação, Estados).
      aria-disabled={enviando ? true : undefined}
      aria-haspopup={props["aria-haspopup"]}
      commandFor={commandfor}
      command={command}
      onClick={(evento) => {
        if (enviando) {
          evento.preventDefault()
          return
        }
        onClick?.(evento)
      }}
      className={buttonClasses(variante, className)}
    >
      {children}
    </button>
  )
}
