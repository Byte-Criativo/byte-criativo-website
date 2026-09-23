import type { ReactElement } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Sala } from "@/components/patterns/sala"
import { Ficha } from "@/components/patterns/ficha"
import {
  FrenteVersoProvider,
  FrenteVersoControle,
  FrenteVersoFaces,
} from "@/components/patterns/frente-verso"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import { Stack } from "@/components/ui/stack"
import type { HomePage } from "@/content/schema"
import CaseUndergroundPB from "@/assets/case-undergroundpb-screenshot.webp"

export function HomeHero({
  hero,
  salaItem,
  estudoDeCasoHref,
}: {
  hero: HomePage["hero"]
  salaItem: HomePage["salas"]["items"][number]
  // Só vem preenchido quando o case está publicado (gate D5); sem ele a
  // Ficha omite o link "Ver estudo de caso", que 404aria.
  estudoDeCasoHref?: string
}): ReactElement {
  return (
    <section
      id="hero"
      aria-label="Início"
      className="home-hero pt-(--space-6) pb-(--space-8) lg:pt-(--space-7) lg:pb-(--space-8)"
    >
      <div className="mx-auto max-w-(--grid-container-max) px-(--grid-margin)">
        <div className="grid grid-cols-1 items-start gap-(--grid-gutter) lg:grid-cols-12">
          {/* Coluna 1-5: Posicionamento, H1, Apoio e Ações */}
          <div className="flex flex-col gap-(--space-5) lg:col-span-5">
            <p className="hero-eyebrow text-caption font-semibold text-brand-blue">
              Software house orientada por design
            </p>
            <Heading nivel={1} semicolon className="hero-title">
              {hero.h1.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {hero.apoio}
            </Text>
            <div className="flex flex-col gap-(--space-3) sm:flex-row sm:items-center">
              <Button href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </Button>
              <TextLink href={hero.ctaSecondary.href} variante="acao">
                {hero.ctaSecondary.label}
              </TextLink>
            </div>
          </div>

          {/* Coluna 6-12: Sala Underground PB com Ficha e Frente/Verso */}
          <div className="hero-project lg:col-span-7">
            <FrenteVersoProvider projeto={salaItem.name}>
              <Ficha
                id="ficha-underground-pb"
                nome={salaItem.name}
                tipo={salaItem.type}
                nivel={2}
                frase={salaItem.phrase}
                capacidades={salaItem.capabilities}
                estudoDeCasoHref={estudoDeCasoHref}
                projetoNoArHref={salaItem.liveUrl}
                contagem={{
                  atual: 1,
                  total: 2,
                  proximo: { nome: "Festival Alumiô", href: "#trabalhos" },
                }}
                controle={<FrenteVersoControle />}
                sala={
                  <Sala
                    slug={salaItem.slug}
                    id={`sala-${salaItem.slug}`}
                    variante="hero"
                  >
                    <FrenteVersoFaces
                      frente={
                        <BrowserFrame
                          dominio="undergroundpb.com.br"
                          legenda={salaItem.image.alt}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- tag nativa com dimensões explícitas e WebP estático para evitar runtime client de next/image no teto de JS da Home */}
                          <img
                            src={CaseUndergroundPB.src}
                            width={CaseUndergroundPB.width}
                            height={CaseUndergroundPB.height}
                            alt={salaItem.image.alt}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="h-auto w-full object-cover"
                          />
                        </BrowserFrame>
                      }
                      verso={
                        <Stack espaco={4}>
                          <div>
                            <Heading nivel={3} className="text-body font-bold">
                              {salaItem.verso.needs.title}
                            </Heading>
                            <Text medida>{salaItem.verso.needs.text}</Text>
                          </div>
                          <div>
                            <Heading nivel={3} className="text-body font-bold">
                              {salaItem.verso.inProduction.title}
                            </Heading>
                            <ul className="flex flex-col gap-(--space-2) pt-(--space-2) text-body">
                              {salaItem.verso.inProduction.items.map((item) => (
                                <li key={item}>— {item}</li>
                              ))}
                            </ul>
                          </div>
                          <Text papel="caption" tom="muted">
                            Construído com {salaItem.verso.tech}.
                          </Text>
                        </Stack>
                      }
                    />
                  </Sala>
                }
              />
            </FrenteVersoProvider>
          </div>
        </div>
      </div>
    </section>
  )
}
