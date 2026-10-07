# Capturas do Underground PB — 2026-09-22

## Rodada de atualização de 22/09/2026

Novas capturas em `docs/research/captures/staging/2026-09-22T18-01-10-146Z-underground-pb-uy902r/`,
com `manifest.json` e `review.json`: 12 PNGs, seis de viewport e seis de página
inteira, sem falhas. A seleção foi revisada visualmente e os derivados foram incorporados à implementação local, sem publicação.
O inventário aponta para esses novos masters; os bytes/SHA-256 dos derivados
refletem os arquivos que efetivamente existem em `src/assets` e `public/cases`.

## Seleção anterior (registro histórico)

Capturas reais do site público em 1440×900 (DPR 2) e 390×844 (DPR 3),
Chromium/Chrome, tema claro, movimento reduzido. Antes de capturar, a opção
“Apenas necessários” foi selecionada no banner de cookies e o aviso de contas
foi fechado. Os PNGs-mestre e `manifest.json` estão em
`docs/research/captures/2026-09-underground-pb/` (cópia local, fora do Git).

| Arquivo AVIF       | Página de origem                           | Dimensões |  Tamanho |
| ------------------ | ------------------------------------------ | --------: | -------: |
| `home-1440.avif`   | <https://www.undergroundpb.com.br/>        |  1440×900 | 69.533 B |
| `agenda-1440.avif` | <https://www.undergroundpb.com.br/agenda/> |  1440×900 | 55.397 B |
| `palcos-1440.avif` | <https://www.undergroundpb.com.br/palcos/> |  1440×900 | 95.412 B |
| `palcos-390.avif`  | <https://www.undergroundpb.com.br/palcos/> |   390×844 | 25.789 B |

Os AVIFs são versões redimensionadas das capturas de viewport, sem composição
ou alteração do conteúdo. A home e a agenda mostram cartazes enviados por
terceiros; a página de palcos inclui mapa e nomes de estabelecimentos. As capturas selecionadas foram autorizadas pelo responsável; os créditos e o
escopo confirmado estão registrados em `docs/case-approvals.md`. Os cartazes e a agenda são conteúdo mutável; as legendas devem indicar a
data da captura, sem apresentá-los como eventos atuais após essa data.

## Derivados revisados em 22/09/2026

Promovidos somente ao worktree após revisão visual. Sem deploy ou merge.

| Arquivo                                         | Dimensões  | Bytes | SHA-256                                                            |
| ----------------------------------------------- | ---------- | ----: | ------------------------------------------------------------------ |
| `src/assets/case-undergroundpb-screenshot.webp` | 1440 × 900 | 79636 | `83db5dfcb5ebfc998f77a9fe3605ef2d2a4653a69e5b62b01525c922355e5bdc` |
| `public/cases/underground-pb/home-1440.avif`    | 1440 × 900 | 59838 | `e0e36e3a73be335126b552754264b771d190e0ad21c7c5237a5e4a230caa9357` |
| `public/cases/underground-pb/agenda-1440.avif`  | 1440 × 900 | 46858 | `27134d97b1f641a2c5362a300ba5dce3170ff4bea456cc4a7735e5ad06799040` |
| `public/cases/underground-pb/palcos-1440.avif`  | 1440 × 900 | 81618 | `96b1d6f9de9ddc072920f51dca27c2ffa4229e2a9d5d488fe8305be7bc8719ca` |
| `public/cases/underground-pb/palcos-390.avif`   | 390 × 844  | 22935 | `9715f38a672b122e2606271b07c0df5b716a75593b2ea62c4f6d37596fc56bcf` |

Origem, data UTC de captura e master de cada derivado constam em
[`selection-2026-09-22.json`](selection-2026-09-22.json).

A captura conserva características do site de origem: o selo de data se sobrepõe
a parte do título e algumas etiquetas do mapa aparecem cortadas nas bordas.
Essas ocorrências foram observadas na revisão e não foram retocadas.

## Rodada de 07/10/2026 (Frente das salas no celular)

