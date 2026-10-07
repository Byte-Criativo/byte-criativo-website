# Prompt: navegação mobile sem desleixo de design

## Pedido original

> Como um especialista em design, UI/UX e em desenvolvimento de sistemas web,
> analise a navegação mobile do site da Byte Criativo e conserte tudo que
> estiver errado com melhores soluções.

O dono mandou um print do celular (Chrome no Android, ~369 px de largura) da
sala do Underground PB na home: o seletor Frente/Verso esticado na largura
toda, com um vão vazio à direita de "Verso", a captura pequena e um bloco
grande de parede vazia embaixo dela.

## Papel

Você é especialista sênior em design de interface, UX mobile e front-end
(Next.js 16 App Router, React 19, Tailwind 4, TypeScript estrito, código e
comentários em português). Você tem olho de diretor de arte e trata
acessibilidade como requisito, não como extra. Trabalha no site da Byte
Criativo, um site editorial com metáfora de museu: cada trabalho é uma
**sala** com a **Ficha** na parede e o seletor **Frente/Verso**, em que a
frente é a captura do site e o verso conta os bastidores.

## Contexto

- Componentes: `src/components/patterns/frente-verso.tsx`, `ficha.tsx`,
  `sala.tsx`, `site-footer.tsx`, `breadcrumbs.tsx`, `mobile-nav.tsx`,
  `site-header.tsx`. Regras estruturais ficam em `src/app/globals.css`, porque
  a guarda de tokens (`src/styles/guarda-tokens.test.ts`) não aceita posições
  e valores soltos em `src/components/**`.
- Breakpoints: `sm` 30 rem (480 px), `md` 48 rem (768 px), `lg` 64 rem.
- O verso usa `data-surface="verso"`, que redefine todas as variáveis de cor.
- Sem JS (RC9), as duas faces ficam empilhadas e o controle some. Com
  movimento reduzido, a troca de face é instantânea e sem deslocamento.

## Diagnóstico (build de produção local, Playwright, Pixel 7)

Todas as rotas foram percorridas em 360, 390 e 412 px: home, portfólio, dois
estudos de caso, serviços, um serviço, processo, sobre, contato e
privacidade. Também foram capturados o menu aberto, o header colado no topo
durante a rolagem e os dois estados do Frente/Verso.

### 1. Parede vazia embaixo da Frente (o print do dono)

As duas faces dividem a mesma célula do grid, então a altura da sala é a da
face **mais alta**, mesmo quando ela está escondida. Abaixo de `md`, o verso
tem quase o dobro da altura da frente. Alturas próprias de cada face
(frente/verso, em px):

| Largura | Home: UPB | Home: Alumiô | Portfólio: Goromax | Portfólio: Carlos Ferrer |
| ------- | --------- | ------------ | ------------------ | ------------------------ |
| 360     | 315 / 609 | 315 / 652    | 315 / 506          | 274 / 485                |
| 390     | 313 / 583 | 334 / 575    | 313 / 460          | 293 / 409                |
| 412     | 327 / 533 | 347 / 551    | 327 / 460          | 307 / 409                |
| 768     | 514 / 416 | 535 / 408    | 514 / 346          | 514 / 346                |
| 1024    | 634 / 440 | 634 / 432    | 634 / 369          | 634 / 369                |
| 1440    | 814 / 452 | 814 / 415    | 814 / 379          | 814 / 379                |

No celular, de 100 a 340 px de parede vazia aparecem embaixo de cada
captura. A partir de `md` a frente é a face mais alta e a sala tem o tamanho
certo. Lá, o verso do mesmo tamanho da frente é a metáfora: o verso de uma
tela tem o tamanho da tela.

### 2. A lista do Verso é quase invisível (contraste, WCAG 1.4.3)

O Ficha define `text-ink` no `<article>`, e a cor herdada é a **computada na
parede** (tinta escura). O verso redefine `--ink`, mas a `<ul>` "O que está
no ar" não tem cor própria e herda o escuro: texto cinza-escuro sobre fundo
preto, em todas as larguras. Os títulos e o `Text` escapam porque aplicam
`text-ink` em si mesmos. O axe não pegou o problema porque o verso começa
oculto (`visibility: hidden`).

### 3. Seletor Frente/Verso esticado

Abaixo de `sm`, a cabeça da Ficha é `flex-col` e o `align-items: stretch`
padrão estica o grupo `inline-flex` na largura toda, mas os botões continuam
com a largura mínima. Fica uma caixa com borda e uma área morta à direita de
"Verso", que parece quebrada.

### 4. Pontuação dobrada com o `;` da marca

O `;` substitui o ponto final dos títulos, mas em dois lugares ele entra
**depois** de outra pontuação:

- `/portfolio`: "…ou conectar pessoas?;"
- `/servicos`: "Não sabe por onde começar? Conte o contexto.;"

### 5. Compromissos da conversa sem hierarquia e com caixa errada

