import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { buttonClasses } from "@/components/ui/button"
import { textLinkClasses } from "@/components/ui/text-link"
import { WhatsAppLink } from "./whatsapp-link"

const MENSAGEM = "Olá! Vim pela página de trabalhos."

function classesFaltando(
  elemento: Element | null,
  esperadas: string,
): string[] {
  const tem = new Set(
    (elemento?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  )
  return esperadas
    .split(/\s+/)
    .filter(Boolean)
    .filter((classe) => !tem.has(classe))
}

describe("WhatsAppLink", () => {
  it("botao: nome começa pelo texto visível e avisa da nova aba", () => {
    render(
      <WhatsAppLink
        aparencia="botao"
        rotulo="Chamar no WhatsApp"
        mensagem={MENSAGEM}
        location="cta"
        context="portfolio"
      />,
    )
    // RC5: o complemento entra depois do texto visível e separado por um
    // espaço real (`VisuallyHidden separador`). A asserção é de igualdade,
    // não de trecho: "Chamar no WhatsApp(abre em nova aba)" reprova aqui.
    const link = screen.getByRole("link", {
      name: "Chamar no WhatsApp (abre em nova aba)",
    })
    expect(link).toHaveAccessibleName("Chamar no WhatsApp (abre em nova aba)")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("leva o número da Byte e a mensagem do contexto codificada na URL", () => {
    render(
      <WhatsAppLink
        aparencia="botao"
        rotulo="Chamar no WhatsApp"
        mensagem={MENSAGEM}
        location="cta"
        context="portfolio"
      />,
    )
    const href = screen.getByRole("link").getAttribute("href") ?? ""
    expect(href).toContain("https://wa.me/5583991253377")
    expect(decodeURIComponent(href)).toContain(MENSAGEM)
    // Codificada: a mensagem crua nunca aparece no href.
    expect(href).not.toContain(MENSAGEM)
  })

  it("texto: usa a aparência de link, com o número como rótulo visível", () => {
    render(
      <WhatsAppLink
        aparencia="texto"
        rotulo="WhatsApp +55 (83) 99125-3377"
        mensagem="Olá!"
        location="footer"
        context="rodape"
      />,
    )
    expect(
      screen.getByRole("link", {
        name: "WhatsApp +55 (83) 99125-3377 (abre em nova aba)",
      }),
    ).toHaveAccessibleName("WhatsApp +55 (83) 99125-3377 (abre em nova aba)")
  })

  it("o ícone só aparece na aparência de botão e é decorativo", () => {
    const { container, rerender } = render(
      <WhatsAppLink
        aparencia="botao"
        rotulo="Chamar no WhatsApp"
        mensagem="Olá!"
        location="cta"
        context="home"
      />,
    )
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    )

    rerender(
      <WhatsAppLink
        aparencia="texto"
        rotulo="Chamar no WhatsApp"
        mensagem="Olá!"
        location="menu"
        context="home"
      />,
    )
    expect(container.querySelector("svg")).toBeNull()
  })

  it("carrega os dados do evento sem nenhum dado pessoal", () => {
    render(
      <WhatsAppLink
        aparencia="botao"
        rotulo="Chamar no WhatsApp"
        mensagem="Olá!"
        location="cta"
        context="case-festival-alumio"
      />,
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("data-evento", "whatsapp_click")
    expect(link).toHaveAttribute("data-location", "cta")
    expect(link).toHaveAttribute("data-context", "case-festival-alumio")
    const dados = [...link.attributes]
      .map((atributo) => atributo.name)
      .filter((nome) => nome.startsWith("data-"))
      .sort()
    expect(dados).toEqual(["data-context", "data-evento", "data-location"])
  })

  it("botao veste o Button primário e texto veste o TextLink de ação", () => {
    const { container, rerender } = render(
      <WhatsAppLink
        aparencia="botao"
        rotulo="Chamar no WhatsApp"
        mensagem="Olá!"
        location="cta"
        context="home"
      />,
    )
    expect(
      classesFaltando(container.querySelector("a"), buttonClasses("primario")),
    ).toEqual([])

    rerender(
      <WhatsAppLink
        aparencia="texto"
        rotulo="Chamar no WhatsApp"
        mensagem="Olá!"
        location="menu"
        context="home"
      />,
    )
    expect(
      classesFaltando(container.querySelector("a"), textLinkClasses("acao")),
    ).toEqual([])
  })
})
