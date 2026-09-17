import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Icon, type IconeNome } from "./icon"

const NOMES: IconeNome[] = [
  "alerta",
  "atencao",
  "confirmado",
  "whatsapp",
  "mais",
  "menos",
  "fechar",
  "ampliar",
  "reproduzir",
  "pausar",
  "email",
  "copiar",
]

describe("Icon", () => {
  it("é decorativo por padrão e fora da ordem de foco", () => {
    const { container } = render(<Icon nome="alerta" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).toHaveAttribute("focusable", "false")
    expect(svg).not.toHaveAttribute("role")
  })

  it("com título vira imagem nomeada", () => {
    const { container, getByRole } = render(
      <Icon nome="whatsapp" titulo="WhatsApp" />,
    )
    expect(getByRole("img", { name: "WhatsApp" })).toBeInTheDocument()
    expect(container.querySelector("svg")).not.toHaveAttribute("aria-hidden")
  })

  it("herda a cor do texto e a espessura do token de controle", () => {
    const { container } = render(<Icon nome="fechar" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("stroke", "currentColor")
    expect(svg?.getAttribute("style")).toContain("var(--border-w-control)")
  })

  it.each(NOMES)("%s desenha em 24 × 24 e tem traçado", (nome) => {
    const { container } = render(<Icon nome={nome} />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24")
    expect(svg).toHaveAttribute("width", "24")
    expect(svg?.querySelectorAll("path").length).toBeGreaterThan(0)
  })

  it("mais e menos têm traçados diferentes (M1): o FaqItem alterna exatamente entre os dois", () => {
    const mais = render(<Icon nome="mais" />)
    const menos = render(<Icon nome="menos" />)
    const tracadosMais = [...mais.container.querySelectorAll("path")].map((p) =>
      p.getAttribute("d"),
    )
    const tracadosMenos = [...menos.container.querySelectorAll("path")].map(
      (p) => p.getAttribute("d"),
    )
    expect(tracadosMais).toHaveLength(2)
    expect(tracadosMenos).toHaveLength(1)
    expect(tracadosMais).not.toEqual(tracadosMenos)
    // "mais" tem o traço vertical que "menos" não tem.
    expect(tracadosMais).toContain("M12 5v14")
  })

  it("os 12 ícones têm, cada um, um conjunto de traçados único (M1)", () => {
    const assinaturas = NOMES.map((nome) => {
      const { container, unmount } = render(<Icon nome={nome} />)
      const assinatura = [...container.querySelectorAll("path")]
        .map((p) => p.getAttribute("d"))
        .join("|")
      unmount()
      return assinatura
    })
    expect(new Set(assinaturas).size).toBe(NOMES.length)
  })
})
