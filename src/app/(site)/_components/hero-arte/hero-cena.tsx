"use client"

import dynamic from "next/dynamic"
import { useLayoutEffect, useRef, type ReactElement } from "react"
import { HERO_ARTE } from "./config"

// O canvas carrega depois do texto, só no cliente: nunca bloqueia a pintura
// e nunca participa do HTML do servidor (sem layout shift: a caixa é a do hero).
const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((modulo) => modulo.HeroCanvas),
  { ssr: false },
)

/**
 * Memória de módulo: vale enquanto a página carregada viver, o que cobre as
 * navegações do App Router (ir a outra rota e voltar à home) sem gravar nada
 * no navegador. Um recarregamento completo toca a entrada completa de novo.
 */
let jaViuEntrada = false

/**
 * Ilha do hero. Três responsabilidades, nenhuma delas um listener de rolagem:
 * 1. carrega o canvas da arte (dynamic import, só no cliente);
 * 2. grava na raiz `data-rolado` (sentinela do topo saiu da tela) e
 *    `data-hero-saiu` (o hero inteiro saiu), que o CSS usa para dar fundo ao
 *    header e mostrar o índice de `;`;
 * 3. marca o hero com `data-entrada="curta"` quando a entrada completa já
 *    tocou nesta sessão de página (antes da primeira pintura da navegação,
 *    por isso useLayoutEffect).
 */
export function HeroCena(): ReactElement {
  const sentinela = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const marcador = sentinela.current
    const hero = marcador?.closest("section")
    if (!marcador || !hero) return

    if (jaViuEntrada) hero.dataset.entrada = "curta"
    jaViuEntrada = true

    const raiz = document.documentElement
    const observadorTopo = new IntersectionObserver(
      (entradas) => {
        const entrada = entradas[0]
        if (entrada)
          raiz.toggleAttribute("data-rolado", !entrada.isIntersecting)
      },
      { threshold: 0 },
    )
    const observadorHero = new IntersectionObserver(
      (entradas) => {
        const entrada = entradas[0]
        if (entrada) {
          raiz.toggleAttribute("data-hero-saiu", !entrada.isIntersecting)
        }
      },
      { threshold: 0 },
    )
    observadorTopo.observe(marcador)
    observadorHero.observe(hero)

    return () => {
      observadorTopo.disconnect()
      observadorHero.disconnect()
      raiz.removeAttribute("data-rolado")
      raiz.removeAttribute("data-hero-saiu")
    }
  }, [])

  return (
    <>
      <div ref={sentinela} aria-hidden="true" className="hero-sentinela" />
      <HeroCanvas
        intensidade={HERO_ARTE.presetDaHome}
        ancoraSeletor=".hero-semicolon"
      />
    </>
  )
}
