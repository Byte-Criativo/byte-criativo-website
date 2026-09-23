# Evolução do site — setembro de 2026

Implementação local na branch `refine/software-house`, baseada na `origin/main`
publicada (`6761cf6`). Sem push, deploy, merge ou alteração de serviços externos.
As alterações não commitadas da `main` local foram preservadas em seu worktree.

## Diagnóstico anterior à implementação

### Problemas comprovados

- **P0 — marca:** o layout passava um `span` com “byte criativo;” ao cabeçalho.
  Nenhuma imagem oficial era renderizada. O arquivo `public/logoByte.png`
  estava disponível, com 3535 × 647 pixels; não era problema de download,
  hidratação, opacidade ou z-index. A inspeção publicada confirmou o texto
  substituto em desktop e mobile.
- **P0 — contato:** a banda final da home e outras chamadas davam aparência
  primária tanto ao formulário quanto ao WhatsApp. A home tinha ainda um link
  redundante para “formulário completo”, sem existir um formulário resumido.
- **P1 — posicionamento:** a hero ativa não dizia “software house”. Um export
  legado continha essa expressão, mas não era usado na página atual.
- **P1 — identidade:** a marca usava laranja `#F65606`; o azul existente
  `#0B5CAD` tinha função informativa. Não foi encontrado azul oficial da Byte.
  O azul da sala Alumiô pertence ao projeto, e não foi apropriado pela Byte.
- **P1 — hierarquia:** a headline desktop ocupava cinco linhas e a home
  apresentava quatro situações de serviço, uma exclusivamente cultural.
- **P0 — tablet, encontrado no QA:** a grade editorial ativava oito colunas em
  768 px, mas os filhos só recebiam spans a partir de 1024 px. No case UPB,
  texto em células de 74 px gerava 57 px de rolagem horizontal.

### Hipóteses e limites

Não havia evidência de que a navegação desktop estivesse escondida: ela já
mostrava os destinos principais. Também não havia informação essencial
exclusiva do verso dos projetos: descrição, capacidades e links ficam fora
da interação. Não há dados para atribuir aumento de conversão às mudanças.

## O que mudou

- Marca oficial completa no header e menu, SSR, sem troca por breakpoint ou
  dependência de JavaScript. Link acessível para a home, proporção original,
  largura reservada e proteção contra compressão.
- Logo servido por `picture`: WebP lossless de 21.456 bytes e PNG original
  de 61.289 bytes como fallback, ambos com 3535 × 647 pixels. Comparação
  dos decodificados confirmou zero diferenças nos pixels visíveis e no canal
  alpha. A otimização muda a codificação, sem redesenhar ou redimensionar.
- Nomes consistentes: Projetos, Serviços, Como trabalhamos, Sobre e
  “Falar sobre meu projeto”. URLs e âncoras existentes preservadas.
- Hero com posicionamento explícito, headline mais curta, CTA laranja com
  tinta preta, apoio azul e captura real ampliada dentro do cavalete existente.
- Azul como extensão semântica da interface: links, manifesto e superfície
  de serviços. Base clara, tipografia, pontuação `;`, salas e identidades dos
  projetos preservadas.
- Três grupos na home: Sites e experiências digitais; Sistemas e produtos;
  Design e estratégia de produto. Todas as sete páginas específicas continuam.
- “Ver estudo de caso” e “Visitar site” distinguem destinos. WhatsApp é
  alternativa textual nas chamadas; a página de contato tem área de apoio
  visualmente separada do formulário.
- Grade editorial corrigida para tablet; favicon usa o MiniLogo existente.

## Integrações e conteúdo preservados

Server Action, Resend, Turnstile, proteção contra abuso, validações, estados
de envio/erro, campos, destinatário e secrets não foram alterados. Testes de
formulário usam mocks e servidor local sem credenciais de envio. Nenhum lead
foi enviado para produção nesta intervenção.

Os dois cases publicados e suas atribuições permanecem. Os três sites de
referência foram visitados. A capa atual do UPB mudou o evento em destaque;
as capturas autorizadas existentes são registros datados, não uma transmissão
ao vivo. Goromax teve escopo e inclusão confirmados pelo responsável na continuação
da revisão. O portfólio pessoal Carlos Ferrer Online foi solicitado como
projeto próprio. Ver `case-approvals.md` e a atualização abaixo. Nenhum cliente, resultado ou prova social foi inventado.

## Contraste

Os pares de tokens são verificados pela suíte, incluindo os novos pares:

| Combinação                                   |  Razão |
| -------------------------------------------- | -----: |
| Preto sobre laranja de ação                  | 6,25:1 |
| Azul sobre branco                            | 6,67:1 |
| Azul sobre superfície azul clara             | 6,07:1 |
| Texto secundário sobre superfície azul clara | 6,37:1 |
| Link azul claro sobre fundo escuro           | 7,00:1 |

