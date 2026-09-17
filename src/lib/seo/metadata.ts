import type { Metadata } from "next"

export const SITE_URL = "https://www.bcriativo.com"
export const SITE_NAME = "Byte Criativo"

const DEFAULT_OG_IMAGE = "/og-image.png"

type MetadataInput = {
  title: string
  description: string
  path: string
  image?: string
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: MetadataInput): Metadata {
  if (
    !path.startsWith("/") ||
    (path.length > 1 && path.endsWith("/")) ||
    path.includes("//")
  ) {
    throw new Error(`Caminho inválido para canonical: ${path}`)
  }
  const resolvedImage = image ?? DEFAULT_OG_IMAGE
  const images = [{ url: resolvedImage, width: 1200, height: 630 }]
  return {
    title,
    description,
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
