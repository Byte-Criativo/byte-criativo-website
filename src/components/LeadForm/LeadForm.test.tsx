import { describe, expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import { renderWithTheme } from "@/src/test/utils"
import { LeadForm } from "./index"

describe("LeadForm", () => {
  it("abre o WhatsApp com a mensagem montada", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null)
    renderWithTheme(<LeadForm />)

    await userEvent.type(screen.getByLabelText(/nome/i), "Ana")
    await userEvent.type(screen.getByLabelText(/empresa/i), "Padaria Real")
    await userEvent.type(
      screen.getByLabelText(/o que você precisa/i),
      "um site novo",
    )
    await userEvent.click(
      screen.getByRole("button", { name: /enviar e abrir conversa/i }),
    )

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("wa.me"),
      "_blank",
      "noopener,noreferrer",
    )
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent("Padaria Real"))
    open.mockRestore()
  })
})
