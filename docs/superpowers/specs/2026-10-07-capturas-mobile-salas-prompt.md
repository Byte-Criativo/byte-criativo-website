# Prompt: capturas mobile nas salas

## Pedido original

> Crie um prompt para que um especialista em desenvolvimento web faça o que
> ficou recomendado como pendência para mim. Melhore o prompt. Execute em
> subagents.

A pendência é a recomendação 9 de
`docs/superpowers/specs/2026-10-07-navegacao-mobile-prompt.md`: no celular,
as salas mostram a captura **de desktop** (1440 × 900) reduzida a ~348 px de
largura, uma escala de 0,24 em que nenhum texto do site se lê. O dono quer a
versão de celular do próprio site no lugar.

## Papel

Você é especialista sênior em desenvolvimento web e em imagem responsiva
(Next.js 16 App Router, React 19, TypeScript estrito, Sharp, Playwright),
cuidadoso com direito de imagem e com desempenho. Código e comentários em
português. O site da Byte Criativo é editorial, com metáfora de museu: cada
trabalho é uma **sala**, e a **Frente** é a captura real do site, dentro de
um `BrowserFrame` com o domínio na barra.

## Contexto

- **Onde as salas aparecem:** home (Underground PB e Festival Alumiô, em
  `src/app/(site)/_components/home-salas.tsx`) e portfólio (os quatro
  projetos, em `src/app/(site)/portfolio/page.tsx`).
- **Imagens de hoje:** `src/assets/case-*-screenshot.webp`, 1440 × 900, com
  import estático e `<img>` nativo. O `next/image` fica de fora para não pesar
  no teto de JS da home.
- **Processo de captura** (obrigatório, ler antes): `docs/portfolio-captures.md`
  e `scripts/portfolio/README.md`.
  - `scripts/portfolio/capture.mjs` captura cada URL em 1440 × 900 (DPR 2) e
    em 390 × 844 (DPR 3), com consentimento explícito
    (`CASE_CAPTURE_CONSENT=necessary-only`).
  - A saída vai para `docs/research/captures/staging/`, ignorada pelo Git, e
    fica `pending-manual-review`.
  - A promoção para `src/assets` é manual, depois de revisão visual.
  - O registro fica em `scripts/portfolio/<slug>.md` e num inventário de
    seleção com bytes e SHA-256.
- **Autorização:** em 22/09/2026 o responsável autorizou a captura dos quatro
  projetos e a atualização periódica. O site pessoal (Carlos Ferrer) nunca
  entra em página inteira, porque tem contato pessoal no rodapé. Cartazes e
  agenda são conteúdo de terceiros, mutável e datado.
- **Frente/Verso no celular:** abaixo de `md`, a sala tem a altura da face
  ativa. A frente de hoje tem ~313 px e o verso, ~583 px.
- **Orçamentos do Lighthouse mobile** (`lighthouserc.json`, home e
  /contato): JS ≤ 240 KB, peso total ≤ 1,5 MiB, LCP ≤ 3,8 s, CLS ≤ 0,05,
  acessibilidade 100. No portfólio, a primeira sala é `eager` e tem
  `fetchPriority="high"`: no celular, ela é candidata a LCP.

## Objetivo

1. Abaixo de `sm` (30 rem), a Frente de cada sala mostra a home do projeto
   **no celular**, legível (escala ≥ 0,85) e dentro do mesmo `BrowserFrame`.
   A barra com o domínio continua: navegador de celular também tem barra de
   endereço.
2. Só uma imagem é baixada por aparelho (direção de arte com `<picture>`, sem
   duas `<img>` escondidas por CSS).
3. Toda imagem é captura real, revisada, registrada e com legenda verdadeira
   para as duas versões.

## Recomendações (executar nesta ordem)

### 1. Captura (sem promover nada)

- Capturar só as homes dos quatro projetos, com `capture.mjs` (uma URL por
  projeto), `CASE_CAPTURE_CONSENT=necessary-only` e
  `CASE_CAPTURE_FULL_PAGE=false`. A página inteira não serve aqui e evita o
  risco do rodapé pessoal.
- Revisar cada PNG pelo checklist de `docs/portfolio-captures.md`: HTTP 200;
  imagens e fontes carregadas; nenhum banner, modal, login ou página de
  manutenção; nenhum dado pessoal ou sensível; conteúdo coerente com o escopo
  da Byte. Descrever em uma frase o que está visível no topo de cada versão,
  para a legenda.
- **Portão:** o orquestrador vê as capturas antes de qualquer promoção. Se
  uma captura falhar no checklist, aquele projeto fica com a imagem atual e o
  motivo vai para o registro.

### 2. Recorte e derivados

- **Recorte da primeira dobra do celular:** os 390 × 560 px CSS do topo da
  viewport (1170 × 1680 no master a DPR 3), sem compor nem retocar. Motivo: a
  viewport inteira (390 × 844) exibida a ~348 px de largura dá ~750 px de
  altura, mais que a tela útil com header e cabeça da Ficha. Com 560 px, a
  frente fica em ~600 px no total, perto da altura do verso (~583). A troca
  Frente/Verso quase não mexe a página, e a Frente cabe numa tela junto com o
  seletor. Se o topo de algum site tiver um elemento cortado de forma
  enganosa, ajuste a altura do recorte (entre 520 e 640) e registre.
