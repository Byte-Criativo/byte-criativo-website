/**
 * Âncoras do mesmo documento com a curva da inércia. O manipulador do motor
 * só assume um clique que o navegador trataria como "rolar até `#id` nesta
 * página"; todo o resto (nova aba, download, outro caminho, quem já chamou
 * `preventDefault`, como o resumo de erros do formulário) segue nativo.
 */

type EventoDeClique = Pick<
  MouseEvent,
  | "defaultPrevented"
  | "button"
  | "ctrlKey"
  | "metaKey"
  | "shiftKey"
  | "altKey"
  | "target"
>

type Endereco = Pick<Location, "origin" | "pathname" | "search">

/**
 * Id do destino do clique, ou `null` quando o clique não é uma âncora do
 * mesmo documento que o motor deva assumir. Não confere se o elemento
 * existe: isso é do motor, que deixa o nativo agir quando não acha o alvo
 * (`#top`, `<a name>`).
 */
export function alvoDoClique(
  evento: EventoDeClique,
  endereco: Endereco,
): string | null {
  if (evento.defaultPrevented || evento.button !== 0) return null
  // Modificadores abrem aba, janela ou baixam: não é rolagem.
  if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
    return null
  }
  const origem = evento.target
  if (!(origem instanceof Element)) return null
  const link = origem.closest("a[href]")
  if (!(link instanceof HTMLAnchorElement)) return null
  if (link.target && link.target !== "_self") return null
  if (link.hasAttribute("download")) return null

  let destino: URL
  try {
    destino = new URL(link.href)
  } catch {
    return null
  }
  if (
    destino.origin !== endereco.origin ||
    destino.pathname !== endereco.pathname ||
    destino.search !== endereco.search
  ) {
    return null
  }
  const id = destino.hash.slice(1)
  if (!id) return null
  try {
    return decodeURIComponent(id)
  } catch {
    // `%` solto no fragmento: o navegador procura o id cru.
    return id
  }
}

/**
 * `scroll-padding-top` computado da raiz, em px. Muda por breakpoint e cai
 * para `--space-4` em janelas de até 30 rem de altura, onde o header deixa
 * de ser fixo. O `lenis.scrollTo(elemento)` já desconta esse valor (e o
 * `scroll-margin-top` do alvo) sozinho; este número serve para conferir o
 * pouso, não para somar como `offset`.
 */
export function deslocamentoDoCabecalho(scrollPaddingTop: string): number {
  const px = Number.parseFloat(scrollPaddingTop)
  return Number.isNaN(px) ? 0 : px
}
