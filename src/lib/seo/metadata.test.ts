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
})
