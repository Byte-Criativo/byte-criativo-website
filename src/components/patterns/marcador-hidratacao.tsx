"use client"

import { useEffect } from "react"

/**
 * Folha Client mínima no layout raiz. Grava `data-hidratado` **só** se
 * `data-js` ainda existir: depois que o script da RC9 remove `data-js`, uma
 * ilha que hidrate atrasada continua no estado visual sem JS.
 */
export function MarcadorHidratacao(): null {
  useEffect(() => {
    const raiz = document.documentElement
    if (raiz.hasAttribute("data-js")) {
      raiz.setAttribute("data-hidratado", "")
    }
  }, [])

  return null
}
