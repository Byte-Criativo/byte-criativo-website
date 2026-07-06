# Rastreamento de conversão de WhatsApp (GTM + Consent Mode v2)

- **Data:** 2026-07-06
- **Site:** Byte Criativo (Next.js 16, Pages Router, styled-components)
- **Status:** Design aprovado — pronto para virar plano de implementação

## Objetivo

Medir conversões de **clique no WhatsApp** para permitir a otimização de campanhas
no Google Ads, respeitando a LGPD. Nenhum ID do Google Ads (conversion ID/label)
deve entrar no repositório — toda a configuração de tags de marketing fica no
Google Tag Manager (GTM).

## Contexto do site

O site é uma landing page de uma única página. Não existe formulário de contato:
todos os CTAs de conversão são links `wa.me` (WhatsApp), que abrem em nova aba.
Hoje não há nenhuma tag de analytics/ads instalada.

Pontos de contato de WhatsApp (todos usam `WHATSAPP_URL` de `src/lib/contact.ts`):

| # | Local | Componente atual | `location` |
|---|-------|------------------|------------|
| 1 | Hero | `Button` (`src/pages/home/sections/Hero/index.tsx`) | `hero` |
| 2 | Header | `Button` (`src/components/Header/index.tsx`) | `header` |
| 3 | Seção CTA | `Button` (`src/pages/home/sections/CTA/index.tsx`) | `cta` |
| 4 | Menu mobile | `ContactButton` (`src/components/BurgerMenu/index.tsx`) | `menu` |
| 5 | Footer | `Link` de ícone (`src/pages/home/sections/Footer/index.tsx`) | `footer` |

E-mail no Footer é um botão de **copiar para a área de transferência** (não é
`mailto:`), telefone não é renderizado em lugar nenhum, e Instagram/LinkedIn são
links de engajamento. Nada disso será rastreado nesta iteração (ver "Fora de escopo").

## Decisões

1. **Carregamento via GTM**, não gtag direto. Uma variável de ambiente
   `NEXT_PUBLIC_GTM_ID` controla tudo. Sem a variável, o site se comporta
   exatamente como hoje (importante para dev e CI).
2. **Consent Mode v2 + banner leve próprio** (sem CMP de terceiros). Padrão
   `denied`; as tags de ads/analytics só disparam após o aceite.
3. **Conversão = clique no WhatsApp**, disparando um único evento
   `whatsapp_click` no `dataLayer` com o parâmetro `location`. O mapeamento
   desse evento para a tag de conversão do Google Ads é feito **dentro do GTM**.
4. **Instrumentação híbrida (opção A + B):** um componente `WhatsAppButton`
   (envolve o `Button` compartilhado) para Hero/Header/CTA, e `onClick` direto
   para o Menu mobile e o Footer, que têm estilos próprios e não passam pelo
   `Button`.

## Arquitetura e componentes

### Módulos novos

- **`src/lib/analytics.ts`** — camada fina sobre o `dataLayer`.
  - `pushToDataLayer(event: Record<string, unknown>)`: empurra para
    `window.dataLayer`, criando o array se necessário.
  - `trackWhatsAppClick(location: WhatsAppLocation)`: empurra
    `{ event: "whatsapp_click", location }`.
  - Tipo `WhatsAppLocation = "hero" | "header" | "cta" | "menu" | "footer"`.
  - **Seguro em SSR e com ad-blocker:** se `window`/`dataLayer` não existir, é
    no-op silencioso. Nunca lança erro para a UI.

- **`src/lib/consent.ts`** — estado de consentimento.
  - Constante `CONSENT_COOKIE` (ex.: `bc_consent`), valores `"granted"` / `"denied"`.
  - `readStoredConsent(): ConsentValue | null` — lê o cookie.
  - `writeStoredConsent(value: ConsentValue)` — persiste (cookie de 1 ano).
  - `applyConsent(granted: boolean)` — empurra o `gtag('consent','update', …)`
    para `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`.
  - Seguro em SSR/sem `dataLayer`, igual ao `analytics.ts`.

- **`src/components/WhatsAppButton/`** — componente que envolve o `Button`
  compartilhado, já com `href={WHATSAPP_URL}` (default, sobrescrevível),
  `target="_blank"` e `onClick={() => trackWhatsAppClick(location)}`. Props:
  `location` (obrigatório), `children`, e repasse de `...props` (ex.: `className`).

- **`src/components/CookieConsent/`** — banner de consentimento.
  - Estilizado com styled-components seguindo o tema atual.
  - Aparece **apenas** quando não há escolha salva (`readStoredConsent() === null`).
  - Botões **Aceitar** / **Recusar**: cada um persiste a escolha
    (`writeStoredConsent`), aplica o consentimento (`applyConsent`) e esconde o banner.
  - Acessível: `role="region"` com `aria-label` (ex.: "Aviso de cookies"), foco
    inicial no botão de aceitar, navegação por teclado nativa. Não é modal (não
    prende o foco nem bloqueia a página).
  - Renderizado no `_app`, somente quando `NEXT_PUBLIC_GTM_ID` estiver definido.

### Arquivos modificados

- **`src/pages/_document.page.tsx`** — script inline de *consent default* no
  `<Head>`, renderizado só quando `NEXT_PUBLIC_GTM_ID` existir. Ver "Ordem de
  carregamento".
