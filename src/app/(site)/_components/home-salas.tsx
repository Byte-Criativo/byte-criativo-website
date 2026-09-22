import type { ReactElement } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
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
import CaseFestivalAlumio from "@/assets/case-festival-alumio-screenshot.webp"

export function HomeSalas({
  salas,
  estudoDeCasoHref,
}: {
  salas: HomePage["salas"]
  // Href do estudo de caso da segunda sala, só quando publicado (gate D5).
  estudoDeCasoHref?: string
}): ReactElement {
  const salaAlumio = salas.items[1]

  if (!salaAlumio) {
    return <></>
  }

  return (
    <section
      id="trabalhos"
      aria-label="Trabalhos em destaque"
      className="py-(--space-8) lg:py-(--space-9)"
    >
      <div className="flex flex-col gap-(--space-8)">
        {/* Sala 2: Festival Alumiô em largura total */}
        <FrenteVersoProvider projeto={salaAlumio.name}>
          <Ficha
            id="ficha-festival-alumio"
            nome={salaAlumio.name}
            tipo={salaAlumio.type}
            nivel={2}
            frase={salaAlumio.phrase}
            capacidades={salaAlumio.capabilities}
            estudoDeCasoHref={estudoDeCasoHref}
            projetoNoArHref={salaAlumio.liveUrl}
            contagem={{
              atual: 2,
              total: 2,
            }}
            controle={<FrenteVersoControle />}
            sala={
              <Sala
                slug={salaAlumio.slug}
                id={`sala-${salaAlumio.slug}`}
                variante="larga"
              >
                <FrenteVersoFaces
                  frente={
                    <BrowserFrame
                      dominio="festivalalumio.com.br"
                      legenda={salaAlumio.image.alt}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- tag nativa com dimensões explícitas e WebP estático para evitar runtime client de next/image no teto de JS da Home */}
                      <img
                        src={CaseFestivalAlumio.src}
                        width={CaseFestivalAlumio.width}
                        height={CaseFestivalAlumio.height}
                        alt={salaAlumio.image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-cover"
                      />
                    </BrowserFrame>
                  }
                  verso={
                    <Stack espaco={4}>
                      <div>
                        <Heading nivel={3} className="text-body font-bold">
                          {salaAlumio.verso.needs.title}
                        </Heading>
                        <Text medida>{salaAlumio.verso.needs.text}</Text>
                      </div>
                      <div>
                        <Heading nivel={3} className="text-body font-bold">
                          {salaAlumio.verso.inProduction.title}
                        </Heading>
                        <ul className="flex flex-col gap-(--space-2) pt-(--space-2) text-body">
                          {salaAlumio.verso.inProduction.items.map((item) => (
                            <li key={item}>— {item}</li>
                          ))}
                        </ul>
                      </div>
                      <Text papel="caption" tom="muted">
                        Construído com {salaAlumio.verso.tech}.
                      </Text>
                    </Stack>
                  }
                />
              </Sala>
            }
          />
        </FrenteVersoProvider>

        {/* Encerramento da seção de trabalhos: link do catálogo e ponte */}
        <div className="mx-auto flex w-full max-w-(--grid-container-max) flex-col gap-(--space-3) px-(--grid-margin) sm:flex-row sm:items-center sm:justify-between">
          <TextLink href={salas.footerLink.href} variante="acao">
            {salas.footerLink.label}
          </TextLink>
          <Text papel="caption" tom="muted">
            {salas.bridgeText}
          </Text>
        </div>
      </div>
    </section>
  )
}
