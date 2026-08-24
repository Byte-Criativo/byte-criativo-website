# Redesign visual e comercial — Vidro Executivo (Liquid Glass Executive)

- **Data:** 2026-08-24
- **Site:** Byte Criativo (Next.js 16, Pages Router, styled-components)
- **Status:** Design aprovado — pronto para virar plano de implementação

## Objetivo

Transformar o site institucional em uma presença digital premium que aumente a
intenção de contato, orçamento e contratação. O redesign cobre direção de arte,
design system, estrutura comercial das páginas, copy, SEO técnico e on-page,
performance e acessibilidade — preservando a stack e a arquitetura de conteúdo
existentes (`src/content`, `src/lib`, seções em `src/pages/home/sections`).

## Contexto e diagnóstico (resumo)

Auditoria completa em 2026-08-24 (código + produção em `www.bcriativo.com`):

**Críticos**

1. **Domínio fantasma:** todo o SEO (`canonical`, sitemap, robots, Open Graph,
   JSON-LD) aponta para `bytecriativotech.com.br`, que não resolve DNS e **não
   pertence mais à empresa**. O site real está em `www.bcriativo.com`.
2. **SSR de CSS quebrado:** o HTML de produção não contém nenhuma tag
   `<style>` (styled-components não injeta estilos no servidor). O site
   renderiza ~2s sem estilo (FOUC), prejudicando LCP/CLS e a percepção premium.
3. **Botão primário desbotado** (salmão, contraste reprovado) em páginas
   internas como `/servicos` e `/portfolio`.

**Importantes**

4. Canibalização de SEO: `/sites-profissionais`, `/sistemas-web`,
   `/landing-pages` e `/automacao-e-integracoes` concorrem com a família
   `/servicos/[slug]` pelas mesmas keywords, com navegação inconsistente.
5. `faq.ts` tem copy antiga com clichês e promete um "formulário de
   detalhamento de projeto" que não existe no site.
6. Blog no menu principal leva a página vazia ("Em breve"); portfólio exibe
   card de placeholder.
7. Analytics: gtag GA4 direto no `_document` + `analytics.ts` empurrando
   eventos no `dataLayer` que o gtag não interpreta — conversões de WhatsApp
   não são medidas de fato. Já existe spec própria (GTM + Consent Mode v2).
8. Identidade visual genérica: Montserrat única, wash pêssego/azul, dois
   acentos concorrentes, espaço morto em seções de duas colunas, case exibido
   como logo em caixa preta em vez de interface real.

## Decisões

1. **Domínio canônico: `https://www.bcriativo.com`.** O `.com.br` foi perdido —
   não haverá redirect a partir dele; todas as referências no repositório são
   trocadas.
2. **Stack preservada.** Next.js 16 Pages Router + styled-components +
   next-seo + Vercel. Nenhuma migração de framework ou de biblioteca de estilo.
3. **Direção de arte: Vidro Executivo.** Base clara quente, quase
   monocromática, com o laranja da marca como único acento; Liquid Glass como
   camada funcional (navbar, menu mobile, banda final escura), nunca como
   textura generalizada; assinatura tipográfica derivada do logo (o `;`
   laranja encerrando headlines e labels em fonte mono).
4. **Azul `#06B2F6` aposentado** como cor de marca. Verde/vermelho ficam
   apenas funcionais (sucesso/erro).
5. **Consolidação de serviços na família `/servicos/[slug]`** com redirects
   301 das quatro páginas soltas. Automação e integrações vira o sétimo
   serviço da família.
6. **Blog sai do nav e do sitemap** até existirem pelo menos 2 posts reais.
   A rota pode permanecer.
7. **Conversão continua centrada no WhatsApp**, com um formulário curto
   (nome, empresa, o que precisa) que monta a mensagem do `wa.me` — sem
   backend. A spec de GTM + Consent Mode v2 existente é pré-requisito para
   medir essas conversões e entra no plano como fase própria.
8. **Nada de conteúdo comercial inventado:** sem depoimentos, logos de
   clientes, métricas ou avaliações fabricadas. Slots para prova social só
   entram quando houver material verificado.

