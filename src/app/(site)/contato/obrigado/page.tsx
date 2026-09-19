import type { Metadata } from "next"
import { Suspense } from "react"
import { getObrigadoPage, getSiteConfig } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { AcessoDireto, ObrigadoCanais } from "./_components/obrigado-canais"

const obrigado = getObrigadoPage()
const site = getSiteConfig()

export const metadata: Metadata = buildMetadata({
  title: obrigado.seo.seoTitle,
  description: obrigado.seo.description,
  path: "/contato/obrigado",
  robots: { index: false },
})

export default function ObrigadoPage() {
  return (
    <div className="relative">
      {/* Abertura: sem breadcrumbs e sem JSON-LD (arquitetura técnica 5.6) */}
      <section
        id="hero"
        aria-labelledby="hero-titulo"
        className="pt-(--space-6) pb-(--space-8) lg:pt-(--space-8) lg:pb-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-6)">
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo">
              {obrigado.h1}
            </Heading>
            <Suspense
              fallback={
                <AcessoDireto
                  texto={obrigado.canais.direto.text}
                  linkLabel={obrigado.canais.direto.link.label}
                  linkHref={obrigado.canais.direto.link.href}
                />
              }
            >
              <ObrigadoCanais
                mensagemGeral={site.contact.defaultWhatsappMessage}
                textos={{
                  whatsapp: {
                    text: obrigado.canais.whatsapp.text,
                    buttonLabel: obrigado.canais.whatsapp.buttonLabel,
                  },
                  email: {
                    fallbackText: obrigado.canais.email.fallbackText,
                    buttonLabel: obrigado.canais.email.buttonLabel,
                  },
                  direto: {
                    text: obrigado.canais.direto.text,
                    linkLabel: obrigado.canais.direto.link.label,
                    linkHref: obrigado.canais.direto.link.href,
                  },
                }}
              />
            </Suspense>
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
              {obrigado.proximosPassos.h2}
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-6) lg:col-span-6 lg:col-start-7">
            <ol className="flex flex-col gap-(--space-4)">
              {obrigado.proximosPassos.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex items-start gap-(--space-4) border-t-(length:--border-w-decorative) border-solid border-border-decorative pt-(--space-3)"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-caption font-bold text-accent select-none"
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
              <TextLink
                href={obrigado.proximosPassos.link.href}
                variante="acao"
              >
                {obrigado.proximosPassos.link.label}
              </TextLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
