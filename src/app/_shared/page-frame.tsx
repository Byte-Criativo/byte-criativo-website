import type { ReactNode } from "react"

/**
 * Par skip link + landmark <main> compartilhado entre o layout do grupo
 * (site) e as páginas de erro na raiz de src/app/ (como not-found.tsx),
 * que não são cobertas por esse layout de grupo. Mantém os dois em sincronia
 * sem criar uma dependência de um lado no outro.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-bg focus:p-3"
      >
        Pular para o conteúdo
      </a>
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
