# Prompt: a brasa do `;` em evidência, com equilíbrio, também no celular

## Papel

Você é especialista sênior em front-end e motion design generativo (Canvas 2D,
GSAP, coreografia de rolagem e de toque), com olho de diretor de arte. Sabe
fazer um detalhe virar assinatura sem virar ruído. Trabalha no site da Byte
Criativo (Next.js 16 App Router, React 19, GSAP 3.15, TypeScript estrito,
código e comentários em português).

## Contexto

O hero da home tem o globo "Ponto e vírgula, planeta": paralelos de código
real girando numa esfera em perspectiva, em Canvas 2D, desenhados em trechos
de palavra a partir de um atlas de linhas (ver
`src/app/(site)/_components/hero-arte/globo-motor.ts` e `config.ts`; histórico
em `docs/superpowers/specs/2026-10-07-globo-fluido-prompt.md`).

Quando um `;` cruza o meridiano da frente, ele vira **brasa**: acende em
laranja em 140 ms, esfria até a tinta em 1,3 s e deixa um brilho laranja
suave atrás (sprite radial, alfa 0,3, raio 1,3 altura de glifo). No máximo 5
brasas ao mesmo tempo, e a zona calma do texto as atenua.

O dono do site adorou o efeito e quer **mais evidência, ainda equilibrada**,
e quer que o celular fique **tão bonito quanto o desktop**. Ele aceita um
pouco mais de custo de carregamento por isso, mas sem estourar os orçamentos
do CI.

## Diagnóstico (medido em produção, 40 s por aparelho)

|                             | Desktop 1440×900 | Celular (Pixel 7) |
| --------------------------- | ---------------- | ----------------- |
| Ignições                    | 53               | 16                |
| Na tela                     | 32               | 8                 |
| Atrás do texto (atenuadas)  | 0                | 5                 |
| Bem visíveis (brilho ≥ 0,2) | 30               | **3**             |
| Alfa médio do brilho        | 0,28             | 0,14              |

No celular o efeito quase não existe. O globo fica com o centro 8 vh abaixo
do bloco de texto e 75 % para a direita. O meridiano da frente, onde o `;`
acende, cai quase inteiro atrás do texto (zona calma) ou abaixo da dobra.
Sem ponteiro, a lanterna fica parada no centro do globo, e o globo parece
menos vivo.

## Objetivo

1. A brasa vira a assinatura visual do globo: perceptível à primeira vista,
   com leitura de "o código compila e termina em `;`".
2. Continua equilibrada: ritmo, não pisca-pisca. O texto do hero continua
   com o contraste AA intocado.
3. No celular, o efeito aparece com a mesma frequência percebida do desktop,
   numa composição bonita.

## Recomendações (executar nesta ordem de prioridade)

### Essenciais

1. **Ignição em três tempos.** O `;` aceso é desenhado em laranja **negrito**
   (peso 700, como o `;` do título), numa faixa própria do atlas. Ele cresce
   até ~1,5× com leve overshoot e volta ao tamanho em ~400 ms. O brilho
   ganha duas camadas: um núcleo mais denso e um halo largo e fraco (bloom
   sem `lighter`, que não funciona sobre fundo claro).
2. **Onda na superfície.** Um anel fino laranja nasce no `;` e se expande
   **sobre a esfera** (círculo geodésico projetado, ~24 pontos) até ~0,25
   rad em ~900 ms, sumindo. A curvatura do planeta aparece a cada ignição.
   Custo: um `stroke` por brasa ativa.
3. **Cadência, não ruído.** O desktop já acende ~1,3 brasa por segundo:
   deixar cada uma mais forte sem baixar a taxa vira barulho. Por isso:
   - **teto de taxa** de ~1 ignição por segundo (porteira probabilística
     ou rodízio), com intervalo mínimo de ~280 ms entre ignições;
   - teto de simultâneas;
   - brilho, onda e escala nunca dentro da zona calma do texto, onde o `;`
     só troca de cor, bem atenuado.

   O ritmo vira assinatura. Segurança: nenhuma região pisca mais de 3 vezes
   por segundo, e a área acesa é pequena (WCAG 2.3.1).
   **Um botão de equilíbrio:** um escalar `intensidade` em `config.ts`
   multiplica o alfa do brilho, o overshoot da escala e o alfa da onda, para
   comparar 2–3 níveis e calibrar com um número só.

4. **Celular com palco.**
   - reposicionar e redimensionar o globo para o meridiano de ignição cair
     na área visível fora do texto;
   - se preciso, mover o meridiano de ignição no celular (deslocamento de
     longitude configurável);
   - brilho e onda com tamanho mínimo em px, porque o glifo do celular é
     pequeno;
   - meta: ≥ 2× as ignições visíveis de hoje, numa composição que um
     diretor de arte aprovaria (validar em 360, 390 e 430 px de largura).
5. **Lanterna autônoma no toque.** Sem ponteiro, a lanterna passeia devagar
   (curva de Lissajous, ~14 s) pela parte visível do globo, fora da zona
   calma. O globo continua vivo no celular.
6. **Quadro estático com brasas.** No modo estático (renderizador por
   software, movimento reduzido), 2–3 `;` ficam acesos, parados, fora da
   zona calma. O acento laranja aparece sem movimento.

