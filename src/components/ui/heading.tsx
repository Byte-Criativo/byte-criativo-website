import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export type HeadingPapel = "display" | "h1" | "h2" | "h3" | "manifesto"

const PAPEL_CLASSE: Record<HeadingPapel, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  manifesto: "text-manifesto",
}

// RC7: --accent só no `;` com 24 px ou mais. display, h1, h2 e manifesto
// nunca descem disso; h3 começa em 20 px, então usa --accent-text.
const PAPEL_GRANDE: Record<HeadingPapel, boolean> = {
  display: true,
  h1: true,
  h2: true,
  h3: false,
  manifesto: true,
}

export function Heading({
  nivel,
  papel,
  semicolon = false,
  id,
  className,
  children,
}: {
  nivel: 1 | 2 | 3
  papel?: HeadingPapel
  semicolon?: boolean
  id?: string
  className?: string
  children: ReactNode
}): ReactElement {
  const Tag = `h${nivel}` as "h1" | "h2" | "h3"
  const papelFinal: HeadingPapel = papel ?? (`h${nivel}` as HeadingPapel)

  return (
    <Tag
      id={id}
      className={cn(
        "text-balance text-ink",
        PAPEL_CLASSE[papelFinal],
        className,
      )}
    >
      {children}
      {semicolon ? (
        <span
          aria-hidden="true"
          className={
            PAPEL_GRANDE[papelFinal] ? "semicolon" : "semicolon-pequeno"
          }
        >
          ;
        </span>
      ) : null}
    </Tag>
  )
}
