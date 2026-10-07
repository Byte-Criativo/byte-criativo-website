import { describe, expect, it } from "vitest"
import { homePageData } from "@/content/home"
import { CAPTURAS_DAS_SALAS } from "./capturas-das-salas"

// Nome do arquivo em src/assets por slug da sala (o do Underground PB não
// tem hífen, herança das capas de 22/09).
const ARQUIVO: Record<string, string> = {
  "underground-pb": "undergroundpb",
  "festival-alumio": "festival-alumio",
  goromax: "goromax",
  "carlos-ferrer": "carlos-ferrer",
}

/**
 * No Vitest o import de um .webp é só a URL do arquivo (uma string), não o
 * StaticImageData do Next. Isso basta para conferir a fiação: cada campo
 * aponta para o arquivo certo (um 1170 trocado por um 780 deixaria o
 * descritor de largura do srcset falso).
 */
function arquivoDe(imagem: unknown): string {
  return String(imagem).split("/").pop() ?? ""
}

describe("capturas das salas", () => {
  it("toda sala tem captura, com o domínio do site ao vivo", () => {
    for (const sala of homePageData.salas.items) {
      const captura = CAPTURAS_DAS_SALAS[sala.slug]
      expect(captura, sala.slug).toBeDefined()
      expect(new URL(sala.liveUrl).hostname.replace(/^www\./, "")).toBe(
        captura?.dominio,
      )
    }
  })

  it("cada campo aponta para o derivado certo em src/assets", () => {
    for (const [slug, arquivo] of Object.entries(ARQUIVO)) {
      const captura = CAPTURAS_DAS_SALAS[slug]
      expect(arquivoDe(captura?.desktop)).toBe(
        `case-${arquivo}-screenshot.webp`,
      )
      expect(arquivoDe(captura?.celular780)).toBe(
        `case-${arquivo}-celular-780.webp`,
      )
      expect(arquivoDe(captura?.celular1170)).toBe(
        `case-${arquivo}-celular-1170.webp`,
      )
    }
  })
})
