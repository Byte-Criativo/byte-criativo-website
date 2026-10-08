import Lenis from "lenis"
import { alvoDoClique } from "./ancora"
import { criarLaco, relogioDoQuadro, taxaPelosIntervalos } from "./laco"
import type { assinarRelogio, RelogioDoGlobo } from "./ponte"

/**
 * Inércia da roda do mouse no desktop. Único arquivo que importa `lenis`, e
 * só é importado (tarde, depois do gate das media queries) por
 * `motor-de-rolagem.tsx`: no celular este chunk nem baixa.
 *
 * O modelo é o do Lenis: a rolagem nativa do documento continua sendo a
 * fonte da verdade (header sticky, `scroll-padding-top`, a barra com
 * `animation-timeline: scroll()`, os IntersectionObserver e a restauração do
 * `<Link>` seguem valendo); só a ENTRADA da roda é suavizada e escrita em
 * `window.scrollTo`, quadro a quadro.
 *
 * Curva: `lerp` 0,1 a 60 Hz é um amortecimento exponencial com λ = 6/s
 * (`damp` do Lenis, independente da taxa de quadros). O primeiro quadro já
 * anda ~10% do clique, e o resto assenta (≤ 0,5 px de 100 px) em ~0,9 s. No
 * trackpad do macOS, que manda deltas finos e já tem momentum próprio, o
 * mesmo `lerp` soma um pouco de peso: é o compromisso de ligar só por
 * `(pointer: fine)`, que não separa mouse de trackpad. Alternativas para o
 * dono testar: 0,12 (mais firme, assenta em ~0,75 s) e 0,08 (mais solta,
 * ~1,1 s).
 */
const OPCOES = {
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
  // Toque nunca: o momentum do iOS e do Android já é a sensação pedida.
  syncTouch: false,
  // Âncoras com manipulador próprio (o do Lenis não confere
  // `defaultPrevented`, modificadores nem botão).
  anchors: false,
  // `autoToggle` depende de `transitionend` com `allow-discrete` e grava
  // `overflow: clip` inline; os diálogos param o Lenis explicitamente.
  autoToggle: false,
  // O relógio é deste arquivo (ver `acordar`), não o rAF eterno do Lenis.
  autoRaf: false,
  // Clique num link para outra página zera a inércia antes de o Next rolar
  // para o topo; senão o Lenis sobrescreveria o topo até assentar.
  stopInertiaOnNavigate: true,
  // Roda com Shift é rolagem horizontal nativa (tabelas de /privacidade). O
  // Lenis não confere o Shift: onde o navegador entrega o delta em `deltaY`,
  // ele rolaria a página na vertical. `false` aqui o deixa de fora.
  virtualScroll: ({ event }: { event: WheelEvent | TouchEvent }) =>
    !event.shiftKey,
}

/** Um quadro nominal (ms): o passo do primeiro quadro depois de acordar. */
const QUADRO_MS = 1000 / 60

/**
 * Diferença (px) entre a rolagem real e a última escrita pelo Lenis acima
 * da qual alguém rolou por fora. Folga para o arredondamento da posição e o
 * limite da página (o Lenis pode mirar além do fim real e o navegador corta).
 */
const TOLERANCIA_PX = 2

/** Teclas que rolam a página nativamente: interrompem a inércia em curso. */
const TECLAS_DE_ROLAGEM = new Set([
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
  // Tab rola até o próximo focável: a inércia não pode puxar de volta.
  "Tab",
])

const EDITAVEL =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

/** O que já recebe foco sem `tabindex` (fora isso, ganha `-1` temporário). */
const FOCAVEL =
  "a[href], area[href], button, input, select, textarea, iframe, summary, [tabindex], [contenteditable]"

/**
 * Leva o foco ao destino da âncora, como o "ponto de partida do Tab" da
 * navegação por fragmento: o próximo Tab sai dali. Um destino que não é
 * focável (uma `<section>`) ganha `tabindex="-1"` só até perder o foco. O
 * anel segue a regra global de `:focus-visible` (a mesma do
 * `main#conteudo` no skip link): depois de clique de mouse o navegador não
 * o mostra; depois de Enter no teclado, mostra.
 */
function levarFoco(alvo: HTMLElement): void {
  if (!alvo.matches(FOCAVEL)) {
    alvo.setAttribute("tabindex", "-1")
    alvo.addEventListener("blur", () => alvo.removeAttribute("tabindex"), {
      once: true,
    })
  }
  alvo.focus({ preventScroll: true })
}

let sincronizarAtual: (() => void) | null = null

/**
 * Depois de cada navegação do Next (topo, hash ou restauração), o Lenis
 * assume a posição real na hora, para a próxima roda não "puxar" de volta
 * para onde a página anterior estava.
 */
export function sincronizar(): void {
  sincronizarAtual?.()
}

/**
 * Monta a inércia e devolve a desmontagem. `assinar` é o `assinarRelogio`
 * da ponte, recebido de quem importa este módulo (ver motor-de-rolagem.tsx).
 */
