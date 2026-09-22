import dynamic from "next/dynamic"
import type { ReactElement } from "react"
import { cn } from "@/lib/cn"
import { Media } from "./media"
import type { FonteVideo } from "./video-loop-ilha"

// Import dinâmico: nenhuma rota sem vídeo paga por este código.
const VideoLoopIlha = dynamic(() =>
  import("./video-loop-ilha").then((modulo) => modulo.VideoLoopIlha),
)

export type { FonteVideo }

/**
 * Figura do loop. O HTML do servidor já traz poster, descrição textual e a
 * caixa reservada; a ilha só troca o poster pelo vídeo perto da viewport.
 * Nunca é LCP e nunca aparece na primeira dobra.
 */
export function VideoLoop({
  poster,
  fontes,
  descricao,
  data,
  complemento,
  width,
  height,
  className,
}: {
  poster: string
  fontes: FonteVideo[]
  descricao: string
  data: string
  complemento: string
  width: number
  height: number
  className?: string
}): ReactElement {
  return (
    <figure className={cn("flex flex-col", className)}>
      <VideoLoopIlha
        poster={poster}
        fontes={fontes}
        complemento={complemento}
        width={width}
        height={height}
      >
        <Media
          tipo="decorativa"
          alt=""
          src={poster}
          width={width}
          height={height}
          sizes="(min-width: 64rem) 58vw, 100vw"
        />
      </VideoLoopIlha>
      <figcaption className="pt-(--space-2) text-caption text-ink-muted">
        {`${descricao} ${data}`}
      </figcaption>
    </figure>
  )
}
