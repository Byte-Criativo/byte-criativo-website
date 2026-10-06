import { Fragment, type CSSProperties, type ReactElement } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import type { HomePage } from "@/content/schema"
import { HeroCena } from "./hero-arte/hero-cena"

/**
 * Hero da home: abertura em tela inteira com a arte generativa "Tecido de
 * bytes" atrás do título. O texto é renderizado no servidor e entra com
 * animação em CSS puro a partir da primeira pintura (globals.css, bloco
 * "Hero"); o canvas chega depois, pela ilha HeroCena, em crossfade sobre o
 * gradiente de mesmas cores.
 *
 * O h1 continua íntegro para leitores de tela e buscadores: o texto real
 * fica dentro dos spans de cada palavra (só a janela de animação é um
 * span; nenhum texto duplicado nem oculto). O `;` final segue a regra do
 * Heading (span aria-hidden em --accent) e é a âncora de onde a arte emana.
 */
export function HomeHero({ hero }: { hero: HomePage["hero"] }): ReactElement {
  const titulo = hero.h1.replace(/;$/, "")
  const palavras = titulo.split(" ")

  return (
    <section id="hero" aria-label="Início" className="home-hero">
      <HeroCena />

      <div className="home-hero-conteudo mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin)">
        <div className="flex max-w-(--medida-max) flex-col gap-(--space-5) lg:gap-(--space-6)">
          <p
            data-hero-ordem="0"
            className="hero-eyebrow hero-entrada text-caption font-semibold text-brand-blue"
          >
            Software house orientada por design
          </p>

          <Heading nivel={1} papel="display" className="hero-title">
            <span
              className="hero-title-visual"
              style={{ "--hero-n": palavras.length } as CSSProperties}
            >
              {/* O espaço fica FORA da janela de cada palavra: dentro de um
                  inline-block com overflow oculto ele seria descartado como
                  espaço final de linha e as palavras colariam. */}
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

          <div data-hero-ordem="1" className="hero-entrada">
            <Text papel="lede" medida>
              {hero.apoio}
            </Text>
          </div>

          <div
            data-hero-ordem="2"
            className="hero-entrada flex flex-col gap-(--space-3) sm:flex-row sm:items-center"
          >
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <TextLink href={hero.ctaSecondary.href} variante="acao">
              {hero.ctaSecondary.label}
            </TextLink>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        data-hero-ordem="3"
        className="hero-rolar hero-entrada text-caption"
      >
        <span className="hero-rolar-linha" />
        <span>Rolar</span>
      </div>

      <div aria-hidden="true" className="hero-veu" />
    </section>
  )
}