Texto branco sobre esse laranja teria apenas 3,36:1; por isso a ação usa preto.
A superfície `#EEF5FC` é uma nova tonalidade de apoio, sem alegação de cor
oficial. As salas dos cases conservam seus próprios pares de tinta e fundo.

## Evidências e revisão

Capturas locais em `docs/research/captures/evolution/`, ignoradas pelo Git:

- `before/`: site publicado, 1440 × 1000 e 390 × 844, oito páginas, menu e
  formulário. Capturas com fontes carregadas, movimento reduzido e escala 1.
- `after/`: mesmas condições no build local; inclui relatório responsivo.
- `performance/`: relatórios Lighthouse de builds locais anterior e novo.

As diferenças são revisadas visualmente; nenhum snapshot foi aprovado
automaticamente. A disponibilidade de Turnstile na produção e sua ausência
no ambiente local de teste são registradas como diferença de configuração.

## Validações executadas

- Formatação, ESLint, TypeScript e build de produção: aprovados.
- Vitest: **888 testes em 82 arquivos**, aprovados.
- Playwright: **81 testes** nos projetos Chromium, WebKit e mobile, aprovados.
  Após a otimização final do logo/CSS, os **24 testes de marca e navegação**
  nesses projetos foram repetidos e aprovados.
- Contrato HTTP: **23 testes**, aprovados; rotas, redirecionamentos, headers,
  canonicals, sitemap e robots preservados.
- Revisão de oito rotas em desktop/mobile, incluindo os dois cases. Larguras
  360, 390, 768, 1024, 1440 e 1920 px; inspeções adicionais em 320 e 640 px.
  Logo carregado, proporção natural, menu por teclado, Escape, retorno de foco,
  rolagem, navegação entre rotas e ausência de JavaScript verificados.
- Sem rolagem horizontal nem erros de console nas rotas inspecionadas.
  Axe adicional em contato e nos dois cases em 768 px: zero violações detectadas.
  A análise automatizada não equivale a certificação completa de WCAG.
- **Firefox não validado:** falhou antes de abrir páginas neste macOS, com
  erros de sandbox/LaunchServices/GPU. Foram tentadas inicializações headed e
  headless; nenhum teste de página foi declarado aprovado nesse navegador.
  Executar a suíte Firefox em ambiente compatível antes de publicar.
- Viewports reduzidos simularam espaço disponível com ampliação, mas não houve
  teste de zoom nativo do navegador nem de dispositivo físico.
- Nenhum envio real de formulário foi executado. Sucesso e falhas do provedor
  foram exercitados com mocks; integrações externas não foram reconfiguradas.

### Desempenho de laboratório

Lighthouse 12.6.1 / LHCI 0.15.1, cinco execuções por rota em cada build local,
viewport mobile 412 × 823, DPR 1, RTT simulado 150 ms, rede 1638,4 kbps e CPU
4×. Mesma máquina, servidor de produção Next.js e configuração sem secrets.
A linha de base usa o código anterior à evolução; as capturas visuais anteriores
usam o site publicado. Os números abaixo são medianas independentes por métrica.

| Página  | LCP antes → depois | TBT antes → depois | CLS   | Performance antes → depois |
| ------- | ------------------ | ------------------ | ----- | -------------------------- |
| Home    | 3456 → 3608 ms     | 4 → 11 ms          | 0 → 0 | 91 → 90                    |
| Contato | 2462 → 2617 ms     | 9 → 9,3 ms         | 0 → 0 | 98 → 97                    |

Acessibilidade Lighthouse: 100 em ambas as rotas, antes e depois. Os budgets
existentes passaram na agregação `median-run`, sem alterar limites (LCP
3800 ms, TBT 150 ms, CLS 0,05). Houve aumento de aproximadamente 150 ms no
LCP e 25 KB transferidos por página com a marca real e a apresentação nova.
O logo foi convertido sem perdas e o CSS de navegação incorporado ao CSS
principal para reduzir custo; a diferença restante é registrada, não ocultada.

Esses resultados não comprovam LCP de campo ≤ 2,5 s nem INP ≤ 200 ms no p75.
Não há amostra de campo nova, e Turnstile/serviços externos não participaram
nessa medição local. Relatórios brutos e `performance/summary.json` ficam
na pasta de evidências. Nos recortes isolados de seções, o cabeçalho foi
ocultado apenas durante a captura nos dois lados, evitando uma sobreposição
artificial do sticky; as capturas de viewport mostram o cabeçalho real.

## Arquivos centrais

