import type { ReactElement } from "react"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { Sala } from "@/components/patterns/sala"
import { Ficha, type FichaContagem } from "@/components/patterns/ficha"
import {
  FrenteVersoProvider,
  FrenteVersoControle,
  FrenteVersoFaces,
} from "@/components/patterns/frente-verso"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import { Stack } from "@/components/ui/stack"
import type { HomePage } from "@/content/schema"
import CaseUndergroundPB from "@/assets/case-undergroundpb-screenshot.webp"
import CaseFestivalAlumio from "@/assets/case-festival-alumio-screenshot.webp"

type SalaItem = HomePage["salas"]["items"][number]

type CapturaEstatica = {
  src: string
  width: number
  height: number
}

/**
 * As duas salas da home, em largura total: Underground PB e Festival
 * Alumiô. A sala do Underground PB saiu do hero (que agora é a abertura com
 * arte generativa) e entrou aqui como primeiro trabalho, com a contagem
 * "1 de 2" levando ao título da ficha seguinte.
 */
function SalaDaHome({
  item,
  captura,
  dominio,
  contagem,
  estudoDeCasoHref,
}: {
  item: SalaItem
  captura: CapturaEstatica
  dominio: string
  contagem: FichaContagem
  estudoDeCasoHref?: string
}): ReactElement {
  return (
    <FrenteVersoProvider projeto={item.name}>
      <Ficha
        id={`ficha-${item.slug}`}
        nome={item.name}
        tipo={item.type}
        nivel={2}
        frase={item.phrase}
        capacidades={item.capabilities}
        estudoDeCasoHref={estudoDeCasoHref}
        projetoNoArHref={item.liveUrl}
        contagem={contagem}
        controle={<FrenteVersoControle />}
        sala={
          <Sala slug={item.slug} id={`sala-${item.slug}`} variante="larga">
            <FrenteVersoFaces
              frente={
                <BrowserFrame dominio={dominio} legenda={item.image.alt}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- tag nativa com dimensões explícitas e WebP estático para evitar runtime client de next/image no teto de JS da Home */}
                  <img
                    src={captura.src}
                    width={captura.width}
                    height={captura.height}
                    alt={item.image.alt}
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
                      {item.verso.needs.title}
                    </Heading>
                    <Text medida>{item.verso.needs.text}</Text>
                  </div>
                  <div>
                    <Heading nivel={3} className="text-body font-bold">
                      {item.verso.inProduction.title}
                    </Heading>
                    <ul className="flex flex-col gap-(--space-2) pt-(--space-2) text-body">
                      {item.verso.inProduction.items.map((linha) => (
                        <li key={linha}>— {linha}</li>
                      ))}
                    </ul>
                  </div>
                  <Text papel="caption" tom="muted">
                    Construído com {item.verso.tech}.
                  </Text>
                </Stack>
              }
            />
          </Sala>
        }
      />
    </FrenteVersoProvider>
  )
}

export function HomeSalas({
  salas,
  estudoDeCasoHrefs = {},
}: {
  salas: HomePage["salas"]
  /**
   * Href do estudo de caso por slug, só para cases publicados (gate D5);
   * sem a entrada, a Ficha omite o link "Ver estudo de caso", que 404aria.
   */
  estudoDeCasoHrefs?: Record<string, string | undefined>
}): ReactElement {
  const salaUnderground = salas.items[0]
  const salaAlumio = salas.items[1]

  if (!salaUnderground || !salaAlumio) {
    return <></>
  }

  return (
    <section
      id="trabalhos"
      aria-label="Projetos em destaque"
      className="py-(--space-8) lg:py-(--space-9)"
    >
      <div className="flex flex-col gap-(--space-8)">
        {/* Sala 1: Underground PB em largura total */}
        <SalaDaHome
          item={salaUnderground}
          captura={CaseUndergroundPB}
          dominio="undergroundpb.com.br"
          contagem={{
            atual: 1,
            total: 2,
            // A Ficha não expõe `id` no <article>; o título dela recebe
            // `${id}-titulo`, e é para ele que o "próximo trabalho" leva.
            proximo: {
              nome: salaAlumio.name,
              href: `#ficha-${salaAlumio.slug}-titulo`,
            },
          }}
          estudoDeCasoHref={estudoDeCasoHrefs[salaUnderground.slug]}
        />

        {/* Sala 2: Festival Alumiô em largura total */}
        <SalaDaHome
          item={salaAlumio}
          captura={CaseFestivalAlumio}
          dominio="festivalalumio.com.br"
          contagem={{ atual: 2, total: 2 }}
          estudoDeCasoHref={estudoDeCasoHrefs[salaAlumio.slug]}
        />

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
