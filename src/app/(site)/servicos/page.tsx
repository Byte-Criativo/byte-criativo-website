import type { Metadata } from "next"
import { getServiceHub, getSiteConfig } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  webPage,
  breadcrumbsJsonLd,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import {
  SituacaoServico,
  type ItemSituacao,
} from "@/components/patterns/situacao-servico"
import { ConversaBand } from "@/components/patterns/conversa-band"

const serviceHub = getServiceHub()
getSiteConfig()

export const metadata: Metadata = buildMetadata({
  title: serviceHub.intro.seoTitle,
  description: serviceHub.intro.description,
  path: "/servicos",
})

export default function ServicosPage() {
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: serviceHub.intro.seoTitle,
      description: serviceHub.intro.description,
      path: "/servicos",
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/servicos" },
    ]),
  ])

  const itensSituacao: ItemSituacao[] = serviceHub.situacoes.map(
    (sit, index) => ({
      id: `situacao-${index + 1}`,
      situacao: sit.situation,
      links: [
        {
          rotulo: sit.targetLabel,
          href: sit.targetAnchor,
        },
      ],
    }),
  )

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />

      {/* Hero / Abertura */}
      <section
        id="hero"
        aria-labelledby="hero-titulo"
        className="pt-(--space-6) pb-(--space-8) lg:pt-(--space-8) lg:pb-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <Breadcrumbs
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Serviços" }]}
          />

          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo" semicolon>
              {serviceHub.intro.h1.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {serviceHub.intro.lede}
            </Text>
          </div>

          <nav aria-label="Capacidades rápidas">
            <ul className="flex flex-wrap items-center gap-x-(--space-5) gap-y-(--space-2)">
              {serviceHub.intro.anchorLinks.map((anchor) => (
                <li key={anchor.href}>
                  <TextLink href={anchor.href} variante="acao">
                    {anchor.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* Seção: Por onde começar */}
      <section
        id="por-onde-comecar"
        aria-labelledby="por-onde-comecar-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
          <Heading nivel={2} id="por-onde-comecar-titulo">
            Por onde começar
          </Heading>
          <SituacaoServico itens={itensSituacao} />
        </Container>
      </section>

      {/* Seções das 3 Capacidades */}
      {serviceHub.capacidades.map((capacidade) => {
        const tituloId = `${capacidade.id}-titulo`
        return (
          <section
            key={capacidade.id}
            id={capacidade.id}
            aria-labelledby={tituloId}
            className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
          >
            <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
              <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
                <Heading nivel={2} id={tituloId}>
                  {capacidade.title}
                </Heading>
                <Text papel="lede" medida>
                  {capacidade.text}
                </Text>
              </div>

              <ul className="flex flex-col">
                {capacidade.services.map((service) => (
                  <li
                    key={service.slug}
                    className="grid grid-cols-1 gap-(--grid-gutter) border-b-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-6) lg:grid-cols-12"
                  >
                    <div className="lg:col-span-5">
                      <Heading nivel={3}>
                        <TextLink href={service.href} variante="acao">
                          {service.title}
                        </TextLink>
                      </Heading>
                    </div>
                    <div className="flex flex-col gap-(--space-4) lg:col-span-6 lg:col-start-7">
                      <Text medida>{service.description}</Text>
                    </div>
                  </li>
                ))}
              </ul>

              {capacidade.relatedCase ? (
                <div>
                  <TextLink
                    href={`/portfolio/${capacidade.relatedCase.slug}`}
                    variante="acao"
                  >
                    {capacidade.relatedCase.linkText}
                  </TextLink>
                </div>
              ) : null}
            </Container>
          </section>
        )
      })}

      {/* Seção: Evolução contínua */}
      <section
        id="evolucao-continua"
        aria-labelledby="evolucao-continua-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={2} id="evolucao-continua-titulo">
              {serviceHub.evolucaoContinua.h2}
            </Heading>
            <Text medida>{serviceHub.evolucaoContinua.text}</Text>
          </div>
          <div>
            <TextLink
              href={serviceHub.evolucaoContinua.cta.href}
              variante="acao"
            >
              {serviceHub.evolucaoContinua.cta.label}
            </TextLink>
          </div>
        </Container>
      </section>

      {/* Seção final: Banda de CTA para indecisos */}
      <ConversaBand
        id="conversa-hub"
        variante="chamada"
        titulo={serviceHub.ctaFinal.h2}
        frase={serviceHub.ctaFinal.text}
        ctaHref={serviceHub.ctaFinal.ctaPrimary.href}
        ctaRotulo={serviceHub.ctaFinal.ctaPrimary.label}
        whatsapp={{
          rotulo: serviceHub.ctaFinal.ctaSecondary.label,
          mensagem: serviceHub.ctaFinal.ctaSecondary.whatsappMessage,
          location: "services-hub",
          context: "hub",
        }}
      />
    </div>
  )
}