### Fortes

7. **A linha compila.** Quando o `;` acende, uma onda quente percorre os
   trechos da instrução que ele encerra, do começo da linha até o `;`
   (~450 ms, tinta → laranja suave → tinta). É a leitura de código que acaba
   de compilar. Use uma segunda faixa do atlas de linhas, em laranja.
8. **Acenda com o cursor e com o toque.** No desktop, o `;` que passa sob a
   lanterna do mouse acende (respeitando a cadência). No celular, tocar o
   hero acende os `;` mais próximos do dedo. Use eventos passivos e não
   bloqueie a rolagem.
9. **Abertura com faísca.** Quando o globo termina de nascer do `;` do
   título, uma cascata curta de 3–4 ignições (uma a cada ~180 ms) liga o `;`
   do título ao planeta.

### Também a executar (depois das Fortes, com a mesma verificação)

10. **Eco nos polos.** Os `;` grandes dos polos respiram um pouco mais forte
    por um instante a cada ignição: um impulso curto de escala e alfa que
    decai sozinho em ~600–900 ms. Impulsos que chegam juntos acumulam com
    teto, para nunca virar pisca-pisca. Escala com `intensidade`, some na
    fita (os polos já somem com a curvatura) e fica de fora do quadro
    estático e do movimento reduzido. Custo desprezível.

## Restrições (não negociáveis)

- Permanecem: o conceito, as cores (`#f65606` laranja, `#0b5cad` azul,
  tinta), a entrada, a fita na rolagem, a zona calma e o halo do `;` do
  título (3:1).
- O texto do hero continua AA. Nenhum efeito novo dentro da zona calma.
- `prefers-reduced-motion`, renderizador por software, `saveData` e
  `deviceMemory ≤ 1` continuam no quadro estático (agora com brasas
  paradas).
- Orçamentos do Lighthouse mobile (mediana): JS ≤ 240 KB (hoje 218.145 B),
  TBT ≤ 150 ms, LCP ≤ 3,8 s, CLS ≤ 0,05 e acessibilidade 100. O dono aceita
  um pouco mais de carregamento, mas não acima desses limites.
- Custo do quadro: o desktop no degrau 0 deve continuar ≤ ~6 ms (hoje
  3,5–5 ms). A qualidade adaptativa continua sem cortes visíveis.
- O código do hero fica em `src/app/(site)/_components/hero-arte/`.
  Parâmetros novos vão para `config.ts`, com comentário.
- Nenhuma dependência nova. Sem commit e sem push (quem orquestra decide).

## Instrumentação

Como já acontece com `degrau` e `custo`, o motor grava no próprio canvas:

- `data-ignicoes`: total de ignições;
- `data-ignicoes-visiveis`: ignições acesas na tela e fora da zona calma.

A medição dos critérios lê esses números, sem depender de interceptar
chamadas de desenho.

## Critérios de aceite

- Celular (Pixel 7, 40 s): ignições bem visíveis ≥ 2× as de hoje (≥ 6), com
  nenhuma brasa com brilho dentro da caixa do texto.
- Desktop: as brasas continuam ~1 a cada 0,7–1,2 s, sem rajadas (intervalo
  mínimo respeitado).
- Capturas de uma ignição completa (início, pico, onda, resfriamento) no
  desktop e no celular.
- `npm run typecheck`, `npm run lint`, `npm run test:unit` e o e2e no
  Chromium passam; o build de produção conclui; o Lighthouse fica nos
  orçamentos.

## Entrega

Branch `feat/brasa-em-evidencia`, diff revisável, números de antes e depois
e capturas.

## Resultado da execução (2026-10-07)

Executado com subagents: um explorador da composição no celular (só
leitura, reescrevendo o layout na produção), um implementador, uma QA
independente (duas rodadas) e uma revisão de código. Medido no build de
produção local, com a GPU real e uma medição por vez.

| Medida                              | `main`  | `feat/brasa-em-evidencia` |
| ----------------------------------- | ------- | ------------------------- |
| Brasas visíveis em 40 s, Pixel 7    | 3       | 9–16                      |
| Brasas visíveis em 40 s, 390×844    | 2       | 11–17                     |
| Brasas visíveis em 40 s, 360×780    | 0       | 3–6                       |
| Brasas visíveis em 40 s, desktop    | 30      | 39 (~1 por segundo)       |
| Custo do quadro, desktop (degrau 0) | 3–5 ms  | 3,0 ms                    |
| Pixel 7 com CPU 4×                  | —       | degrau ≤ 1, 59,9 fps      |
| Lighthouse mobile: perf             | 93      | 99                        |
| LCP                                 | 3110 ms | 2255 ms                   |
| TBT                                 | 88 ms   | 49 ms                     |
| JS transferido                      | 218 KB  | 223 KB                    |
| Acessibilidade                      | 100     | 100                       |

O contraste foi medido por pixel com o texto oculto: apoio, h1, "Ver
projetos" e "Rolar" ficam AA no desktop e no celular. O rótulo "Rolar"
virou uma segunda zona calma depois que o véu do celular encurtou. Com
toques contínuos, não passam de 2 brasas por quadrante em nenhuma janela de
1 s. Em 375×667 não há palco abaixo do texto, então não aparece brasa: é
decisão registrada.
