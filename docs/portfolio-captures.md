# Capturas do portfólio

Atualizadas em 11/09/2026 a partir dos sites públicos, com Chromium em
1440 × 900 pixels (proporção 16:10), após o carregamento das fontes e imagens.

| Projeto         | Origem                             | Arquivo em `src/assets`                |
| --------------- | ---------------------------------- | -------------------------------------- |
| Festival Alumiô | https://www.festivalalumio.com.br/ | `case-festival-alumio-screenshot.webp` |
| Underground PB  | https://www.undergroundpb.com.br/  | `case-undergroundpb-screenshot.webp`   |

As imagens mostram o início das páginas, sem montagens ou conteúdo gerado.
No Underground PB, os avisos de cookies e novidades foram dispensados pelos
controles do próprio site. A captura mostra o destaque Obsession Fest vigente
na data da consulta; o site pode apresentar outros eventos posteriormente.

Conversão para WebP com Sharp, qualidade 88 e esforço 6, sem redimensionamento.
Os arquivos têm aproximadamente 101 KiB (Alumiô) e 128 KiB (Underground PB).
O componente `next/image` gera as versões responsivas servidas pelo site.

Os projetos são definidos em `src/content/pages.ts` e exibidos em `/portfolio`;
não há páginas individuais de projetos. O Underground PB também usa a mesma
capa na seção `#cases` da página inicial. O PNG anterior foi preservado como
arquivo histórico, sem referências na aplicação.

As descrições refletem o conteúdo observado. Categorias editoriais substituem
as etiquetas técnicas anteriores do Underground PB, pois a inspeção pública
não comprova a tecnologia de implementação ou o funcionamento como PWA.