- **Derivados WebP** (padrão das capas: qualidade 88, esforço 6) em duas
  larguras, 780 w e 1170 w, para `srcset` + `sizes`. Teto de ~120 KB para o de
  1170 w. Se passar, baixe a qualidade até 80 e registre. Não ampliar.
- **Nomes:** `src/assets/case-<slug>-celular-780.webp` e
  `-celular-1170.webp`.
- **Mesma data no desktop:** se a home mudou desde 22/09 (agenda, cartaz,
  destaque), a captura desktop da **mesma rodada** substitui a
  `case-<slug>-screenshot.webp` da sala. Assim a legenda única descreve as
  duas versões com verdade. As imagens dos estudos de caso
  (`public/cases/**`) ficam como estão, porque têm legendas datadas próprias.
  **Atenção ao alcance:** as capas `case-undergroundpb-screenshot.webp` e
  `case-festival-alumio-screenshot.webp` também são usadas em
  `src/content/pages.ts` (`imageSrc`/`imageAlt`, perto da linha 1109). Se
  forem trocadas, esses `imageAlt` também precisam continuar verdadeiros.
  Também é preciso atualizar `scripts/portfolio/media-inventory.mjs`
  (`trackedCover`), se o nome ou o conteúdo mudar.

### 3. Implementação

- **Um componente de captura da sala**, usado pela home e pelo portfólio, em
  `src/app/(site)/_components/` (a guarda de tokens não aceita literais
  numéricos em `src/components/**`):

  ```tsx
  <picture>
    <source
      media="(width < 30rem)"
      srcSet="…-celular-780.webp 780w, …-celular-1170.webp 1170w"
      sizes="calc(100vw - 42px)"
      width={…}
      height={…}
      type="image/webp"
    />
    <img src={desktop.src} width={desktop.width} height={desktop.height} … />
  </picture>
  ```

  - `width`/`height` no `<source>` reservam a proporção certa em cada versão
    (sem CLS).
  - Mantêm-se o `loading`/`fetchPriority` de cada página e as classes
    `h-auto w-full`.
  - O `sizes` é a largura real da imagem no celular: a margem lateral da
    sala abaixo de `md` (`--grid-margin`: 20 px de cada lado) mais 1 px de
    borda do `BrowserFrame` de cada lado, total de 42 px. `sizes` não aceita
    `var()`, por isso o número fica literal, com comentário.

- **Por que `sm` e não `md`:** entre 480 e 767 px a captura em retrato,
  esticada na largura da sala, passaria de 1.000 px de altura. Nessas
  larguras a captura desktop já se lê razoavelmente.
- **Legendas e `alt`:** um texto só, verdadeiro para as duas versões, em
  `src/content`. Mencionar a data da captura quando o conteúdo for mutável
  (agenda, cartazes), como pede o processo.
- **Registro:**
  - em `scripts/portfolio/<slug>.md`, uma "Rodada de 07/10/2026" com
    master, recorte, derivados, dimensões, bytes e SHA-256;
  - um `scripts/portfolio/selection-2026-10-07.json` no formato do anterior;
  - uma linha em `docs/portfolio-captures.md`.
- **Testes:** testes unitários dos dois pontos de uso (há `<picture>`, o
  `<source>` tem `media`, `srcset`, `width` e `height`, e o `img` mantém
  `alt`, dimensões e `loading`). Atualizar os testes existentes que olham a
  imagem da sala.

### 4. Verificação independente (QA)

- **Medir no celular** (360, 390 e 430 px), com Playwright e DPR 3:
  - a imagem carregada é a de celular (`currentSrc`), e só ela foi baixada (a
    rede não pede a desktop);
  - frente e verso com alturas próximas;
  - em 390 × 844, a sala cabe numa tela junto com o seletor (num celular de
    640 px de altura isso não é exigido);
  - sem transbordo horizontal.
- **Medir em 480, 768 e 1440 px:** a imagem desktop, sem mudança visual.
- **Lighthouse mobile** (3 execuções, mediana) na home, no /contato e no
  /portfolio, contra a linha de base da `main`: LCP, CLS, peso total.
- `npm test`, lint, `format:check` e E2E em chromium, mobile e firefox.
- **Revisão visual de diretor de arte:** a frente no celular está bonita,
  legível, sem corte estranho?

## Restrições (não negociáveis)

- Nada de interface inventada, montagem, retoque ou composição. O recorte do
  topo da viewport é o único tratamento.
- Nenhum consentimento silencioso. O site pessoal nunca entra em página
  inteira, e nenhum master de página inteira vai para o Git.
- Zero JS novo no cliente. Nenhuma dependência nova (Sharp já vem com o
  Next). Orçamentos do Lighthouse mantidos.
