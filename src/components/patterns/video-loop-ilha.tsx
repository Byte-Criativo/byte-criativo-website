"use client"

import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { buttonClasses } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

export type FonteVideo = { src: string; type: string; media?: string }

/** Margem de antecipação: o vídeo só é pedido perto da viewport. */
const PERTO = "100% 0px"
/** Metade da figura visível: o piso para começar a reprodução. */
const REPRODUZ_A_PARTIR_DE = 0.5

/**
 * Ilha do VideoLoop. **Por que precisa de JS:** reprodução por viewport,
 * pausa, movimento reduzido e economia de dados. **Sem JS:** o poster do
 * servidor continua na tela, a barra fica vazia sem mudar de altura e o
 * botão nem aparece.
 *
 * O estado de partida é sempre o poster: na montagem o botão oferece
 * "Reproduzir vídeo". Só troca o poster pelo `<video>` perto da viewport e
 * só reproduz com `data-js` presente (o botão de pausa precisa estar
 * visível — RC9), sem movimento reduzido e sem economia de dados. Pausa ao
 * sair da tela; quem pausou na mão continua pausado ao voltar.
 */
export function VideoLoopIlha({
  poster,
  fontes,
  complemento,
  width,
  height,
  children,
}: {
  poster: string
  fontes: FonteVideo[]
  complemento: string
  width: number
  height: number
  children: ReactNode
}): ReactElement {
  const caixa = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [mostrarVideo, setMostrarVideo] = useState(false)
  const [tocando, setTocando] = useState(false)
  const [pausadoPelaPessoa, setPausadoPelaPessoa] = useState(false)

  useEffect(() => {
    const elemento = caixa.current
    if (!elemento) return
    // RC9: sem a marca de JS na raiz o botão de pausa não aparece, e nada
    // pode começar a tocar sem ele.
    if (!document.documentElement.hasAttribute("data-js")) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const conexao = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    if (conexao?.saveData) return

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setMostrarVideo(true)
          if (entrada.intersectionRatio >= REPRODUZ_A_PARTIR_DE) {
            if (!pausadoPelaPessoa) setTocando(true)
          } else {
            setTocando(false)
          }
        }
      },
      { rootMargin: PERTO, threshold: [0, REPRODUZ_A_PARTIR_DE] },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [pausadoPelaPessoa])

  useEffect(() => {
    const elemento = video.current
    if (!elemento) return
    if (tocando) {
      // A política do navegador pode recusar: o poster continua na tela e o
      // botão continua oferecendo "Reproduzir vídeo".
      void elemento.play().catch(() => {})
    } else {
      elemento.pause()
    }
  }, [tocando, mostrarVideo])

  const rotulo = tocando ? "Pausar vídeo" : "Reproduzir vídeo"

  return (
    <>
      <div ref={caixa} style={{ aspectRatio: `${width} / ${height}` }}>
        {mostrarVideo ? (
          <video
            ref={video}
            muted
            playsInline
            loop
            preload="none"
            poster={poster}
            width={width}
            height={height}
            className="h-auto w-full"
          >
            {fontes.map((fonte) => (
              <source
                key={fonte.src}
                src={fonte.src}
                type={fonte.type}
                media={fonte.media}
              />
            ))}
          </video>
        ) : (
          children
        )}
      </div>

      {/* Barra com altura reservada no HTML: com ou sem botão, a caixa é a
          mesma (sem CLS). */}
      <div
        data-barra-video
        className="flex min-h-(--alvo-toque) items-center pt-(--space-2)"
      >
        <button
          type="button"
          onClick={() => {
            if (tocando) {
              setPausadoPelaPessoa(true)
              setTocando(false)
            } else {
              setPausadoPelaPessoa(false)
              setMostrarVideo(true)
              setTocando(true)
            }
          }}
          className={buttonClasses("contorno", "hidden js:inline-flex")}
        >
          <Icon nome={tocando ? "pausar" : "reproduzir"} />
          {rotulo}
          {/* R70: o complemento começa com dois-pontos, que colam na palavra
              anterior — sem `separador`, senão o nome sairia
              "Pausar vídeo : busca de bandas". */}
          <VisuallyHidden>{`: ${complemento}`}</VisuallyHidden>
        </button>
      </div>
    </>
  )
}
