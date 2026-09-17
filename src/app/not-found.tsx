import type { Metadata } from "next"
import Link from "next/link"
import { PageFrame } from "@/app/_shared/page-frame"

// Texto final (título, corpo) vem na Fase 8: aqui só garantimos landmark,
// skip link e uma saída para quem cair numa rota inexistente.
export const metadata: Metadata = {
  title: "Página não encontrada",
}

export default function NotFound() {
  return (
    <PageFrame>
      <h1>Página não encontrada</h1>
      <Link href="/">Voltar para a página inicial</Link>
    </PageFrame>
  )
}
