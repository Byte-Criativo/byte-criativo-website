"use client"

import Link from "next/link"
import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
} from "react"
import { BrandLogo } from "@/components/patterns/brand-logo"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { homePageData } from "@/content/home"
import estilos from "./globo.module.css"
import type { GloboVariante } from "./globo-motor"

const VARIANTES: readonly GloboVariante[] = ["contida", "media", "ousada"]

/**
 * Cena do protótipo: a composição real do hero (header falso, eyebrow,
 * h1 com `;`, apoio, CTAs) sobre o canvas do globo. A entrada do título
 * reaproveita as classes `.hero-*` que já existem em globals.css; o `;`
 * é atrasado para acender junto com os polos do globo, em 1,3 s.
 */
export function GloboCena({
  variante,
}: {
  variante: GloboVariante
}): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const secaoRef = useRef<HTMLElement>(null)
  const fpsRef = useRef<HTMLSpanElement>(null)
  const hero = homePageData.hero
  const titulo = hero.h1.replace(/;$/, "")
  const palavras = titulo.split(" ")

  useEffect(() => {
    const canvas = canvasRef.current
    const secao = secaoRef.current
    if (!canvas || !secao) return
    let desmontar: (() => void) | null = null
    let vivo = true
    void import("./globo-motor").then(({ montarGlobo }) => {
      if (!vivo) return
      desmontar = montarGlobo(canvas, {
        variante,
        secao,
        ancora: () =>
          secao.querySelector(".hero-semicolon")?.getBoundingClientRect() ??
          null,
        aoFps: (fps) => {
          if (fpsRef.current) fpsRef.current.textContent = `${fps} fps`
        },
      })
    })
    return () => {
      vivo = false
      desmontar?.()
    }
  }, [variante])

  return (
    <div className={estilos.pagina}>
      <header className={estilos.header} aria-label="Header de referência">
        <BrandLogo />
        <nav className={estilos.headerLinks} aria-hidden="true">
          <span>Projetos</span>
          <span>Serviços</span>
          <span>Como trabalhamos</span>
          <span>Sobre</span>
        </nav>
        <div className={estilos.headerCta}>
          <Button href="/contato">Falar sobre meu projeto</Button>
        </div>
      </header>

      <section
        ref={secaoRef}
        id="hero"
        aria-label="Início"
        className={estilos.hero}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          tabIndex={-1}
          className={estilos.canvas}
        />

        <div className={estilos.conteudo}>
          <div className={estilos.coluna}>
            <p
              data-hero-ordem="0"
              className={`${estilos.eyebrow} hero-entrada`}
            >
              Software house orientada por design
            </p>

            <Heading nivel={1} papel="display" className="hero-title">
              <span
                className="hero-title-visual"
                style={{ "--hero-n": palavras.length } as CSSProperties}
              >
                {palavras.map((palavra, indice) => (
                  <Fragment key={`${indice}-${palavra}`}>
                    {indice > 0 ? " " : null}
                    <span
                      className="hero-palavra"
                      style={{ "--hero-i": indice } as CSSProperties}
                    >
                      <span className="hero-palavra-interna">{palavra}</span>
                    </span>
                  </Fragment>
                ))}
                <span
                  aria-hidden="true"
                  className="semicolon hero-semicolon"
                  style={{ animationDelay: "1.3s" }}
                >
                  ;
                </span>
              </span>
            </Heading>

            <div data-hero-ordem="1" className="hero-entrada">
              <Text papel="lede" medida>
                {hero.apoio}
              </Text>
            </div>

            <div
              data-hero-ordem="2"
              className={`${estilos.acoes} hero-entrada`}
            >
              <Button href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </Button>
              <TextLink href={hero.ctaSecondary.href} variante="acao">
                {hero.ctaSecondary.label}
              </TextLink>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className={estilos.veu} />
      </section>

      <div className={estilos.proximo}>
        <Text papel="caption" tom="muted">
          Seção seguinte (Projetos), só para ver a saída ao rolar.
        </Text>
      </div>

      <nav aria-label="Variação" className={estilos.painel}>
        {VARIANTES.map((valor) => (
          <Link
            key={valor}
            href={{ pathname: "/lab/globo", query: { v: valor } }}
            aria-current={valor === variante ? "true" : undefined}
          >
            {valor}
          </Link>
        ))}
        <span ref={fpsRef} />
      </nav>
    </div>
  )
}
