import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithTheme } from "@/src/test/utils"
import { QuestionAnswer } from "./index"

describe("QuestionAnswer", () => {
  it("liga pergunta e resposta via ARIA e mostra o texto", () => {
    renderWithTheme(
      <QuestionAnswer
        question="Pergunta de teste?"
        answer="Resposta de teste."
        onClick={() => {}}
      />,
    )

    const button = screen.getByRole("button", { name: /Pergunta de teste\?/ })
    const region = screen.getByRole("region")

    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveAttribute("aria-controls", region.id)
    expect(region).toHaveAttribute("aria-labelledby", button.id)
    expect(region).toHaveTextContent("Resposta de teste.")
  })

  it("reflete o estado aberto via aria-expanded", () => {
    renderWithTheme(
      <QuestionAnswer question="P?" answer="R" isOpen onClick={() => {}} />,
    )

    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true")
  })

  it("dispara onClick ao clicar na pergunta", async () => {
    const onClick = vi.fn()
    renderWithTheme(
      <QuestionAnswer question="P?" answer="R" onClick={onClick} />,
    )

    await userEvent.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
