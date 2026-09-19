import { describe, expect, it } from "vitest"
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbsJsonLd,
  buildJsonLdGraph,
  collectionPageJsonLd,
  faqPageJsonLd,
  organization,
  serializeJsonLd,
  serviceJsonLd,
  webPage,
  webSite,
} from "./json-ld"

describe("json-ld", () => {
  it("organização tem @id estável e CNPJ", () => {
    const org = organization()
    expect(org["@id"]).toBe(ORGANIZATION_ID)
    expect(org["taxID"]).toBe("52.652.130/0001-02")
  })

  it("webSite tem @id estável e publisher vinculado à organização", () => {
    const site = webSite()
    expect(site["@id"]).toBe(WEBSITE_ID)
    expect(site["publisher"]).toEqual({ "@id": ORGANIZATION_ID })
    expect(site["inLanguage"]).toBe("pt-BR")
  })

  it("webPage vincula a página ao WebSite e à Organization", () => {
    const page = webPage({
      name: "Serviços",
      description: "Serviços de design e engenharia",
      path: "/servicos",
    })
    expect(page["@type"]).toBe("WebPage")
    expect(page["@id"]).toBe("https://www.bcriativo.com/servicos#webpage")
    expect(page["isPartOf"]).toEqual({ "@id": WEBSITE_ID })
    expect(page["about"]).toEqual({ "@id": ORGANIZATION_ID })
  })

  it("serviceJsonLd cria nó Service com provider da organização", () => {
    const s = serviceJsonLd({
      name: "Desenvolvimento de sites",
      description: "Sites profissionais e rápidos",
      path: "/servicos/desenvolvimento-de-sites",
    })
    expect(s["@type"]).toBe("Service")
    expect(s["@id"]).toBe(
      "https://www.bcriativo.com/servicos/desenvolvimento-de-sites#service",
    )
    expect(s["provider"]).toEqual({ "@id": ORGANIZATION_ID })
    expect(s["serviceType"]).toBe("Desenvolvimento de sites")
  })

  it("faqPageJsonLd gera nó FAQPage com perguntas e respostas", () => {
    const faq = faqPageJsonLd([
      { question: "Como funciona?", answer: "Explicamos no diagnóstico." },
    ])
    expect(faq["@type"]).toBe("FAQPage")
    expect(faq["mainEntity"]).toEqual([
      {
        "@type": "Question",
        name: "Como funciona?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Explicamos no diagnóstico.",
        },
      },
    ])
  })

  it("breadcrumbsJsonLd mapeia posições e caminhos", () => {
    const crumbs = breadcrumbsJsonLd([
      { name: "Início", path: "/" },
      { name: "Serviços", path: "/servicos" },
    ])
    expect(crumbs["@type"]).toBe("BreadcrumbList")
    expect(crumbs["itemListElement"]).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://www.bcriativo.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Serviços",
        item: "https://www.bcriativo.com/servicos",
      },
    ])
  })

  it("buildJsonLdGraph monta envelope @graph com @context schema.org", () => {
    const graph = buildJsonLdGraph([organization(), webSite()])
    expect(graph["@context"]).toBe("https://schema.org")
    expect(Array.isArray(graph["@graph"])).toBe(true)
  })

  it("webPage aceita tipo especializado (AboutPage, ContactPage)", () => {
    const sobre = webPage({
      name: "Sobre",
      description: "Quem conduz a Byte Criativo.",
      path: "/sobre",
      type: "AboutPage",
    })
    expect(sobre["@type"]).toBe("AboutPage")
    expect(sobre["@id"]).toBe("https://www.bcriativo.com/sobre#webpage")

    const contato = webPage({
      name: "Contato",
      description: "Fale com a Byte Criativo.",
      path: "/contato",
      type: "ContactPage",
    })
    expect(contato["@type"]).toBe("ContactPage")
  })

  it("collectionPageJsonLd gera CollectionPage com ItemList de CreativeWork", () => {
    const colecao = collectionPageJsonLd({
      name: "Trabalhos",
      description: "Estudos de caso publicados.",
      path: "/portfolio",
      items: [
        { name: "Underground PB", path: "/portfolio/underground-pb" },
        { name: "Festival Alumiô", path: "/portfolio/festival-alumio" },
      ],
    })
    expect(colecao["@type"]).toBe("CollectionPage")
    expect(colecao["@id"]).toBe("https://www.bcriativo.com/portfolio#webpage")
    expect(colecao["isPartOf"]).toEqual({ "@id": WEBSITE_ID })
    expect(colecao["about"]).toEqual({ "@id": ORGANIZATION_ID })

    const lista = colecao["mainEntity"] as Record<string, unknown>
    expect(lista["@type"]).toBe("ItemList")
    expect(lista["itemListElement"]).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "CreativeWork",
          name: "Underground PB",
          url: "https://www.bcriativo.com/portfolio/underground-pb",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "CreativeWork",
          name: "Festival Alumiô",
          url: "https://www.bcriativo.com/portfolio/festival-alumio",
        },
      },
    ])
  })

  it("serialização escapa < para evitar fechar a tag script", () => {
    const output = serializeJsonLd({
      name: "</script><script>alert(1)</script>",
    })
    expect(output).not.toContain("<")
    expect(JSON.parse(output).name).toBe("</script><script>alert(1)</script>")
  })
})
