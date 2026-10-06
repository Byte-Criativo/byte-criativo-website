"use client"

import { useEffect, type RefObject } from "react"
import { HERO_ARTE, type HeroIntensidade } from "./config"

export type HeroCanvasOpcoes = {
  intensidade: HeroIntensidade
  /**
   * Seletor CSS do `;` de onde a energia emana, procurado primeiro dentro do
   * pai do canvas. A posição é lida do DOM a cada poucos quadros, então
   * acompanha reflow, troca de fonte e redimensionamento sem observador extra.
   */
  ancoraSeletor: string
}

/**
 * Estado gravado em `data-estado` no próprio canvas, para o CSS fazer o
 * crossfade sem passar por estado React:
 * - "iniciando": ainda sem primeiro quadro (o gradiente CSS aparece);
 * - "pronto": arte na tela;
 * - "fallback": sem WebGL, com saveData, aparelho fraco ou renderizador por
 *   software — fica o gradiente.
 */
export type HeroCanvasEstado = "iniciando" | "pronto" | "fallback"

type NavegadorComDicas = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

/**
 * Liga a arte generativa a um canvas que já está no DOM. O efeito em si é
 * barato: só decide o fallback e agenda o início. O motor (WebGL, shader,
 * laço) é importado de forma tardia, no início ocioso depois do `load`,
 * para não entrar na tarefa de hidratação nem disputar com a pintura do
 * título (que é o LCP). Ver motor.ts para o que acontece de lá em diante:
 * resolução reduzida, laço pausável, qualidade adaptativa, movimento
 * reduzido, perda de contexto, resize e liberação de recursos.
 */
export function useHeroCanvas(
  ref: RefObject<HTMLCanvasElement | null>,
  { intensidade, ancoraSeletor }: HeroCanvasOpcoes,
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

    const iniciar = () => {
      cancelarInicio = null
      void import("./motor").then(({ montarMotor }) => {
        if (!ativo) return
        desmontar = montarMotor(canvas, { intensidade, ancoraSeletor, marcar })
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
  }, [ref, intensidade, ancoraSeletor])
}