- **`src/pages/_app.page.tsx`** — carrega `<GoogleTagManager gtmId={…} />` de
  `@next/third-parties/google` (nova dependência) e renderiza o `CookieConsent`,
  ambos condicionados à variável de ambiente.
- **Hero / Header / CTA** — trocam `Button` por `WhatsAppButton` com o `location`
  adequado.
- **BurgerMenu** — adiciona `onClick={() => trackWhatsAppClick("menu")}` ao
  `ContactButton`.
- **Footer** — adiciona `onClick={() => trackWhatsAppClick("footer")}` ao `Link`
  de WhatsApp.

## Ordem de carregamento e consentimento (ponto crítico)

O padrão de consentimento **precisa** ser definido antes do GTM carregar:

1. Script inline no `<Head>` do `_document` (roda antes de tudo):
   ```js
   window.dataLayer = window.dataLayer || [];
   function gtag(){ dataLayer.push(arguments); }
   // lê o cookie bc_consent
   var g = /* 'granted' se aceito antes, senão 'denied' */;
   gtag('consent','default', {
     ad_storage: g, analytics_storage: g,
     ad_user_data: g, ad_personalization: g,
     wait_for_update: 500
   });
   ```
   Para visitante novo → `denied`. Para quem já aceitou → `granted` (aplicado já
   na carga, sem precisar reexibir o banner).
2. GTM carrega em seguida (estratégia `afterInteractive` do
   `@next/third-parties`), respeitando o estado de consentimento.
3. O banner só aparece se não houver escolha salva. Ao aceitar/recusar, o
   `applyConsent` empurra o `gtag('consent','update', …)`.

## Fluxo de dados

```
visitante entra
  → script inline define consent default (denied ou escolha salva)
  → GTM carrega respeitando o consentimento
  → banner aparece (se não houver escolha salva)
  → visitante clica no WhatsApp
  → onClick → trackWhatsAppClick(location)
  → dataLayer.push({ event: 'whatsapp_click', location })
  → gatilho no GTM dispara a tag de conversão do Google Ads (respeitando consentimento)
  → nova aba abre wa.me
```

Como o WhatsApp abre em **nova aba** (`target="_blank"`), a página não é
descarregada — o evento tem tempo de sobra para disparar. Não é necessário
`eventCallback` nem atraso no redirect.

## Tratamento de erros

- Funções de `analytics.ts` e `consent.ts` fazem no-op se `window`/`dataLayer`
  não existir (SSR ou bloqueio por ad-blocker). Nunca propagam erro para a UI.
- Sem `NEXT_PUBLIC_GTM_ID`: nenhum script/banner é renderizado; os helpers de
  tracking continuam seguros (no-op).
- O botão de copiar e-mail do Footer já trata a indisponibilidade da área de
  transferência silenciosamente — sem mudança.

## Variáveis de ambiente

- **`NEXT_PUBLIC_GTM_ID`** (ex.: `GTM-XXXXXXX`). Definida na Vercel (Production e
  Preview conforme desejado). Documentada no README e em `.env.example`.

## Estratégia de testes

- **`analytics.test.ts`** — `trackWhatsAppClick` empurra
  `{ event: 'whatsapp_click', location }`; no-op seguro quando `dataLayer` não existe.
- **`consent.test.ts`** — leitura/escrita do cookie; `applyConsent` empurra o
  update de consentimento correto para `granted` e `denied`.
- **`CookieConsent.test.tsx`** (RTL) — aparece quando não há escolha salva;
  Aceitar persiste + concede + esconde; Recusar persiste + nega + esconde.
- **`WhatsAppButton.test.tsx`** (RTL) — renderiza âncora com `WHATSAPP_URL`; o
  clique chama `trackWhatsAppClick` com o `location` esperado.
- **E2E (`e2e/home.spec.ts`)** — com `window.dataLayer` observado, clicar no
  WhatsApp do Hero empurra o evento `whatsapp_click`.
- A suíte atual (`npm test`) continua verde.

## Pré-requisitos fora do código (interface do GTM / Google Ads)

Feitos por você, não versionados no repositório:

1. Criar um container no GTM → usar o ID em `NEXT_PUBLIC_GTM_ID`.
2. Criar uma ação de conversão no Google Ads.
3. No GTM: criar um gatilho no evento `whatsapp_click` e uma tag de conversão do
   Google Ads acionada por ele.
4. Habilitar o Consent Mode no GTM/Ads (as tags respeitam
   `ad_storage`/`analytics_storage`).

## Fora de escopo (YAGNI)

- GA4 (pode ser adicionado depois só no GTM, consumindo o mesmo evento — sem
  mudança de código).
- Rastreamento de copiar e-mail, cliques em redes sociais e telefone.
- CMP de terceiros (Cookiebot/Osano etc.).
- Server-side tagging.

## Critérios de aceite

- `npm run build` e `npm test` passam.
- Sem `NEXT_PUBLIC_GTM_ID`: o site se comporta exatamente como hoje.
- Com `NEXT_PUBLIC_GTM_ID`: GTM carrega, o banner aparece para visitante novo, os
  cliques nos 5 botões de WhatsApp empurram `whatsapp_click` com o `location`
  correto, e o estado de consentimento é respeitado (default `denied`, update no
  aceite).
