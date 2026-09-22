import type { ReactElement } from "react"

export const email: ReactElement = (
  <>
    <path d="M3 6h18v12H3V6Z" />
    {/* M4 (gate B): a aba precisa tocar os dois cantos superiores do
        corpo — (3,6) e (21,6) — sem emenda de 1 px. */}
    <path d="m3 6 9 7 9-7" />
  </>
)
