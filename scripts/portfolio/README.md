# Preparação das mídias dos cases

Os dois cases continuam em `review`, com `permissions.cleared: false`. As
referências `/cases/.../*.avif` em `src/content/cases.ts` são alvos planejados:
os arquivos não existem em `public` e não devem ser adicionados ao Git antes
dos gates D2 (seleção das imagens) e D5 (autorização do dono e de terceiros).

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
`docs/portfolio-captures.md`. A captura original do Alumiô está em
`docs/research/captures/2026-09-alumio/` na cópia local do projeto. Faltam
arquivos-mestre de 1440 e 390 do Underground PB, além de estados e recortes
solicitados nas fichas `docs/content/cases/*.md`.

Para recapturar depois da decisão editorial sobre data, tema, estado e cookies,
use o script existente com as URLs aprovadas. Se aparecer um banner conhecido,
o script exige uma escolha explícita e registra `consentAction` no manifesto:

```sh
CASE_CAPTURE_CONSENT=reject node scripts/portfolio/capture.mjs underground-pb \
  https://www.undergroundpb.com.br/ \
  https://www.undergroundpb.com.br/palcos/
```

As capturas vão para `docs/research/captures/YYYY-MM-<slug>/` e devem
permanecer fora do Git até revisão. Antes de derivar AVIF/WebP e apontar a
galeria para cada arquivo, conferir os créditos e autorizações nas fichas dos
cases. Não usar uma mesma imagem três vezes para preencher a galeria final.
