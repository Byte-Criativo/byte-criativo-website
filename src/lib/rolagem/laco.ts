/**
 * Laço da inércia, separado do Lenis para ser testável: acorda num relógio
 * (o ticker do GSAP na home, ou o rAF próprio), roda um passo por quadro e
 * dorme quando o passo diz que acabou. Em repouso não existe.
 */

/** Onde o passo roda: o ticker do globo (pela ponte) ou o rAF próprio. */
export type Relogio = {
  adicionar: (passo: () => void) => void
  remover: (passo: () => void) => void
}

export type Laco = {
  acordar: (relogio: Relogio) => void
  dormir: () => void
  readonly acordado: boolean
}

/**
 * `quadro(primeiro)` roda um passo e devolve se a animação continua.
 * `primeiro` é verdadeiro só na primeira chamada depois de acordar.
 *
 * O primeiro passo nunca dorme. Ele pode chegar SÍNCRONO, de dentro do
 * `acordar`: o ticker do GSAP dormindo (`autoSleep`, com o globo fora da
 * tela) acorda no `add()` e roda um tick na hora. Quem acorda o laço (o
 * evento `virtual-scroll` do Lenis) faz isso antes de começar a animação;
 * dormir nesse passo deixava a animação sem relógio, presa.
 */
export function criarLaco(quadro: (primeiro: boolean) => boolean): Laco {
  let atual: Relogio | null = null
  let primeiro = false

  const passo = () => {
    const eraPrimeiro = primeiro
    primeiro = false
    const continua = quadro(eraPrimeiro)
    if (!continua && !eraPrimeiro) dormir()
  }

  function dormir() {
    if (!atual) return
    const relogio = atual
    atual = null
    relogio.remover(passo)
  }

  return {
    acordar(relogio) {
      if (atual) return
      atual = relogio
      primeiro = true
      relogio.adicionar(passo)
    },
    dormir,
    get acordado() {
      return atual !== null
    },
  }
}

/**
 * Relógio de rAF próprio (fora da home, ou com o ticker limitado). Pede o
 * próximo quadro antes de rodar o passo, para um `remover` dentro do passo
 * cancelar o pedido.
 */
export function relogioDoQuadro(): Relogio {
  let id = 0
  let alvo: (() => void) | null = null
  const tique = () => {
    if (!alvo) return
    id = requestAnimationFrame(tique)
    alvo()
  }
  return {
    adicionar(passo) {
      alvo = passo
      id = requestAnimationFrame(tique)
    },
    remover() {
      alvo = null
      cancelAnimationFrame(id)
    },
  }
}

/**
 * Taxa da tela (Hz) pela mediana dos intervalos entre quadros (ms). A
 * mediana ignora um quadro perdido ou um intervalo de aquecimento.
 */
export function taxaPelosIntervalos(intervalos: number[]): number {
  const validos = intervalos.filter((ms) => ms > 0).sort((a, b) => a - b)
  const meio = validos[Math.floor(validos.length / 2)]
  return meio ? 1000 / meio : 60
}