## Direção de arte

### Paleta

| Token          | Valor                                           | Uso                               |
| -------------- | ----------------------------------------------- | --------------------------------- |
| `bg`           | `#FAFAF7`                                       | Fundo geral (branco quente)       |
| `surface`      | `#FFFFFF`                                       | Cartões e superfícies de conteúdo |
| `surface2`     | `#F1F1EC`                                       | Superfícies alternadas            |
| `ink`          | `#121216`                                       | Texto principal, banda escura     |
| `muted`        | `#55555E`                                       | Texto secundário                  |
| `border`       | `#E4E4DE`                                       | Bordas e réguas                   |
| `accent`       | `#F65606`                                       | Acento único (laranja da marca)   |
| `accentStrong` | `#C24405`                                       | Hover/estados do acento           |
| `accentSoft`   | `rgba(246,86,6,.10)`                            | Fundos de destaque                |
| `success`      | `#1E8F5A`                                       | Funcional                         |
| `destructive`  | `#C43B3B`                                       | Funcional                         |
| Banda escura   | `bg #121216`, `surface #1C1C21`, `text #FAFAF7` | CTA final + footer                |

### Glass (tokens próprios)

- `glass.bg`: `rgba(255,255,255,.55)`
- `glass.border`: `rgba(255,255,255,.65)`
- `glass.highlight`: `inset 0 1px 0 rgba(255,255,255,.8)`
- `glass.blur`: `16px`
- `glass.shadow`: `0 18px 44px rgba(18,18,22,.08)`
- **Fallback obrigatório:** `@supports not (backdrop-filter: blur(1px))` usa
  fundo sólido `#FFFFFFF2`. Legibilidade nunca depende do blur.
- Uso restrito: navbar, menu mobile, painéis flutuantes e destaques na banda
  escura. Superfícies de conteúdo são opacas.

### Tipografia

Todas Google Fonts (OFL), self-hosted via `next/font` (substituem Montserrat):

- **Display/headings:** Bricolage Grotesque
- **Corpo:** Instrument Sans
- **Labels/eyebrows/dados:** JetBrains Mono (maiúsculas com tracking)

Escala (com `clamp()`):

| Papel         | Tamanho                                 |
| ------------- | --------------------------------------- |
| display       | `clamp(2.5rem, 5vw + 1rem, 4.25rem)`    |
| h1            | `clamp(2.25rem, 4vw + .75rem, 3.5rem)`  |
| h2            | `clamp(1.75rem, 2.5vw + .5rem, 2.5rem)` |
| h3            | `1.375rem`                              |
| body          | `1rem`–`1.125rem`, line-height 1.6      |
| small         | `.875rem`                               |
| caption/label | `.75rem` mono                           |

### Demais tokens

- **Spacing:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (px)
- **Radius:** `sm 8` · `md 14` · `lg 22` · `pill 999` — apenas esses quatro
- **Sombras:** `soft 0 1px 2px rgba(18,18,22,.06)` ·
  `lift 0 12px 32px -12px rgba(18,18,22,.16)`
- **Motion:** `fast 120ms` · `base 200ms` · `slow 320ms`; easing
  `cubic-bezier(.32,.72,0,1)`; reveal padrão fade + `translateY(8px)`;
  `prefers-reduced-motion` desliga tudo
- **Breakpoints:** 480 · 768 · 1024 · 1280 (substituem os nove valores
  mágicos atuais)

### Assinatura visual

O ponto e vírgula laranja do logo encerra as headlines principais (`;` como
elemento tipográfico, não emoji/ícone) e as eyebrows usam JetBrains Mono em
caixa alta — eco direto do `</>` da marca. É o único lugar onde o site
"fala código"; o restante da comunicação é de negócio.

## Arquitetura de páginas

