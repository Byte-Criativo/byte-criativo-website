import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CapturaDaSala } from "./captura-da-sala"
import type { CapturaDaSalaDados } from "./capturas-das-salas"

// No Vitest um import de .webp vira só a URL (string), sem dimensões: aqui
// os dados são objetos literais no formato do StaticImageData do Next, com
// as dimensões reais da sala do Underground PB (retrato de 390 × 505 CSS).
const CAPTURA: CapturaDaSalaDados = {
  dominio: "undergroundpb.com.br",
  desktop: {
    src: "/_next/static/media/case-undergroundpb-screenshot.webp",
    width: 1440,
    height: 900,
  },
  celular780: {
    src: "/_next/static/media/case-undergroundpb-celular-780.webp",
    width: 780,
    height: 1010,
  },
  celular1170: {
    src: "/_next/static/media/case-undergroundpb-celular-1170.webp",
    width: 1170,
    height: 1515,
  },
}

const ALT =
  "Página inicial do Underground PB, capturada em 7 de outubro de 2026, com um show em destaque"

function renderCaptura(
  props: Partial<Parameters<typeof CapturaDaSala>[0]> = {},
) {
  return render(
    <CapturaDaSala captura={CAPTURA} alt={ALT} loading="lazy" {...props} />,
  )
}

describe("CapturaDaSala", () => {
  it("usa <picture> com um <source> de celular e o <img> desktop dentro dele", () => {
    const { container } = renderCaptura()
    const picture = container.querySelector("figure picture")
    expect(picture).not.toBeNull()
    expect(picture?.querySelectorAll("source")).toHaveLength(1)
    expect(picture?.querySelectorAll("img")).toHaveLength(1)
    // O <img> vem depois do <source>, como a direção de arte exige.
    expect(picture?.lastElementChild?.tagName).toBe("IMG")
  })

  it("o <source> só vale abaixo de sm e traz o retrato em 780 w e 1170 w", () => {
    const { container } = renderCaptura()
    const source = container.querySelector("picture source")
    expect(source).toHaveAttribute("media", "(width < 30rem)")
    expect(source).toHaveAttribute("type", "image/webp")
    expect(source).toHaveAttribute(
      "srcset",
      "/_next/static/media/case-undergroundpb-celular-780.webp 780w, /_next/static/media/case-undergroundpb-celular-1170.webp 1170w",
    )
    expect(source).toHaveAttribute("sizes", "calc(100vw - 42px)")
  })

  it("o <source> reserva a proporção do retrato (sem CLS no celular)", () => {
    const { container } = renderCaptura()
    const source = container.querySelector("picture source")
    expect(source).toHaveAttribute("width", "1170")
    expect(source).toHaveAttribute("height", "1515")
  })

  it("o <img> mantém a captura desktop, o alt, as dimensões e a carga adiada", () => {
    renderCaptura()
    const img = screen.getByAltText(ALT)
    expect(img).toHaveAttribute(
      "src",
      "/_next/static/media/case-undergroundpb-screenshot.webp",
    )
    expect(img).toHaveAttribute("width", "1440")
    expect(img).toHaveAttribute("height", "900")
    expect(img).toHaveAttribute("loading", "lazy")
    expect(img).toHaveAttribute("decoding", "async")
    expect(img).not.toHaveAttribute("fetchpriority")
    expect(img).toHaveClass("h-auto", "w-full", "object-cover")
  })

  it("repassa carga imediata e prioridade alta quando a sala é candidata a LCP", () => {
    renderCaptura({ loading: "eager", fetchPriority: "high" })
    const img = screen.getByAltText(ALT)
    expect(img).toHaveAttribute("loading", "eager")
    expect(img).toHaveAttribute("fetchpriority", "high")
  })

  it("o mesmo texto é alt e legenda visível, na moldura com o domínio", () => {
    const { container } = renderCaptura()
    expect(screen.getByRole("figure", { name: ALT })).toBeInTheDocument()
    expect(container.querySelector("figcaption")).toHaveTextContent(ALT)
    expect(container.querySelector("[data-barra]")).toHaveTextContent(
      "undergroundpb.com.br",
    )
  })
})