- Os estudos de caso (`public/cases/**`) não mudam.
- Sem commit, push ou merge pelos subagents. O orquestrador decide. A
  publicação só sai com o ok do dono, que precisa ver as capturas.

## Critérios de aceite

- Em 390 px, cada sala mostra a home do projeto no celular, com o texto do
  site legível, escala ≥ 0,85.
- Uma imagem por aparelho, sem CLS e com LCP do portfólio mobile ≤ 3,8 s.
- Legenda verdadeira para as duas versões. Registro completo (master, bytes,
  SHA-256).
- Testes, lint e E2E verdes. Desktop sem diferença, exceto a captura da
  mesma rodada, se tiver sido trocada.

## Resultados (2026-10-07)

Executado com subagents: um de captura, um de implementação e um de QA
independente. Os portões de revisão visual ficaram com o orquestrador.
Branch `feat/capturas-mobile-salas`.

**Capturas (só as homes, só viewport, Chrome 155):**

- **Carlos Ferrer, Goromax e Festival Alumiô:** passaram no checklist.
  - Recorte de **545** px CSS em vez de 560: com 560, a primeira linha do
    Festival e um bloco de texto do Goromax ficavam cortados ao meio.
  - Desktop mantida nos três. No Goromax só o menu do site mudou, e a nova
    pesaria 48 % a mais.
- **Underground PB:** a primeira captura reprovou porque o banner de cookies
  ficou aberto, com o manifest dizendo `none`.
  - Causa: o `capture.mjs` usava `.first()` e pegava o "Aceitar e carregar"
    oculto do player do Spotify. Além disso, "Só essenciais" não estava nos
    seletores. Corrigido e recapturado com `necessary-only` registrado.
  - Recorte de **505** px CSS: o cartaz começa em 511, então o recorte para
    depois dos botões.
  - A desktop da sala foi trocada pela da mesma rodada, porque a home mudou
    (Pogo Fest no lugar do Beco Underground).

**Legendas** (uma só, verdadeira para as duas versões):

- UPB: "…em 7 de outubro de 2026, com o Pogo Fest – Ano II em destaque e
  acesso à agenda".
- Festival: "…com a chamada 'Vem alumiar o Centro' e as datas do festival".
- GOROMAX: "…com o logotipo laranja sobre a fotografia da banda diante de
  uma parede descascada". O dono ratificou essa legenda.
- Carlos Ferrer: "…com o título 'Software Engineer, Founder & CEO'".

**Lighthouse mobile** (mediana de 3, main → branch):

| Rota       | LCP (ms)    | CLS | Peso total (KB) | Imagens (KB)  |
| ---------- | ----------- | --- | --------------- | ------------- |
| /          | 3139 → 2297 | 0   | 505,8 → 430,0   | 182,6 → 105,7 |
| /contato   | 2003 → 2794 | 0   | 280,0 → 280,3   | 21,9 → 21,9   |
| /portfolio | 3651 → 3303 | 0   | 640,5 → 432,5   | 386,5 → 177,5 |

- O LCP do /contato variou por ruído da máquina: mesmo elemento, mesmos
  bytes.
- JS idêntico e acessibilidade 100 nas seis medições.
- O Lighthouse emula 412 px e baixa as versões de 780.

**Celular** (altura da Frente / do Verso em px; main entre colchetes):

| Largura | Escala | UPB             | Alumiô          | Goromax         | Carlos Ferrer   |
| ------- | ------ | --------------- | --------------- | --------------- | --------------- |
| 360 @3  | 0,82   | 528 / 609       | 561 / 652       | 561 / 506       | 561 / 485       |
| 390 @3  | 0,89   | 567 / 583 [313] | 602 / 575 [334] | 602 / 460 [313] | 582 / 409 [293] |
| 430 @3  | 0,99   | 619 / 534       | 638 / 551       | 658 / 461       | 638 / 409       |

- O aparelho baixa uma imagem por sala: -celular-1170 em DPR 3 e -780 em
  DPR 2. Nenhuma `*-screenshot*.webp` é baixada no celular.
- Sem CLS e sem transbordo horizontal.
- Em 390 × 844, o seletor e a Frente inteira cabem numa tela.

**Desktop** (480 / 768 / 1024 / 1440): mesma altura de imagem da main, com
diferença de 0,00 px. Só a captura do UPB muda de conteúdo.

**Testes:**

- Vitest 924/924, lint e `format:check` verdes.
- E2E 86/87: a falha foi o teste de teclado do menu no Firefox, sem relação
  com as salas. Isolado, passou 5 de 5.
- O `media-inventory.mjs` confere bytes e SHA-256.

**Observações (não bloqueiam):**

- Em 360 px a escala é 0,82 (o critério de 0,85 vale para 390).
- No Goromax e no Carlos Ferrer, a troca Frente/Verso ainda move de 140 a
  170 px.
- O Goromax 1170 w está 1,4 % acima do teto de ~120 KB, no piso q80.
- A sintaxe `(width < 30rem)` exige Safari 16.4 ou mais novo, o mesmo piso
  do Tailwind v4. Fora disso, cai na captura desktop.
