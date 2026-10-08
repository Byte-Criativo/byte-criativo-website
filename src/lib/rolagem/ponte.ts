/**
 * Ponte entre o globo do hero e o motor da inércia. Não importa nada de
 * propósito: nem `gsap` nem `lenis`. Se importasse, o Turbopack juntaria o
 * Lenis ao chunk do globo (que baixa no celular) ou o globo ao chunk do
 * Lenis (que só baixa com mouse). Os dois lados chegam por `import()`
 * tardio, em ordem indefinida, por isso quem assina recebe o estado atual
 * na hora.
 */

/**
 * O relógio do globo, oferecido enquanto ele está montado. O motor entra
 * nele com prioridade para escrever a rolagem antes do `desenhar` do mesmo
 * quadro, e chama `aoRolar` (o `ScrollTrigger.update`) a cada passo da
 * inércia, sem esperar o evento `scroll` do quadro seguinte.
 */
export type RelogioDoGlobo = {
  adicionar: (passo: () => void) => void
  remover: (passo: () => void) => void
  aoRolar: () => void
  /**
   * O ticker acompanha uma tela de `hz`? Falso quando o teto de fps dos
   * degraus (60, ou 30 no último) fica abaixo dela: aí a inércia anda no rAF
   * próprio, senão herdaria o teto.
   */
  noRitmoDaTela: (hz: number) => boolean
}

type Assinante = (relogio: RelogioDoGlobo | null) => void

let atual: RelogioDoGlobo | null = null
const assinantes = new Set<Assinante>()

function avisar(): void {
  for (const assinante of assinantes) assinante(atual)
}

export function oferecerRelogio(relogio: RelogioDoGlobo): void {
  atual = relogio
  avisar()
}

export function retirarRelogio(): void {
  if (!atual) return
  atual = null
  avisar()
}

/** Entrega o relógio atual (ou `null`) já, e de novo a cada troca. */
export function assinarRelogio(assinante: Assinante): () => void {
  assinantes.add(assinante)
  assinante(atual)
  return () => {
    assinantes.delete(assinante)
  }
}

/*
 * Veto da inércia, pelo globo. No modo estático por falta de aceleração
 * (renderizador por software, ou o custo medido dos primeiros quadros), cada
 * quadro do canvas é uma cópia cara na composição; a inércia faz a rolagem
 * mudar a cada quadro com o hero na tela, e o trace sem GPU + CPU 4× piorou
 * (p95 33,4 → 50,1 ms, 7 → 9 tarefas longas). Vetada, a ilha desmonta o
 * Lenis por inteiro: parado ele ainda seguraria a roda num ouvinte não
 * passivo, atrás das tarefas longas da thread principal.
 */
let vetada = false
const assinantesDoVeto = new Set<(vetada: boolean) => void>()

export function vetarInercia(novo: boolean): void {
  if (novo === vetada) return
  vetada = novo
  for (const assinante of assinantesDoVeto) assinante(vetada)
}

/** Entrega o veto atual já, e de novo a cada troca. */
export function assinarVeto(assinante: (vetada: boolean) => void): () => void {
  assinantesDoVeto.add(assinante)
  assinante(vetada)
  return () => {
    assinantesDoVeto.delete(assinante)
  }
}
