import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllServices, getPublishedCases, getServiceBySlug } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  organization,
  webSite,
  webPage,
  breadcrumbsJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
  buildJsonLdGraph,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { TextLink } from "@/components/ui/text-link"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { WhatsAppLink } from "@/components/patterns/whatsapp-link"
import { FaqItem } from "@/components/patterns/faq-item"
import { ConversaBand } from "@/components/patterns/conversa-band"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {}
  }

  return buildMetadata({
    title: service.seoTitle,
    description: service.description,
    path: `/servicos/${service.slug}`,
  })
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const casePublicado = getPublishedCases().some(
    (estudo) => estudo.slug === service.ondeFoiAplicado.caseSlug,
  )

  const relacionados = service.servicosRelacionados
    .map((relSlug) => getServiceBySlug(relSlug))
    .filter((rel): rel is NonNullable<typeof rel> => rel !== undefined)

  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: service.seoTitle,
      description: service.description,
      path: `/servicos/${service.slug}`,
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/servicos" },
      { name: service.title, path: `/servicos/${service.slug}` },
    ]),
    serviceJsonLd({
      name: service.title,
      description: service.description,
      path: `/servicos/${service.slug}`,
    }),
    ...(service.faqs.length > 0 ? [faqPageJsonLd(service.faqs)] : []),
  ])

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />

      {/* Abertura / Hero */}
      <section
        id="hero"
        aria-labelledby="hero-titulo"
        className="pt-(--space-6) pb-(--space-8) lg:pt-(--space-8) lg:pb-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <Breadcrumbs
            trilha={[
              { rotulo: "Início", href: "/" },
              { rotulo: "Serviços", href: "/servicos" },
              { rotulo: service.title },
            ]}
          />
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-5)">
            <Text papel="caption" tom="muted">
              {service.eyebrow}
            </Text>
            <Heading nivel={1} id="hero-titulo" semicolon>
              {service.title.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {service.promise}
            </Text>
            <div className="flex flex-col gap-(--space-3) pt-(--space-2) sm:flex-row sm:items-center">
              <Button
                href={`/contato?tipo=${service.slug}&origem=${service.slug}`}
              >
                Falar sobre meu projeto
              </Button>
              <WhatsAppLink
                aparencia="botao"
                rotulo="Chamar no WhatsApp"
                mensagem={service.whatsappMessage}
                location="service-hero"
                context={service.slug}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Quando faz sentido */}
      <section
        id="quando-faz-sentido"
        aria-labelledby="quando-faz-sentido-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="quando-faz-sentido-titulo">
              Quando faz sentido
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="flex flex-col gap-(--space-4)">
              {service.quandoFazSentido.map((item) => (
                <li key={item} className="flex items-start gap-(--space-3)">
                  <span
                    aria-hidden="true"
                    className="text-body font-bold text-accent select-none"
                  >
                    —
                  </span>
                  <Text medida>{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* O que você recebe */}
      <section
        id="o-que-recebe"
        aria-labelledby="o-que-recebe-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="o-que-recebe-titulo">
              O que você recebe
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="flex flex-col gap-(--space-4)">
              {service.oQueRecebe.map((item) => (
                <li key={item} className="flex items-start gap-(--space-3)">
                  <span
                    aria-hidden="true"
                    className="text-body font-bold text-accent select-none"
                  >
                    —
                  </span>
                  <Text medida>{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Onde foi aplicado */}
      <section
        id="onde-foi-aplicado"
        aria-labelledby="onde-foi-aplicado-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="onde-foi-aplicado-titulo">
              Exemplo em uso
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-4) lg:col-span-6 lg:col-start-7">
            <Text medida>{service.ondeFoiAplicado.description}</Text>
            {casePublicado &&
            service.ondeFoiAplicado.linkHref &&
            service.ondeFoiAplicado.linkText ? (
              <div>
                <TextLink
                  href={service.ondeFoiAplicado.linkHref}
                  variante="acao"
                >
                  {service.ondeFoiAplicado.linkText}
                </TextLink>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Como o projeto é conduzido */}
      <section
        id="como-conduzido"
        aria-labelledby="como-conduzido-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="como-conduzido-titulo">
              Como o projeto é conduzido
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-6) lg:col-span-6 lg:col-start-7">
            <ol className="flex flex-col gap-(--space-4)">
              {service.comoConduzimos.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-(--space-4) border-t-(length:--border-w-decorative) border-solid border-border-decorative pt-(--space-3)"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-caption font-bold text-accent select-none"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Text medida>{item}</Text>
                </li>
              ))}
            </ol>
            <div>
              <TextLink href="/processo" variante="acao">
                Ver como trabalhamos
              </TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Dúvidas sobre {nome do serviço em minúsculas} */}
      {service.faqs && service.faqs.length > 0 ? (
        <section
          id="duvidas"
          aria-labelledby="duvidas-titulo"
          className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
        >
          <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading nivel={2} id="duvidas-titulo">
                {`Dúvidas sobre ${service.title.toLowerCase()}`}
              </Heading>
            </div>
            <div className="flex flex-col lg:col-span-6 lg:col-start-7">
              {service.faqs.map((faq) => (
                <FaqItem pergunta={faq.question} key={faq.question}>
                  {faq.answer}
                </FaqItem>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Serviços relacionados */}
      {relacionados.length > 0 ? (
        <section
          id="servicos-relacionados"
          aria-labelledby="servicos-relacionados-titulo"
          className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
        >
          <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading nivel={2} id="servicos-relacionados-titulo">
                Serviços relacionados
              </Heading>
            </div>
            <div className="flex flex-col gap-(--space-6) lg:col-span-6 lg:col-start-7">
              {relacionados.map((rel) => (
                <div
                  key={rel.slug}
                  className="flex flex-col gap-(--space-2) border-b-(length:--border-w-decorative) border-solid border-border-decorative pb-(--space-6) last:border-b-0 last:pb-0"
                >
                  <div>
                    <TextLink href={`/servicos/${rel.slug}`} variante="acao">
                      {rel.title}
                    </TextLink>
                  </div>
                  <Text medida tom="muted">
                    {rel.description}
                  </Text>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Banda final de CTA */}
      <ConversaBand
        id="conversa-servico"
        variante="chamada"
        titulo={`Falar sobre ${service.title.toLowerCase()}`}
        frase="Conte o contexto do projeto ou tire dúvidas diretamente com quem desenha e programa."
        ctaHref={`/contato?tipo=${service.slug}&origem=${service.slug}`}
        ctaRotulo="Falar sobre meu projeto"
        whatsapp={{
          rotulo: "Chamar no WhatsApp",
          mensagem: service.whatsappMessage,
          location: "service-detail",
          context: service.slug,
        }}
      />
    </div>
  )
}
