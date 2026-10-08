/**
 * Onde a inércia da roda liga. Só com ponteiro fino que paira (mouse) e sem
 * pedido de movimento reduzido. No toque e no trackpad do celular o
 * momentum do sistema já é a sensação pedida: sequestrar o toque é o erro
 * clássico, e lá o chunk do Lenis nem baixa (o gate vem antes do `import()`).
 */
export const CONSULTA_PONTEIRO_FINO = "(hover: hover) and (pointer: fine)"
export const CONSULTA_MOVIMENTO_REDUZIDO = "(prefers-reduced-motion: reduce)"

export type EstadoDoGate = { ponteiroFino: boolean; reduzido: boolean }

export function inerciaPermitida({
  ponteiroFino,
  reduzido,
}: EstadoDoGate): boolean {
  return ponteiroFino && !reduzido
}

type ConsultaDeMidia = Pick<
  MediaQueryList,
  "matches" | "addEventListener" | "removeEventListener"
>

/**
 * Lê as duas consultas, entrega a decisão na hora e de novo a cada mudança
 * (mouse ligado num tablet, movimento reduzido trocado nas preferências com
 * a página aberta). Só chama `aoMudar` quando a decisão muda, não a cada
 * evento das consultas. Devolve a função que para de ouvir.
 */
export function observarGate(
  matchMedia: (consulta: string) => ConsultaDeMidia,
  aoMudar: (permitida: boolean) => void,
): () => void {
  const fino = matchMedia(CONSULTA_PONTEIRO_FINO)
  const reduzido = matchMedia(CONSULTA_MOVIMENTO_REDUZIDO)
  const decidir = () =>
    inerciaPermitida({ ponteiroFino: fino.matches, reduzido: reduzido.matches })

  let atual = decidir()
  aoMudar(atual)

  const aoTrocar = () => {
    const nova = decidir()
    if (nova === atual) return
    atual = nova
    aoMudar(nova)
  }
  fino.addEventListener("change", aoTrocar)
  reduzido.addEventListener("change", aoTrocar)
  return () => {
    fino.removeEventListener("change", aoTrocar)
    reduzido.removeEventListener("change", aoTrocar)
  }
}
