"use client"

import { useRef, type ReactElement } from "react"
import { cn } from "@/lib/cn"
import type { HeroIntensidade } from "./config"
import { useHeroCanvas, type HeroAncora } from "./use-hero-canvas"

/**
 * Canvas da arte generativa do hero. É decoração: fora da árvore de
 * acessibilidade, sem ponteiro e fora da ordem de tabulação. Nasce invisível
 * (`data-estado="iniciando"`) sobre o gradiente CSS e aparece em crossfade
 * quando o primeiro quadro é desenhado. Sem WebGL, fica invisível para sempre
 * e o gradiente permanece.
 */
export function HeroCanvas({
  intensidade,
  ancora,
  className,
}: {
  intensidade: HeroIntensidade
  ancora: (largura: number, altura: number) => HeroAncora
  className?: string
}): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null)
  useHeroCanvas(ref, { intensidade, ancora })

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
