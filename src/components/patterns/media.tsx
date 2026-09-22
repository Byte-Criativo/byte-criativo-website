import Image, { type StaticImageData } from "next/image"
import type { ReactElement } from "react"
import { cn } from "@/lib/cn"

export type MediaFonte = StaticImageData | string

type MediaBase = {
  src: MediaFonte
  width: number
  height: number
  /** Obrigatório: sem `sizes` preciso o Next serve o arquivo errado. */
  sizes: string
  /** Só no LCP do template (CaseHero). Nunca em imagem fora da dobra. */
  prioridade?: boolean
  className?: string
}

export type MediaProps =
  | (MediaBase & { tipo: "captura"; alt: string })
  | (MediaBase & { tipo: "decorativa"; alt: "" })

/**
 * Imagem do site: `next/image` com AVIF e WebP (next.config.ts), dimensões
 * explícitas e `sizes` obrigatório. O `alt` é obrigatório pelo tipo — a
 * captura descreve o ponto da tela, a decorativa só aceita `alt=""`.
 * Sem raio por padrão (`radius.none`); o `radius.media` é do BrowserFrame.
 */
export function Media({
  src,
  width,
  height,
  sizes,
  alt,
  prioridade = false,
  className,
}: MediaProps): ReactElement {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      sizes={sizes}
      alt={alt}
      priority={prioridade}
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : undefined}
      className={cn("h-auto w-full rounded-(--radius-none)", className)}
    />
  )
}
