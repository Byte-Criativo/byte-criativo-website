import type { Metadata } from "next"
import { LabLinha } from "./lab-linha"
import { variacaoValida } from "./variacao"

/**
 * Rota TEMPORÁRIA de protótipo: conceito B, "A Mesma Linha", para
 * comparação com o conceito A. Fora do sitemap, da navegação e dos
 * índices. `?v=contida|ousada` escolhe a variação; sem parâmetro é a base.
 */
export const metadata: Metadata = {
  title: "Lab: a mesma linha",
  robots: { index: false, follow: false },
}

export default async function LabLinhaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const variacao = variacaoValida(params.v) ? params.v : "base"
  return <LabLinha variacao={variacao} />
}
