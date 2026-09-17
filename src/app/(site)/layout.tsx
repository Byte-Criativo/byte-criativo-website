import type { ReactNode } from "react"

export default function SiteLayout({ children }: { children: ReactNode }) {
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
