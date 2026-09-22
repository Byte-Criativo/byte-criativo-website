import type { Metadata } from "next"
import type { ReactElement } from "react"
import { getPrivacidadePage } from "@/content"
import { formatarDataPorExtenso } from "@/content/pages"
import type { PrivacidadeBlock } from "@/content/schema"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  buildJsonLdGraph,
  organization,
  webSite,
  webPage,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { cn } from "@/lib/cn"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { EditorialLayout } from "@/components/patterns/editorial-layout"

const privacidade = getPrivacidadePage()

export const metadata: Metadata = buildMetadata({
  title: privacidade.seo.seoTitle,
  description: privacidade.seo.description,
  path: "/privacidade",
})

function Blocos({ blocos }: { blocos: PrivacidadeBlock[] }): ReactElement {
  return (
    <>
      {blocos.map((bloco, indice) => {
        switch (bloco.type) {
          case "paragraph":
            return (
              <Text key={indice} medida>
                {bloco.text}
              </Text>
            )
          case "list": {
            const Tag = bloco.ordered ? "ol" : "ul"
            return (
              <div key={indice} className="flex flex-col gap-(--space-2)">
                {bloco.title ? <Text medida>{bloco.title}</Text> : null}
                <Tag
                  className={cn(
                    "flex max-w-(--medida-max) flex-col gap-(--space-2) pl-(--space-5) text-body text-ink",
                    bloco.ordered ? "list-decimal" : "list-disc",
                  )}
                >
                  {bloco.items.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </Tag>
              </div>
            )
          }
          case "table":
            return (
              <div key={indice} className="overflow-x-auto">
                <table className="w-full border-collapse text-body text-ink">
                  <caption className="p-(--space-2) text-left text-caption text-ink-muted">
                    {bloco.caption}
                  </caption>
                  <thead>
                    <tr>
                      {bloco.columns.map((coluna) => (
                        <th
                          key={coluna}
                          scope="col"
                          className="border-(length:--border-w-decorative) border-solid border-border-decorative p-(--space-2) text-left font-medium"
                        >
                          {coluna}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bloco.rows.map((linha, indiceLinha) => (
                      <tr key={indiceLinha}>
                        {linha.map((celula, indiceCelula) =>
                          indiceCelula === 0 ? (
                            <th
                              key={indiceCelula}
                              scope="row"
                              className="border-(length:--border-w-decorative) border-solid border-border-decorative p-(--space-2) text-left font-normal"
                            >
                              {celula}
                            </th>
                          ) : (
                            <td
                              key={indiceCelula}
                              className="border-(length:--border-w-decorative) border-solid border-border-decorative p-(--space-2) align-top"
                            >
                              {celula}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      })}
    </>
  )
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
              {formatarDataPorExtenso(privacidade.lastUpdated)}
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
            {section.blocks ? <Blocos blocos={section.blocks} /> : null}
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
                <Blocos blocos={sub.blocks} />
              </section>
            ))}
          </section>
        ))}
      </EditorialLayout>
    </div>
  )
}
