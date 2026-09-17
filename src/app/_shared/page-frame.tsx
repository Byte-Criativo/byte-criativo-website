import type { ReactNode } from "react"
import { SkipLink } from "@/components/ui/skip-link"

/**
 * Par skip link + landmark <main> compartilhado entre o layout do grupo
 * (site) e as páginas de erro na raiz de src/app/ (como not-found.tsx),
 * que não são cobertas por esse layout de grupo. Mantém os dois em sincronia
 * sem criar uma dependência de um lado no outro.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
