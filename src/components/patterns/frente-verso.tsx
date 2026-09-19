"use client"

import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"

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

const CLASSE_CONTROLE =
  "hidden overflow-hidden rounded-(--radius-tag) border-(length:--border-w-control) border-solid border-ink js:inline-flex"
const CLASSE_BOTAO =
  "min-h-(--space-7) min-w-(--space-8) px-(--space-3) text-label transition-colors duration-(--dur-fast) focus-visible:relative"
const CLASSE_ATIVO = "bg-ink text-bg"
const CLASSE_INATIVO =
  "bg-surface text-ink focus-visible:bg-surface-muted ponteiro:hover:bg-surface-muted"

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
      data-controle-frente-verso
      className={
        className ? `${CLASSE_CONTROLE} ${className}` : CLASSE_CONTROLE
      }
    >
      {FACES.map(({ valor, rotulo }, indice) => (
        <button
          key={valor}
          type="button"
          aria-pressed={face === valor}
          onClick={() => trocar(valor)}
          className={`${CLASSE_BOTAO}${indice === 1 ? "border-l-(length:--border-w-control) border-solid border-ink" : ""} ${face === valor ? CLASSE_ATIVO : CLASSE_INATIVO}`}
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
    <div
      className={
        className ? `grid gap-(--space-5) ${className}` : "grid gap-(--space-5)"
      }
    >
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
