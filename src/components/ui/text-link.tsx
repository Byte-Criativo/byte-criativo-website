import type { Route } from "next"
import Link from "next/link"
import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { getSafeRel } from "@/lib/link-security"
import { VisuallyHidden } from "./visually-hidden"

export type TextLinkVariante = "acao" | "inline" | "navegacao"

const BASE = "text-ink underline-offset-(--desloc-sublinhado)"

const VARIANTE: Record<TextLinkVariante, string> = {
  // Link de ação isolado: nunca usa a exceção de texto corrido do 2.5.8.
  acao: "inline-flex min-h-(--alvo-toque) items-center gap-(--space-1) text-label underline decoration-(length:--border-w-decorative) ponteiro:hover:decoration-(length:--border-w-focus)",
  // Dentro de frase: herda tamanho e peso; sempre sublinhado (1.4.1).
  inline:
    "underline decoration-(length:--border-w-decorative) ponteiro:hover:decoration-(length:--border-w-focus)",
  // NavLink: sem sublinhado em repouso; a página atual ganha sublinhado de
  // border.focus junto com aria-current (nunca só cor).
  navegacao:
    "inline-flex min-h-(--alvo-min) items-center no-underline ponteiro:hover:underline ponteiro:hover:decoration-(length:--border-w-decorative) aria-[current]:underline aria-[current]:decoration-(length:--border-w-focus)",
}

export function textLinkClasses(
  variante: TextLinkVariante,
  className?: string,
): string {
  return cn(BASE, VARIANTE[variante], className)
}

export type TextLinkProps = {
  href: string
  variante?: TextLinkVariante
  externo?: boolean
  /** Complemento da RC5: entra depois do texto visível, em VisuallyHidden. */
  complemento?: string
  id?: string
  className?: string
  "aria-current"?: "page" | "true"
  "data-indice-link"?: string
  children: ReactNode
}

export function TextLink({
  href,
  variante = "inline",
  externo = false,
  complemento,
  id,
  className,
  "aria-current": ariaCurrent,
  "data-indice-link": dataIndiceLink,
  children,
}: TextLinkProps): ReactElement {
  // R51: o espaço que separa o texto visível do complemento fica num nó de
  // texto explícito (" "), fora do <VisuallyHidden>. dom-accessibility-api
  // (usado por toHaveAccessibleName/getByRole) não junta o texto de nós
  // adjacentes com espaço, e uma quebra de linha JSX entre dois containers
  // de expressão também não vira espaço — sem isso o nome sai
  // "Ver estudo de casodo Festival Alumiô", sem espaço antes do complemento.
  const conteudo = (
    <>
      {children}
      {complemento ? (
        <>
          {" "}
          <VisuallyHidden>{complemento}</VisuallyHidden>
        </>
      ) : null}
      {externo ? (
        <>
          {/* Marcador de destino, não seta decorativa (RC8). */}
          <span aria-hidden="true">{" ↗"}</span>{" "}
          <VisuallyHidden>(abre em nova aba)</VisuallyHidden>
        </>
      ) : null}
    </>
  )

  const classes = textLinkClasses(variante, className)

  if (externo) {
    return (
      <a
        id={id}
        href={href}
        target="_blank"
        rel={getSafeRel("_blank")}
        aria-current={ariaCurrent}
        data-indice-link={dataIndiceLink}
        className={classes}
      >
        {conteudo}
      </a>
    )
  }

  return (
    <Link
      id={id}
      href={href as Route}
      aria-current={ariaCurrent}
      data-indice-link={dataIndiceLink}
      className={classes}
    >
      {conteudo}
    </Link>
  )
}
