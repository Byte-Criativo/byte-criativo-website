"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { observarGate } from "@/lib/rolagem/gate"
import { assinarRelogio, assinarVeto } from "@/lib/rolagem/ponte"

/** Teto do ocioso depois do `load` (o mesmo do globo do hero). */
const ESPERA_OCIOSO_MAX_MS = 1200
/** Sem `requestIdleCallback` (Safari): espera fixa depois do `load`. */
const ESPERA_OCIOSO_MIN_MS = 250

type Motor = typeof import("@/lib/rolagem/motor")

/**
 * Ilha da inércia da roda. Não renderiza nada. O gate das media queries
 * (mouse que paira, sem movimento reduzido) vem ANTES do `import()`: no
 * toque e com movimento reduzido o chunk do Lenis nem baixa, e a rolagem
 * fica nativa como sempre. Com o gate aberto, o motor entra depois do
 * `load` e de um momento ocioso, como o globo (`use-hero-canvas.ts`), fora
 * da hidratação e da pintura do LCP. O gate é ouvido ao vivo: trocar o
 * movimento reduzido nas preferências desmonta ou monta na hora. O globo da
 * home pode vetar a inércia (modo estático sem aceleração): aí ela sai da
 * home e volta nas outras páginas.
 */
export function MotorDeRolagem(): null {
  const motor = useRef<Motor | null>(null)
  const rota = usePathname()

  useEffect(() => {
    let ativo = true
    // Gate das media queries e veto do globo (modo estático sem aceleração,
    // ver `vetarInercia` em ponte.ts): a inércia só vive com os dois a favor.
    let permitida = false
    let vetada = false
    let desmontar: (() => void) | null = null
    let cancelarInicio: (() => void) | null = null

    const ligar = () => {
      cancelarInicio = null
      void import("@/lib/rolagem/motor").then((modulo) => {
        // O gate pode ter fechado enquanto o chunk baixava.
        if (!ativo || desmontar || !permitida || vetada) return
        motor.current = modulo
        // A ponte vem daqui, não de um import do motor: assim ela mora no
        // chunk do layout, já carregado, em vez de virar um arquivo próprio
        // que o globo e o motor dividiriam (na home do celular, um pedido a
        // mais de ~1,4 KB, quase tudo cabeçalho, por ~150 B de código).
        desmontar = modulo.montarInercia(assinarRelogio)
      })
    }
    const agendar = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(ligar, {
          timeout: ESPERA_OCIOSO_MAX_MS,
        })
        cancelarInicio = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(ligar, ESPERA_OCIOSO_MIN_MS)
        cancelarInicio = () => window.clearTimeout(id)
      }
    }
    const desligar = () => {
      cancelarInicio?.()
      cancelarInicio = null
      desmontar?.()
      desmontar = null
    }
    const decidir = () => {
      if (!permitida || vetada) {
        desligar()
        return
      }
      if (desmontar || cancelarInicio) return
      if (document.readyState === "complete") {
        agendar()
      } else {
        const aoCarregar = () => agendar()
        window.addEventListener("load", aoCarregar, { once: true })
        cancelarInicio = () => window.removeEventListener("load", aoCarregar)
      }
    }

    const pararDeOuvirVeto = assinarVeto((agora) => {
      vetada = agora
      decidir()
    })
    const pararDeOuvirGate = observarGate(
      (consulta) => window.matchMedia(consulta),
      (agora) => {
        permitida = agora
        decidir()
      },
    )

    return () => {
      ativo = false
      pararDeOuvirGate()
      pararDeOuvirVeto()
      desligar()
    }
  }, [])

  // Troca de rota: o Next já rolou (topo, hash ou restauração) quando os
  // efeitos rodam; o Lenis assume a posição real.
  useEffect(() => {
    motor.current?.sincronizar()
  }, [rota])

  return null
}
