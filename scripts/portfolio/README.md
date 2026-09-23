# Preparação e manutenção das mídias dos cases

Underground PB e Festival Alumiô possuem estudos publicados e capturas autorizadas.
Em 22/09/2026, o responsável também autorizou a inclusão de Goromax e do projeto próprio Carlos Ferrer, além da atualização
periódica das capturas. Isso permite preparar novas imagens, mas não publicar
alterações automaticamente nem atribuir à Byte um escopo ainda não confirmado.

Execute os comandos na raiz do repositório, com Node 24, dependências instaladas e
Chrome disponível (padrão local). No Linux/CI, instale o Chromium com
`npx playwright install --with-deps chromium` e defina
`CASE_CAPTURE_BROWSER_CHANNEL=chromium`. O navegador usa um contexto novo por página, sem sessões
pessoais salvas. O script abre apenas as URLs indicadas, não envia formulários e
não segue os links externos exibidos nas páginas.

```sh
# Confere a seleção sem abrir navegador nem produzir arquivos.
node scripts/portfolio/refresh.mjs --dry-run

# Atualiza os quatro projetos, sempre para revisão local.
CASE_CAPTURE_CONSENT=necessary-only node scripts/portfolio/refresh.mjs

# Ou seleciona apenas um projeto.
CASE_CAPTURE_CONSENT=necessary-only node scripts/portfolio/refresh.mjs goromax
```

A escolha de cookies é explícita e registrada por captura. Se o banner não oferecer
“Apenas necessários”, a captura falha; revise o site e escolha `reject` quando essa
opção estiver disponível. Não use aceitação silenciosa como fallback.

Cada execução gera uma pasta exclusiva em
`docs/research/captures/staging/<data-hora>-<slug>-<id>/`, ignorada pelo Git. Ela
contém PNGs de viewport e, quando habilitada, página inteira, `manifest.json` com origem, URL final,
data, dimensões, consentimento e avisos dispensados, além de `review.json` com
versão do navegador, falhas e estado `pending-manual-review`.

Nenhuma execução substitui `src/assets` ou `public/cases`. Há código de saída
não zero em falhas; resultados parciais também ficam pendentes de revisão. Páginas
com HTTP de erro não viram capturas válidas. Duas URLs que gerariam o mesmo nome
de arquivo são recusadas antes da captura.

Para uma seleção editorial diferente, preserve o comando específico:

```sh
CASE_CAPTURE_CONSENT=necessary-only node scripts/portfolio/capture.mjs underground-pb \
  https://www.undergroundpb.com.br/ \
  https://www.undergroundpb.com.br/palcos/
```

Veja [cadência e checklist de promoção manual](../../docs/portfolio-captures.md).
Os registros de seleção estão em `underground-pb.md`, `festival-alumio.md` e
`goromax.md` e `carlos-ferrer.md`. Para conferir o inventário histórico e arquivos publicados:

```sh
node scripts/portfolio/media-inventory.mjs
# Outra cópia local pode conter os PNGs históricos ignorados pelo Git:
node scripts/portfolio/media-inventory.mjs /caminho/para/byte-criativo-website
```

O inventário não promove capturas nem redefine a autorização dos projetos.

## Restrição para artifacts remotos

A rotina `refresh.mjs` sempre desativa capturas de página inteira para Carlos
Ferrer, cujo rodapé contém contato pessoal. O workflow desativa página inteira
para todos os sites (`CASE_CAPTURE_FULL_PAGE=false`) e também exclui qualquer
`*-full.png` do upload, como defesa adicional. Somente viewports e relatórios são
gerados/enviados pela execução agendada. Ainda é necessário revisar o conteúdo
visível das viewports, pois os sites podem mudar.

O comando específico `capture.mjs` mantém página inteira habilitada por padrão
para inspeção local. Aceita apenas `CASE_CAPTURE_FULL_PAGE=true` ou `false`.
Não envie masters históricos de página inteira do site pessoal para artifacts
remotos ou para o repositório.
