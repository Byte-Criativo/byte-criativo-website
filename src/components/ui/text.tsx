import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export type TextoPapel = "body" | "lede" | "caption" | "code"
export type TextoTom = "ink" | "muted"

const PAPEL_CLASSE: Record<TextoPapel, string> = {
  body: "text-body",
  lede: "text-lede",
  caption: "text-caption",
  // RC8: IBM Plex Mono só em código (verso dos cases).
  code: "text-code font-mono",
}

const TOM_CLASSE: Record<TextoTom, string> = {
  ink: "text-ink",
  muted: "text-ink-muted",
}

export function Text({
  as: Tag = "p",
  papel = "body",
  tom = "ink",
  medida = false,
  id,
  className,
  children,
}: {
  as?: "p" | "span" | "strong" | "code"
  papel?: TextoPapel
  tom?: TextoTom
  medida?: boolean
  id?: string
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <Tag
      id={id}
      className={cn(
        PAPEL_CLASSE[papel],
        TOM_CLASSE[tom],
        medida && "max-w-(--medida-max)",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
