import type { Metadata } from "next"
import { intensidadeValida } from "@/app/(site)/_components/hero-arte/config"
import { LabHero } from "./lab-hero"

/**
 * Rota TEMPORÁRIA de protótipo (Fase 1 do hero com arte generativa).
 * Fora do sitemap, da navegação e dos índices; é removida na Fase 3.
 * `?v=calma|media|intensa` escolhe o preset; `?guia=1` desenha onde o
 * título ficaria.
 */
export const metadata: Metadata = {
  title: "Lab: hero",
  robots: { index: false, follow: false },
}

export default async function LabHeroPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const intensidade = intensidadeValida(params.v) ? params.v : "media"
  return <LabHero intensidade={intensidade} guia={params.guia === "1"} />
}