Na banda de conversa da home, título e explicação são concatenados num texto
corrido, e a explicação começa em minúscula: "Quem desenha, programa. desde a
primeira conversa…" e "Escopo escrito antes do código. a proposta traz…".

### 6. Dois botões primários no hero dos serviços

Em `/servicos/[slug]`, "Falar sobre meu projeto" e "Chamar no WhatsApp" são
dois botões laranja cheios, empilhados no celular. Não há hierarquia. No
resto do site (hero da home, bandas de conversa), o padrão é um botão
primário mais um link de texto.

### 7. Rodapé de ~1.100 px no celular

São 16 links em coluna única até `md`, cada um com alvo de 44 px e 8 px de
vão. É a maior parte da rolagem final de toda página.

### 8. Trilha com separador órfão

Em serviço com título longo, a trilha quebra e a segunda linha começa com
"›": "Início › Serviços / › Landing pages para campanhas e lançamentos".

### Verificado e sem problema

- **Menu (diálogo):** alvos de 48 px, `aria-current` na página atual, rolagem
  da página travada, foco preso no diálogo e devolvido ao fechar, nenhum
  transbordo em 360 px.
- **Rolagem horizontal:** nenhuma em 360, 390 e 412 px, em todas as rotas.
- **Contorno arredondado na borda direita do print:** não vem do site, já
  que não há transbordo medido. O formato bate com a alça do painel lateral
  do Android (Samsung Edge Panel).

## Objetivo

1. Nenhuma sala com parede vazia no celular: a sala abraça a face visível.
2. O verso tem o contraste AA em todo o conteúdo.
3. Os controles e textos ficam com acabamento de produto: seletor equilibrado,
   pontuação limpa, hierarquia clara de CTA, rodapé e trilha compactos.
4. Nada piora no desktop, sem JS ou com movimento reduzido.

## Recomendações (executar nesta ordem)

### Essenciais

1. **Verso herda a tinta do verso.** Aplicar `text-ink` na própria face do
   verso (o elemento com `data-surface="verso"`). Assim todo descendente sem
   cor própria resolve pela tinta do verso. É a correção na raiz: corrigir só
   a `<ul>` deixaria a próxima lista com o mesmo defeito. Teste unitário: a
   face do verso carrega `text-ink`. Teste E2E: com o **Verso ativo**, a cor
   computada de cada texto contra o fundo da face dá ≥ 4,5:1.
2. **A sala abraça a face ativa abaixo de `md`.** Abaixo de 48 rem, a face
   inativa sai do fluxo (`position: absolute`, presa ao topo e às laterais do
   invólucro das faces, que ganha `position: relative`). A altura da célula
   passa a ser a da face visível. O invólucro recorta (`overflow: clip`) a
   face que sai durante o crossfade de 240 ms, para ela não cobrir o texto da
   Ficha. A partir de `md` nada muda: a sala segue do tamanho da frente, que
   é a mais alta, e o verso mantém a metáfora do mesmo tamanho. A regra vive
   em `globals.css`, no bloco do FrenteVerso, sob `:root[data-js]` (sem JS,
   nada muda). A troca de altura vem de um clique, então não conta como CLS.
3. **Seletor segmentado inteiro no celular.** Abaixo de `sm`, os dois botões
   dividem a largura em metades iguais (`flex-1`), com o mesmo peso visual dos
   CTAs de largura total do celular e alvos maiores. A partir de `sm` o
   controle volta a ser compacto, alinhado à direita da cabeça da Ficha.
4. **O `;` nunca depois de outra pontuação.** A regra mora no `Heading`, que
   é quem desenha o `;`: ele substitui o ponto final do título e não entra
   depois de `?` ou `!`. A pergunta do portfólio fica como o dono escreveu,
   agora sem o `;`. O ponto de "Conte o contexto" também sai do conteúdo.
   Testes unitários cobrem os dois casos.
5. **Compromissos com hierarquia.** A explicação começa em maiúscula
   (conteúdo), e o título vai em `<strong>` antes dela. São duas frases, com
   a primeira em destaque.

### Fortes

6. **Um primário por grupo de CTA.** No hero dos serviços, o WhatsApp passa
   para a aparência de link de texto, como no resto do site. A marcação de
   analytics (`data-evento`, `data-location="service-hero"`) continua igual.
7. **Rodapé mais compacto no celular.** No toque, cada link já tem 44 px de
   alvo, então o vão de 8 px entre eles sai. O vão entre os grupos cai de
   `space-7` para `space-6` abaixo de `md`. O alvo de 44 px fica. Duas colunas
   foram testadas e descartadas: em 360 px, "Carlos Ferrer Online",
   "Desenvolvimento de sites" e outros rótulos quebram em duas linhas e as
   linhas ficam desencontradas. Nada de sanfona (`<details>`): o
   `#navegacao-rodape` é o destino do link "Menu" sem JS e precisa continuar
   aberto.
