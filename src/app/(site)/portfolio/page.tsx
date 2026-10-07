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
import { CapturaDaSala } from "../_components/captura-da-sala"
import { CAPTURAS_DAS_SALAS } from "../_components/capturas-das-salas"

const portfolio = getPortfolioPage()
const salas = getHomePage().salas

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
      { name: "Projetos", path: "/portfolio" },
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
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Projetos" }]}
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
        aria-label="Projetos publicados"
        className="flex flex-col gap-(--space-8) pb-(--space-8) lg:pb-(--space-9)"
      >
        {salas.items.map((sala, indice) => {
          const captura = CAPTURAS_DAS_SALAS[sala.slug]
          if (!captura) return null
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
                        // A primeira sala é candidata a LCP (no celular
                        // também, agora com o retrato): carga imediata e
                        // prioridade alta; as demais esperam a rolagem.
                        <CapturaDaSala
                          captura={captura}
                          alt={sala.image.alt}
                          loading={indice === 0 ? "eager" : "lazy"}
                          fetchPriority={indice === 0 ? "high" : undefined}
                        />
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
