import type { Metadata } from "next"
import { getProcessoPage } from "@/content"
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
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { FaqItem } from "@/components/patterns/faq-item"
import { ConversaBand } from "@/components/patterns/conversa-band"

const processo = getProcessoPage()

export const metadata: Metadata = buildMetadata({
  title: processo.seo.seoTitle,
  description: processo.seo.description,
  path: "/processo",
})

export default function ProcessoPage() {
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: processo.seo.seoTitle,
      description: processo.seo.description,
      path: "/processo",
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Processo", path: "/processo" },
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
            trilha={[{ rotulo: "Início", href: "/" }, { rotulo: "Processo" }]}
          />
          <div className="flex max-w-(--medida-max) flex-col gap-(--space-4)">
            <Heading nivel={1} id="hero-titulo" semicolon>
              {processo.h1.replace(/;$/, "")}
            </Heading>
            <Text papel="lede" medida>
              {processo.lede}
            </Text>
          </div>
        </Container>
      </section>

      {/* Onde design, produto e engenharia se cruzam */}
      <section
        id="onde-se-cruzam"
        aria-labelledby="onde-se-cruzam-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-4)">
          <Heading nivel={2} id="onde-se-cruzam-titulo">
            {processo.ondeSeCruzam.h2}
          </Heading>
          <Text medida className="max-w-(--medida-max)">
            {processo.ondeSeCruzam.text}
          </Text>
        </Container>
      </section>

      {/* As cinco etapas */}
      <section
        id="etapas"
        aria-labelledby="etapas-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="flex flex-col gap-(--space-7) lg:gap-(--space-8)">
          <Heading nivel={2} id="etapas-titulo">
            As cinco etapas
          </Heading>
          <ol className="flex flex-col">
            {processo.etapas.map((etapa) => (
              <li
                key={etapa.number}
                className="grid grid-cols-1 gap-(--grid-gutter) border-b-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-6) lg:grid-cols-12"
              >
                <div className="flex items-start gap-(--space-4) lg:col-span-5">
                  <span
                    aria-hidden="true"
                    className="font-mono text-caption font-bold text-accent select-none"
                  >
                    {String(etapa.number).padStart(2, "0")}
                  </span>
                  <Heading nivel={3}>{etapa.title}</Heading>
                </div>
                <dl className="flex flex-col gap-(--space-4) lg:col-span-6 lg:col-start-7">
                  <div>
                    <dt className="text-label text-ink">O que acontece</dt>
                    <dd>
                      <Text medida>{etapa.whatHappens}</Text>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-label text-ink">Você recebe</dt>
                    <dd>
                      <Text medida>{etapa.youReceive}</Text>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-label text-ink">Sua participação</dt>
                    <dd>
                      <Text medida>{etapa.yourParticipation}</Text>
                    </dd>
                  </div>
                  {etapa.whereAppears ? (
                    <div>
                      <dt className="text-label text-ink">
                        Onde aparece num trabalho
                      </dt>
                      <dd>
                        <Text medida tom="muted">
                          {etapa.whereAppears}
                        </Text>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* O diagnóstico */}
      <section
        id="diagnostico"
        aria-labelledby="diagnostico-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="diagnostico-titulo">
              {processo.diagnostico.h2}
            </Heading>
          </div>
          <div className="flex flex-col gap-(--space-6) lg:col-span-6 lg:col-start-7">
            <Text medida>{processo.diagnostico.text}</Text>
            <ul className="flex flex-col gap-(--space-3)">
              {processo.diagnostico.questions.map((question) => (
                <li key={question} className="flex items-start gap-(--space-3)">
                  <span
                    aria-hidden="true"
                    className="text-body font-bold text-accent select-none"
                  >
                    —
                  </span>
                  <Text medida>{question}</Text>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-(--space-3)">
              <Heading nivel={3}>{processo.diagnostico.whatToBring.h3}</Heading>
              <ul className="flex flex-col gap-(--space-2)">
                {processo.diagnostico.whatToBring.items.map((item) => (
                  <li key={item}>
                    <Text medida>— {item}</Text>
                  </li>
                ))}
              </ul>
              <Text medida tom="muted">
                {processo.diagnostico.whatToBring.note}
              </Text>
            </div>
            <div className="flex flex-col gap-(--space-3)">
              <Heading nivel={3}>
                {processo.diagnostico.whatComesOut.h3}
              </Heading>
              <Text medida>{processo.diagnostico.whatComesOut.text}</Text>
            </div>
          </div>
        </Container>
      </section>

      {/* Parceiros e responsabilidade */}
      <section
        id="parceiros"
        aria-labelledby="parceiros-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="parceiros-titulo">
              {processo.parceiros.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>{processo.parceiros.text}</Text>
          </div>
        </Container>
      </section>

      {/* Depois da entrega */}
      <section
        id="depois-da-entrega"
        aria-labelledby="depois-da-entrega-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="depois-da-entrega-titulo">
              {processo.depoisDaEntrega.h2}
            </Heading>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Text medida>{processo.depoisDaEntrega.text}</Text>
          </div>
        </Container>
      </section>

      {/* Dúvidas */}
      <section
        id="duvidas"
        aria-labelledby="duvidas-titulo"
        className="border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-8) lg:py-(--space-9)"
      >
        <Container className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading nivel={2} id="duvidas-titulo">
              Dúvidas sobre custo, prazo e manutenção
            </Heading>
          </div>
          <div className="flex flex-col lg:col-span-6 lg:col-start-7">
            {processo.duvidas.map((duvida) => (
              <FaqItem pergunta={duvida.question} key={duvida.question}>
                {duvida.answer}
              </FaqItem>
            ))}
          </div>
        </Container>
      </section>

      {/* Banda final */}
      <ConversaBand
        id="conversa-processo"
        variante="chamada"
        titulo={processo.ctaFinal.h2.replace(/;$/, "")}
        frase={processo.ctaFinal.text}
        ctaHref={processo.ctaFinal.ctaPrimary.href}
        ctaRotulo={processo.ctaFinal.ctaPrimary.label}
        whatsapp={{
          rotulo: processo.ctaFinal.ctaSecondary.label,
          mensagem: processo.ctaFinal.ctaSecondary.whatsappMessage,
          location: "processo",
          context: "processo",
        }}
      />
    </div>
  )
}
