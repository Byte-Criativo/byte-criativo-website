# Capturas do portfólio

## Origem e autorização

As imagens são capturas reais dos sites públicos, sem interfaces inventadas ou
montagens. Underground PB e Festival Alumiô já possuem estudos de caso publicados
em `/portfolio/underground-pb` e `/portfolio/festival-alumio`, definidos em
`src/content/cases.ts`. As capas e cards também são definidos em
`src/content/pages.ts`.

O responsável autorizou as capturas selecionadas desses dois projetos e, em
22/09/2026, autorizou incluir Goromax, seu projeto próprio Carlos Ferrer e atualizar periodicamente as capturas. Essa
autorização não permite presumir autoria de marcas, fotografias, ilustrações ou
conteúdo, nem resultados comerciais. O escopo da Byte deve continuar apoiado nas
confirmações registradas em `docs/content/` e `docs/case-approvals.md`.

| Projeto                         | Origem                               | Registro de seleção                                          |
| ------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| Underground PB                  | <https://www.undergroundpb.com.br/>  | [Mídias e contexto](../scripts/portfolio/underground-pb.md)  |
| Festival Alumiô                 | <https://www.festivalalumio.com.br/> | [Mídias e contexto](../scripts/portfolio/festival-alumio.md) |
| Goromax                         | <https://www.goromax.com.br/>        | [Mídias e contexto](../scripts/portfolio/goromax.md)         |
| Carlos Ferrer (projeto próprio) | <https://www.carlosferrer.online/>   | [Mídias e contexto](../scripts/portfolio/carlos-ferrer.md)   |

As capturas são registros datados. Cartazes, agenda, lançamentos e outros conteúdos
podem mudar; uma captura histórica não deve ser apresentada como programação atual.

## Cadência proposta

Revisar mensalmente, começando em outubro de 2026, e também após uma alteração
visual relevante nos sites de origem. A pessoa responsável pelo portfólio executa
o comando e registra a revisão. O workflow `.github/workflows/portfolio-captures.yml` prepara candidatos no dia 1
de cada mês, às 12h UTC (9h de Fortaleza), e permite execução manual por
`workflow_dispatch`. Usa apenas permissões de leitura, nenhum secret e o Chromium
instalado pelo Playwright; não abre issues nem envia mensagens. As capturas ficam
em artifacts por sete dias, inclusive quando há falha parcial, para revisão humana.

**O agendamento ainda está inativo enquanto esta implementação permanecer local.**
Ele só passa a ser executado depois que a mudança aprovada chegar à branch padrão.
Não há serviço pago, publicação automática nem cópia de artifacts para o site.
Resultados revisados devem ser baixados antes de expirar; não use artifacts como
único arquivo histórico de uma seleção aprovada.

```sh
node scripts/portfolio/refresh.mjs --dry-run
CASE_CAPTURE_CONSENT=necessary-only node scripts/portfolio/refresh.mjs
```

Para revisar somente Goromax, acrescente `goromax` ao último comando. As rotas
cadastradas são home e `/1997` do projeto próprio Carlos Ferrer; home e imprensa do Goromax; home, agenda e palcos do Underground
PB; home, programação e circuito do Festival Alumiô. Nenhum link externo é seguido
e nenhum formulário é enviado.

O script salva candidatos em `docs/research/captures/staging/`, numa pasta nova
por execução. O manifesto identifica data, URL original e final, status HTTP,
viewport, densidade, cookies e avisos dispensados. `review.json` registra falhas e
permanece em `pending-manual-review`. Não há cópia automática para arquivos servidos
pelo site. As capturas originais são ignoradas pelo Git.

## Condições comparáveis

Chrome local ou Chromium no CI (identificado em `review.json`), português brasileiro, fuso America/Fortaleza, tema claro e
movimento reduzido. Desktop em 1440 × 900, DPR 2; mobile em 390 × 844, DPR 3.
Fontes são aguardadas e o script percorre a página para disparar imagens com
carregamento tardio. Capturas de página inteira usam densidade 1 para evitar
limites de textura em páginas longas. Registre a versão efetiva do navegador e
compare imagens produzidas com a mesma viewport e condições.

Somente controles explícitos de cookies e avisos conhecidos são usados. Um banner
sem escolha compatível exige revisão; não deve ser apagado com CSS para esconder
um estado não registrado. Conteúdo dinâmico, mídia de terceiros e carrosséis ainda
exigem inspeção visual.

## Revisão e promoção manual

1. Confira código de saída, `review.json` e todos os itens do manifesto. Falhas ou
   páginas de manutenção/login/bloqueio impedem promover a imagem afetada.
2. Abra desktop e mobile lado a lado com a versão vigente. Verifique carregamento
   de imagens, fontes, enquadramento, banners, imagens cortadas e conteúdo sensível.
3. Escolha somente telas coerentes com o escopo comprovado da Byte. Identifique
   materiais novos de terceiros que precisem de crédito ou cuja autorização não
   esteja coberta. Remova conteúdo privado antes de qualquer incorporação.
4. Converta a seleção com Sharp, respeitando proporção e dimensões de saída. Para
   os padrões existentes: capas WebP, qualidade 88/esforço 6; mídia de case AVIF,
   qualidade 65. Compare visualmente os derivados e evite ampliar imagens.
5. Copie **manualmente** apenas os derivados aprovados para `src/assets` e/ou
   `public/cases/<slug>`. Atualize importações, dimensões, alt, legendas, data e o
   registro em `scripts/portfolio/<slug>.md` quando necessário.
6. Registre origem, data UTC, dimensões, bytes e SHA-256 dos derivados. Preserve os
   originais na pasta datada e não confunda a data de revisão com a de captura.
7. Revise a apresentação local na home, portfólio e case em desktop/mobile; execute
   os checks afetados e confirme que rotas, crédito, acessibilidade e desempenho
   não regrediram. Uma troca de imagem não autoriza atualizar snapshots sem olhar.
8. Leve a mudança para revisão e aprovação antes de publicar. A rotina não faz
   commit, push, merge, deploy ou edição em produção.

Registre cada rodada no documento do projeto: data da revisão, pasta/manifesto,
seleção aprovada ou mantida, motivo, responsável e referência da mudança quando
existir. Se nada relevante mudou, mantenha a mídia atual e registre a conferência.

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

## Seleção incorporada nesta rodada

Em 22/09/2026, foram revisados e incorporados somente ao worktree quatro capas
WebP e 14 imagens AVIF. O [inventário da seleção](../scripts/portfolio/selection-2026-09-22.json)
registra dimensões, bytes, SHA-256, URL de origem, master e data UTC de captura de
cada derivado. Os registros dos projetos detalham a seleção e preservam o histórico
anterior. Essa promoção local não constitui publicação em produção.
