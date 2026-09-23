# Capturas do projeto próprio Carlos Ferrer — 2026-09-22

O responsável descreveu o site como seu currículo-portfólio, desenvolvido como
projeto próprio, e autorizou sua inclusão. Essa classificação deve permanecer
explícita; não se trata de um cliente externo ou de contrato comercial.

Fontes públicas: <https://www.carlosferrer.online/> e `/1997`, acessível pela
navegação de épocas do próprio site. Capturas em Chrome, 1440×900 (DPR 2) e 390×844
(DPR 3), tema claro, movimento reduzido. Masters e manifesto desta rodada:

`docs/research/captures/staging/2026-09-22T18-01-31-970Z-carlos-ferrer-rUDjgi/`

O script gerou oito PNGs (viewport e página inteira das duas rotas/larguras), sem
falhas. Os derivados selecionados foram revisados visualmente e incorporados à implementação local, sem publicação.

| Destino                                         | Master          | Origem      |
| ----------------------------------------------- | --------------- | ----------- |
| `src/assets/case-carlos-ferrer-screenshot.webp` | `home-1440.png` | Home        |
| `public/cases/carlos-ferrer/home-1440.avif`     | `home-1440.png` | Home        |
| `public/cases/carlos-ferrer/home-390.avif`      | `home-390.png`  | Home mobile |
| `public/cases/carlos-ferrer/era-1997-1440.avif` | `1997-1440.png` | Época 1997  |

A página inteira inclui contato pessoal. Os masters locais são ignorados pelo
Git: não promova capturas com endereço pessoal, campos preenchidos ou outros
dados privados ao repositório público. Prefira o enquadramento de viewport limpo,
revisando também as versões mobile antes da conversão.

Bytes e SHA-256 dos derivados aparecem em `node scripts/portfolio/media-inventory.mjs`.
A [rotina mensal](../../docs/portfolio-captures.md) não publica automaticamente.

## Derivados revisados em 22/09/2026

Promovidos somente ao worktree após revisão visual. Sem deploy ou merge.

| Arquivo                                         | Dimensões  | Bytes | SHA-256                                                            |
| ----------------------------------------------- | ---------- | ----: | ------------------------------------------------------------------ |
| `src/assets/case-carlos-ferrer-screenshot.webp` | 1440 × 900 | 37934 | `fe7a70edd1434c4ea30ff9a53ea5ee9cc4df583c254d3a221f0119deb2f944d9` |
| `public/cases/carlos-ferrer/home-1440.avif`     | 1440 × 900 | 30086 | `10f3169b182b492f437c551b78cfe8d8acd0cfa5a546b9885d29b17fb2fee4f0` |
| `public/cases/carlos-ferrer/home-390.avif`      | 390 × 844  | 17180 | `391e4413815c4ed766c765378d3668922b5bfdb65e065fcc20835f4cc47d1245` |
| `public/cases/carlos-ferrer/era-1997-1440.avif` | 1440 × 900 | 47006 | `f2d05647689c34650cd2549f7cde3060b720003fd30cbfc54ff558ddb688801d` |

Origem, data UTC de captura e master de cada derivado constam em
[`selection-2026-09-22.json`](selection-2026-09-22.json).
