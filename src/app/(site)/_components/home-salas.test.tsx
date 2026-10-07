import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { homePageData } from "@/content/home"
import { HomeSalas } from "./home-salas"

const salas = homePageData.salas
const salasDaHome = salas.items.slice(0, 2)

describe("HomeSalas", () => {
  it("renderiza as duas salas da home, cada uma com a captura em <picture>", () => {
    render(<HomeSalas salas={salas} />)
    const secao = screen.getByRole("region", { name: "Projetos em destaque" })

    for (const sala of salasDaHome) {
      const artigo = within(secao).getByRole("article", { name: sala.name })
      const img = within(artigo).getByAltText(sala.image.alt)
      const picture = img.closest("picture")
      expect(picture).not.toBeNull()

      // No Vitest o import de .webp vira só a URL (sem .src nem
      // dimensões): aqui conferimos a estrutura; os valores do srcset e das
      // dimensões ficam no teste do componente.
      const source = picture?.querySelector("source")
      expect(source).toHaveAttribute("media", "(width < 30rem)")
      expect(source).toHaveAttribute("sizes", "calc(100vw - 42px)")
      expect(source).toHaveAttribute("type", "image/webp")
      expect(source?.getAttribute("srcset")?.split(", ")).toHaveLength(2)

      // Sala da home nunca é LCP (fica abaixo da abertura): carga adiada.
      expect(img).toHaveAttribute("loading", "lazy")
      expect(img).not.toHaveAttribute("fetchpriority")

      // O mesmo texto é a legenda visível da moldura.
      expect(
        within(artigo).getByRole("figure", { name: sala.image.alt }),
      ).toBeInTheDocument()
    }
  })
})
