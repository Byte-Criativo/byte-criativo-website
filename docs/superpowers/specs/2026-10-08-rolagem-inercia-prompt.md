# Prompt: rolagem com inércia e navegação fluida

## Pedido original

> Crie um prompt para que um especialista em desenvolvimento de software crie
> uma solução para deixar a navegação e o rolar das páginas do site mais
> fluida e que a rolagem tenha aquele efeito de inércia, inventado pela Apple,
> de deixar o rolar das páginas mais fluidas e intuitivas e prazerosa. O
> sentido é deixar a navegação além de bonita (que é como está agora),
> fluida e com esse efeito de inércia bem gostoso.

## Papel

Você é engenheiro front-end sênior especializado em movimento e desempenho
de rolagem na web, com repertório de design de interação no padrão Apple
(curvas de desaceleração, resposta imediata ao gesto, nada de atraso
perceptível). Domina Next.js 16 (App Router), React 19, GSAP 3.15 com
ScrollTrigger, Lenis, a View Transitions API, TypeScript estrito e
acessibilidade. Código e comentários em português. Você trabalha no site da
Byte Criativo, um site editorial com metáfora de museu (cada trabalho é uma
**sala** com a **Ficha** na parede) e um hero com globo de código em Canvas
2D na home.

O site já é bonito. **Nada muda no visual.** A tarefa é a sensação: a página
precisa deslizar, desacelerar com naturalidade e responder ao gesto como um
app nativo.

## O problema, com precisão

A "inércia da Apple" é o _momentum scrolling_: a página continua andando
depois do gesto e desacelera numa curva exponencial. No **trackpad do macOS**
e no **toque (iOS e Android)** o sistema operacional já faz isso, de graça e
melhor que qualquer biblioteca. Onde a sensação falta é:

1. **Roda do mouse no desktop (Windows e Linux).** Cada clique da roda pula
   ~100 px de uma vez, em degraus secos. O dono usa Linux + Chrome com mouse:
   é exatamente aqui que ele sente o site "duro".
2. **Rolagens programáticas.** Âncoras (`#…`), o índice de `;` das salas, o
   rótulo "Rolar" do hero, o _skip link_ e os links da trilha saltam de uma
   vez, sem continuidade.
3. **Troca de página.** A rota nova substitui a anterior de uma vez, sem
   nenhuma ligação visual (o header, que é o mesmo nas duas, pisca junto).
4. **Quadros perdidos.** Qualquer quadro longo durante a rolagem quebra a
   fluidez, com ou sem inércia. E rolagem suavizada **amplifica** o
   travamento: o olho percebe mais um tranco no meio de um deslizamento do
   que num salto seco. Por isso o diagnóstico de desempenho vem antes.

## Contexto (o que já existe e não pode quebrar)

- **Rolagem é nativa, no documento.** Não há `scroll-behavior: smooth`
  global. Com movimento reduzido, `globals.css` (~l. 385–400) força
  `scroll-behavior: auto !important` e zera as durações.
- **Header sticky** (`[data-site-header]`, `globals.css` ~l. 560–590) com a
  altura reservada em `scroll-padding-top` na raiz, que muda por breakpoint
  (`lg`) e cai para `--space-4` em janelas de até 30 rem de altura, onde o
  header fica estático.
- **Barra de progresso de leitura** nos estudos de caso, com
  `animation-timeline: scroll()` (CSS, sem JS).
- **Índice de `;`** (`indice-semicolon.tsx`, `.indice-lista` sticky) com
  links `#…` para as salas.
- **Regra da casa:** nenhum listener de rolagem na main thread.
  `SalaObserver`, `hero-cena.tsx` e `video-loop-ilha.tsx` usam
  `IntersectionObserver`.
- **Globo do hero** (`src/app/(site)/_components/hero-arte/globo-motor.ts`,
  importado tarde por `use-hero-canvas.ts`, só na home): laço no
  `gsap.ticker`, `ScrollTrigger` na seção do hero com **`scrub: 0.6`**
  (gira, recua em paralaxe e achata em fita), girar arrastando com inércia
  própria, `touch-action: pan-y pinch-zoom` no `.home-hero`, zonas calmas
  (texto e "Rolar"), qualidade adaptativa e modo estático sem GPU.
- **Diálogos modais:** `MobileNav` (`<dialog>` com `showModal()`, rolagem da
  página travada, foco preso) e `galeria-dialog`.
