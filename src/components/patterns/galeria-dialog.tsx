"use client"

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { Button, buttonClasses } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

export type ItemGaleria = { id: string; legenda: string; ampliada: ReactNode }

/**
 * Ilha do diálogo de ampliação da galeria do case. **Por que precisa de
 * JS:** `showModal()`, gatilho sobreposto, troca de imagem e retorno de
 * foco. **Sem JS:** a galeria continua legível em tamanho de coluna, sem
 * gatilho nenhum — eles só existem depois da hidratação e entram por portal
 * nas figuras já renderizadas no servidor, sem mudar a caixa nem remontar a
 * imagem.
 *
 * Um único `<dialog>` por página, filho do bloco da galeria e dentro de
 * `article[data-case]`: `--bg` e `--ink` resolvem pelas cores do case (RC6).
 *
 * R62: nenhum estado é gravado dentro de efeito. Os alvos do portal chegam
 * por **ref de callback** — React a executa no commit, quando as figuras do
 * servidor já estão no DOM — e o retorno de foco usa o evento nativo
 * `close` do `<dialog>` (`onClose`), não uma assinatura em efeito.
 */
export function GaleriaDialog({
  itens,
  children,
}: {
  itens: ItemGaleria[]
  children: ReactNode
}): ReactElement {
  const dialogo = useRef<HTMLDialogElement>(null)
  const gatilhoAtivo = useRef<HTMLElement | null>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)
  const [alvos, setAlvos] = useState<HTMLElement[]>([])
  const [indice, setIndice] = useState(0)
  const idLegenda = useId()

  // Sem dependência de `itens`: a lista chega do chamador como literal novo a
  // cada render, e uma ref de callback recriada a cada render seria
  // desmontada e remontada em laço. Os alvos são lidos do próprio DOM e
  // casados com os itens pelo atributo `data-galeria-item`.
  const aoMontarGaleria = useCallback((no: HTMLDivElement | null) => {
    setAlvos(
      no ? [...no.querySelectorAll<HTMLElement>("[data-galeria-item]")] : [],
    )
  }, [])

  const abrir = (posicao: number, gatilho: HTMLElement) => {
    gatilhoAtivo.current = gatilho
    setIndice(posicao)
    dialogo.current?.showModal()
    fecharRef.current?.focus()
  }

  const mover = (passo: number) => {
    setIndice((atual) => (atual + passo + itens.length) % itens.length)
  }

  const atual = itens[indice]

  return (
    <>
      {/* `display: contents` mantém as figuras do servidor exatamente onde
          estavam na grade da galeria; o invólucro existe só para dar à ref
          de callback um escopo para consultar. */}
      <div ref={aoMontarGaleria} className="contents">
        {children}
      </div>

      {alvos.map((alvo) => {
        const id = alvo.dataset.galeriaItem
        const posicao = itens.findIndex((item) => item.id === id)
        if (posicao < 0) return null
        return createPortal(
          <button
            type="button"
            onClick={(evento) => abrir(posicao, evento.currentTarget)}
            className="galeria-gatilho flex items-end justify-end bg-transparent p-(--space-3) text-ink"
          >
            <Icon nome="ampliar" />
            <VisuallyHidden>
              {`Ampliar imagem: ${itens[posicao]?.legenda ?? ""}`}
            </VisuallyHidden>
          </button>,
          alvo,
          `gatilho-${id}`,
        )
      })}

      <dialog
        ref={dialogo}
        aria-labelledby={idLegenda}
        // O retorno de foco ao gatilho é nativo no navegador; o evento
        // `close` cobre também Esc e o fechamento por comando.
        onClose={() => gatilhoAtivo.current?.focus()}
        onKeyDown={(evento) => {
          if (evento.key === "ArrowRight") mover(1)
          if (evento.key === "ArrowLeft") mover(-1)
        }}
        className="z-(--z-overlay) h-full max-h-none w-full max-w-none bg-bg text-ink lg:h-auto lg:max-w-(--grid-container-max) lg:shadow-(--shadow-overlay)"
      >
        <div className="flex flex-col gap-(--space-4) p-(--space-4) lg:p-(--space-5)">
          <div className="flex justify-end">
            {/* `<button>` direto, e não o primitivo Button, porque o foco
                inicial do diálogo precisa de `ref` e o primitivo não
                encaminha refs. As classes são as mesmas. */}
            <button
              ref={fecharRef}
              type="button"
              onClick={() => dialogo.current?.close()}
              className={buttonClasses("contorno")}
            >
              <Icon nome="fechar" />
              Fechar
            </button>
          </div>

          {atual?.ampliada}

          <Text id={idLegenda} papel="caption" tom="muted">
            {atual?.legenda}
          </Text>

          <div className="flex gap-(--space-3)">
            <Button type="button" variante="contorno" onClick={() => mover(-1)}>
              Imagem anterior
            </Button>
            <Button type="button" variante="contorno" onClick={() => mover(1)}>
              Próxima imagem
            </Button>
          </div>

          {/* Região polida DENTRO do diálogo: fora dele ficaria inerte
              enquanto o modal está aberto (RC11, canal único). */}
          <p role="status" className="sr-only">
            {atual?.legenda}
          </p>
        </div>
      </dialog>
    </>
  )
}
