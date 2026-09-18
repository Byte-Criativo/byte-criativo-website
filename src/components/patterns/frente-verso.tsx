"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { cn } from "@/lib/cn"

type Face = "frente" | "verso"

type ContextoFrenteVerso = {
  projeto: string
  face: Face
  trocar: (face: Face) => void
}

const Contexto = createContext<ContextoFrenteVerso | null>(null)

function useFrenteVerso(): ContextoFrenteVerso {
  const contexto = useContext(Contexto)
  if (!contexto) {
    throw new Error(
      "FrenteVersoControle e FrenteVersoFaces precisam estar dentro de FrenteVersoProvider",
    )
  }
  return contexto
}

/**
 * Ilha Client do Frente/Verso. O controle fica na cabeça da Ficha (parede) e
 * as faces dentro da sala, então o estado mora num provedor que envolve os
 * dois. `frente` e `verso` chegam renderizados no servidor: a ilha só
 * controla atributos.
 */
export function FrenteVersoProvider({
  projeto,
  children,
}: {
  projeto: string
  children: ReactNode
}): ReactElement {
  const [face, trocar] = useState<Face>("frente")
  return (
    <Contexto.Provider value={{ projeto, face, trocar }}>
      {children}
    </Contexto.Provider>
  )
}

const FACES: ReadonlyArray<{ valor: Face; rotulo: string }> = [
  { valor: "frente", rotulo: "Frente" },
  { valor: "verso", rotulo: "Verso" },
]

export function FrenteVersoControle({
  className,
}: {
  className?: string
}): ReactElement {
  const { projeto, face, trocar } = useFrenteVerso()

  return (
    <div
      role="group"
      aria-label={`Mostrar a frente ou o verso do ${projeto}`}
      // RC10: seletor estável para a regra de forced-colors em globals.css
      // mirar só o botão pressionado deste controle (Highlight/HighlightText).
      data-controle-frente-verso
      // RC9: o controle só existe com JS; sem JS as faces ficam empilhadas.
      className={cn(
        "hidden overflow-hidden rounded-(--radius-tag) border-(length:--border-w-control) border-solid border-ink js:inline-flex",
        className,
      )}
    >
      {FACES.map(({ valor, rotulo }, indice) => (
        <button
          key={valor}
          type="button"
          aria-pressed={face === valor}
          onClick={() => trocar(valor)}
          className={cn(
            "min-h-(--space-7) min-w-(--space-8) px-(--space-3) text-label transition-colors duration-(--dur-fast) focus-visible:relative",
            indice === 1 &&
              "border-l-(length:--border-w-control) border-solid border-ink",
            face === valor
              ? "bg-ink text-bg"
              : // RC2: o foco visível repete o feedback do hover — o par
                // focus-visible: é obrigatório ao lado de todo ponteiro:hover:.
                "bg-surface text-ink focus-visible:bg-surface-muted ponteiro:hover:bg-surface-muted",
          )}
        >
          {rotulo}
        </button>
      ))}
    </div>
  )
}

export function FrenteVersoFaces({
  frente,
  verso,
  className,
}: {
  frente: ReactNode
  verso: ReactNode
  className?: string
}): ReactElement {
  const { face } = useFrenteVerso()

  return (
    <div className={cn("grid gap-(--space-5)", className)}>
      <div
        data-face="frente"
        data-ativo={face === "frente"}
        className="js:col-start-1 js:row-start-1"
      >
        <h3 className="text-label text-ink js:sr-only">Frente</h3>
        {frente}
      </div>
      <div
        data-face="verso"
        data-ativo={face === "verso"}
        // Redefine todas as vars: por isso o verso pode viver dentro da sala.
        data-surface="verso"
        className="bg-bg p-(--space-5) lg:p-(--space-6) js:col-start-1 js:row-start-1"
      >
        <h3 className="text-label text-ink js:sr-only">Verso</h3>
        {verso}
      </div>
    </div>
  )
}