```text
/                                  Home
/servicos                          Hub de serviços
/servicos/desenvolvimento-de-sites
/servicos/sistemas-web-sob-medida
/servicos/ui-ux-design
/servicos/landing-pages
/servicos/design-de-produto
/servicos/copywriting-para-web
/servicos/automacao-e-integracoes  (novo)
/portfolio                         Case UPB expandido
/sobre
/contato

301 (next.config.mjs):
/sites-profissionais       → /servicos/desenvolvimento-de-sites
/sistemas-web              → /servicos/sistemas-web-sob-medida
/landing-pages             → /servicos/landing-pages
/automacao-e-integracoes   → /servicos/automacao-e-integracoes
```

As páginas `.page.tsx` soltas (`sites-profissionais`, `sistemas-web`,
`landing-pages`, `automacao-e-integracoes`) são removidas; o conteúdo útil
delas migra para `src/content/services.ts`. `/sobre`, `/contato` e
`/portfolio` continuam usando o componente de página de marketing,
redesenhado com os novos tokens.

## Estrutura da Home

```text
NAV       vidro fixo · logo · Início/Serviços/Portfólio/Sobre/Contato ·
          CTA "Falar sobre um projeto"
HERO      eyebrow mono · H1 com ";" laranja · subtítulo · CTA primário +
          secundário · composição abstrata derivada do </> da marca
PROVA     case Underground PB com screenshot real da interface,
          desafio → solução → resultado (conteúdo atual, layout novo)
SERVIÇOS  grid com os 7 serviços, links para /servicos/*
PROCESSO  4 passos numerados (copy atual mantida)
POR QUE   3 diferenciais verificáveis (funde as seções Cards e Trust;
          a seção Audience deixa de existir como bloco próprio)
FAQ       perguntas reescritas (alimenta o JSON-LD FAQPage)
CTA FINAL banda escura (ink) · título atual · formulário curto que monta
          a mensagem do WhatsApp · botão único
FOOTER    escuro · logo · CNPJ · contatos · nav · redes
```

## Copy aprovada

- **Menu:** Início · Serviços · Portfólio · Sobre · Contato — botão
  **Falar sobre um projeto**
- **Hero**
  - Eyebrow (mono): `software house · design e engenharia`
  - H1: **Sites e sistemas sob medida para vender mais e operar melhor;**
    (`;` em laranja)
  - Subtítulo: "A Byte Criativo planeja, desenha e desenvolve o projeto
    inteiro com o mesmo time. Você conversa direto com quem decide e escreve
    o código."
  - CTA primário: **Falar sobre meu projeto** · secundário: **Ver projetos**
- **Serviços:** títulos e descrições atuais mantidos; automação e integrações
  entra com a copy da página existente condensada.
- **Processo:** os 4 passos atuais, sem alteração.
- **Por que a Byte Criativo:**
  1. "Diagnóstico antes do código. Entendemos objetivo, público e operação
     antes de propor qualquer solução."
  2. "SEO, performance e segurança desde a base. Não são extras: entram na
     estrutura do projeto no primeiro dia."
  3. "Contato direto. Quem responde sua mensagem é quem projeta e desenvolve,
     então nada se perde no caminho."
- **FAQ (substitui `faq.ts`):**
  1. _O que a Byte Criativo desenvolve?_ — "Sites institucionais, sistemas
     web sob medida, landing pages, automações e produtos digitais. Também
     cuidamos de UI/UX e dos textos, para o projeto sair completo."
  2. _Como funciona o processo?_ — "Começamos entendendo seu objetivo e sua
     operação. Com isso definimos escopo, prazo e investimento antes de
     escrever código. Durante o desenvolvimento você acompanha as decisões, e
     depois da entrega seguimos disponíveis para evolução."
  3. _Quanto custa e quanto tempo leva?_ — "Depende do escopo. Um site
     institucional e um sistema com login e painéis são projetos muito
     diferentes. Depois da primeira conversa, você recebe uma proposta com
     valores, etapas e prazo."
  4. _Preciso ter tudo definido antes de falar com vocês?_ — "Não. Pode
     chegar com uma ideia solta ou um problema de operação. Organizar isso em
     escopo é parte do nosso trabalho."
