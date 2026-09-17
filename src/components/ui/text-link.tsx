import type { Route } from "next"
import Link from "next/link"
import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { getSafeRel } from "@/lib/link-security"
import { VisuallyHidden } from "./visually-hidden"

export type TextLinkVariante = "acao" | "inline" | "navegacao"

const BASE = "text-ink underline-offset-(--desloc-sublinhado)"

// I1 / RC2: "o foco visível repete o feedback do hover". Cada variante tem
// um par `focus-visible:*` idêntico ao `ponteiro:hover:*` correspondente —
// nunca um valor diferente — porque a especificação de `navegacao` reserva
// border.focus só para o estado "atual" (aria-current); repouso/hover/foco
// (quando não é a página atual) usam border.decorative nos três.
const VARIANTE: Record<TextLinkVariante, string> = {
  // Link de ação isolado: nunca usa a exceção de texto corrido do 2.5.8.
  acao: "inline-flex min-h-(--alvo-toque) items-center gap-(--space-1) text-label underline decoration-(length:--border-w-decorative) ponteiro:hover:decoration-(length:--border-w-focus) focus-visible:decoration-(length:--border-w-focus)",
  // Dentro de frase: herda tamanho e peso; sempre sublinhado (1.4.1).
  inline:
    "underline decoration-(length:--border-w-decorative) ponteiro:hover:decoration-(length:--border-w-focus) focus-visible:decoration-(length:--border-w-focus)",
  // NavLink: sem sublinhado em repouso; a página atual ganha sublinhado de
  // border.focus junto com aria-current (nunca só cor).
  navegacao:
    "inline-flex min-h-(--alvo-min) items-center no-underline ponteiro:hover:underline ponteiro:hover:decoration-(length:--border-w-decorative) focus-visible:underline focus-visible:decoration-(length:--border-w-decorative) aria-[current]:underline aria-[current]:decoration-(length:--border-w-focus)",
}

export function textLinkClasses(
  variante: TextLinkVariante,
  className?: string,
): string {
  return cn(BASE, VARIANTE[variante], className)
}

type TextLinkComum = {
  href: string
  /** Complemento da RC5: entra depois do texto visível, em VisuallyHidden. */
  complemento?: string
  id?: string
  className?: string
  "aria-current"?: "page" | "true"
  "data-indice-link"?: string
  children: ReactNode
}

// M6: "Modificador externo: vale para acao e inline; nunca para navegacao"
// (especificação). União discriminada em vez de `variante?: TextLinkVariante;
// externo?: boolean` soltos, que aceitava `variante="navegacao" externo`.
export type TextLinkProps =
  | (TextLinkComum & { variante?: "acao" | "inline"; externo?: boolean })
  | (TextLinkComum & { variante: "navegacao"; externo?: never })

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
  // M5 / R51: o espaço que separa o texto visível do complemento é
  // responsabilidade do próprio VisuallyHidden (prop `separador`), não
  // deste componente montar um `{" "}` manual — ver o comentário em
  // visually-hidden.tsx para o porquê (RC5).
  const conteudo = (
    <>
      {children}
      {complemento ? (
        <VisuallyHidden separador>{complemento}</VisuallyHidden>
      ) : null}
      {externo ? (
        <>
          {/* Marcador de destino, não seta decorativa (RC8). Espaço não
              separável (U+00A0) antes do glifo para ele não quebrar sozinho
              para a linha seguinte, longe da palavra anterior. */}
          <span aria-hidden="true">{" ↗"}</span>
          <VisuallyHidden separador>(abre em nova aba)</VisuallyHidden>
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
