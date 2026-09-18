/**
 * Substituto explícito de `window.matchMedia` para os testes de unidade:
 * o jsdom não implementa a API, e qualquer componente que consulte mídia
 * quebraria na montagem por lacuna do ambiente, não por defeito seu.
 *
 * R65: o substituto entra **por chamada explícita de cada teste**, nunca
 * como stub global no `vitest.setup.ts`. Um stub global que respondesse
 * sempre `matches: false` faria passar, vazio, justamente o teste de
 * "respeita movimento reduzido" — o componente poderia nunca consultar
 * nada e ninguém notaria. Aqui a consulta e a resposta ficam à vista no
 * próprio teste, `consultas` registra o que o componente pediu de fato, e
 * `responder()` troca a resposta e dispara `change` nas listas já criadas.
 */
export type RespostaDeMidia = (consulta: string) => boolean

export type MatchMediaFalso = {
  /** Consultas que o código sob teste realmente pediu, na ordem. */
  readonly consultas: string[]
  /** Troca a resposta e dispara `change` em todas as listas já entregues. */
  responder: (resposta: RespostaDeMidia) => void
  /** Devolve `window.matchMedia` ao estado anterior. */
  restaurar: () => void
}

type Ouvinte = (evento: MediaQueryListEvent) => void

type ListaFalsa = {
  media: string
  ouvintes: Set<Ouvinte>
  lista: MediaQueryList
}

export function instalarMatchMedia(resposta: RespostaDeMidia): MatchMediaFalso {
  const anterior = Object.getOwnPropertyDescriptor(window, "matchMedia")
  const consultas: string[] = []
  const listas: ListaFalsa[] = []
  let responder = resposta

  function criar(media: string): MediaQueryList {
    const ouvintes = new Set<Ouvinte>()
    const lista = {
      media,
      // Getter, não valor congelado: depois de `responder()` a mesma lista
      // precisa passar a responder a verdade nova.
      get matches() {
        return responder(media)
      },
      onchange: null,
      addEventListener: (tipo: string, ouvinte: Ouvinte) => {
        if (tipo === "change") ouvintes.add(ouvinte)
      },
      removeEventListener: (tipo: string, ouvinte: Ouvinte) => {
        if (tipo === "change") ouvintes.delete(ouvinte)
      },
      addListener: (ouvinte: Ouvinte) => ouvintes.add(ouvinte),
      removeListener: (ouvinte: Ouvinte) => ouvintes.delete(ouvinte),
      dispatchEvent: () => false,
    } as unknown as MediaQueryList

    listas.push({ media, ouvintes, lista })
    return lista
  }

  window.matchMedia = (media: string) => {
    consultas.push(media)
    return criar(media)
  }

  return {
    consultas,
    responder(nova) {
      responder = nova
      for (const { media, ouvintes, lista } of listas) {
        const evento = {
          media,
          matches: lista.matches,
        } as MediaQueryListEvent
        for (const ouvinte of [...ouvintes]) ouvinte(evento)
      }
    },
    restaurar() {
      if (anterior) Object.defineProperty(window, "matchMedia", anterior)
      else Reflect.deleteProperty(window, "matchMedia")
    },
  }
}