- `src/components/patterns/brand-logo.tsx`, `site-header.tsx`, `mobile-nav.tsx`:
  marca e navegação compartilhadas.
- `src/app/(site)/layout.tsx`, `_components/home-*.tsx` e `contato/page.tsx`:
  composição e hierarquia de contato.
- `src/content/home.ts`, `site.ts`, `services.ts`, `pages.ts` e `schema.ts`:
  mensagens e agrupamentos, sem alterar URLs.
- `src/styles/tokens.json`, `navigation.css` e `src/app/globals.css`:
  tokens semânticos, proporções e carregamento dos estilos.
- `src/components/patterns/editorial-layout.tsx`: correção da grade em tablet.
- `e2e/brand-navigation.spec.ts`: regressões de marca, navegação e responsividade.

## Como visualizar

Servidor de revisão: `http://localhost:3100`.

Galeria comparativa local: `http://127.0.0.1:3102`. O arquivo está em
`docs/research/captures/evolution/index.html`, junto às capturas ignoradas pelo Git.

Para reiniciar a partir deste worktree, use Node 24:

```sh
npm ci
npm run dev -- --port 3100
```

Não é necessário copiar secrets de produção para revisar o layout. O envio
local cai no tratamento de falha e no contato alternativo. Para validar
sucesso, os testes unitários simulam o provedor e a verificação de segurança.

## Próximos passos fora desta entrega

1. Aprovar visualmente a evolução local e validar Firefox em ambiente compatível
   antes de abrir publicação/merge.
2. Revisar visualmente os dois novos cases antes da publicação.
3. Atualizar periodicamente capturas datadas dos cases, com revisão editorial.
4. Avaliar dados reais de conversão e Core Web Vitals após publicação aprovada,
   respeitando consentimento. Lighthouse de laboratório não comprova INP de campo.

## Continuação autorizada — quatro projetos

O responsável confirmou o escopo da GOROMAX (desenvolvimento, design, UI/UX,
identidade e conteúdo para a banda) e solicitou Carlos Ferrer Online como
projeto próprio de currículo e portfólio. Os dois foram incluídos no catálogo,
rodapé, sitemap e rotas locais. A home mantém os dois destaques existentes.
A navegação de cases agora percorre os vizinhos em ordem, sem voltar sempre
ao primeiro projeto.

As 14 capturas selecionadas dos quatro sites foram recapturadas em 22/09/2026
e revisadas visualmente. Os derivados AVIF e as capas WebP compartilham os
mesmos masters. As telas do site pessoal não incluem seu e-mail pessoal.
As sobreposições do selo de data e os rótulos cortados no mapa do Underground
PB pertencem ao site de origem; a captura os preserva, sem retoque. Datas das
observações técnicas antigas foram mantidas como registros históricos.

A rotina mensal de captura prepara candidatos para revisão, sem substituir
imagens ou publicar automaticamente. Enquanto o workflow permanecer apenas
local, nenhum agendamento remoto está ativo.

### Validação da inclusão dos dois novos projetos

- Typecheck, lint, formatação e build aprovados; as duas rotas novas são estáticas.
- 905 testes unitários aprovados. Contrato HTTP: 23 aprovados.
- Na suíte E2E, 81 cenários existentes passaram. O cenário novo falhou por
  tentar rolar cópias de imagens no diálogo fechado. O seletor foi corrigido
  para exigir exatamente a capa e as três miniaturas visíveis; os 15 testes
  de contato/cases passaram na repetição em Chromium, WebKit e mobile.
- QA dos dois novos cases em 1440, 390 e 768 px: HTTP 200, quatro imagens
  visíveis carregadas por case, nenhum overflow, erro de console ou violação
  axe detectada. Navegação Goromax → Carlos → Goromax → Alumiô verificada.
- Evidências locais: `docs/research/captures/evolution/additions/` (capturas,
  `review.json` e `navigation.json`) e `validation/cases-*.log`.
- Firefox permanece não validado neste ambiente. Nenhum envio real ou deploy.
- O workflow mensal foi inspecionado e validado localmente, mas não executado
  no GitHub; agendamento remoto ainda não ativo.

A revisão visual também identificou o ícone de ampliação sobre algumas
legendas no celular. Foi reservado espaço à direita das legendas para manter
texto e ícone separados.

Lighthouse após as novas capturas/cases: cinco execuções por rota, mesmas
condições locais. Medianas: home LCP 3149 ms, TBT 7 ms, CLS 0, performance 94;
contato LCP 2768 ms, TBT 12,5 ms, CLS 0, performance 96. Todos os budgets
existentes passaram. Relatórios em `performance/after-cases/`. As diferenças
entre rodadas são de laboratório e não demonstram melhoria de conversão ou
Core Web Vitals de campo.