8. **Trilha sem separador órfão.** Abaixo de `sm`, a trilha fica numa linha
   só e o nível atual, que repete o H1 logo abaixo, é truncado com reticências.
   O texto inteiro continua no DOM para leitores de tela.

### Depende do dono (recomendado, não executar agora)

9. **Capturas mobile nas salas.** No celular, uma captura em retrato do
   próprio site (390 × 844 a DPR 3) seria mais legível que a captura de
   desktop reduzida a 310 px. As capturas `-390.avif` aprovadas hoje são de
   outras páginas (palcos, programação) e não das homes que as legendas
   descrevem. Isso exige rodar `scripts/portfolio/refresh.mjs` e a promoção
   manual descrita em `docs/portfolio-captures.md`. Depois, é um `<picture>`
   com `<source media>` e `width`/`height` próprios dentro do mesmo
   BrowserFrame.

## Restrições (não negociáveis)

- Zero JS novo no cliente. Orçamento do Lighthouse mobile (mediana): JS ≤ 240
  KB, TBT ≤ 150 ms, LCP ≤ 3,8 s, CLS ≤ 0,05, acessibilidade 100.
- O desktop (≥ `md`) do Frente/Verso fica como está.
- Sem JS (RC9): as faces continuam empilhadas e legíveis. Com movimento
  reduzido, a troca continua instantânea, sem deslocamento. Em cores
  forçadas (RC10), o botão pressionado continua distinto.
- Posições estruturais e `@media` ficam em `globals.css`, nunca como valores
  soltos em `src/components/**`.
- Nenhuma dependência nova. O menu não muda.

## Verificação

- `npm test` (typecheck + Vitest, incluindo as guardas de tokens e as regras
  de componentes), `npm run lint` e `npm run format:check`.
- E2E: `PORT=3217 npx playwright test` (com o servidor antigo desligado, para
  não testar o build velho). Atenção para `--project=mobile`, para
  `design-system-comportamento.spec.ts` e para o axe.
- Remedir com os scripts da auditoria, em 360, 390, 430 e 1440 px:
  - abaixo de `md`, a altura da célula = a altura da face ativa, nos dois
    estados;
  - a partir de `md`, a altura da célula = a altura da frente (como hoje).
- Capturar de novo os estados Frente e Verso no celular e o Verso no desktop.

## Critérios de aceite

- Celular: nenhuma sala com vão maior que o respiro padrão embaixo da face
  ativa. Seletor com metades iguais.
- Verso: todo texto com contraste ≥ 4,5:1 sobre o fundo do verso, medido
  por E2E com o Verso ativo. O axe sozinho não serve aqui: o véu da sala
  (`.sala::before`) é um pseudo-elemento e o color-contrast sai
  "incompleto".
- Nenhum título com `?;`, `!;` ou `.;`, com um teste que impede a volta.
- Hero dos serviços com um único botão primário.
- Rodapé mais curto no celular, sem rótulo quebrado.
- Trilha numa linha só em 360 px.
- Testes, lint e E2E verdes. Desktop sem diferença visual no Frente/Verso.

## Resultados (2026-10-07, build de produção local)

Branch `fix/navegacao-mobile`. Zero JS novo: as mudanças são CSS, classes,
conteúdo e componentes de servidor. JS da home pelo
`scripts/measure-route-js.mjs`: 218,5 KiB.

**Frente/Verso**, com a célula das faces medida nos dois estados (px):

| Largura | Frente: célula / face | Verso: célula / face | Seletor (grupo / botões) |
| ------- | --------------------- | -------------------- | ------------------------ |
| 360     | 315 / 315             | 609 / 609            | 320 / 159 + 159          |
| 390     | 313 / 313             | 583 / 583            | 350 / 174 + 174          |
| 430     | 338 / 338             | 534 / 534            | 390 / 194 + 194          |
| 768     | 514 / 514 (frente)    | 514 (= frente)       | 150 / 76 + 72            |
| 1440    | 814 / 814 (frente)    | 814 (= frente)       | 150 / 76 + 72            |

Abaixo de `md`, a sala tem exatamente a altura da face visível. Somem de 100 a
340 px de parede vazia por sala. A partir de `md`, nada muda.

**Contraste do Verso:** a lista "O que está no ar" estava em `rgb(0, 0, 0)`
sobre `rgb(20, 20, 20)`, uma razão de **1,14:1**. Depois da correção, todo
texto do verso passa de 4,5:1. O teste E2E novo reprova o build antigo e
aprova o novo.

**Rodapé (altura em px):** de 1.551 para 1.399 em 360 px e de 1.531 para
1.379 em 390 px, ou seja, −10 %, sem nenhum rótulo quebrado.

**Testes:** `npm test` (913 testes), lint, `format:check` e E2E em chromium,
mobile (Pixel 7) e firefox: 87 de 87. O WebKit fica para o CI, porque falta
lib de sistema na máquina local.

**Pendente com o dono:** a recomendação 9 (capturas mobile das salas).
