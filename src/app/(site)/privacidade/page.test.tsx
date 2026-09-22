import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PrivacidadePage, { metadata } from "./page"
import { getPrivacidadePage } from "@/content"

const privacidade = getPrivacidadePage()

describe("Página Privacidade (/privacidade)", () => {
  it("exporta metadata com seoTitle, description e canonical /privacidade", () => {
    expect(metadata.title).toEqual({ absolute: privacidade.seo.seoTitle })
    expect(metadata.description).toBe(privacidade.seo.description)
    expect(metadata.alternates?.canonical).toBe("/privacidade")
  })

  it("renderiza script ld+json apenas com Organization, WebSite e WebPage", () => {
    const { container } = render(<PrivacidadePage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const json = JSON.parse(script?.textContent ?? "{}")
    const tipos = json["@graph"].map(
      (item: Record<string, unknown>) => item["@type"],
    )
    expect(tipos).toEqual(["Organization", "WebSite", "WebPage"])
  })

  it("renderiza exatamente um H1 com o título e a data de atualização", () => {
    render(<PrivacidadePage />)
    const h1s = screen.getAllByRole("heading", { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(privacidade.title)

    const tempo = screen.getByText(/Última atualização:/)
    expect(tempo.querySelector("time")).toHaveAttribute(
      "datetime",
      privacidade.lastUpdated,
    )
    expect(tempo).toHaveTextContent("16 de setembro de 2026")
  })

  it("renderiza as 15 seções do rascunho como H2, numeradas de 1 a 15", () => {
    render(<PrivacidadePage />)

    expect(privacidade.sections).toHaveLength(15)

    const h2s = screen.getAllByRole("heading", { level: 2 })
    expect(h2s).toHaveLength(15)
    expect(h2s.map((h2) => h2.textContent)).toEqual(
      privacidade.sections.map((s) => `${s.number}. ${s.title}`),
    )
    expect(privacidade.sections.map((s) => s.number)).toEqual(
      Array.from({ length: 15 }, (_, i) => String(i + 1)),
    )
  })

  it("renderiza os blocos de conteúdo de cada seção (parágrafos, listas e tabelas)", () => {
    render(<PrivacidadePage />)

    for (const section of privacidade.sections) {
      const titulo = `${section.number}. ${section.title}`
      const secao = screen.getByRole("region", { name: titulo })

      for (const bloco of section.blocks ?? []) {
        if (bloco.type === "paragraph") {
          // Trechos repetidos dentro da mesma seção são válidos no texto
          // da política (ex.: as linhas de base legal das subseções).
          expect(
            within(secao).getAllByText(bloco.text).length,
          ).toBeGreaterThanOrEqual(1)
        } else if (bloco.type === "list") {
          for (const item of bloco.items) {
            expect(
              within(secao).getAllByText(item).length,
            ).toBeGreaterThanOrEqual(1)
          }
        } else {
          for (const linha of bloco.rows) {
            for (const celula of linha) {
              expect(
                within(secao).getAllByText(celula).length,
              ).toBeGreaterThanOrEqual(1)
            }
          }
        }
      }
    }
  })

  it("renderiza as tabelas das seções 5 e 14 com caption e escopos acessíveis", () => {
    render(<PrivacidadePage />)

    const secoesComTabela = privacidade.sections.filter((section) =>
      section.blocks?.some((bloco) => bloco.type === "table"),
    )
    expect(secoesComTabela.map((s) => s.number)).toEqual(["5", "14"])

    for (const section of secoesComTabela) {
      const secao = screen.getByRole("region", {
        name: `${section.number}. ${section.title}`,
      })
      const blocoTabela = section.blocks?.find(
        (bloco) => bloco.type === "table",
      )
      if (!blocoTabela || blocoTabela.type !== "table") continue

      const tabela = within(secao).getByRole("table", {
        name: blocoTabela.caption,
      })
      for (const coluna of blocoTabela.columns) {
        expect(
          within(tabela).getByRole("columnheader", { name: coluna }),
        ).toHaveAttribute("scope", "col")
      }
      for (const linha of blocoTabela.rows) {
        expect(
          within(tabela).getByRole("rowheader", { name: linha[0] }),
        ).toHaveAttribute("scope", "row")
      }
    }
  })

  it("publica a seção 5 só com categorias, sem fornecedores nem anotações internas", () => {
    render(<PrivacidadePage />)

    const secao = screen.getByRole("region", {
      name: "5. Com quem os dados são compartilhados",
    })
    for (const proibido of [
      "Vercel",
      "Resend",
      "Proposta da arquitetura técnica",
      "a definir",
      "Não documentado",
    ]) {
      expect(within(secao).queryByText(new RegExp(proibido))).toBeNull()
    }
  })

  it("deriva a data da versão 1.0 da mesma fonte de lastUpdated", () => {
    render(<PrivacidadePage />)

    const secao = screen.getByRole("region", {
      name: "14. Mudanças nesta política",
    })
    expect(
      within(secao).getByText("16 de setembro de 2026"),
    ).toBeInTheDocument()
  })

  it("renderiza a lista ordenada dos 9 direitos do art. 18 na seção 8", () => {
    render(<PrivacidadePage />)

    const secao = screen.getByRole("region", { name: "8. Seus direitos" })
    const listas = within(secao).getAllByRole("list")
    expect(listas).toHaveLength(1)
    const [lista] = listas
    expect(lista).toBeDefined()
    if (!lista) return
    expect(within(lista).getAllByRole("listitem")).toHaveLength(9)
  })

  it("mantém a seção do Pomodoro apontando para a política própria do aplicativo", () => {
    render(<PrivacidadePage />)

    const secao = screen.getByRole("region", {
      name: "13. Aplicativo Pomodoro",
    })
    expect(secao).toHaveTextContent("www.bcriativo.com/pomodoro/privacidade")
    expect(secao).toHaveTextContent(
      "Esta política não se aplica ao aplicativo.",
    )
  })

  it("renderiza as 9 subseções 3.1 a 3.9 como H3 dentro da seção de dados tratados", () => {
    render(<PrivacidadePage />)

    const principal = privacidade.sections.find((s) => s.subsections)
    expect(principal).toBeDefined()
    if (!principal) return

    expect(principal.subsections).toHaveLength(9)
    expect(principal.subsections?.map((sub) => sub.number)).toEqual(
      Array.from({ length: 9 }, (_, i) => `3.${i + 1}`),
    )

    const secao = screen.getByRole("region", {
      name: `${principal.number}. ${principal.title}`,
    })

    for (const sub of principal.subsections ?? []) {
      const titulo = `${sub.number} ${sub.title}`
      expect(
        within(secao).getByRole("heading", { level: 3, name: titulo }),
      ).toBeInTheDocument()

      for (const bloco of sub.blocks) {
        if (bloco.type === "paragraph") {
          expect(
            within(secao).getAllByText(bloco.text).length,
          ).toBeGreaterThanOrEqual(1)
        } else if (bloco.type === "list") {
          for (const item of bloco.items) {
            expect(
              within(secao).getAllByText(item).length,
            ).toBeGreaterThanOrEqual(1)
          }
        }
      }
    }
  })

  it("não renderiza breadcrumbs", () => {
    render(<PrivacidadePage />)
    expect(
      screen.queryByRole("navigation", { name: "Caminho da página" }),
    ).toBeNull()
  })
})
