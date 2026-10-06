"use client"

import { useRef, type ReactElement } from "react"
import { cn } from "@/lib/cn"
import type { GloboVariante } from "./config"
import { useHeroCanvas } from "./use-hero-canvas"

/**
 * Canvas do globo de código do hero. É decoração: fora da árvore de
 * acessibilidade, sem ponteiro e fora da ordem de tabulação. Nasce invisível
 * (`data-estado="iniciando"`) sobre o gradiente CSS e aparece em crossfade
 * quando o primeiro quadro é desenhado. Sem Canvas 2D, fica invisível para
 * sempre e o gradiente permanece.
 */
export function HeroCanvas({
  variante,
  ancoraSeletor,
  className,
}: {
  variante: GloboVariante
  ancoraSeletor: string
  className?: string
}): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null)
  useHeroCanvas(ref, { variante, ancoraSeletor })

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      data-estado="iniciando"
      className={cn("hero-arte", className)}
    />
  )
}
