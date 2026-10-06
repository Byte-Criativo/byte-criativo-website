"use client"

import { useEffect, useLayoutEffect, useRef, type ReactElement } from "react"
import { HERO_ARTE } from "./config"
import { HeroCanvas } from "./hero-canvas"

/**
 * Memória de módulo: vale enquanto a página carregada viver, o que cobre as
 * navegações do App Router (ir a outra rota e voltar à home) sem gravar nada
 * no navegador. Um recarregamento completo toca a entrada completa de novo.
 */
let jaViuEntrada = false

/**
 * Ilha do hero. Três responsabilidades, nenhuma delas um listener de rolagem:
 * 1. monta o canvas da arte (o motor WebGL chega por import tardio, no
 *    início ocioso depois do load — ver use-hero-canvas.ts);
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

  // A memória só é gravada quando o hero sai do DOM de verdade (troca de
  // rota). A limpeza de um efeito passivo roda depois de o nó ser removido,
  // então `isConnected` separa a desmontagem real da repetição do efeito no
  // modo estrito do React em dev — que, sem a guarda, marcaria a entrada
  // como "já vista" na primeira visita.
  useEffect(() => {
    const hero = sentinela.current?.closest("section")
    return () => {
      if (hero && !hero.isConnected) jaViuEntrada = true
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
