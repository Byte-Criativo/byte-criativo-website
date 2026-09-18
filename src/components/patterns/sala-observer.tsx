"use client"

import { useEffect } from "react"

const ENTRADA_DA_SALA = 0.4

/**
 * Única ilha de observação da página. Faz duas coisas, com o custo de um
 * IntersectionObserver cada e **nenhum listener de rolagem na main thread**
 * (plano de qualidade 2.3, item 8):
 *
 * 1. Momento orquestrado: uma sala `larga` que estava inteiramente abaixo da
 *    dobra na hidratação começa em `parede` e volta a `projeto` uma única
 *    vez ao entrar 40% na tela. Com movimento reduzido, nunca entra em
 *    `parede`: a sala fica na cor final, sem transição.
 * 2. Seção atual do IndiceSemicolon: grava `aria-current="true"` no link da
 *    seção mais visível. Esc esconde o rótulo visível do link focado, sem
 *    mover o foco (1.4.13).
 *
 * **Sem JS:** a sala já está na cor do projeto (o véu nasce transparente) e
 * o índice fica sem estado atual e sem rótulo visível.
 */
export function SalaObserver({
  salas = [],
  secoes = [],
}: {
  salas?: string[]
  secoes?: string[]
}): null {
  useEffect(() => {
    if (salas.length === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const alvos = salas
      .map((id) => document.getElementById(id))
      .filter((elemento): elemento is HTMLElement => elemento !== null)
      .filter((elemento) => elemento.dataset.variante === "larga")
      // Só a sala que ninguém viu ainda pode nascer em parede; uma sala já
      // na tela piscaria da parede para a cor do projeto.
      .filter(
        (elemento) => elemento.getBoundingClientRect().top > window.innerHeight,
      )

    if (alvos.length === 0) return

    for (const alvo of alvos) alvo.dataset.estado = "parede"

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.intersectionRatio >= ENTRADA_DA_SALA) {
            const elemento = entrada.target as HTMLElement
            elemento.dataset.estado = "projeto"
            observador.unobserve(elemento)
          }
        }
      },
      { threshold: [ENTRADA_DA_SALA] },
    )

    for (const alvo of alvos) observador.observe(alvo)
    return () => observador.disconnect()
  }, [salas])

  useEffect(() => {
    if (secoes.length === 0) return

    const alvos = secoes
      .map((id) => document.getElementById(id))
      .filter((elemento): elemento is HTMLElement => elemento !== null)
    if (alvos.length === 0) return

    const marcar = (id: string) => {
      for (const link of document.querySelectorAll("[data-indice-link]")) {
        if (link.getAttribute("data-indice-link") === id) {
          link.setAttribute("aria-current", "true")
        } else {
          link.removeAttribute("aria-current")
        }
      }
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visivel) marcar(visivel.target.id)
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] },
    )

    for (const alvo of alvos) observador.observe(alvo)
    return () => observador.disconnect()
  }, [secoes])

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "Escape") return
      const ativo = document.activeElement
      if (
        ativo instanceof HTMLElement &&
        ativo.hasAttribute("data-indice-link")
      ) {
        // Só esconde o rótulo: o foco fica onde está (1.4.13).
        ativo.dataset.rotulo = "oculto"
      }
    }
    document.addEventListener("keydown", aoTeclar)
    return () => document.removeEventListener("keydown", aoTeclar)
  }, [])

  return null
}
