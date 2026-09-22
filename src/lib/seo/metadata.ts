import type { Metadata } from "next"

export const SITE_URL = "https://www.bcriativo.com"
export const SITE_NAME = "Byte Criativo"

const DEFAULT_OG_IMAGE = "/og-image.png"

type MetadataInput = {
  title: string
  description: string
  path: string
  image?: string
  imageSize?: { width: number; height: number }
  robots?: Metadata["robots"]
}

// Lista de permissão em vez de proibir "//": aceita "/" (home) ou "/" seguido
// de um ou mais segmentos minúsculos alfanuméricos com hífen, sem barra
// final, sem espaços/controle e sem letra maiúscula. Qualquer coisa fora
// disso (troca de host via "//evil", espaço, tab, barra invertida,
// maiúscula) é rejeitada.
const CANONICAL_PATH_RE = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/

export function buildMetadata({
  title,
  description,
  path,
  image,
  imageSize,
  robots,
}: MetadataInput): Metadata {
  if (!CANONICAL_PATH_RE.test(path)) {
    throw new Error(`Caminho inválido para canonical: ${path}`)
  }
  const resolvedImage = image ?? DEFAULT_OG_IMAGE
  const images = [
    {
      url: resolvedImage,
      width: imageSize?.width ?? 1200,
      height: imageSize?.height ?? 630,
    },
  ]
  return {
    // `absolute` porque os seoTitle da copy v1 já trazem "| Byte Criativo";
    // sem isso o template "%s | Byte Criativo" do layout raiz duplica o sufixo.
    title: { absolute: title },
    description,
    ...(robots ? { robots } : {}),
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title,
      description,
      locale: "pt_BR",
      siteName: SITE_NAME,
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  }
}
