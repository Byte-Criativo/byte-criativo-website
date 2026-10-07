# Mídias do case Festival Alumiô

## Rodada de atualização de 22/09/2026

Novas capturas em `docs/research/captures/staging/2026-09-22T18-02-01-295Z-festival-alumio-buZZ42/`,
com `manifest.json` e `review.json`: 12 PNGs, seis de viewport e seis de página
inteira, sem falhas. A seleção foi revisada visualmente e os derivados foram incorporados à implementação local, sem publicação.
O inventário aponta para esses novos masters; os bytes/SHA-256 dos derivados
refletem os arquivos que efetivamente existem em `src/assets` e `public/cases`.

## Seleção anterior (registro histórico)

Seleção de capturas reais do site `festivalalumio.com.br`, feitas em 2026-09-16
e registradas no manifesto local `docs/research/captures/2026-09-alumio/manifest.json`.
Os arquivos AVIF são derivados sem alteração visual além de redimensionamento e
compressão (Sharp, qualidade 65). A captura retrata o estado do site nessa data,
inclusive a indicação de que a agenda era parcial; não representa o estado atual.

| Arquivo                 | Página de origem                                | Captura (UTC)       | Dimensão |  Bytes |
| ----------------------- | ----------------------------------------------- | ------------------- | -------: | -----: |
| `home-1440.avif`        | `https://www.festivalalumio.com.br/`            | 2026-09-16 22:34:52 | 1440×900 | 56.429 |
| `programacao-1440.avif` | `https://www.festivalalumio.com.br/programacao` | 2026-09-16 22:35:08 | 1440×900 | 40.609 |
| `circuito-1440.avif`    | `https://www.festivalalumio.com.br/circuito`    | 2026-09-16 22:35:21 | 1440×900 | 45.599 |
| `programacao-390.avif`  | `https://www.festivalalumio.com.br/programacao` | 2026-09-16 22:35:14 |  390×844 | 21.229 |

As três capturas desktop mostram a identidade da home, os controles da
programação e a apresentação do circuito. A captura mobile mostra a mesma
programação na navegação estreita. A tela de memória foi excluída da seleção
porque inclui fotografia de pessoas. As quatro capturas escolhidas ainda contêm
marca e ilustrações do festival, autorizadas pelo responsável para as capturas selecionadas. A Byte realizou
apenas o site; a autoria dos demais elementos não deve ser atribuída à Byte.

## Derivados revisados em 22/09/2026

Promovidos somente ao worktree após revisão visual. Sem deploy ou merge.

| Arquivo                                              | Dimensões  | Bytes | SHA-256                                                            |
| ---------------------------------------------------- | ---------- | ----: | ------------------------------------------------------------------ |
| `src/assets/case-festival-alumio-screenshot.webp`    | 1440 × 900 | 82822 | `ddcd985aafce822d6f6aac75f3f5efb671dc8d51c1da1e32fc4377677f4af727` |
| `public/cases/festival-alumio/home-1440.avif`        | 1440 × 900 | 57977 | `383b472a275ac37ff2eda24e6e9f823902c20277ea3debddc7bc1371daa45b98` |
| `public/cases/festival-alumio/programacao-1440.avif` | 1440 × 900 | 41330 | `29c3b678b768c9bfc4c8e2f62259f1c17a30cf5574855d309f0b356c3680aec2` |
| `public/cases/festival-alumio/circuito-1440.avif`    | 1440 × 900 | 47323 | `89dd64f7993416fbfc912a67e3c2be2c2d156326bd4f7eb2bc1454f4b176422f` |
| `public/cases/festival-alumio/programacao-390.avif`  | 390 × 844  | 22128 | `2dc6b4774130a1bbffea98e60c1955b1a7d853489b8993cada6daf6854273c91` |

Origem, data UTC de captura e master de cada derivado constam em
[`selection-2026-09-22.json`](selection-2026-09-22.json).

## Rodada de 07/10/2026 (Frente das salas no celular)

Objetivo: mostrar a home do projeto no celular na Frente da sala, abaixo de
`sm` (30rem), no lugar da captura desktop reduzida. Só a home foi capturada,
com `CASE_CAPTURE_CONSENT=necessary-only` e `CASE_CAPTURE_FULL_PAGE=false`,
em Chrome 155.0.8059.39: 1440×900 (DPR 2) e 390×844 (DPR 3), HTTP 200 nas
duas. Masters, `manifest.json` e `review.json` (sem falhas) em
`docs/research/captures/staging/2026-10-07T18-57-31-624Z-festival-alumio-3KXf10/`.
Nenhum banner apareceu (`consentAction: none`); nenhum modal ou dado pessoal.

- **Recorte do celular:** topo de 390×545 CSS (1170×1635 no master), sem
  retoque nem composição.
- **O que está visível:** no celular, o selo "5ª edição", o título "Vem
  alumiar o Centro.", as datas "18 · 19 · 20 setembro 2026" e o local
  (Centro Histórico, João Pessoa). A ilustração dos casarios não aparece no
  recorte, por isso a legenda da sala deixou de citá-la.
- **Desktop mantido:** a captura desktop de 22/09 continua igual à home de
  07/10 (mesmo título, datas e ilustração), então
  `case-festival-alumio-screenshot.webp` não mudou.

Derivados promovidos ao worktree (WebP, esforço 6; sem deploy ou merge):

| Arquivo                                             | Dimensões   | Bytes | Qualidade | SHA-256                                                            |
| --------------------------------------------------- | ----------- | ----: | --------: | ------------------------------------------------------------------ |
| `src/assets/case-festival-alumio-celular-780.webp`  | 780 × 1090  | 57918 |        88 | `387eb597257279cda9c1b8058c28b3c9b90421557f847ce13b46473612ab7da1` |
| `src/assets/case-festival-alumio-celular-1170.webp` | 1170 × 1635 | 89484 |        88 | `c9d2a2174a4d9b46993c078162a14f3286a1f4662ce5ac0a19720e5502a36fcd` |

Origem, master e data UTC de cada derivado constam em
[`selection-2026-10-07.json`](selection-2026-10-07.json). Revisão visual
aprovada no portão da rodada; a publicação depende do ok do responsável.
