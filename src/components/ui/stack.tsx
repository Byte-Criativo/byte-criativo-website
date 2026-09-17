import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

// M6: a especificação (tabela de primitivos) só permite --space-2 a
// --space-10 como espaço entre filhos do Stack — --space-1 é fino demais
// para ser um espaçamento "entre itens de uma pilha" e não consta na
// tabela.
export type EspacoPasso = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Classes literais: o Tailwind lê o código-fonte, então `gap-(--space-${n})`
// interpolado não seria encontrado pelo scanner.
const ESPACO_CLASSE: Record<EspacoPasso, string> = {
  2: "gap-(--space-2)",
  3: "gap-(--space-3)",
  4: "gap-(--space-4)",
  5: "gap-(--space-5)",
  6: "gap-(--space-6)",
  7: "gap-(--space-7)",
  8: "gap-(--space-8)",
  9: "gap-(--space-9)",
  10: "gap-(--space-10)",
}

export function Stack({
  as: Tag = "div",
  espaco = 4,
  rotulo,
  className,
  children,
}: {
  as?: "div" | "ul" | "ol"
  espaco?: EspacoPasso
  rotulo?: string
  className?: string
  children: ReactNode
}): ReactElement {
  const ehLista = Tag === "ul" || Tag === "ol"
  return (
    <Tag
      // I2: o preflight do Tailwind zera list-style em ul/ol, o que remove
      // o papel implícito de lista no Safari/VoiceOver (o papel nativo só
      // some com list-style: none nesse par navegador/leitor de tela — o
      // jsdom não aplica CSS, então um teste sem este atributo passaria por
      // engano). role="list" explícito devolve o papel independente do CSS.
      role={ehLista ? "list" : undefined}
      aria-label={ehLista ? rotulo : undefined}
      className={cn("flex flex-col", ESPACO_CLASSE[espaco], className)}
    >
      {children}
    </Tag>
  )
}
