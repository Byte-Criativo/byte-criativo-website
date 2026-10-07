# Capturas do Goromax — 2026-09-22

O responsável autorizou a inclusão do site e confirmou desenvolvimento, design
UI/UX, identidade e conteúdo realizados pela Byte para a banda Goromax. Ver o
registro editorial em `docs/case-approvals.md`. Não atribuir métricas comerciais
nem inferir serviços adicionais a partir das capturas.

Fontes públicas conferidas: <https://www.goromax.com.br/> e o link `/imprensa`
presente na home. Capturas em Chrome, 1440×900 (DPR 2) e 390×844 (DPR 3), tema
claro, movimento reduzido. O manifesto identifica o horário UTC de cada imagem e
os estados de consentimento. Os masters desta rodada estão em:

`docs/research/captures/staging/2026-09-22T17-58-34-474Z-goromax-pcbeza/`

A rodada gerou oito PNGs (viewport e página inteira de cada rota/largura), sem
falhas. As imagens selecionadas foram revisadas visualmente e seus derivados incorporados à implementação local, sem publicação.

Seleção incorporada à implementação local:

| Destino                                   | Master              | Origem      |
| ----------------------------------------- | ------------------- | ----------- |
| `src/assets/case-goromax-screenshot.webp` | `home-1440.png`     | Home        |
| `public/cases/goromax/home-1440.avif`     | `home-1440.png`     | Home        |
| `public/cases/goromax/imprensa-1440.avif` | `imprensa-1440.png` | Imprensa    |
| `public/cases/goromax/home-390.avif`      | `home-390.png`      | Home mobile |

Bytes e SHA-256 dos derivados podem ser conferidos com
`node scripts/portfolio/media-inventory.mjs`. A capa representa a interface do
site nessa data; fotos, lançamentos e agenda não são uma fonte atualizada ao vivo.

A [rotina mensal](../../docs/portfolio-captures.md) gera novos candidatos e não
substitui arquivos aprovados nem publica automaticamente.

## Derivados revisados em 22/09/2026

Promovidos somente ao worktree após revisão visual. Sem deploy ou merge.

| Arquivo                                   | Dimensões  |  Bytes | SHA-256                                                            |
| ----------------------------------------- | ---------- | -----: | ------------------------------------------------------------------ |
| `src/assets/case-goromax-screenshot.webp` | 1440 × 900 | 168736 | `164fbb83639cb6d99d3b1c67ee10e2e7bbd05501b689495fe401f9124cc5126e` |
| `public/cases/goromax/home-1440.avif`     | 1440 × 900 | 142950 | `655c6f8086d430301ccede848cf6713cfb7f9117810588dc0fd66f7c89f52ea7` |
| `public/cases/goromax/imprensa-1440.avif` | 1440 × 900 |  61846 | `027c9633d7f4fddc102a270aa25a7047fc4d4fa2b63129ae7c0dc75eca82e651` |
| `public/cases/goromax/home-390.avif`      | 390 × 844  |  40438 | `db03fdff5013982ca52a12c73d0f7ca562be0858b4c3e97da67e3db1847d1674` |

Origem, data UTC de captura e master de cada derivado constam em
[`selection-2026-09-22.json`](selection-2026-09-22.json).

## Rodada de 07/10/2026 (Frente das salas no celular)

Objetivo: mostrar a home do projeto no celular na Frente da sala, abaixo de
`sm` (30rem), no lugar da captura desktop reduzida. Só a home foi capturada,
com `CASE_CAPTURE_CONSENT=necessary-only` e `CASE_CAPTURE_FULL_PAGE=false`,
em Chrome 155.0.8059.39: 1440×900 (DPR 2) e 390×844 (DPR 3), HTTP 200 nas
duas. Masters, `manifest.json` e `review.json` (sem falhas) em
`docs/research/captures/staging/2026-10-07T18-57-12-401Z-goromax-0jO7FS/`.
Nenhum banner apareceu (`consentAction: none`); nenhum modal ou dado pessoal.

- **Recorte do celular:** topo de 390×545 CSS (1170×1635 no master), sem
  retoque nem composição.
- **O que está visível:** no celular, a fotografia da banda enquadrada numa
  integrante diante de parede descascada, a linha "Metal · Stoner · Da
  Paraíba" e o logotipo GOROMAX laranja.
- **Peso:** o 1170 w passou do teto de ~120 KB em qualidade 88 (185552 B);
  baixou em passos de 2 até o piso de 80 e ficou em 121714 B, 1,4% acima do
  teto. O 780 w tinha saído em qualidade 88 com 109978 B, quase o peso do
  1170 w; foi regerado em qualidade 80, a partir do mesmo recorte PNG sem
  perdas, e ficou com 72490 B. O de qualidade 88 ficou só no staging
  (`case-goromax-celular-780.q88.webp`).
- **Desktop mantido:** a nova captura desktop só difere no menu do site e o
  WebP dela pesaria 250094 B (+48% sobre os 168736 B atuais), então
  `case-goromax-screenshot.webp` não mudou e o derivado desktop desta rodada
  não foi promovido.

Derivados promovidos ao worktree (WebP, esforço 6; sem deploy ou merge):

| Arquivo                                     | Dimensões   |  Bytes | Qualidade | SHA-256                                                            |
| ------------------------------------------- | ----------- | -----: | --------: | ------------------------------------------------------------------ |
| `src/assets/case-goromax-celular-780.webp`  | 780 × 1090  |  72490 |        80 | `0c99dabfd164fc3a4faceeec7d9cfc3b047ff2fbfbbe8bbc2eac97fc34d3d7f9` |
| `src/assets/case-goromax-celular-1170.webp` | 1170 × 1635 | 121714 |        80 | `dc62e2d9da8608caccfce28267dead12e2f19716958f9aa989ba15351e7c0dc3` |

Origem, master e data UTC de cada derivado constam em
[`selection-2026-10-07.json`](selection-2026-10-07.json). Revisão visual
aprovada no portão da rodada; a publicação depende do ok do responsável.
