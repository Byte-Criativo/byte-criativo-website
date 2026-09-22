import type { Metadata } from "next"
import { getSobrePage } from "@/content"
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
import { ConversaBand } from "@/components/patterns/conversa-band"

const sobre = getSobrePage()

export const metadata: Metadata = buildMetadata({
  title: sobre.seo.seoTitle,
  description: sobre.seo.description,
  path: "/sobre",
})

export default function SobrePage() {
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: sobre.seo.seoTitle,
      description: sobre.seo.description,
      path: "/sobre",
      type: "AboutPage",
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Sobre", path: "/sobre" },
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
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Sobre" }]}
          />
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo" semicolon>
              {sobre.h1.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {sobre.lede}
            </Text>
          </div>
        </Container>
      </section>

      {/* Quem conduz */}
      <section
        id="quem-conduz"
        aria-labelledby="quem-conduz-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="quem-conduz-titulo">
              {sobre.quemConduz.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>{sobre.quemConduz.text}</Text>
          </div>
        </Container>
      </section>

      {/* Por que a Byte trabalha assim (manifesto) */}
      <section
        id="trajetoria"
        aria-labelledby="trajetoria-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="trajetoria-titulo">
              {sobre.trajetoria.h2}
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-5) lg:col-span-6 lg:col-start-7">
            {sobre.trajetoria.manifestoParagraphs.map((paragraph) => (
              <Text key={paragraph.slice(0, 32)} medida>
                {paragraph}
              </Text>
            ))}
            <div>
              <TextLink href={sobre.trajetoria.cta.href} variante="acao">
                {sobre.trajetoria.cta.label}
              </TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Três princípios */}
      <section
        id="principios"
        aria-labelledby="principios-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
          <Heading nivel={2} id="principios-titulo">
            Três princípios
          </Heading>
          <ol className="flex flex-col">
            {sobre.principios.map((principio) => (
              <li
                key={principio.number}
                className="grid grid-cols-1 gap-(--grid-gutter) border-b-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-6) lg:grid-cols-12"
              >
                <div className="flex items-start gap-(--space-4) lg:col-span-5">
                  <span
                    aria-hidden="true"
                    className="font-mono text-caption font-bold text-accent select-none"
                  >
                    {String(principio.number).padStart(2, "0")}
                  </span>
                  <Heading nivel={3}>{principio.title}</Heading>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <Text medida>{principio.description}</Text>
                </div>
              </li>
            ))}
          </ol>
          <div>
            <TextLink href="/processo" variante="acao">
              Ver o processo completo
            </TextLink>
          </div>
        </Container>
      </section>

      {/* Parceiros */}
      <section
        id="parceiros"
        aria-labelledby="parceiros-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="parceiros-titulo">
              {sobre.parceiros.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>{sobre.parceiros.text}</Text>
          </div>
        </Container>
      </section>

      {/* Onde a Byte está */}
      <section
        id="onde-estamos"
        aria-labelledby="onde-estamos-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="onde-estamos-titulo">
              {sobre.ondeEstamos.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>{sobre.ondeEstamos.text}</Text>
          </div>
        </Container>
      </section>

      {/* A empresa */}
      <section
        id="empresa"
        aria-labelledby="empresa-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="empresa-titulo">
              {sobre.empresa.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>
              {sobre.empresa.name}, CNPJ {sobre.empresa.cnpj}.
            </Text>
          </div>
        </Container>
      </section>

      {/* Banda final */}
      <ConversaBand
        id="conversa-sobre"
        variante="chamada"
        titulo={sobre.ctaFinal.h2.replace(/;$/, "")}
        ctaHref={sobre.ctaFinal.ctaPrimary.href}
        ctaRotulo={sobre.ctaFinal.ctaPrimary.label}
        whatsapp={{
          rotulo: sobre.ctaFinal.ctaSecondary.label,
          mensagem: sobre.ctaFinal.ctaSecondary.whatsappMessage,
          location: "sobre",
          context: "sobre",
        }}
      />
    </div>
  )
}
