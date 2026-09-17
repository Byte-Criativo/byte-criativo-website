import { describe, expect, it } from "vitest"
import { buildMetadata } from "./metadata"

describe("buildMetadata", () => {
  it("gera canonical, Open Graph e Twitter coerentes", () => {
    const metadata = buildMetadata({
      title: "Processo",
      description:
        "Como um projeto anda na Byte Criativo, do diagnóstico ao lançamento.",
      path: "/processo",
    })
    expect(metadata.title).toBe("Processo")
    expect(metadata.alternates?.canonical).toBe("/processo")
    expect(metadata.openGraph).toMatchObject({
      url: "/processo",
      title: "Processo",
      locale: "pt_BR",
      siteName: "Byte Criativo",
      type: "website",
    })
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" })
  })

  it("recusa caminho sem barra inicial ou com barra final", () => {
    expect(() =>
      buildMetadata({ title: "X", description: "Y", path: "processo" }),
    ).toThrow()
    expect(() =>
      buildMetadata({ title: "X", description: "Y", path: "/processo/" }),
    ).toThrow()
  })

  it("recusa caminho que começa com // ou contém // (troca de host)", () => {
    expect(() =>
      buildMetadata({ title: "X", description: "Y", path: "//evil.example" }),
    ).toThrow()
    expect(() =>
      buildMetadata({ title: "X", description: "Y", path: "/a//b" }),
    ).toThrow()
  })

  it("usa /og-image.png como imagem padrão em Open Graph e Twitter", () => {
    const metadata = buildMetadata({
      title: "Processo",
      description: "Como um projeto anda",
      path: "/processo",
    })
    expect(metadata.openGraph?.images).toMatchObject([
      { url: "/og-image.png", width: 1200, height: 630 },
    ])
    expect(metadata.twitter).toMatchObject({
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    })
  })

  it("preenche título e descrição do Twitter", () => {
    const metadata = buildMetadata({
      title: "Processo",
      description: "Como um projeto anda",
      path: "/processo",
    })
    expect(metadata.twitter).toMatchObject({
      title: "Processo",
      description: "Como um projeto anda",
    })
  })
})
