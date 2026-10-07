# Prompt: globo de código do hero sem cortes, mais fluido e mais bonito

## Papel

Você é especialista sênior em front-end e motion design generativo (Canvas 2D,
WebGL, GSAP, coreografia de rolagem). Tem obsessão por 60 fps estáveis e por
transições que nunca cortam: nada aparece nem some em um único quadro. Trabalha
no site da Byte Criativo (Next.js 16 App Router, React 19, GSAP 3.15,
TypeScript estrito, código e comentários em português).

## Contexto

O hero da home tem o globo "Ponto e vírgula, planeta": paralelos de código real
girando numa esfera em perspectiva, desenhados em Canvas 2D com atlas de glifos
(`src/app/(site)/_components/hero-arte/globo-motor.ts`; parâmetros em
`config.ts`). O globo nasce do `;` do título, tem lanterna e paralaxe do
ponteiro, acende em laranja o `;` que cruza o meridiano e achata em fita
quando a página rola.

## Problema relatado

"De vez em quando o globo apaga algumas linhas de código e depois elas voltam,
como um bug."

## Objetivo

1. Eliminar o bug pela causa raiz. Nenhum elemento do globo pode aparecer ou
   sumir em um único quadro.
2. Deixar o movimento mais fluido: menos custo por quadro e sem picos.
3. Um refinamento visual que cause admiração sem trocar o conceito aprovado.

## Diagnóstico já feito (confirme antes de mudar)

Uma sonda Playwright com a GPU real (Intel UHD, 1853×927, DPR 1) registrou o
degrau da qualidade adaptativa em d1→d0→d1→d2→d1 em 25 s. Cada troca de degrau
liga ou desliga paralelos inteiros (`ia % 3`, `ia % 2`) sem transição, e esse é
exatamente o sintoma relatado. Amplificadores:

- O estimador usa a média de 20 quadros. Um único pico (GC, outra aba; um de
  63,9 ms foi medido) derruba o degrau, e 3 s depois ele sobe de novo. A
  oscilação vem do próprio desenho do estimador.
- O laço quente aloca dois objetos por glifo por quadro (`projetar`) e usa
  `Math.hypot`, `atan2`, `Map.get` e trigonometria por glifo. Ele também
  projeta os espaços. Isso gera custo e pressão de GC, e os picos de GC
  alimentam a oscilação.
- Trocar o DPR ou redimensionar chama `montarAneis()` com o PRNG já avançado:
  o texto e a rotação de todos os anéis são sorteados de novo.
- Outros cortes de um quadro:
  - o hemisfério de trás entra de uma vez no fim da entrada e some de uma vez
    em `curva < 0.5`;
  - um glifo cai de alfa 0,07 para 0 ao cruzar o horizonte;
  - o pulso do `;` volta de laranja para preto em um quadro;
  - na fita, a paralaxe do ponteiro faz parte da fita sumir, porque o teste de
    hemisfério usa a profundidade com paralaxe.

## Recomendações principais

1. **Presença por anel (0→1) interpolada no tempo (~0,9 s).** O degrau só
   define alvos e o laço faz a transição. Ao reentrar, zere o estado de
   cruzamento do meridiano para não disparar pulsos falsos.
2. **Estimador robusto.** Use a mediana por janelas de 30 quadros. Desça só
   com duas janelas caras seguidas. Suba só depois de 3 s baratos e nunca de
   volta a um degrau que falhou antes do resfriamento (20 s, dobrando a cada
   falha). Meta: nenhuma troca de degrau em 60 s de regime estável.
3. **Degraus em ordem de invisibilidade.** Primeiro some o hemisfério de trás
   (em fade), depois cai o DPR, só então saem anéis (em fade) e, por último, o
   quadro cai para 30 fps. O modo estático mantém o desenho de antes, para o
   Lighthouse do CI (SwiftShader) não mudar.
4. **Desenhar em trechos, não em glifos (a maior alavanca).** No Canvas 2D,
   o que custa é o número de chamadas: ~2,3 µs por `setTransform` e
   `drawImage`, contra 0,2 ms de conta por quadro inteiro. Componha as
   linhas de código num atlas (mesma grade espaçada, aspas já em azul) e
   desenhe cada anel em trechos de palavra, cada um numa chamada só. O
   trecho cobre um arco curto o bastante para a corda não se afastar mais
   de 0,5 px da curva (flecha = raio · ângulo² / 8). Só o `;` continua peça
   individual, porque acende sozinho.
