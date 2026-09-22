"use client"

import { usePathname } from "next/navigation"
import {
  useCallback,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react"
import { Button, buttonClasses } from "@/components/ui/button"
import { NavLink } from "@/components/ui/nav-link"
import { TextLink } from "@/components/ui/text-link"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import type { ItemNavegacao } from "./site-header"
import { WhatsAppLink } from "./whatsapp-link"

const ID_DIALOGO = "menu-principal"
const ID_TITULO = "menu-principal-titulo"
const LARGURA_LG = "(min-width: 64rem)"

/**
 * Ilha do menu do celular. **Por que precisa de JS:** abrir com
 * `showModal()` onde não há Invoker Commands, e fechar ao concluir a
 * navegação, ao clicar num link e ao cruzar `breakpoints.lg`. **Sem JS ou
 * sem hidratação:** o link "Menu" leva à navegação do rodapé; o botão só
 * aparece sob `data-invoker` ou `data-hidratado`, nunca como botão morto.
 *
 * Sem `aria-controls` e sem `aria-expanded`: com o diálogo modal aberto o
 * gatilho fica inerte, e `aria-controls` apontando para um `<dialog>`
 * fechado gera resultado incompleto no axe.
 */
export function MobileNav({
  navegacao,
  ctaHref = "/contato",
  ctaRotulo = "Falar sobre um projeto",
  whatsapp,
  emailHref,
  wordmark,
  rodapeNavId = "navegacao-rodape",
}: {
  navegacao: ItemNavegacao[]
  ctaHref?: string
  ctaRotulo?: string
  whatsapp: { rotulo: string; mensagem: string }
  emailHref: string
  wordmark: ReactNode
  rodapeNavId?: string
}): ReactElement {
  const dialogo = useRef<HTMLDialogElement>(null)
  const gatilho = useRef<HTMLButtonElement>(null)
  const rota = usePathname()

  // Os dois manipuladores conferem `open` antes de agir, e é isso que os
  // torna compatíveis com o Invoker Command nativo do mesmo botão: onde
  // `commandfor`/`command` existem, o navegador executa a ação **depois**
  // da propagação do clique, sobre um diálogo que já está no estado final —
  // e a especificação do comando manda sair sem fazer nada nesse caso. Por
  // isso não há detecção de suporte guardada em estado (que, além de
  // supérflua, seria `setState` dentro de efeito, proibido pelo lint deste
  // projeto).
  const abrir = useCallback(() => {
    const elemento = dialogo.current
    if (elemento && !elemento.open) elemento.showModal()
  }, [])

  const fechar = useCallback(() => {
    const elemento = dialogo.current
    if (elemento?.open) elemento.close()
  }, [])

  // Fecha ao concluir a navegação.
  useEffect(() => {
    fechar()
  }, [rota, fechar])

  // Fecha ao passar a largura de breakpoints.lg (o menu não existe lá).
  useEffect(() => {
    const consulta = window.matchMedia(LARGURA_LG)
    const aoMudar = (evento: MediaQueryListEvent) => {
      if (evento.matches) fechar()
    }
    consulta.addEventListener("change", aoMudar)
    return () => consulta.removeEventListener("change", aoMudar)
  }, [fechar])

  const aoTeclar = (evento: React.KeyboardEvent<HTMLDialogElement>) => {
    if (evento.key !== "Tab") return
    const elemento = dialogo.current
    if (!elemento) return

    const focaveis = elemento.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focaveis.length === 0) return

    const primeiro = focaveis[0]
    const ultimo = focaveis[focaveis.length - 1]

    if (evento.shiftKey) {
      if (document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo?.focus()
      }
    } else {
      if (document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro?.focus()
      }
    }
  }

  return (
    <>
      {/* Gatilho sem JS: link comum para um destino visível na mesma página,
          com os mesmos destinos do header. Some quando o botão aparece. */}
      <a
        href={`#${rodapeNavId}`}
        className={buttonClasses("contorno", "invoker:hidden hidratado:hidden")}
      >
        Menu
      </a>

      <button
        ref={gatilho}
        type="button"
        aria-haspopup="dialog"
        commandfor={ID_DIALOGO}
        command="show-modal"
        onClick={abrir}
        className={buttonClasses(
          "contorno",
          "hidden invoker:inline-flex hidratado:inline-flex",
        )}
      >
        Menu
      </button>

      <dialog
        id={ID_DIALOGO}
        ref={dialogo}
        onClose={() => gatilho.current?.focus()}
        onKeyDown={aoTeclar}
        aria-labelledby={ID_TITULO}
        className="h-full max-h-none w-full max-w-none bg-surface text-ink"
      >
        <div className="flex items-center justify-between gap-(--space-5) px-(--grid-margin) py-(--space-3)">
          <span aria-hidden="true">{wordmark}</span>
          <button
            type="button"
            commandfor={ID_DIALOGO}
            command="close"
            onClick={fechar}
            className={buttonClasses("contorno")}
          >
            Fechar menu
          </button>
        </div>

        <VisuallyHidden as="div">
          <h2 id={ID_TITULO}>Menu</h2>
        </VisuallyHidden>

        {/* Um clique em qualquer link da folha fecha, inclusive no link da
            página atual (que não dispara mudança de rota). O alvo real é
            sempre um link, que o teclado também aciona por clique — nenhum
            comportamento fica preso ao ponteiro. */}
        <div
          onClick={(evento) => {
            if ((evento.target as HTMLElement).closest("a")) fechar()
          }}
          className="flex flex-col gap-(--space-5) px-(--grid-margin) py-(--space-5)"
        >
          <nav aria-label="Principal">
            <ul className="flex flex-col">
              {navegacao.map((item) => (
                <li
                  key={item.href}
                  className="border-b-(length:--border-w-decorative) border-solid border-border-decorative"
                >
                  <NavLink
                    href={item.href}
                    secao={item.secao}
                    className="min-h-(--space-7) w-full text-h3"
                  >
                    {item.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Button href={ctaHref} className="w-full">
            {ctaRotulo}
          </Button>

          <div className="flex flex-wrap items-center gap-(--space-5)">
            <WhatsAppLink
              aparencia="texto"
              rotulo={whatsapp.rotulo}
              mensagem={whatsapp.mensagem}
              location="menu"
              context="menu"
            />
            <TextLink href={emailHref} variante="acao">
              Escrever e-mail
            </TextLink>
          </div>
        </div>
      </dialog>
    </>
  )
}
