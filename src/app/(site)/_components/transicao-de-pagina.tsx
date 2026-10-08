import { ViewTransition, type ReactElement, type ReactNode } from "react"

/**
 * Crossfade curto na troca de página. Vai em cada `page.tsx` de (site), não
 * no layout: o layout persiste entre as rotas, e ali `enter`/`exit` nunca
 * disparam (guia de view transitions do Next). A navegação do App Router já
 * é uma transição, então nada mais precisa ligá-la. `default="none"`: só a
 * entrada e a saída da página animam, nunca uma atualização no lugar.
 * Classe `pagina` em globals.css (duração, curva, movimento reduzido); header
 * e rodapé ficam parados com nome próprio. Sem suporte no navegador, a
 * navegação segue igual, sem animação.
 */
export function TransicaoDePagina({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return (
    <ViewTransition enter="pagina" exit="pagina" default="none">
      {children}
    </ViewTransition>
  )
}