- **CTA final:** título atual mantido; formulário de 3 campos (nome, empresa,
  o que você precisa) abre o WhatsApp com mensagem montada. Botão:
  **Enviar e abrir conversa**.
- Toda copy nova passa por revisão final de naturalidade (sem clichês de IA,
  ortografia pt-BR, keywords preservadas).

## SEO

- `SITE_URL = "https://www.bcriativo.com"` em `src/lib/seo.ts`; sitemap,
  robots, OG e JSON-LD atualizados. Sem redirect do `.com.br` (domínio
  perdido).
- Title home mantido: `Software House: Sites e Sistemas Web Sob Medida |
Byte Criativo`. H1 = headline do hero.
- Canonical sempre por página; nunca herdar o da home via default do `_app`.
- Mapa de keywords (uma página-alvo por intenção): criação de sites
  profissionais → desenvolvimento-de-sites; sistema web sob medida →
  sistemas-web-sob-medida; landing page de alta conversão → landing-pages;
  automação de processos / integração de sistemas →
  automacao-e-integracoes; ui ux design → ui-ux-design; software house →
  home.
- JSON-LD: manter Organization/WebSite/WebPage/FAQPage; adicionar `Service` +
  `BreadcrumbList` na família `/servicos/*`. Sem LocalBusiness, sem reviews.
- Sitemap regenerado sem rotas redirecionadas e sem blog.
- Rastreamento de conversão: executar a spec
  `2026-07-06-rastreamento-conversao-whatsapp-design.md` (GTM + Consent Mode
  v2) como parte do plano.

## Componentes

Revisados: `Button` (primário sólido laranja, secundário ghost ink, estados
hover/focus/disabled corrigidos), `Link`, `SectionTitle` (eyebrow mono + h2),
`Header`/`BurgerMenu` (vidro), `HighlightCard`, `QuestionAnswer`,
`CardContent`, `MarketingPage`, `FooterSection` (escuro).

Novos: `GlassPanel`, `CaseShowcase`, `ProcessStep`, `LeadForm` (formulário →
mensagem de WhatsApp), `ServiceCard`.

## Fases de implementação

```text
FASE 0 — Correções críticas (podem ir a produção antes do visual)
  seo.ts/sitemap/robots → domínio bcriativo.com
  registry.tsx/_document → SSR de CSS (FOUC)
  next.config.mjs → redirects 301
  Button → estados desbotados
FASE 1 — Fundação: theme.ts (tokens), global.ts, fontes no _app
FASE 2 — Componentes base
FASE 3 — Header + Hero
FASE 4 — Seções da home (nova ordem e fusões)
FASE 5 — Páginas internas + consolidação de serviços
FASE 6 — Copy final (content/*.ts) + revisão de naturalidade
FASE 7 — SEO estruturado + GTM/Consent Mode v2
FASE 8 — Performance, QA visual por breakpoint, acessibilidade, testes
```

Branch: `redesign/vidro-executivo`. Cada fase termina com
`check-format`, `check-lint`, `check-types` e testes verdes; os testes de
SEO/segurança existentes são atualizados junto com as mudanças que os afetam.

## Critérios de aceite

- HTML de produção contém os estilos SSR (sem FOUC).
- Todas as URLs canônicas, sitemap, robots, OG e JSON-LD usam
  `www.bcriativo.com`.
- Redirects 301 funcionando para as quatro rotas consolidadas.
- WCAG AA: contraste, foco visível, navegação por teclado, touch targets.
- `prefers-reduced-motion` respeitado; glass com fallback sólido.
- Lighthouse (produção): Performance 90+, Accessibility 95+, Best Practices
  95+, SEO 95+ — desvios documentados com causa.
- Nenhum conteúdo comercial inventado.
- `npm run lint`, `npm run check-types` e `npm test` verdes.

## Fora de escopo

- Blog com conteúdo real (fica para ciclo próprio de conteúdo/SEO).
- Novos cases além do Underground PB (dependem de material do cliente).
- Depoimentos/prova social (dependem de autorização de clientes).
- Backend de formulário/CRM (o LeadForm usa apenas o deep link do WhatsApp).
