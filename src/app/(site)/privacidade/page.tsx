import type { Metadata } from "next"
import { getPrivacidadePage } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  webPage,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { EditorialLayout } from "@/components/patterns/editorial-layout"

const privacidade = getPrivacidadePage()

export const metadata: Metadata = buildMetadata({
  title: privacidade.seo.seoTitle,
  description: privacidade.seo.description,
  path: "/privacidade",
})

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number)
  const nomeMes = MESES[(mes ?? 1) - 1] ?? ""
  return `${dia} de ${nomeMes} de ${ano}`
}

function paragrafosDe(content: string | string[]): string[] {
  return Array.isArray(content) ? content : [content]
}

export default function PrivacidadePage() {
  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: privacidade.seo.seoTitle,
      description: privacidade.seo.description,
      path: "/privacidade",
    }),
  ])

  return (
    <div className="relative py-(--space-8) lg:py-(--space-9)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />

      <EditorialLayout variante="texto">
        <header className="flex flex-col gap-(--space-4)">
          <Heading nivel={1}>{privacidade.title}</Heading>
          <Text papel="caption" tom="muted">
            Última atualização:{" "}
            <time dateTime={privacidade.lastUpdated}>
              {formatarData(privacidade.lastUpdated)}
            </time>
          </Text>
        </header>

        {privacidade.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-titulo`}
            className="flex flex-col gap-(--space-4)"
          >
            <Heading nivel={2} id={`${section.id}-titulo`}>
              {`${section.number}. ${section.title}`}
            </Heading>
            {paragrafosDe(section.content).map((paragrafo) => (
              <Text key={paragrafo.slice(0, 40)} medida>
                {paragrafo}
              </Text>
            ))}
            {section.subsections?.map((sub) => (
              <section
                key={sub.id}
                id={sub.id}
                aria-labelledby={`${sub.id}-titulo`}
                className="flex flex-col gap-(--space-3) pt-(--space-3)"
              >
                <Heading nivel={3} id={`${sub.id}-titulo`}>
                  {`${sub.number} ${sub.title}`}
                </Heading>
                {paragrafosDe(sub.content).map((paragrafo) => (
                  <Text key={paragrafo.slice(0, 40)} medida>
                    {paragrafo}
                  </Text>
                ))}
              </section>
            ))}
          </section>
        ))}
      </EditorialLayout>
    </div>
  )
}
