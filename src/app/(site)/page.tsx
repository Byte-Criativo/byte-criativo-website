import type { Metadata } from "next"
import { getHomePage, getPublishedCases, getSiteConfig } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  webPage,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { IndiceSemicolon } from "@/components/patterns/indice-semicolon"
import { SalaObserver } from "@/components/patterns/sala-observer"
import { HomeHero } from "./_components/home-hero"
import { HomeSalas } from "./_components/home-salas"
import { HomeFormaDePensar } from "./_components/home-forma-de-pensar"
import { HomeOQueFazemos } from "./_components/home-o-que-fazemos"
import { HomeComoAnda } from "./_components/home-como-anda"
import { HomeConversa } from "./_components/home-conversa"

const home = getHomePage()
const site = getSiteConfig()

// O resolvedor de metadata do Next converte o canonical da rota raiz para a
// origem SEM barra final ("https://www.bcriativo.com"), mas o contrato de
// rotas preservadas exige "https://www.bcriativo.com/". Por isso a home
// omite o canonical da metadata e emite o <link> manualmente no componente.
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Software House, Sites e Sistemas Web Sob Medida | Byte Criativo",
    description: home.hero.apoio,
    path: "/",
  }),
  alternates: undefined,
}

const ITENS_INDICE = [
  { id: "hero", rotulo: "Início" },
  { id: "trabalhos", rotulo: "Trabalhos" },
  { id: "forma-de-pensar", rotulo: "Forma de pensar" },
  { id: "o-que-fazemos", rotulo: "O que fazemos" },
  { id: "como-anda", rotulo: "Como anda" },
  { id: "conversa", rotulo: "Conversa" },
]

export default function HomePage() {
  // O link "Ver estudo de caso" das salas só aparece para cases publicados
  // As salas de cases em revisão continuam com o link do site ao vivo.
  const publicados = new Set(getPublishedCases().map((estudo) => estudo.slug))
  const hrefEstudoDeCaso = (
    sala: (typeof home.salas.items)[number],
  ): string | undefined =>
    publicados.has(sala.slug) ? sala.caseStudyUrl : undefined

  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: "Software House, Sites e Sistemas Web Sob Medida | Byte Criativo",
      description: home.hero.apoio,
      path: "/",
    }),
  ])

  return (
    <div className="relative">
      <link rel="canonical" href="https://www.bcriativo.com/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />
      <SalaObserver
        salas={["sala-underground-pb", "sala-festival-alumio"]}
        secoes={[
          "hero",
          "trabalhos",
          "forma-de-pensar",
          "o-que-fazemos",
          "como-anda",
          "conversa",
        ]}
      />
      <IndiceSemicolon itens={ITENS_INDICE} />

      {home.salas.items[0] ? (
        <HomeHero
          hero={home.hero}
          salaItem={home.salas.items[0]}
          estudoDeCasoHref={hrefEstudoDeCaso(home.salas.items[0])}
        />
      ) : null}
      <HomeSalas
        salas={home.salas}
        estudoDeCasoHref={
          home.salas.items[1]
            ? hrefEstudoDeCaso(home.salas.items[1])
            : undefined
        }
      />
      <HomeFormaDePensar formaDePensar={home.formaDePensar} />
      <HomeOQueFazemos
        oQueFazemos={home.oQueFazemos}
        casesPublicados={publicados}
      />
      <HomeComoAnda comoAnda={home.comoAnda} />
      <HomeConversa conversa={home.conversa} site={site} />
    </div>
  )
}
