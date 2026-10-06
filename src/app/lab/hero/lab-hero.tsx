"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, type ReactElement } from "react"
import {
  INTENSIDADES,
  type HeroIntensidade,
} from "@/app/(site)/_components/hero-arte/config"
import type { HeroAncora } from "@/app/(site)/_components/hero-arte/use-hero-canvas"

// Carregado só no cliente, depois do texto: o canvas nunca bloqueia a pintura.
const HeroCanvas = dynamic(
  () =>
    import("@/app/(site)/_components/hero-arte/hero-canvas").then(
      (m) => m.HeroCanvas,
    ),
  { ssr: false },
)

/**
 * Âncora provisória do protótipo: onde o `;` do h1 ficaria na home.
 * Na Fase 2 a posição vem do próprio elemento no DOM.
 */
function ancoraDoLab(largura: number, altura: number): HeroAncora {
  return largura / altura > 1 ? { x: 0.27, y: 0.62 } : { x: 0.68, y: 0.57 }
}

function ContadorQuadros(): ReactElement {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let quadros = 0
    let inicio = performance.now()
    let raf = 0
    const tique = (agora: number) => {
      quadros += 1
      if (agora - inicio >= 1000) {
        if (ref.current) ref.current.textContent = `${quadros} fps`
        quadros = 0
        inicio = agora
      }
      raf = requestAnimationFrame(tique)
    }
    raf = requestAnimationFrame(tique)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <span ref={ref} />
}

export function LabHero({
  intensidade,
  guia,
}: {
  intensidade: HeroIntensidade
  guia: boolean
}): ReactElement {
  return (
    <div className="lab-hero">
      <HeroCanvas intensidade={intensidade} ancora={ancoraDoLab} />

      {guia ? (
        <div aria-hidden="true" className="lab-hero-guia">
          <p className="lab-hero-guia-titulo text-h1">
            Software sob medida com design que diferencia
            <span className="semicolon">;</span>
          </p>
        </div>
      ) : null}

      <nav aria-label="Intensidade" className="lab-hero-painel text-caption">
        {INTENSIDADES.map((valor) => (
          <Link
            key={valor}
            href={{
              pathname: "/lab/hero",
              query: guia ? { v: valor, guia: "1" } : { v: valor },
            }}
            aria-current={valor === intensidade ? "true" : undefined}
          >
            {valor}
          </Link>
        ))}
        <Link
          href={{
            pathname: "/lab/hero",
            query: guia ? { v: intensidade } : { v: intensidade, guia: "1" },
          }}
        >
          {guia ? "sem guia" : "guia"}
        </Link>
        <ContadorQuadros />
      </nav>
    </div>
  )
}
