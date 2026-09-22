import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { HomeConversa } from "./home-conversa"
import { getHomePage, getSiteConfig } from "@/content"

const home = getHomePage()
const site = getSiteConfig()

describe("HomeConversa", () => {
  it("renderiza o aviso de privacidade uma única vez, com o link embutido", () => {
    render(<HomeConversa conversa={home.conversa} site={site} />)

    const links = screen.getAllByRole("link", {
      name: "política de privacidade",
    })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute("href", "/privacidade")

    const aviso = links[0]?.closest("p")
    expect(aviso).not.toBeNull()
    expect(aviso?.textContent).toBe(home.conversa.formNotice)

    expect(
      screen.getAllByText(/Seus dados são usados só para responder/),
    ).toHaveLength(1)
  })

  it("falha rápido se o formNotice não traz o trecho do link exatamente uma vez", () => {
    const conversaSemTrecho = {
      ...home.conversa,
      formNotice:
        "Seus dados são usados só para responder sobre o seu projeto.",
    }

    expect(() =>
      render(<HomeConversa conversa={conversaSemTrecho} site={site} />),
    ).toThrow(/política de privacidade.*exatamente uma vez/)
  })
})
