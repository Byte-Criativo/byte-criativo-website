import { describe, expect, it, vi } from "vitest"
import {
  CONSULTA_MOVIMENTO_REDUZIDO,
  CONSULTA_PONTEIRO_FINO,
  inerciaPermitida,
  observarGate,
} from "./gate"

/** Consulta de mídia falsa: `matches` mutável e `change` disparável. */
function consultaFalsa(matches: boolean) {
  const ouvintes = new Set<() => void>()
  return {
    matches,
    addEventListener: vi.fn((_tipo: string, fn: () => void) => {
      ouvintes.add(fn)
    }),
    removeEventListener: vi.fn((_tipo: string, fn: () => void) => {
      ouvintes.delete(fn)
    }),
    mudar(novo: boolean) {
      this.matches = novo
      for (const fn of ouvintes) fn()
    },
    get ouvintes() {
      return ouvintes.size
    },
  }
}

function montar(fino: boolean, reduzido: boolean) {
  const consultas = {
    [CONSULTA_PONTEIRO_FINO]: consultaFalsa(fino),
    [CONSULTA_MOVIMENTO_REDUZIDO]: consultaFalsa(reduzido),
  }
  const matchMedia = (consulta: string) => {
    const c = consultas[consulta as keyof typeof consultas]
    if (!c) throw new Error(`consulta inesperada: ${consulta}`)
    return c
  }
  const decisoes: boolean[] = []
  const parar = observarGate(matchMedia, (permitida) =>
    decisoes.push(permitida),
  )
  return {
    fino: consultas[CONSULTA_PONTEIRO_FINO],
    reduzido: consultas[CONSULTA_MOVIMENTO_REDUZIDO],
    decisoes,
    parar,
  }
}

describe("gate da inércia", () => {
  it("liga só com ponteiro fino e sem movimento reduzido", () => {
    expect(inerciaPermitida({ ponteiroFino: true, reduzido: false })).toBe(true)
    expect(inerciaPermitida({ ponteiroFino: true, reduzido: true })).toBe(false)
    expect(inerciaPermitida({ ponteiroFino: false, reduzido: false })).toBe(
      false,
    )
    expect(inerciaPermitida({ ponteiroFino: false, reduzido: true })).toBe(
      false,
    )
  })

  it("as consultas são as combinadas: mouse que paira e movimento reduzido", () => {
    expect(CONSULTA_PONTEIRO_FINO).toBe("(hover: hover) and (pointer: fine)")
    expect(CONSULTA_MOVIMENTO_REDUZIDO).toBe("(prefers-reduced-motion: reduce)")
  })

  it("entrega a decisão inicial na hora", () => {
    expect(montar(true, false).decisoes).toEqual([true])
    expect(montar(false, false).decisoes).toEqual([false])
    expect(montar(true, true).decisoes).toEqual([false])
  })

  it("desliga e religa ao vivo quando o movimento reduzido muda", () => {
    const g = montar(true, false)
    g.reduzido.mudar(true)
    g.reduzido.mudar(false)
    expect(g.decisoes).toEqual([true, false, true])
  })

  it("liga ao vivo quando um mouse aparece (tablet com mouse)", () => {
    const g = montar(false, false)
    g.fino.mudar(true)
    expect(g.decisoes).toEqual([false, true])
  })

  it("não repete a decisão quando a troca não muda o resultado", () => {
    const g = montar(false, false)
    // Movimento reduzido liga e desliga, mas sem ponteiro fino a inércia
    // continua desligada: nenhuma chamada nova.
    g.reduzido.mudar(true)
    g.reduzido.mudar(false)
    expect(g.decisoes).toEqual([false])
  })

  it("para de ouvir as duas consultas", () => {
    const g = montar(true, false)
    expect(g.fino.ouvintes).toBe(1)
    expect(g.reduzido.ouvintes).toBe(1)
    g.parar()
    expect(g.fino.ouvintes).toBe(0)
    expect(g.reduzido.ouvintes).toBe(0)
    g.reduzido.mudar(true)
    expect(g.decisoes).toEqual([true])
  })
})