Objetivo: mostrar a home do projeto no celular na Frente da sala, abaixo de
`sm` (30rem), no lugar da captura desktop reduzida. Só a home foi capturada,
com `CASE_CAPTURE_CONSENT=necessary-only` e `CASE_CAPTURE_FULL_PAGE=false`
(viewport, sem página inteira), em Chrome 155.0.8059.39: 1440×900 (DPR 2) e
390×844 (DPR 3), HTTP 200 nas duas.

**Primeira captura reprovada:**
`docs/research/captures/staging/2026-10-07T18-57-22-481Z-underground-pb-ds6itf/`.
O banner de cookies ("Só cookies essenciais por padrão; Spotify/YouTube pedem
permissão", com "Aceitar tudo" e "Só essenciais") ficou aberto na captura e o
manifesto gravou `consentAction: none`. Causa: o `capture.mjs` usava
`.first()` e pegava o "Aceitar e carregar" oculto do player do Spotify, que
vem antes no DOM, então o banner visível passava como inexistente. O script
foi corrigido: agora filtra só ocorrências visíveis e reconhece "Só
essenciais" como escolha `necessary-only`. Nada dessa pasta foi promovido.

**Recaptura aprovada:**
`docs/research/captures/staging/2026-10-07T19-12-12-981Z-underground-pb-SXQM0B/`,
com `manifest.json` e `review.json` (sem falhas). Consentimento registrado
nas duas viewports: `consentAction: necessary-only` ("Só essenciais").
Nenhum banner, modal ou dado pessoal visível.

- **Recorte do celular:** topo de 390×505 CSS (1170×1515 no master), sem
  retoque nem composição. Termina depois dos botões "Ver evento" e "Ver
  agenda" e antes do cartaz, que começa em 511 CSS: cortar o cartaz no meio
  seria enganoso.
- **O que está visível (07/10/2026):** no celular, a barra "Apoiar a cena",
  "Hoje na cena", o título "Pogo Fest - Ano II", "10 out · 20h00", Vila do
  Porto, João Pessoa, e os botões "Ver evento" e "Ver agenda". No desktop, o
  mesmo destaque com o cartaz do Pogo Fest, o selo 10/out, a faixa "Próximos
  shows" (18/out, 13/nov e 27/nov) e "A cena é nossa".
- **Desktop trocado:** a home mudou desde 22/09 (o destaque agora é o Pogo
  Fest, em 10/10), então a capa `case-undergroundpb-screenshot.webp` da sala
  passou a ser a captura desktop desta mesma rodada. A legenda única das duas
  versões cita a data da captura, porque agenda e cartazes são conteúdo
  mutável. A capa de 22/09 (79636 B, `83db5dfc…`) fica só no histórico acima.
  `public/cases/underground-pb/**` não mudou.

Derivados promovidos ao worktree (WebP, esforço 6; sem deploy ou merge):

| Arquivo                                           | Dimensões   |  Bytes | Qualidade | SHA-256                                                            |
| ------------------------------------------------- | ----------- | -----: | --------: | ------------------------------------------------------------------ |
| `src/assets/case-undergroundpb-celular-780.webp`  | 780 × 1010  |  25792 |        88 | `43f1da8b782a96f621d5a49490960969154ba6916449839daa720079355f0734` |
| `src/assets/case-undergroundpb-celular-1170.webp` | 1170 × 1515 |  37214 |        88 | `947cc8b4a74dd4bec25c97b48d1b3aa4f87e3a99abbee4f74d0189cc628d8407` |
| `src/assets/case-undergroundpb-screenshot.webp`   | 1440 × 900  | 111282 |        88 | `b128dd27acd2776b733a7f7e87cac0bb0ded0aa2504982bc8bf8f5f2d0543625` |

Origem, master e data UTC de cada derivado constam em
[`selection-2026-10-07.json`](selection-2026-10-07.json). Revisão visual
aprovada no portão da rodada; a publicação depende do ok do responsável.
