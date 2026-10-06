"use client"

import { useEffect, type RefObject } from "react"
import { HERO_ARTE, type GloboVariante } from "./config"

export type HeroCanvasOpcoes = {
  variante: GloboVariante
  /**
   * Seletor CSS do `;` do título, procurado dentro da seção do hero: é de
   * onde o globo nasce na variação ousada.
   */
  ancoraSeletor: string
}

/**
 * Estado gravado em `data-estado` no próprio canvas, para o CSS fazer o
 * crossfade sem passar por estado React:
 * - "iniciando": ainda sem primeiro quadro (o gradiente CSS aparece);
 * - "pronto": arte na tela;
 * - "fallback": sem Canvas 2D, com saveData ou aparelho fraco — fica o
 *   gradiente.
 */
export type HeroCanvasEstado = "iniciando" | "pronto" | "fallback"

type NavegadorComDicas = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

/**
 * Liga o globo a um canvas que já está no DOM. O efeito em si é barato: só
 * decide o fallback e agenda o início. O motor (GSAP, Canvas 2D, atlas de
 * glifos, laço) é importado de forma tardia, no início ocioso depois do
 * `load`, para não entrar na tarefa de hidratação nem disputar com a
 * pintura do título (que é o LCP). Ver globo-motor.ts para o que acontece
 * de lá em diante: laço pausável, movimento reduzido, resize, rolagem e
 * liberação de recursos.
 */
export function useHeroCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  { variante, ancoraSeletor }: HeroCanvasOpcoes,
): void {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const marcar = (estado: HeroCanvasEstado) => {
      canvas.dataset.estado = estado
    }

    const navegador = navigator as NavegadorComDicas
    const fraco =
      navegador.deviceMemory !== undefined && navegador.deviceMemory <= 1
    if (navegador.connection?.saveData || fraco) {
      marcar("fallback")
      return
    }

    let ativo = true
    let desmontar: (() => void) | null = null
    let cancelarInicio: (() => void) | null = null

    const secao = canvas.closest("section")
    if (!secao) {
      marcar("fallback")
      return
    }

    const iniciar = () => {
      cancelarInicio = null
      void import("./globo-motor").then(({ montarGlobo }) => {
        if (!ativo) return
        desmontar = montarGlobo(canvas, {
          variante,
          secao,
          marcar,
          ancora: () =>
            secao.querySelector(ancoraSeletor)?.getBoundingClientRect() ?? null,
        })
      })
    }
    const agendarInicio = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(iniciar, {
          timeout: HERO_ARTE.esperaInicioMaxMs,
        })
        cancelarInicio = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(iniciar, HERO_ARTE.esperaInicioMinMs)
        cancelarInicio = () => window.clearTimeout(id)
      }
    }
    if (document.readyState === "complete") {
      agendarInicio()
    } else {
      const aoCarregar = () => agendarInicio()
      window.addEventListener("load", aoCarregar, { once: true })
      cancelarInicio = () => window.removeEventListener("load", aoCarregar)
    }

    return () => {
      ativo = false
      cancelarInicio?.()
      desmontar?.()
    }
  }, [ref, variante, ancoraSeletor])
}
