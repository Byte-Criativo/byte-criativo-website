import type { ReactElement, ReactNode } from "react"

/**
 * Recorte acessível: some da tela, continua na árvore de acessibilidade.
 * Só complementa nome ou contexto (RC5); nada essencial para quem enxerga
 * pode viver só aqui.
 *
 * M5: `separador` antepõe um espaço real (fora do recorte) ao conteúdo, sem
 * quem chama precisar lembrar de compor um `{" "}` manual antes da tag. Sem
 * isso, o texto visível anterior e o complemento colam sem espaço: uma
 * quebra de linha do JSX entre o texto e a tag não vira espaço, e o
 * computador de nome acessível (dom-accessibility-api) também não junta o
 * texto de nós irmãos adjacentes com espaço — o nome sairia
 * "Ver estudo de casodo Festival Alumiô".
 */
export function VisuallyHidden({
  as: Tag = "span",
  separador = false,
  children,
}: {
  as?: "span" | "div"
  separador?: boolean
  children: ReactNode
}): ReactElement {
  return (
    <>
      {separador ? " " : null}
      <Tag className="sr-only">{children}</Tag>
    </>
  )
}
