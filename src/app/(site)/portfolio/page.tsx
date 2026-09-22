import type { Metadata } from "next"
import { getHomePage, getPortfolioPage, getPublishedCases } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  collectionPageJsonLd,
  breadcrumbsJsonLd,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Stack } from "@/components/ui/stack"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { ConversaBand } from "@/components/patterns/conversa-band"
import { Sala } from "@/components/patterns/sala"
import { Ficha } from "@/components/patterns/ficha"
import {
  FrenteVersoProvider,
  FrenteVersoControle,
  FrenteVersoFaces,
} from "@/components/patterns/frente-verso"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import CaseUndergroundPB from "@/assets/case-undergroundpb-screenshot.webp"
import CaseFestivalAlumio from "@/assets/case-festival-alumio-screenshot.webp"

const portfolio = getPortfolioPage()
const salas = getHomePage().salas

const IMAGENS: Record<
  string,
  { data: typeof CaseUndergroundPB; dominio: string }
> = {
  "underground-pb": {
    data: CaseUndergroundPB,
    dominio: "undergroundpb.com.br",
  },
  "festival-alumio": {
    data: CaseFestivalAlumio,
    dominio: "festivalalumio.com.br",
  },
}

export const metadata: Metadata = buildMetadata({
  title: portfolio.seo.seoTitle,
  description: portfolio.seo.description,
  path: "/portfolio",
})

export default function PortfolioPage() {
  // Estudos de caso só existem depois do gate D5 (status "published"). O
  // link "Ver estudo de caso" e as entradas do ItemList aparecem só para
  // cases publicados; as salas continuam visíveis com o link do site ao vivo.
  const publicados = new Set(getPublishedCases().map((estudo) => estudo.slug))
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    collectionPageJsonLd({
      name: portfolio.seo.seoTitle,
      description: portfolio.seo.description,
      path: "/portfolio",
      items: salas.items
        .filter((sala) => publicados.has(sala.slug))
        .map((sala) => ({
          name: sala.name,
          path: sala.caseStudyUrl,
        })),
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Trabalhos", path: "/portfolio" },
    ]),
  ])

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />

      {/* Abertura */}
      <section
        id="hero"
        aria-labelledby="hero-titulo"
        className="pt-(--space-6) pb-(--space-8) lg:pt-(--space-8) lg:pb-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <Breadcrumbs
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Trabalhos" }]}
          />
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo" semicolon>
              {portfolio.h1.replace(/;$/, "")}
            </Heading>
            {portfolio.intro.map((paragrafo) => (
              <Text key={paragrafo.slice(0, 32)} papel="lede" medida>
                {paragrafo}
              </Text>
            ))}
          </div>
        </Container>
      </section>

      {/* Salas dos trabalhos publicados */}
      <section
        id="trabalhos"
        aria-label="Trabalhos publicados"
        className="flex flex-col gap-(--space-8) pb-(--space-8) lg:pb-(--space-9)"
      >
        {salas.items.map((sala, indice) => {
          const imagem = IMAGENS[sala.slug]
          if (!imagem) return null
          return (
            <FrenteVersoProvider key={sala.slug} projeto={sala.name}>
              <Ficha
                id={`ficha-${sala.slug}`}
                nome={sala.name}
                tipo={sala.type}
                nivel={2}
                frase={sala.phrase}
                capacidades={sala.capabilities}
                estudoDeCasoHref={
                  publicados.has(sala.slug) ? sala.caseStudyUrl : undefined
                }
                projetoNoArHref={sala.liveUrl}
                contagem={{ atual: indice + 1, total: salas.items.length }}
                controle={<FrenteVersoControle />}
                sala={
                  <Sala
                    slug={sala.slug}
                    id={`sala-${sala.slug}`}
                    variante="larga"
                  >
                    <FrenteVersoFaces
                      frente={
                        <BrowserFrame
                          dominio={imagem.dominio}
                          legenda={sala.image.alt}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- tag nativa com dimensões explícitas e WebP estático, mesmo padrão das salas da home */}
                          <img
                            src={imagem.data.src}
                            width={imagem.data.width}
                            height={imagem.data.height}
                            alt={sala.image.alt}
                            loading={indice === 0 ? "eager" : "lazy"}
                            fetchPriority={indice === 0 ? "high" : undefined}
                            decoding="async"
                            className="h-auto w-full object-cover"
                          />
                        </BrowserFrame>
                      }
                      verso={
                        <Stack espaco={4}>
                          <div>
                            <Heading nivel={3} className="text-body font-bold">
                              {sala.verso.needs.title}
                            </Heading>
                            <Text medida>{sala.verso.needs.text}</Text>
                          </div>
                          <div>
                            <Heading nivel={3} className="text-body font-bold">
                              {sala.verso.inProduction.title}
                            </Heading>
                            <ul className="flex flex-col gap-(--space-2) pt-(--space-2) text-body">
                              {sala.verso.inProduction.items.map((item) => (
                                <li key={item}>— {item}</li>
                              ))}
                            </ul>
                          </div>
                          <Text papel="caption" tom="muted">
                            Construído com {sala.verso.tech}.
                          </Text>
                        </Stack>
                      }
                    />
                  </Sala>
                }
              />
            </FrenteVersoProvider>
          )
        })}
      </section>

      {/* Banda final */}
      <ConversaBand
        id="conversa-portfolio"
        variante="chamada"
        titulo={portfolio.ctaFinal.h2}
        frase={portfolio.ctaFinal.text}
        ctaHref={portfolio.ctaFinal.ctaPrimary.href}
        ctaRotulo={portfolio.ctaFinal.ctaPrimary.label}
        whatsapp={{
          rotulo: portfolio.ctaFinal.ctaSecondary.label,
          mensagem: portfolio.ctaFinal.ctaSecondary.whatsappMessage,
          location: "portfolio",
          context: "portfolio",
        }}
      />
    </div>
  )
}