5. **Laço quente sem alocação.**
   - projeção inline;
   - rotação do anel pela soma de ângulos (seno e cosseno pré-calculados por
     peça, nenhuma trigonometria por peça);
   - tangente direto do vetor, sem `atan2`;
   - `Math.sqrt` no lugar de `hypot`;
   - espaços fora da lista de desenho;
   - `globalAlpha` só quando muda;
   - grão com `createPattern` (uma chamada em vez de cerca de 200).
6. **Conteúdo determinístico.** O PRNG volta à semente a cada montagem e a
   rotação de cada anel é preservada. Resize e troca de DPR não mudam o
   desenho.
7. **Continuidade em tudo.**
   - o glifo entra e sai em fade no horizonte;
   - o hemisfério de trás tem presença própria e acompanha a curvatura;
   - o teste de hemisfério usa a esfera inclinada sem paralaxe, então a fita
     fica estável.
8. **Refinamento visual de marca: o `;` vira brasa.** Ao cruzar o meridiano,
   ele acende rápido e esfria em ~1,4 s de laranja para tinta, em crossfade,
   com um brilho laranja suave atrás (sprite pré-renderizado). O número de
   brasas acesas continua limitado e a zona calma do texto as atenua.

## Restrições (não negociáveis)

- Permanecem: o conceito, as cores, a entrada (nasce do `;`), a rolagem
  (achata em fita), a zona calma do texto e o halo do `;` do título (3:1).
- Orçamentos do Lighthouse mobile (mediana de 5 execuções): JS ≤ 240 KB,
  TBT ≤ 150 ms, CLS ≤ 0,05 e acessibilidade 100.
- O canvas continua `aria-hidden`, sem ponteiro e fora da tabulação.
- Renderizador por software, `saveData`, `deviceMemory ≤ 1` e
  `prefers-reduced-motion` continuam no quadro estático.
- O código do hero fica em `src/app/(site)/_components/`, porque o
  `guarda-tokens.test` varre `src/components/**`.
- Nenhuma dependência nova.

## Critérios de aceite

- Sonda de 60 s com a GPU real a 1853×927 (DPR 1) e a 1440×900 (DPR 2):
  nenhuma troca de degrau depois do assentamento inicial. Se houver troca, ela
  é um fade, e nenhum anel some em um quadro.
- Custo do quadro no degrau cheio menor que a linha de base (~8,6–8,9 ms).
- Um resize mantém o mesmo texto nos mesmos anéis.
- `npm run typecheck`, `npm run lint` e `npm run test:unit` passam, o build de
  produção conclui e o JS fica dentro do orçamento.

## Fora de escopo (próximos passos sugeridos)

- Renderizador WebGL2 instanciado: um draw call para todos os glifos, com
  custo de CPU por quadro perto de zero.
- Detectar gargalo de GPU pelo intervalo entre quadros. O custo medido hoje é
  só o de gravação dos comandos do Canvas 2D na CPU.

## Entrega

Branch `fix/globo-fluido` com diff revisável e números de antes e depois.

## Resultado da execução (2026-10-07)

Medido no build de produção local, com a GPU real (Intel UHD) e o
Lighthouse 13.5 contra o Chrome do sistema. A `main` foi medida nas mesmas
condições.

| Medida                                | `main`                     | `fix/globo-fluido`         |
| ------------------------------------- | -------------------------- | -------------------------- |
| Trocas de degrau (1853×927)           | 4 em 25 s (d1→d0→d1→d2→d1) | 1 em 60 s (subida aos 5 s) |
| Trocas de degrau (1440×900, DPR 2)    | 0 em 45 s (preso em d1)    | 1 em 60 s (subida aos 5 s) |
| Custo do quadro                       | 7,2 ms (d1, ⅔ dos anéis)   | 3,5–5,0 ms (d0, completo)  |
| Chamadas de Canvas por quadro         | ~3.460 `drawImage`         | ~1.780 `drawImage`         |
| Lighthouse mobile, mediana de 3: perf | 93                         | 93                         |
| LCP                                   | 3.106 ms                   | 3.115 ms                   |
| TBT                                   | 90 ms                      | 88 ms                      |
| CLS                                   | 0                          | 0                          |
| JS transferido                        | 216.963 B                  | 218.145 B                  |
| Acessibilidade                        | 100                        | 100                        |

Toda troca de degrau passa pelo mecanismo de presença (fade de 0,9 s),
então nenhum anel some num quadro. Um resize mantém o mesmo texto nos mesmos
anéis (conferido por captura no modo estático). O celular (Pixel 7 emulado)
anima a 59,8 fps com 1,4 ms por quadro. O SwiftShader, o Firefox headless
(renderização por software) e o movimento reduzido continuam no quadro
estático.
