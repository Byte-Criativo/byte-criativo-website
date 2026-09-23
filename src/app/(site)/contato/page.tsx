import type { Metadata } from "next"
import { getContatoPage } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  webPage,
  breadcrumbsJsonLd,
  faqPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { WhatsAppLink } from "@/components/patterns/whatsapp-link"
import { CopyEmail } from "@/components/patterns/copy-email"
import { FaqItem } from "@/components/patterns/faq-item"
import { LeadForm } from "./_components/lead-form"

const contato = getContatoPage()

export const metadata: Metadata = buildMetadata({
  title: contato.seo.seoTitle,
  description: contato.seo.description,
  path: "/contato",
})

export default function ContatoPage() {
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: contato.seo.seoTitle,
      description: contato.seo.description,
      path: "/contato",
      type: "ContactPage",
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Contato", path: "/contato" },
    ]),
    faqPageJsonLd(contato.faqs),
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
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Contato" }]}
          />
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo" semicolon>
              {contato.h1.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {contato.apoio}
            </Text>
          </div>
        </Container>
      </section>

      {/* Dois caminhos: formulário e direto */}
      <section
        id="caminhos"
        aria-label="Caminhos de contato"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--space-8) lg:grid-cols-12 lg:gap-(--grid-gutter)">
          <div className="flex flex-col gap-(--space-6) lg:col-span-7">
            <Heading nivel={2}>{contato.caminhos.formulario.h2}</Heading>
            <LeadForm
              contato={contato}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
          <div className="flex flex-col gap-(--space-5) self-start bg-brand-surface p-(--space-5) lg:col-span-4 lg:col-start-9">
            <Heading nivel={2} papel="h3">
              {contato.caminhos.direto.h2}
            </Heading>
            <div>
              <WhatsAppLink
                aparencia="texto"
                rotulo={contato.caminhos.direto.whatsapp.label}
                mensagem={contato.caminhos.direto.whatsapp.message}
                location="contato"
                context="contato"
              />
            </div>
            <WhatsAppLink
              aparencia="texto"
              rotulo={contato.caminhos.direto.whatsapp.display}
              mensagem={contato.caminhos.direto.whatsapp.message}
              location="contato"
              context="contato-numero"
            />
            <CopyEmail
              variante="email"
              email={contato.caminhos.direto.email.address}
            />
          </div>
        </Container>
      </section>

      {/* O que acontece depois */}
      <section
        id="proximos-passos"
        aria-labelledby="proximos-passos-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="proximos-passos-titulo">
              {contato.proximosPassos.h2}
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-6) lg:col-span-6 lg:col-start-7">
            <ol className="flex flex-col gap-(--space-4)">
              {contato.proximosPassos.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex items-start gap-(--space-4) border-t-(length:--border-w-decorative) border-solid border-border-decorative pt-(--space-3)"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-caption font-bold text-ink select-none"
                  >
                    {String(step.number).padStart(2, "0")}
                  </span>
                  <Text medida>
                    <strong>{step.title}</strong> {step.description}
                  </Text>
                </li>
              ))}
            </ol>
            <div>
              <TextLink href={contato.proximosPassos.link.href} variante="acao">
                {contato.proximosPassos.link.label}
              </TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Dúvidas antes de começar */}
      <section
        id="duvidas"
        aria-labelledby="duvidas-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="duvidas-titulo">
              Dúvidas antes de começar
            </Heading>
          </div>
          <div className="flex flex-col lg:col-span-6 lg:col-start-7">
            {contato.faqs.map((faq) => (
              <FaqItem pergunta={faq.question} key={faq.question}>
                {faq.answer}
              </FaqItem>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
