import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCaseBySlug, getPublishedCases } from "@/content"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  organization,
  webSite,
  webPage,
  creativeWorkJsonLd,
  breadcrumbsJsonLd,
  buildJsonLdGraph,
  serializeJsonLd,
} from "@/lib/seo/json-ld"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { CaseHero } from "@/components/patterns/case-hero"
import { EditorialLayout } from "@/components/patterns/editorial-layout"
import { GaleriaDialog } from "@/components/patterns/galeria-dialog"
import { NavegacaoTrabalhos } from "@/components/patterns/navegacao-trabalhos"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import { Media } from "@/components/patterns/media"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  // Só cases publicados viram página estática. Hoje nenhum (gate D5), então
  // a rota existe mas não gera páginas até a assinatura do dono.
  return getPublishedCases().map((estudo) => ({ slug: estudo.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const estudo = getCaseBySlug(slug)

  if (!estudo || estudo.status !== "published") {
    return {}
  }

  return buildMetadata({
    title: estudo.seo.title,
    description: estudo.seo.description,
    path: `/portfolio/${estudo.slug}`,
    image: estudo.media.cover.src,
    imageSize: {
      width: estudo.media.cover.width,
      height: estudo.media.cover.height,
    },
  })
}

function nomeCurto(titulo: string): string {
  return titulo.split(":")[0] ?? titulo
}

export default async function CasePage({ params }: PageProps) {
  const { slug } = await params
  const estudo = getCaseBySlug(slug)

  // dynamicParams = false já barra slugs fora de generateStaticParams; a
  // checagem de status protege também acesso direto a case em review.
  if (!estudo || estudo.status !== "published") {
    notFound()
  }

  const nome = nomeCurto(estudo.title)
  const dominio = new URL(estudo.liveUrl).hostname.replace(/^www\./, "")
  const caminho = `/portfolio/${estudo.slug}`

  const anterior = getPublishedCases().find(
    (outro) => outro.slug !== estudo.slug,
  )

  const jsonLdGraph = buildJsonLdGraph([
    organization(),
    webSite(),
    webPage({
      name: estudo.seo.title,
      description: estudo.seo.description,
      path: caminho,
    }),
    creativeWorkJsonLd({
      name: estudo.title,
      description: estudo.summary,
      path: caminho,
      liveUrl: estudo.liveUrl,
    }),
    breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Trabalhos", path: "/portfolio" },
      { name: nome, path: caminho },
    ]),
  ])

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
      />

      <div className="mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin) pt-(--space-6)">
        <Breadcrumbs
          trilha={[
            { rotulo: "Início", href: "/" },
            { rotulo: "Trabalhos", href: "/portfolio" },
            { rotulo: nome },
          ]}
        />
      </div>

      <article
        data-case={estudo.slug}
        className="bg-bg pb-(--space-8) text-ink"
      >
        <CaseHero
          titulo={estudo.title}
          subtitulo={estudo.subtitle}
          imagem={
            <BrowserFrame dominio={dominio} legenda={estudo.media.cover.alt}>
              <Media
                tipo="captura"
                src={estudo.media.cover.src}
                alt={estudo.media.cover.alt}
                width={estudo.media.cover.width}
                height={estudo.media.cover.height}
                sizes="(min-width: 64rem) 58vw, 100vw"
                prioridade
              />
            </BrowserFrame>
          }
          fichaTecnica={[
            { termo: "Tipo", descricao: estudo.projectType },
            { termo: "Plataformas", descricao: "Web" },
            {
              termo: "Tecnologias",
              descricao: estudo.engineering.map((item) => item.name).join(", "),
            },
          ]}
          projetoNoAr={{ nome, href: estudo.liveUrl }}
        />

        <EditorialLayout className="pt-(--space-8)">
          <Heading nivel={2}>O que o projeto precisava</Heading>
          <ul className="flex flex-col gap-(--space-3)">
            {estudo.needs.map((necessidade) => (
              <li
                key={necessidade}
                className="flex items-start gap-(--space-3)"
              >
                <span aria-hidden="true" className="font-bold select-none">
                  —
                </span>
                <Text medida>{necessidade}</Text>
              </li>
            ))}
          </ul>

          <Heading nivel={2}>Decisões de UX</Heading>
          {estudo.uxDecisions.map((decisao) => (
            <section key={decisao.title} aria-label={decisao.title}>
              <Heading nivel={3}>{decisao.title}</Heading>
              <Text medida tom="muted">
                {decisao.problem}
              </Text>
              <Text medida>{decisao.decision}</Text>
            </section>
          ))}

          <Heading nivel={2}>Engenharia verificada</Heading>
          <ul className="flex flex-col gap-(--space-3)">
            {estudo.engineering.map((item) => (
              <li key={item.name}>
                <Text medida>
                  <strong>{item.name}</strong>
                  {` — ${item.evidence}`}
                </Text>
              </li>
            ))}
          </ul>

          <Heading nivel={2}>O que se observa no ar</Heading>
          <dl className="flex flex-col gap-(--space-3)">
            {estudo.observableResults.map((fato) => (
              <div key={fato.label}>
                <dt className="text-caption text-ink-muted">{fato.label}</dt>
                <dd>
                  <Text medida>
                    {`${fato.value} (fonte: ${fato.source}, verificado em ${fato.checkedAt})`}
                  </Text>
                </dd>
              </div>
            ))}
          </dl>

          <Heading nivel={2}>Créditos de terceiros</Heading>
          <ul className="flex flex-col gap-(--space-3)">
            {estudo.thirdPartyCredits.map((credito) => (
              <li key={credito.item}>
                <Text medida>
                  <strong>{credito.item}</strong>
                  {` — ${credito.credit}`}
                </Text>
              </li>
            ))}
          </ul>

          <Heading nivel={2}>Galeria</Heading>
          <GaleriaDialog
            itens={estudo.media.gallery.map((imagem, indice) => ({
              id: `galeria-${indice + 1}`,
              legenda: imagem.caption ?? imagem.alt,
              ampliada: (
                <Media
                  tipo="captura"
                  src={imagem.src}
                  alt={imagem.alt}
                  width={imagem.width}
                  height={imagem.height}
                  sizes="(min-width: 64rem) 80vw, 100vw"
                  className={
                    imagem.width < imagem.height
                      ? "mx-auto max-w-96"
                      : undefined
                  }
                />
              ),
            }))}
          >
            {estudo.media.gallery.map((imagem, indice) => (
              <figure
                key={`galeria-${indice + 1}`}
                data-galeria-item={`galeria-${indice + 1}`}
                className="relative"
              >
                <Media
                  tipo="captura"
                  src={imagem.src}
                  alt={imagem.alt}
                  width={imagem.width}
                  height={imagem.height}
                  sizes="(min-width: 64rem) 58vw, 100vw"
                  className={
                    imagem.width < imagem.height
                      ? "mx-auto max-w-96"
                      : undefined
                  }
                />
                <figcaption className="pt-(--space-2) text-caption text-ink-muted">
                  {imagem.caption ?? imagem.alt}
                </figcaption>
              </figure>
            ))}
          </GaleriaDialog>
        </EditorialLayout>
      </article>

      <NavegacaoTrabalhos
        anterior={
          anterior
            ? {
                nome: nomeCurto(anterior.title),
                href: `/portfolio/${anterior.slug}`,
              }
            : undefined
        }
        todosHref="/portfolio"
      />
    </div>
  )
}