export function montarInercia(assinar: typeof assinarRelogio): () => void {
  const lenis = new Lenis(OPCOES)

  /**
   * A animação do Lenis está em curso? `isScrolling` não é confiável para
   * isso: depois de uma rolagem nativa (teclado, `scrollTo`) o Lenis agenda
   * um `setTimeout` de 400 ms que grava `isScrolling = false` sem conferir
   * nada; se ele disparar no começo de uma inércia, antes do primeiro evento
   * `scroll` dela, o laço dormiria com a animação pela metade e o teclado não
   * a interromperia. `animate.isRunning` é o estado real; privado só no tipo
   * (é um campo JS comum), com a versão do Lenis fixada.
   */
  const animando = () =>
    (lenis as unknown as { animate: { isRunning: boolean } }).animate.isRunning

  // --- relógio -----------------------------------------------------------------
  // Em repouso nada roda: o laço (laco.ts) só existe entre o primeiro evento
  // de roda (ou um `scrollTo` de âncora) e o assentamento. Com o globo
  // montado e o ticker do GSAP no ritmo da tela, anda nele com prioridade,
  // para a rolagem ser escrita antes do `desenhar` do mesmo quadro. O ticker
  // tem o teto de fps dos degraus do globo (`fps()` é global: 60, ou 30 no
  // último degrau); numa tela mais rápida que o teto (120/144 Hz), no degrau
  // de 30 fps ou fora da home, o laço anda no rAF próprio.
  let relogio: RelogioDoGlobo | null = null
  const proprio = relogioDoQuadro()

  // Taxa da tela, medida uma vez na montagem (uma dúzia de rAFs): até sair,
  // vale 60 Hz.
  let hz = 60
  const intervalos: number[] = []
  let anterior = 0
  let rafMedida = requestAnimationFrame(function medir(t) {
    if (anterior) intervalos.push(t - anterior)
    anterior = t
    if (intervalos.length < 12) rafMedida = requestAnimationFrame(medir)
    else hz = taxaPelosIntervalos(intervalos)
  })

  const laco = criarLaco((primeiro) => {
    // `performance.now()` e não o tempo do ticker: o `gsap.ticker` aplica o
    // `lagSmoothing` dele (que o globo usa), e o Lenis não pode herdar esse
    // ajuste; assim ninguém mexe no `lagSmoothing` global.
    const agora = performance.now()
    // Depois de dormir, `lenis.time` é antigo: o primeiro passo vale um
    // quadro nominal, nem zero (atraso de borracha) nem o tempo dormindo
    // (que levaria a inércia ao fim de uma vez).
    if (primeiro) {
      lenis.time = agora - QUADRO_MS
    } else if (
      animando() &&
      Math.abs(window.scrollY - lenis.animatedScroll) > TOLERANCIA_PX
    ) {
      // Alguém rolou a página por fora desde o último passo: busca na
      // página (Ctrl+F), `focus()`, `scrollIntoView`, `scrollTo` de outro
      // código, ajuste de âncora de rolagem do navegador. O Lenis ignora a
      // rolagem nativa enquanto anima e, no passo seguinte, a desfaria
      // (voltava ao destino da inércia). A posição nativa vale: interrompe.
      // Sem ouvinte de `scroll`: a conferência é uma leitura por quadro, só
      // enquanto a inércia anda.
      interromper()
    }
    lenis.raf(agora)
    return animando()
  })

  const acordar = () => {
    laco.acordar(relogio?.noRitmoDaTela(hz) ? relogio : proprio)
  }

  const pararDeAssinar = assinar((novo) => {
    const estava = laco.acordado
    laco.dormir()
    relogio = novo
    if (estava) acordar()
  })

  // O ScrollTrigger do globo atualiza no evento `scroll`, um quadro depois
  // da escrita; chamado aqui, o globo e a página andam no mesmo quadro. Na
  // rolagem nativa (teclado, barra) o próprio ScrollTrigger já ouve.
  lenis.on("scroll", () => {
    if (relogio && animando()) relogio.aoRolar()
  })
  // O `virtual-scroll` sai ANTES de o Lenis chamar o próprio `scrollTo` no
  // mesmo evento de roda. Acordando numa microtarefa, o laço já encontra a
  // animação em curso: com o ticker do GSAP dormindo, o tique síncrono do
  // `_wake` escreve a rolagem no próprio evento, em vez de um quadro depois
  // (o limitador de fps do ticker pula o tique do quadro seguinte).
  let montado = true
  lenis.on("virtual-scroll", () => {
    queueMicrotask(() => {
      if (montado) acordar()
    })
  })

  /**
   * Interrompe a inércia em curso e devolve a rolagem ao nativo. `reset()`
   * é privado no Lenis e `scrollTo(atual, { immediate })` sai cedo quando o
   * alvo coincide; `stop()` seguido de `start()` passa pelo `reset()` dos
   * dois lados. Parado por diálogo, fica parado.
   */
  const interromper = () => {
    if (lenis.isStopped) return
    lenis.stop()
    lenis.start()
  }

  // --- teclado, voltar/avançar e barra de rolagem -------------------------------
  // Durante uma inércia o Lenis sobrescreve a rolagem nativa até assentar:
  // o gesto nativo novo tem prioridade.
  const aoTeclar = (evento: KeyboardEvent) => {
    if (!TECLAS_DE_ROLAGEM.has(evento.key)) return
    if (!animando()) return
    const origem = evento.target
    if (origem instanceof Element && origem.closest(EDITAVEL)) return
    interromper()
  }
  const aoVoltar = () => interromper()
  // Clique na barra de rolagem do documento (o Chrome entrega o
  // `pointerdown` à raiz, fora da largura do conteúdo). O botão do meio o
  // próprio Lenis já trata.
  const aoApertar = (evento: PointerEvent) => {
    if (evento.clientX >= document.documentElement.clientWidth) interromper()
  }

  // --- âncoras ------------------------------------------------------------------
  // Na fase de borbulha do `window`, depois dos manipuladores do React (que
  // ouvem na raiz do documento): quem chamou `preventDefault` fica nativo.
  const aoClicar = (evento: MouseEvent) => {
    const id = alvoDoClique(evento, window.location)
    if (!id || lenis.isStopped) return
    const alvo = document.getElementById(id)
    if (!alvo) return
    evento.preventDefault()
    // A entrada no histórico que o fragmento nativo criaria. O App Router
    // aceita `pushState` externo (copia o próprio estado para a entrada e
    // sincroniza a URL); nenhum CSS do site usa `:target`, que o
    // `pushState` não atualiza.
    const hash = `#${encodeURIComponent(id)}`
    if (window.location.hash !== hash) window.history.pushState(null, "", hash)
    // Uma rolagem nativa no mesmo quadro do clique (teclado, barra, foco)
    // ainda não chegou ao Lenis: o evento `scroll` só vem no quadro
    // seguinte. Sem acertar a posição aqui, o alvo sairia deslocado e a curva
    // começaria voltando. Fora de uma inércia, a posição real é a verdade.
    if (!animando()) lenis.resize()
    // Com elemento como alvo, o Lenis já desconta o `scroll-padding-top`
    // computado da raiz e o `scroll-margin-top` do alvo.
    lenis.scrollTo(alvo)
    // O foco vai já, como o ponto de partida do Tab na navegação nativa por
    // fragmento: uma roda no meio do caminho interrompe a curva, mas o
    // próximo Tab continua saindo do destino. `preventScroll` em
    // `levarFoco`: o foco não rola a página (nem dispara a interrupção acima).
    levarFoco(alvo)
    acordar()
  }

  // --- diálogos -----------------------------------------------------------------
  // `MobileNav` e galeria travam a página por CSS
  // (`html:has(dialog[open])`); o Lenis para junto, para a roda não
  // acumular alvo por trás. O menu também abre por Invoker Command nativo,
  // sem JS: por isso observar o atributo, não os botões. O filtro de
  // `DIALOG` deixa de fora o `<details open>` do FAQ.
  const conferirDialogos = () => {
    if (document.querySelector("dialog[open]")) lenis.stop()
    else lenis.start()
  }
  const observador = new MutationObserver((registros) => {
    if (registros.some((r) => r.target.nodeName === "DIALOG")) {
      conferirDialogos()
    }
  })
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["open"],
    subtree: true,
  })
  conferirDialogos()

  window.addEventListener("click", aoClicar)
  window.addEventListener("keydown", aoTeclar)
  window.addEventListener("popstate", aoVoltar)
  window.addEventListener("pointerdown", aoApertar, { passive: true })

  sincronizarAtual = () => {
    // Um diálogo que sai do DOM aberto (galeria aberta + Voltar: a página
    // desmonta sem `close()`) não muda o atributo `open`, e o observador não
    // vê. Sem esta conferência o Lenis ficaria parado para sempre, com a
    // roda bloqueada no site todo (`interromper` sai cedo quando parado).
    conferirDialogos()
    interromper()
    lenis.resize()
  }

  return () => {
    montado = false
    sincronizarAtual = null
    window.removeEventListener("click", aoClicar)
    window.removeEventListener("keydown", aoTeclar)
    window.removeEventListener("popstate", aoVoltar)
    window.removeEventListener("pointerdown", aoApertar)
    observador.disconnect()
    pararDeAssinar()
    cancelAnimationFrame(rafMedida)
    laco.dormir()
    lenis.destroy()
    // O Lenis grava em `window.lenis` um registro dele (versão) e não o
    // apaga no `destroy`. `window.lenisVersion` fica: é o sinal de que o
    // chunk chegou a baixar (o E2E do celular prova o contrário por ele).
    Reflect.deleteProperty(window, "lenis")
  }
}
