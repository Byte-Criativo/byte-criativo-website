# Preparação das mídias dos cases

Os dois cases continuam em `review`, com `permissions.cleared: false`. As
capturas reais selecionadas para cada estudo estão em `public/cases/` e são
referenciadas por `src/content/cases.ts`. A autorização para preparar e usar
essas capturas não fecha a revisão D5 do texto, dos créditos e dos elementos
de terceiros; as páginas individuais seguem fora da publicação.

Para conferir fontes, dimensões, tamanho, SHA-256, URL e data de captura:

```sh
node scripts/portfolio/media-inventory.mjs
```

Se as capturas estão em outra cópia local do repositório, passe a raiz dela:

```sh
node scripts/portfolio/media-inventory.mjs /caminho/para/byte-criativo-website
```

O inventário sai em JSON na saída padrão, sem copiar mídia. A capa WebP de
cada projeto já está em `src/assets` e foi documentada em
`docs/portfolio-captures.md`. As origens, datas, dimensões e observações da
seleção atual estão em `scripts/portfolio/festival-alumio.md` e
`scripts/portfolio/underground-pb.md`. Os PNGs-mestre ficam em
`docs/research/captures/` na cópia local e são ignorados pelo Git.

Para recapturar depois da decisão editorial sobre data, tema, estado e cookies,
use o script existente com as URLs aprovadas. Se aparecer um banner conhecido,
o script exige uma escolha explícita e registra `consentAction` no manifesto:

```sh
CASE_CAPTURE_CONSENT=necessary-only node scripts/portfolio/capture.mjs underground-pb \
  https://www.undergroundpb.com.br/ \
  https://www.undergroundpb.com.br/palcos/
```

As capturas vão para `docs/research/captures/YYYY-MM-<slug>/` e permanecem
fora do Git. Antes de publicar as páginas dos cases, conferir os créditos,
autorizações e alegações nas fichas em `docs/content/cases/*.md`.
