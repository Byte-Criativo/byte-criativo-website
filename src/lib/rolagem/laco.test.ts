import { afterEach, describe, expect, it, vi } from "vitest"
import { criarLaco, relogioDoQuadro, taxaPelosIntervalos } from "./laco"

/**
 * Relógio falso. `sincrono` imita o ticker do GSAP dormindo: o `add()` o
 * acorda e roda um tick na hora, de dentro de quem adicionou.
 */
function relogioFalso({ sincrono }: { sincrono: boolean }) {
  const passos = new Set<() => void>()
  return {
    adicionar: vi.fn((passo: () => void) => {
      passos.add(passo)
      if (sincrono) passo()
    }),
    remover: vi.fn((passo: () => void) => {
      passos.delete(passo)
    }),
    tique() {
      for (const passo of [...passos]) passo()
    },
    get inscritos() {
      return passos.size
    },
  }
}

describe("criarLaco", () => {
  it("regressão: tick síncrono no acordar, antes de a animação começar, não faz dormir", () => {
    let animando = false
    const chamadas: boolean[] = []
    const laco = criarLaco((primeiro) => {
      chamadas.push(primeiro)
      return animando
    })
    const relogio = relogioFalso({ sincrono: true })

    // O Lenis emite `virtual-scroll` (acorda o laço) e só depois começa a
    // animação: o tick síncrono vê "não está animando".
    laco.acordar(relogio)
    animando = true

    expect(chamadas).toEqual([true])
    expect(laco.acordado).toBe(true)
    expect(relogio.inscritos).toBe(1)

    relogio.tique()
    relogio.tique()
    expect(chamadas).toEqual([true, false, false])
    expect(laco.acordado).toBe(true)

    animando = false
    relogio.tique()
    expect(laco.acordado).toBe(false)
    expect(relogio.inscritos).toBe(0)
  })

  it("acordado depois de a animação começar (microtarefa do motor), o tique síncrono já anda no próprio evento", () => {
    let animando = false
    const avancos: boolean[] = []
    const laco = criarLaco((primeiro) => {
      if (animando) avancos.push(primeiro)
      return animando
    })
    const relogio = relogioFalso({ sincrono: true })
    // Ordem do motor: o Lenis começa a animação no mesmo evento de roda e
    // só depois (microtarefa) o laço acorda.
    animando = true
    laco.acordar(relogio)
    expect(avancos).toEqual([true])
    relogio.tique()
    expect(avancos).toEqual([true, false])
    expect(laco.acordado).toBe(true)
  })

  it("relógio assíncrono: primeiro passo marcado, dorme quando a animação acaba", () => {
    let restantes = 3
    const chamadas: boolean[] = []
    const laco = criarLaco((primeiro) => {
      chamadas.push(primeiro)
      restantes -= 1
      return restantes > 0
    })
    const relogio = relogioFalso({ sincrono: false })
    laco.acordar(relogio)
    expect(chamadas).toEqual([])
    relogio.tique()
    relogio.tique()
    relogio.tique()
    expect(chamadas).toEqual([true, false, false])
    expect(laco.acordado).toBe(false)
    expect(relogio.remover).toHaveBeenCalledTimes(1)
  })

  it("um gesto que não anima (Ctrl+roda) dorme no segundo passo", () => {
    const laco = criarLaco(() => false)
    const relogio = relogioFalso({ sincrono: false })
    laco.acordar(relogio)
    relogio.tique()
    expect(laco.acordado).toBe(true)
    relogio.tique()
    expect(laco.acordado).toBe(false)
  })

  it("acordar de novo enquanto acordado não inscreve duas vezes", () => {
    const laco = criarLaco(() => true)
    const relogio = relogioFalso({ sincrono: false })
    laco.acordar(relogio)
    laco.acordar(relogio)
    expect(relogio.adicionar).toHaveBeenCalledTimes(1)
  })

  it("dormir tira o passo do relógio em que ele está", () => {
    const laco = criarLaco(() => true)
    const a = relogioFalso({ sincrono: false })
    laco.acordar(a)
    laco.dormir()
    expect(a.inscritos).toBe(0)
    const b = relogioFalso({ sincrono: false })
    laco.acordar(b)
    expect(b.inscritos).toBe(1)
  })
})

describe("relogioDoQuadro", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("roda o passo por quadro e para ao remover (inclusive de dentro do passo)", () => {
    const fila: FrameRequestCallback[] = []
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((fn: FrameRequestCallback) => fila.push(fn)),
    )
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
    const quadro = () => fila.shift()?.(0)

    const relogio = relogioDoQuadro()
    let n = 0
    const passo = () => {
      n += 1
      if (n === 3) relogio.remover(passo)
    }
    relogio.adicionar(passo)
    quadro()
    quadro()
    quadro()
    quadro()
    quadro()
    expect(n).toBe(3)
  })
})

describe("taxaPelosIntervalos", () => {
  it("mediana dos intervalos, imune a um quadro perdido", () => {
    expect(Math.round(taxaPelosIntervalos([16.7, 16.6, 33.4, 16.7]))).toBe(60)
    expect(Math.round(taxaPelosIntervalos([8.3, 8.4, 8.3, 16.7, 8.3]))).toBe(
      120,
    )
    expect(Math.round(taxaPelosIntervalos([6.9, 7, 6.9]))).toBe(145)
  })

  it("sem amostras válidas, assume 60 Hz", () => {
    expect(taxaPelosIntervalos([])).toBe(60)
    expect(taxaPelosIntervalos([0, -1])).toBe(60)
  })
})
