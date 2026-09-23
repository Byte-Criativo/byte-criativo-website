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