- **Rolagem aninhada:** tabelas com `overflow-x-auto` em `/privacidade`.
- **Next 16:** `<Link>` mantém a posição ou rola até o topo da página nova; o
  Next 16 **não** sobrescreve mais `scroll-behavior: smooth` na troca de rota
  (opt-in com `data-scroll-behavior="smooth"` no `<html>`; ver
  `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`,
  ~l. 960). `<ViewTransition>` do React funciona no App Router sem
  configuração (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`;
  o padrão do header fixo está ~l. 333). **Leia esses guias antes de
  escrever código** (AGENTS.md).
- **Orçamento (lighthouserc.json, mobile, mediana de 5 runs):** JS ≤ 240.000
  B, TBT ≤ 150 ms, LCP ≤ 3,8 s, CLS ≤ 0,05, acessibilidade 100, zero
  terceiros. A home está em ~218,5 KiB de JS: folga de ~21 KB. O TBT do CI já
  oscila perto de 150 (runner lento, sem GPU).
- **Guarda de tokens** (`src/styles/guarda-tokens.test.ts`): nada de hex nem
  utilitários numéricos soltos em `src/components/**`. Lógica de movimento
  fica em `src/lib/` ou `src/app/(site)/_components/`. Regras estruturais,
  posições e `@media` ficam em `globals.css`.
- **CSP:** `script-src 'self'` (+ Turnstile). Dependência do npm entra no
  bundle e passa; CDN não.

## Fase 0: diagnóstico medido (antes de qualquer código)

1. **Linha de base:** build de produção, Lighthouse mobile em modo CI (5 runs)
   em `/` e `/contato`, Lighthouse desktop (3 runs) em `/`, e
   `scripts/measure-route-js.mjs` em `/`, `/portfolio`, um estudo de caso e
   `/servicos`, no celular e no desktop.
2. **Trace da rolagem:** Playwright com as flags de GPU (a janela do Chrome
   da extensão fica oculta e o rAF não roda nela). Rolar com a roda (sequência
   de `mouse.wheel` de 100 px, como um mouse real) na home em 1440 px, com GPU
   real e com `--disable-gpu` + CPU 4×. Rolar com toque no Pixel 7 emulado.
   Repetir num estudo de caso e em `/portfolio`. Registrar duração dos quadros
   (p50, p95, quadros perdidos), tarefas longas e o que roda por evento de
   rolagem (`ScrollTrigger` → `desenhar`, pintura, _commit_, camadas).
3. **Inventário das rolagens programáticas:** âncoras, _skip link_, índice de
   `;`, "Rolar", troca de rota (topo), voltar/avançar, foco por Tab, busca na
   página (Ctrl+F), abertura dos diálogos. Para cada um: comportamento hoje e
   como deve ficar.

Os números da Fase 0 entram na seção **Diagnóstico** deste arquivo e viram a
régua dos critérios de aceite.

## Objetivo

1. **Roda do mouse com inércia no desktop:** a página desliza e desacelera
   numa curva exponencial e assenta em ~0,8–1,2 s, com resposta imediata no
   primeiro quadro (sem "atraso de borracha").
2. **Toque e trackpad continuam nativos.** O momentum do sistema não é
   substituído nem duplicado.
3. **Rolagens programáticas com a mesma curva**, pousando no lugar certo
   (respeitando o header via `scroll-padding-top`) e levando o foco junto.
4. **Troca de página com continuidade:** o conteúdo entra num _crossfade_
   sutil, o header e o rodapé ficam parados, sem flash e sem salto.
5. **Quadros no ritmo da tela durante a rolagem**, sem regressão em nenhuma
   métrica do Lighthouse.
6. **Movimento reduzido, sem JS e tecnologias assistivas:** comportamento
   nativo idêntico ao de hoje.

## Recomendações principais (executar nesta ordem)

### Essenciais

1. **A rolagem nativa continua sendo a fonte da verdade.** Proibido rolagem
   por _wrapper_ fixo com `transform` (GSAP ScrollSmoother, Locomotive v4 e
   afins). Esse modelo quebra o header sticky, o `.indice-lista` sticky, o
   `scroll-padding-top` das âncoras, a barra com `animation-timeline:
scroll()`, os três `IntersectionObserver`, a restauração de rolagem do
   `<Link>`, a busca na página e o travamento de rolagem do `<dialog>`. O
   único formato compatível é suavizar a **entrada da roda** e escrever na
   posição de rolagem real do documento (modelo Lenis).
2. **Lenis como padrão** (MIT, ~3–4 KB gz, cobre os casos de borda de
   teclado, rolagem aninhada e âncoras). Fixe a versão exata. A alternativa
   é um _lerp_ próprio em `src/lib/` (~60–100 linhas); só troque se a medição
   mostrar que o Lenis não cabe ou atrapalha. A escolha vai justificada no
   relatório, com bytes medidos.
3. **Ligar só onde ajuda.** Iniciar apenas com
   `(hover: hover) and (pointer: fine)` **e** sem
   `prefers-reduced-motion: reduce`; ouvir as duas _media queries_ e desligar
   ou ligar na hora em que mudarem. No toque, nada (`syncTouch: false`): o
   momentum nativo do iOS e do Android já é a sensação pedida, e sequestrar o
   toque é o erro clássico. O trackpad do macOS manda _deltas_ finos que o
   Lenis também suaviza: calibre `lerp` (ponto de partida 0,1) e
   `wheelMultiplier` (1) para que o trackpad não fique "pesado", e documente
   o compromisso.
4. **Fora do caminho crítico.** `import()` dinâmico depois do `load` e do
   ocioso (como o `globo-motor`), com o _gate_ das _media queries_ **antes**
   do `import()`. No celular o _chunk_ nem baixa, então o Lighthouse mobile
   do CI não muda. Sem CLS, sem trabalho na hidratação.
5. **Um relógio só na home.** Quando o globo estiver montado, o Lenis anda no
   `gsap.ticker` (`autoRaf: false`, `gsap.ticker.lagSmoothing(0)`) e chama
   `ScrollTrigger.update` a cada rolagem, para o globo e a página andarem no
   mesmo quadro. Fora da home, `autoRaf`. Em repouso o laço não pode custar
   nada mensurável: medir.
6. **Sem suavização dupla no globo.** O `scrub: 0.6` do ScrollTrigger já
   suaviza; somado ao _lerp_ da roda, o globo fica atrasado em relação à
   página. Com a inércia ligada, reduzir o `scrub` (ou `scrub: true`) para o
   globo seguir a página; no toque, manter o comportamento de hoje. Validar
   em vídeo lado a lado.
7. **Nenhum modo de falha de sequestro.** Precisam continuar funcionando:
   Espaço e Shift+Espaço, PgUp/PgDn, Home/End e setas (nativos); Ctrl+F; foco
   por Tab rolando até o elemento; _skip link_; Ctrl+roda (zoom); roda com
   Shift e roda horizontal; arrastar a barra de rolagem; rolagem automática
   do botão do meio; seleção de texto arrastando; arrastar o globo; voltar e
   avançar restaurando a posição; e a rolagem dentro das tabelas de
   `/privacidade` (`data-lenis-prevent` ou `allowNestedScroll`).
8. **Diálogos param a página.** Ao abrir o `MobileNav` ou a galeria,
   `lenis.stop()`; ao fechar, `lenis.start()`. Dentro do diálogo, rolagem
   nativa (`data-lenis-prevent`) e `overscroll-behavior: contain` para a
   rolagem não vazar para a página.
9. **Troca de rota sincronizada.** Depois de cada navegação do Next (topo,
   _hash_ ou restauração), o Lenis assume a posição real na hora
   (`scrollTo(atual, { immediate: true })` ou `resize()`), para a próxima
   roda não "puxar" de volta para onde a página anterior estava.
10. **Âncoras e rolagens programáticas com a mesma curva.** Com o Lenis
    ativo, os links `#…` do mesmo documento (índice de `;`, "Rolar", serviços,
    salas) usam `lenis.scrollTo` com o deslocamento lido do
    `scroll-padding-top` computado (muda por breakpoint e pela altura da
    janela) e, ao terminar, levam o foco ao destino. Sem Lenis (toque,
    trackpad sem roda, movimento reduzido), `html { scroll-behavior: smooth }`
    só sob `prefers-reduced-motion: no-preference`, com
    `data-scroll-behavior="smooth"` no `<html>` para a troca de rota do Next
    continuar instantânea. Com o Lenis ativo, o CSS suave sai (a classe
    `lenis-smooth` já zera), para os dois não brigarem.

### Fortes

11. **Caçar o tranco antes de suavizar.** Com o trace da Fase 0, eliminar o
    custo por rolagem que aparecer (leitura de layout em `onUpdate`, pintura
    de áreas grandes, camadas que repintam, vídeo). Zero mudança visual.
12. **Transição de rota com `<ViewTransition>`.** _Crossfade_ curto (≤ 250 ms,
    `ease-out`) só no `<main>`; header e rodapé com `viewTransitionName`
    próprio e `animation: none`, seguindo o guia do Next. Com movimento
    reduzido, nada anima. Sem suporte no navegador, a navegação segue normal.
    Atenção ao canvas do globo (o _snapshot_ da página velha não pode travar
    nem piscar) e à ordem entre a rolagem para o topo e a transição. Medir o
    custo em JS e TBT; se não couber, documentar e não entregar.

### Depende do dono (recomendado, não executar agora)

13. **Revelações por rolagem, _snap_ e paralaxe nas seções:** mudam o design,
    que o dono aprovou como está.
14. **Inércia sintética no toque (`syncTouch`):** não recomendado; o nativo é
    melhor.
15. **Ajuste fino da curva no mouse do dono:** entregar o valor escolhido e
    duas alternativas (mais solta, mais firme) documentadas, para ele testar.

## Restrições (não negociáveis)

- Visual idêntico. Nenhuma cor, espaço, tipografia ou animação existente muda
  (exceto o `scrub` do globo, recomendação 6).
- Orçamento do Lighthouse mobile (mediana): JS ≤ 240 KB, TBT ≤ 150 ms, LCP ≤
  3,8 s, CLS ≤ 0,05, acessibilidade 100, zero terceiros. Desktop sem
  regressão.
- Movimento reduzido = rolagem nativa, sem Lenis e sem _crossfade_. Sem JS =
  site igual ao de hoje.
- No máximo uma dependência nova (Lenis), versão exata, sem CDN.
- Guarda de tokens, `regras-componentes.test.ts` e o restante dos testes
  verdes. Código e comentários em português, no estilo dos arquivos vizinhos.
- Nada de commit, push, PR ou merge sem o dono pedir. Trabalho na branch
  `feat/rolagem-inercia`.

## Verificação

- `npm test` (typecheck + Vitest), `npm run lint`, `npm run format:check` e
  `npm run build`.
- E2E: `PORT=3217 npx playwright test` com o servidor antigo desligado
  (matar pelo PID de `ss -ltnp`, não com `pkill -f`). Projetos chromium,
  mobile e firefox; o WebKit fica para o CI.
- **E2E novos:**
  - desktop: um único `mouse.wheel` gera vários valores intermediários e
    crescentes de `scrollY` ao longo dos quadros, e assenta;
  - movimento reduzido: a mesma roda move a página de uma vez (sem Lenis);
  - projeto mobile: o _chunk_ do Lenis não é baixado;
  - PgDn e Espaço rolam; link `#…` pousa com o alvo abaixo do header;
  - menu aberto: a roda não move a página;
  - troca de rota: chega no topo e a próxima roda parte do topo, sem salto
    para trás;
  - tabela de `/privacidade` rola na horizontal sem mover a página.
- Testes unitários para as partes puras (o _gate_ das _media queries_, o
  cálculo do deslocamento das âncoras).
- Desempenho: trace antes e depois nas mesmas condições da Fase 0 (p50/p95
  dos quadros, quadros perdidos), Lighthouse mobile em modo CI (5 runs) em `/`
  e `/contato`, desktop (3 runs) em `/`, `measure-route-js.mjs` no celular e
  no desktop.
- Vídeo curto (Playwright `recordVideo`, 1440 px) da mesma rolagem com roda
  antes e depois, para o dono sentir a diferença.

## Critérios de aceite

- Roda do mouse no desktop: deslizamento contínuo com desaceleração, sem
  degraus, assentando em ~1 s; primeiro quadro responde na hora.
- Toque, trackpad, teclado, busca, foco, zoom e barra de rolagem: idênticos ao
  nativo.
- Âncoras pousam abaixo do header em todos os breakpoints, inclusive com a
  janela de até 30 rem de altura, e o foco vai junto.
- Menu e galeria abertos: a página não rola por trás.
- Troca de rota: sem salto e sem "puxão" de volta; com `<ViewTransition>`,
  header e rodapé parados.
- Globo acompanha a rolagem sem atraso visível com a roda.
- p95 da duração dos quadros durante a rolagem igual ou melhor que a linha de
  base; nenhuma tarefa longa nova.
- Lighthouse mobile dentro do orçamento, script do celular sem aumento; desktop
  sem regressão.
- Movimento reduzido e sem JS: sem diferença em relação à `main`.
- Testes, lint, formato, build e E2E verdes.

## Diagnóstico (2026-10-08, build de produção local, `main` 59ca89f)

Ambiente: Chrome 155.0.8059.39, Playwright 1.61.1 (`channel: "chrome"`),
Lighthouse CLI 12.8.2, Node 24.18, Next 16.3.8 (Turbopack). GPU com as flags:
ANGLE / Mesa Intel UHD (TGL GT1); `--disable-gpu` = SwiftShader. rAF a
59–63 Hz em todas as execuções. Uma primeira passada com a máquina ~3× mais
lenta (`benchmarkIndex` 431–1316; TBT da home 1696 ms) foi descartada; os
números abaixo são com a máquina ociosa (`benchmarkIndex` ~3300, `cpuMs` do
trace 282–301). Scripts, traces, JSONs e o vídeo "antes" ficam fora do repo,
em `~/byte-criativo-capturas/rolagem/` (`scripts/`, `antes/`, `antes.webm`).

### Lighthouse (mediana por métrica)

|                       | perf | LCP     | TBT   | CLS | FCP    | script (transfer) | a11y |
| --------------------- | ---- | ------- | ----- | --- | ------ | ----------------- | ---- |
| mobile `/` (5)        | 95   | 2970 ms | 44 ms | 0   | 905 ms | 223.795 B         | 100  |
| mobile `/contato` (5) | 99   | 2104 ms | 31 ms | 0   | 904 ms | 171.525 B         | 100  |
| desktop `/` (3)       | 100  | 624 ms  | 0 ms  | 0   | 246 ms | 223.795 B         | 100  |

TBT dos runs: home 37/45/44/44/37; contato 30/30/33/31/35; desktop 0/1/0. O
LCP da home mobile é bimodal (2255 ou ~2970 ms). **Folga real de JS na home:
240.000 − 223.795 = 16.205 B** (não ~21 KB). Zero terceiros.

### JS por rota (bytes transferidos)

| rota                        | desktop | celular (Pixel 7) |
| --------------------------- | ------- | ----------------- |
| `/`                         | 223.795 | 223.795           |
| `/portfolio`                | 165.647 | 165.647           |
| `/portfolio/underground-pb` | 173.343 | 173.343           |
| `/servicos`                 | 165.647 | 163.586           |

`scripts/measure-route-js.mjs` só mede desktop (sem emulação, para em
`networkidle` com 5 s); o celular foi medido com um script equivalente fora do
repo (`medir-js-rota.mjs --mobile`), que no desktop bate com o original.

### Quadros na rolagem

Método único: rAF injetado medindo o intervalo entre quadros (perdidos =
Σ max(0, round(Δ/16,67) − 1)), mais os estados do `PipelineReporter` do
compositor. Roda: 30 cliques de 100 px a cada 60–80 ms, 1440×900, janela do
primeiro clique até 1,5 s depois do último. Toque: Pixel 7, 4 arrastos de
480 px a ~2400 px/s (`Input.dispatchTouchEvent`). 3 repetições, mediana.

| condição / página                      | p50  | p95      | máx     | perdidos | longas               |
| -------------------------------------- | ---- | -------- | ------- | -------- | -------------------- |
| roda, GPU, `/`                         | 16,7 | 16,7     | 33,4    | 2        | 0                    |
| roda, GPU, `/portfolio`                | 16,7 | 16,8     | 16,8    | 0        | 0                    |
| roda, GPU, estudo de caso              | 16,7 | 16,7     | 16,8    | 0        | 0                    |
| **roda, sem GPU + CPU 4×, `/`**        | 16,7 | **33,4** | **133** | **43**   | **7 (61–121 ms)**    |
| roda, sem GPU + CPU 4×, `/portfolio`   | 16,7 | 16,7     | 16,8    | 0        | 0                    |
| roda, sem GPU + CPU 4×, estudo de caso | 16,7 | 16,7     | 16,8    | 0        | 0                    |
| toque, `/`                             | 16,7 | 16,8     | 33,4    | 2        | 0                    |
| toque, `/portfolio`                    | 16,7 | 16,7     | 16,8    | 0        | 0                    |
| toque, estudo de caso                  | 16,7 | 33,3     | 33,4    | 39       | 0                    |
| toque + CPU 4×, `/`                    | 16,7 | 33,3     | 66,6    | 28       | 0 (5 em 1 de 3 reps) |
| toque + CPU 4×, `/portfolio`           | 16,7 | 16,8     | 16,8    | 0        | 0                    |
| toque + CPU 4×, estudo de caso         | 16,7 | 33,4     | 33,4    | 41       | 0                    |

**Curva de um clique de roda hoje:** `scrollY` fica parado ~23 ms e salta 100
px num único quadro, sem valor intermediário (o "degrau"). Roda sintética do
CDP; o "depois" usa a mesma roda.

### Achados

1. **Com GPU a rolagem já roda no ritmo da tela** nas três páginas. O tranco
   real é a **home sem GPU**: 7 tarefas longas de 61–121 ms no primeiro
   segundo, enquanto o hero está visível; dentro delas,
   `BeginMainFrame → Commit → DoUpdateLayers` ≈ 100 ms (cópia da camada do
   canvas pintado por software). Gatilho: no modo estático o `onUpdate` do
   `ScrollTrigger` (`globo-motor.ts` ~l. 2511–2517) chama `desenhar`
   sincronamente a cada evento `scroll` (3,4 ms por evento sob CPU 4×). Com a
   inércia gerando rolagem a cada quadro, esse caminho passa a rodar por
   quadro: é o primeiro alvo da recomendação 11.
2. **Custo do globo por quadro** (hero visível, repouso): GPU 3,6 ms de script
   e 12,8 ms no processo da GPU (Intel UHD); toque + CPU 4× 6,3 ms. Durante a
   rolagem com roda o hero sai em ~0,6 s e o globo dorme (0,6 ms/quadro).
   `/portfolio` e estudo de caso: ≤ 0,45 ms/quadro.
3. **Nenhuma leitura de layout custosa** por rolagem: só `window.scrollY` em
   `desenhar` (l. 1388) e no getter do ScrollTrigger (~0,1 ms).
4. **Ouvintes:** hoje não há ouvinte `wheel` não passivo. O Lenis registra
   `wheel`, `touchstart` e `touchmove` com `passive: false` no `window` mesmo
   com `syncTouch: false`; isso tira a roda do caminho exclusivo do
   compositor, por isso o p95 do "depois" importa.
5. **Toque no estudo de caso** alterna quadros de 33 ms no arrasto sem
   descarte no compositor e com a thread principal ociosa; hipótese: a barra
   `.progresso-leitura` (`animation-timeline: scroll()`). Fora do escopo do
   Lenis (toque fica nativo).
6. **O `scrub: 0.6` do globo é inerte.** O gatilho não tem `animation`
   (`ScrollTrigger.js` só aplica `scrubDuration` dentro de `if (animation)`), e
   o `onUpdate` grava `self.progress` cru em `estado.rolagem`. Não há
   suavização dupla a remover; o atraso real é de um quadro (o ScrollTrigger
   atualiza no evento `scroll`, um quadro depois da escrita do Lenis), que
   `lenis.on('scroll', ScrollTrigger.update)` no mesmo relógio elimina.
7. **`gsap.ticker.fps()` é global:** os degraus de qualidade do globo limitam
   o ticker a 60 (degraus 0–5) ou 30 fps (degrau 6) (`config.ts:112–118`;
   `globo-motor.ts` l. 2313, 2723, 2768). O Lenis no ticker herdaria esse teto.

### Inventário das rolagens programáticas

Não existe `scrollTo`, `scrollIntoView`, `scrollBy`, `location.hash` nem
`hashchange` em `src/`: toda rolagem é nativa. Os links `#…` são de dois
tipos: `<a>` nativo (skip link `skip-link.tsx:18`, índice de `;`
`indice-semicolon.tsx:37`) e `TextLink` (`text-link.tsx:104`), que renderiza
`next/link` mesmo com `#` (âncoras do hub de `/servicos`, "Ir para…" das
situações, contagem "1 de 2" da Ficha); esses passam pelo roteador do Next
(`scrollIntoView()`, sem mover o foco). O rótulo "Rolar" do hero **não é
interativo** (`div aria-hidden`); torná-lo link é decisão do dono. O "Menu"
sem JS (`#navegacao-rodape`) só existe sem hidratação. O `lead-form` foca o
campo com erro (`focus()` nativo). Diálogos (`mobile-nav.tsx`,
`galeria-dialog.tsx`) travam a página só por CSS
(`html:has(dialog[open]) { overflow: hidden }`, `globals.css:654`); o
`MobileNav` também abre por Invoker Command nativo, sem JS. Rolagem aninhada:
só as tabelas `overflow-x-auto` de `/privacidade` (`page.tsx:58`). Não há
banner de consentimento no site.

### Lenis e Next 16

- **`lenis@1.3.26`** (05/08/2026, MIT): 5.431 B gz (min), não 3–4 KB.
  `lenis.css` (513 B) **não** zera `scroll-behavior` nesta versão; o
  `scrollTo` com elemento já desconta o `scroll-padding-top` computado e o
  `scroll-margin-top` do alvo (não somar `offset`). `anchors: true` não confere
  `defaultPrevented`, modificadores nem botão: usar manipulador próprio.
  Durante uma inércia o Lenis sobrescreve a rolagem nativa (teclado, barra,
  `scrollTop = 0` do Next) até assentar. `autoToggle` para/religa sozinho
  quando o `overflow` do `<html>` vira `hidden`. Grava `window.lenis`.
- **Next 16:** `data-scroll-behavior="smooth"` só desliga o CSS suave na troca
  de rota, não quando só o hash muda. O manipulador de rolagem novo não move o
  foco. `<ViewTransition>` funciona sem configuração, mas o tipo só existe em
  `@types/react/canary` (precisa de `/// <reference types="react/canary" />`);
  o guia manda pôr o invólucro em cada `page.tsx`, não no layout. A CSP real é
  `script-src 'self' 'unsafe-inline' …` e `style-src 'self' 'unsafe-inline'`.

## Resultados (2026-10-08, build de produção local)

Branch `feat/rolagem-inercia`, sem commit. Uma dependência nova:
`lenis@1.3.26`, versão exata. Executado com subagents: medidor e inventário
(Fase 0), implementador, três ciclos de QA independente e um revisor de
código.

**O que entrou**

- `src/lib/rolagem/`, com funções puras testadas:
  - `gate.ts`: as duas media queries, ouvidas ao vivo.
  - `ancora.ts`: quais cliques viram rolagem suave, e o deslocamento do header.
  - `ponte.ts`: o relógio do globo e o veto da inércia, sem importar `gsap`
    nem `lenis`.
  - `laco.ts`: acordar e dormir o laço, e a taxa da tela.
  - `motor.ts`: o único arquivo que importa o Lenis.
- `motor-de-rolagem.tsx`: a ilha no layout. Ordem: gate, `load`, ocioso e só
  então o `import()`. Também `sincronizar()` a cada troca de rota.
- `transicao-de-pagina.tsx`: o `<ViewTransition>` em cada `page.tsx` de
  `(site)`.
- Mudanças em arquivos existentes:
  - `globals.css`: `scroll-behavior: smooth` só com JS e sem movimento
    reduzido, e `auto` sob `.lenis`; `dialog { overscroll-behavior: contain }`;
    duas regras do `lenis.css`; a transição de página.
  - `layout.tsx`: `data-scroll-behavior="smooth"`.
  - `text-link.tsx`: `<a>` simples para `#…`.
  - `data-lenis-prevent` nos dois diálogos e
    `data-lenis-prevent-horizontal` nas tabelas de `/privacidade`.
  - `data-site-footer` no `<footer>`.
  - `globo-motor.ts`: ponte, veto, desenho no modo estático uma vez por
    quadro, e `scroll-behavior: auto` inline durante o `refresh` do
    ScrollTrigger.

**Decisões**

- **Lenis, não lerp próprio.** O chunk tem 6.721 B gz no build final (Lenis
  5.444 + motor, laço e âncoras) e só baixa no desktop. Um lerp próprio economizaria ~4 KB, só no
  desktop, e evitaria os ouvintes `touch*` com `passive: false` que o Lenis
  registra mesmo com `syncTouch: false`. Mas teria de refazer à mão o que o
  Lenis já cobre: `deltaMode`, Ctrl+roda, botão do meio, exclusões por
  atributo, `scrollTo` que lê `scroll-padding`/`scroll-margin`,
  `stop`/`start` e a sincronização com a rolagem nativa. O trace não mostrou
  custo do Lenis: 0,04–0,25 ms por quadro rolando, nada em repouso.
- **Curva: `lerp` 0,1** (amortecimento exponencial, λ = 6/s, independente da
  taxa de quadros). O primeiro quadro anda 10 px; 50 % em 114 ms, 90 % em
  380 ms, assenta em ~0,9 s. Alternativas para o dono testar no mouse dele
  (rec. 15), trocando `lerp` em `OPCOES` de `motor.ts`:
  - **0,12**: mais firme, assenta em ~0,75 s;
  - **0,08**: mais solta, ~1,1 s.

  Compromisso: `(pointer: fine)` não separa mouse de trackpad, então o
  trackpad do macOS também ganha um pouco de peso.

- **Âncoras com manipulador próprio**, não `anchors: true` (o do Lenis não
  confere `defaultPrevented`, modificadores nem botão). Sequência:
  `preventDefault`, `history.pushState` do hash (nenhum CSS usa `:target`),
  `lenis.scrollTo(alvo)` sem `offset`, porque o Lenis já desconta o
  `scroll-padding-top` computado. O foco vai ao destino já no clique
  (`tabindex="-1"` temporário, `preventScroll`); com mouse não aparece anel.
- **Diálogos:** `MutationObserver` em `open`, filtrado a `DIALOG`, chamando
  `stop`/`start`. Cobre também o Invoker Command nativo. A troca de rota
  reconfere os diálogos, porque a galeria pode sair do DOM aberta (Voltar).
  Não usei `autoToggle` nem a regra `overflow: clip` do `lenis.css`, que
  venceria o `scrollbar-gutter` da trava da casa e mudaria a largura.
- **Rolagem nativa no meio da inércia** (busca, `focus()`,
  `scrollIntoView`, teclado, barra, Voltar) tem prioridade. O laço compara
  `scrollY` com a última escrita do Lenis e interrompe a inércia se a
  diferença passar de 2 px. É uma leitura por quadro, só durante a inércia,
  sem ouvinte de `scroll` novo.
- **Um relógio só na home.** Com o globo montado, o passo entra no
  `gsap.ticker` com prioridade e chama `ScrollTrigger.update`. Isso vale só
  se o teto de fps do ticker acompanha a tela; com 120/144 Hz ou no degrau de
  30 fps, usa rAF próprio. O passo só existe da primeira roda até assentar.
  Escolhi `performance.now()` em vez de `lagSmoothing(0)` para não mudar o
  ticker global do globo. Dois bugs do `_wake()` síncrono do GSAP
  apareceram no QA e foram corrigidos com teste unitário: o primeiro clique
  não andava e, depois, escrevia um quadro atrasado.
- **`scrub: 0.6` do globo: nada a mudar.** A instrumentação confirmou que é
  inerte: o gatilho não tem `animation`, e `self.progress` é igual ao
  progresso cru de `scrollY` em todo quadro, com e sem a inércia. Ficou um
  comentário.
- **Rec. 11:** no modo estático o globo passou a desenhar no máximo uma vez
  por quadro. Mesmo assim, a home sem GPU com inércia piorou (p95
  33,4 → 50,1 ms, 7 → 9 tarefas longas), porque a cópia do canvas pintado por
  software custa ~100 ms e a inércia mantém o hero mais tempo na tela. Por
  isso **o globo veta a inércia em modo estático sem aceleração**: nessa
  máquina a home fica nativa, e as outras páginas mantêm a inércia. As 7
  tarefas longas da linha de base continuam lá; são anteriores à rodada.
- **Rec. 12: entregue.**
  - Crossfade de 240 ms `ease-out` (`--dur-base`) no conteúdo; header parado.
  - O rodapé visível esmaece no lugar: o grupo segura a geometria velha. Com
    só o nome próprio ele sumia na hora.
  - Movimento reduzido: duração 0. Custo de JS: zero (já vem no React).
  - Tipo via `/// <reference types="react/canary" />`.

**Quadros na rolagem, código final** (mesmos scripts e condições da Fase
0, na tomada, 3 repetições, mediana, `cpuMs` aceito 282–310, runs fora da
faixa refeitos):

| célula                                       | p95 antes → depois | máx         | perdidos | longas |
| -------------------------------------------- | ------------------ | ----------- | -------- | ------ |
| roda, GPU, `/`                               | 16,7 → 16,7        | 33,4 → 16,8 | 2 → 0    | 0 → 0  |
| roda, GPU, `/portfolio`                      | 16,8 → 16,8        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| roda, GPU, estudo de caso                    | 16,7 → 16,7        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| roda, sem GPU + CPU 4×, `/` (inércia vetada) | 33,4 → 33,3        | 133 → 133   | 43 → 40  | 7 → 7  |
| roda, sem GPU + CPU 4×, `/portfolio`         | 16,7 → 16,7        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| roda, sem GPU + CPU 4×, estudo de caso       | 16,7 → 16,7        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| toque, `/`                                   | 16,8 → 16,7        | 33,4 → 33,3 | 2 → 2    | 0 → 0  |
| toque, `/portfolio`                          | 16,7 → 16,7        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| toque, estudo de caso                        | 33,3 → 33,3        | 33,4 → 33,5 | 39 → 40  | 0 → 0  |
| toque + CPU 4×, `/`                          | 33,3 → 33,3        | 66,6 → 66,6 | 28 → 24  | 0 → 0  |
| toque + CPU 4×, `/portfolio`                 | 16,8 → 16,7        | 16,8 → 16,8 | 0 → 0    | 0 → 0  |
| toque + CPU 4×, estudo de caso               | 33,4 → 33,3        | 33,4 → 33,4 | 41 → 41  | 0 → 0  |

Custo do Lenis por quadro rolando: 0,06–0,10 ms com GPU e 0,26–0,42 ms sem
GPU com CPU 4× (fora da home); zero em repouso. Na home com GPU, o globo
custa 0,63 ms e o ScrollTrigger 0,13 ms. No toque, o chunk do Lenis não
carrega.

**Curva de um clique** (roda sintética do CDP, GPU, `/`):

- antes: `scrollY` parado por ~23 ms, depois 100 px num único quadro;
- depois: 10 px a 23 ms, 50 % em ~123 ms, 90 % em ~389 ms, assenta em
  ~0,9 s. Primeira escrita no próprio evento da roda (+1–2 ms), também na
  home com o ticker do GSAP dormindo.

**Lighthouse do código final** (mediana; `benchmarkIndex` aceito 3107–3380):

|                       | perf      | LCP         | TBT     | CLS   | script            | a11y | terceiros |
| --------------------- | --------- | ----------- | ------- | ----- | ----------------- | ---- | --------- |
| mobile `/` (5)        | 95 → 99   | 2970 → 2262 | 44 → 37 | 0 → 0 | 223.795 → 224.726 | 100  | 0         |
| mobile `/contato` (5) | 99 → 99   | 2104 → 2105 | 31 → 39 | 0 → 0 | 171.525 → 172.244 | 100  | 0         |
| desktop `/` (3)       | 100 → 100 | 624 → 620   | 0 → 0   | 0 → 0 | 223.795 → 224.726 | 100  | 0         |

- O LCP da home é bimodal (~2257 ou ~2950 ms) nos dois lados; a queda da
  mediana é da amostra, não melhora real.
- TBT dos runs de `/contato`: 39, 43, 31, 67, 32 (antes 30–35). `/contato`
  não tem globo nem Lenis no celular; o +719 B da ilha é o único JS novo
  ali. Fica dentro do orçamento e do ruído conhecido do TBT (até ~150 no CI).
- O chunk do Lenis não é baixado em nenhum run do Lighthouse, nem no
  desktop: ele entra depois do `load` e do ocioso.

**JS por rota no código final** (bytes transferidos; não depende da CPU):

| rota                        | celular antes → depois   | desktop antes → depois |
| --------------------------- | ------------------------ | ---------------------- |
| `/`                         | 223.795 → 224.726 (+931) | 223.795 → 232.519      |
| `/portfolio`                | 165.647 → 166.366 (+719) | 165.647 → 174.159      |
| `/portfolio/underground-pb` | 173.343 → 174.075 (+732) | 173.343 → 181.868      |
| `/servicos`                 | 163.586 → 164.305 (+719) | 165.647 → 174.159      |

No celular, o chunk do Lenis não baixa. Nenhum script com `lenisVersion`
aparece, nem no Pixel 7 nem no Lighthouse mobile. Os ~0,7–0,9 KB a mais são o
piso de um gate no cliente: ilha ~700 B gz e ponte ~230 B gz no chunk do
layout, mais os ouvintes de `refresh` no chunk do globo. Isso **não atende à
risca** o critério "script do celular sem aumento". O orçamento continua
atendido, com folga de 15.274 B na home.

**Testes**

- `npm test`: 959 testes. Os unitários novos cobrem gate, âncora e laço,
  inclusive um relógio que acorda de forma síncrona como o GSAP.
- `npm run lint` e `npm run build` ok. `format:check` ok, depois de formatar
  este arquivo.
- E2E (chromium, mobile, firefox): no QA do ciclo 3, 125 passaram e 19
  foram pulados de propósito (roda só no desktop; o teste do celular só no
  mobile). Na última suíte completa, depois do ajuste final da microtarefa,
  124 passaram e 1 falhou (o flaky do menu por teclado, abaixo); os specs
  `rolagem-inercia` + `brand-navigation` passaram 62/62 e o teste do menu
  60/60 isolado.
- `e2e/rolagem-inercia.spec.ts`, novo, cobre:
  - roda com valores intermediários;
  - movimento reduzido;
  - chunk ausente no celular;
  - PgDn e Espaço;
  - âncoras abaixo do header em três tamanhos, com foco;
  - menu e galeria;
  - galeria aberta seguida de Voltar;
  - troca de rota;
  - tabela de `/privacidade`;
  - `find`, `focus` e `scrollIntoView` no meio da inércia.
- Flakies:
  - Conhecido: `lead-form` "falha de envio".
  - `brand-navigation` "menu funciona por teclado…" falhou duas vezes na
    suíte completa (firefox e chromium) e passou 60/60 isolado. **É
    anterior a esta rodada:** com a suíte completa 6× (chromium, firefox e
    mobile), ele falhou 1 vez num build da `main` (59ca89f, 1 de 522) e 1 vez
    na branch (1 de 750); a mesma taxa, 1 em 18 execuções desse teste.
    Hipótese, não confirmada: o Enter logo depois do `goto` abre o menu pelo
    Invoker Command antes da hidratação, e o efeito "fecha ao concluir a
    navegação" do `MobileNav` o fecha na montagem.
- WebKit fica para o CI.

**Ficou de fora, ou com o dono**

- Recs. 13–15 não foram executadas; as alternativas de curva estão acima.
- O "Rolar" do hero continua sem ação: torná-lo link é mudança de
  comportamento.
- Pendente:
  - testar em tela de 120/144 Hz e com trackpad real;
  - endurecer o teste do menu por teclado (flaky anterior a esta rodada).
- O CI não exercita a inércia na home: sem GPU, o globo a veta.
- Vídeos lado a lado (fora do repo): `~/byte-criativo-capturas/rolagem/antes.webm`
  e `depois.webm` (1440×900, GPU real, mesma rolagem com roda).
- O flaky do menu por teclado pode deixar o CI vermelho: um re-run resolve.
  Ele já existia na `main` (ver Testes).
