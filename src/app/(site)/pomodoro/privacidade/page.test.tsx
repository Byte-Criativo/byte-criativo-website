import { readFileSync } from "node:fs"
import { join } from "node:path"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { visibleText } from "../../../../../e2e/contract/html"
import PomodoroPrivacidadePage, { metadata } from "./page"
import { POMODORO_PRIVACIDADE_SEO, pomodoroPrivacidade } from "./conteudo"

const FIXTURE = readFileSync(
  join(process.cwd(), "e2e/contract/fixtures/pomodoro-privacidade.txt"),
  "utf-8",
).trim()

describe("Pomodoro — Política de Privacidade (/pomodoro/privacidade)", () => {
  it("reconstrói o texto da fixture exatamente a partir do conteúdo", () => {
    const reconstruido = [
      pomodoroPrivacidade.h1,
      pomodoroPrivacidade.intro,
      ...pomodoroPrivacidade.secoes.flatMap((secao) => [
        secao.titulo,
        ...secao.paragrafos,
      ]),
    ].join(" ")
    expect(reconstruido).toBe(FIXTURE)
  })

  it("renderiza texto visível contendo a fixture, como o contrato e2e exige", () => {
    const { container } = render(<PomodoroPrivacidadePage />)
    expect(visibleText(container.innerHTML)).toContain(FIXTURE)
  })

  it("renderiza H1 único com o texto exigido pelo contrato", () => {
    render(<PomodoroPrivacidadePage />)
    const h1 = screen.getByRole("heading", {
      level: 1,
      name: "Política de Privacidade",
    })
    expect(h1).toBeInTheDocument()
  })

  it("exporta metadata com título absoluto, canonical e descrição do contrato", () => {
    expect(metadata.title).toEqual({
      absolute: "Política de Privacidade do Pomodoro | Byte Criativo",
    })
    expect(metadata.alternates?.canonical).toBe("/pomodoro/privacidade")
    expect(typeof metadata.description).toBe("string")
    expect((metadata.description as string).length).toBeGreaterThan(50)
    expect(metadata.robots ?? "").not.toMatch(/noindex/)
    expect(metadata.openGraph?.images).toBeTruthy()
    expect(POMODORO_PRIVACIDADE_SEO.title).toBe(
      "Política de Privacidade do Pomodoro | Byte Criativo",
    )
  })

  it("não emite JSON-LD nem breadcrumbs", () => {
    const { container } = render(<PomodoroPrivacidadePage />)
    expect(
      container.querySelector('script[type="application/ld+json"]'),
    ).toBeNull()
    expect(
      screen.queryByRole("navigation", { name: "Caminho da página" }),
    ).toBeNull()
  })

  it("renderiza as 7 seções da política como H2 nomeados", () => {
    render(<PomodoroPrivacidadePage />)
    for (const secao of pomodoroPrivacidade.secoes) {
      expect(
        screen.getByRole("heading", { level: 2, name: secao.titulo }),
      ).toBeInTheDocument()
    }
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(7)
  })
})
