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
import estilos from "./linha.module.css"
import { VARIACOES, type Variacao } from "./variacao"

const TITULO = "Software sob medida com design que diferencia"
const APOIO =
  "Somos uma software house que une design e desenvolvimento para criar sites, sistemas e produtos digitais sob medida. Da primeira ideia ao software em uso."

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

export function LabLinha({ variacao }: { variacao: Variacao }): ReactElement {
  const cena = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const ultimoCta = useRef<HTMLDivElement>(null)
  const palavras = TITULO.split(" ")

  useEffect(() => {
    const raizCena = cena.current
    const raizSvg = svg.current
    if (!raizCena || !raizSvg) return
    let desmontar: (() => void) | null = null
    let ativo = true
    let espera = 0

    const montar = async () => {
      const { montarLinha } = await import("./linha")
      if (!ativo) return
      desmontar?.()
      desmontar = montarLinha(
        raizSvg,
        {
          traco: estilos.traco ?? "",
          tracoFundo: estilos.tracoFundo ?? "",
          forma: estilos.forma ?? "",
          codigo: estilos.codigo ?? "",
          codigoString: estilos.codigoString ?? "",
          semicolon: estilos.semicolon ?? "",
        },
        {
          variacao,
          ancora: () => {
            const s = raizCena.querySelector(".hero-semicolon")
            if (!s) return null
            const a = s.getBoundingClientRect()
            const c = raizCena.getBoundingClientRect()
            return {
              x: a.left + a.width / 2 - c.left,
              y: a.top + a.height / 2 - c.top,
            }
          },
          limiteTexto: () => {
            const c = raizCena.getBoundingClientRect()
            const u = ultimoCta.current?.getBoundingClientRect()
            return u ? u.bottom - c.top : c.height * 0.6
          },
          movimentoReduzido: window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches,
          toque: window.matchMedia("(pointer: coarse)").matches,
        },
      )
    }

    // espera a fonte e o layout do título assentarem para medir o `;`
    void document.fonts.ready.then(() => {
      if (ativo) void montar()
    })

    const ro = new ResizeObserver(() => {
      window.clearTimeout(espera)
      espera = window.setTimeout(() => void montar(), 200)
    })
    ro.observe(raizCena)

    return () => {
      ativo = false
      window.clearTimeout(espera)
      ro.disconnect()
      desmontar?.()
    }
  }, [variacao])

  return (
    <div ref={cena} className={estilos.cena}>
      <svg ref={svg} aria-hidden="true" className={estilos.svg} />

      {variacao === "ousada" ? (
        <div aria-hidden="true" className={estilos.veu} />
      ) : null}

      <header className={estilos.header}>
        <BrandLogo />
        <nav className={`${estilos.nav} text-body`}>
          <span>Projetos</span>
          <span>Serviços</span>
          <span>Como trabalhamos</span>
          <span>Sobre</span>
        </nav>
        <div className="hidden lg:block">
          <Button href="/contato">Falar sobre meu projeto</Button>
        </div>
      </header>

      <div className={estilos.conteudo}>
        <div className={estilos.coluna}>
          <p
            data-hero-ordem="0"
            className={`${estilos.eyebrow} hero-entrada text-caption font-semibold text-brand-blue`}
          >
            Software house orientada por design
          </p>

          <div className={estilos.titulo}>
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
                <span aria-hidden="true" className="semicolon hero-semicolon">
                  ;
                </span>
              </span>
            </Heading>
          </div>

          <div data-hero-ordem="1" className="hero-entrada">
            <Text papel="lede" medida>
              {APOIO}
            </Text>
          </div>

          <div
            ref={ultimoCta}
            data-hero-ordem="2"
            className={`${estilos.acoes} hero-entrada`}
          >
            <Button href="/contato">Falar sobre meu projeto</Button>
            <TextLink href="/portfolio" variante="acao">
              Ver projetos
            </TextLink>
          </div>
        </div>
      </div>

      <nav aria-label="Variação" className={estilos.painel}>
        {VARIACOES.map((v) => (
          <Link
            key={v}
            href={{ pathname: "/lab/linha", query: v === "base" ? {} : { v } }}
            aria-current={v === variacao ? "true" : undefined}
          >
            {v}
          </Link>
        ))}
        <ContadorQuadros />
      </nav>
    </div>
  )
}
