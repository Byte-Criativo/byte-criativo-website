import type { Metadata } from "next"
import { GloboCena } from "./globo-cena"
import type { GloboVariante } from "./globo-motor"

/**
 * Rota TEMPORÁRIA de protótipo: conceito A, "Ponto e vírgula, planeta".
 * Fora do sitemap, da navegação e dos índices. `?v=contida|media|ousada`; ousada é o padrão.
 */
export const metadata: Metadata = {
  title: "Lab: globo de código",
  robots: { index: false, follow: false },
}

const VARIANTES = new Set<string>(["contida", "media", "ousada"])

export default async function LabGloboPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const v =
    typeof params.v === "string" && VARIANTES.has(params.v)
      ? params.v
      : "ousada"
  return <GloboCena variante={v as GloboVariante} />
}
