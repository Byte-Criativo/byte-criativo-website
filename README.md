# Byte Criativo — Website

Site institucional da Byte Criativo.

## Estado atual

A branch `redesign/v2` é uma reescrita completa em Next.js App Router,
saindo do antigo Pages Router + styled-components. Hoje só existe o
esqueleto: layout raiz (`src/app/layout.tsx`), layout do grupo `(site)`
com skip link e landmark `<main>`, uma home mínima
(`src/app/(site)/page.tsx`) e a página de 404 (`src/app/not-found.tsx`).
As páginas de conteúdo (Sobre, Serviços, Portfólio, Contato) chegam na
Fase 8.

## Stack

- Next.js 16.3 (App Router, Turbopack)
- React 19.3 e TypeScript 6 (`tsc --noEmit` em modo estrito)
- Tailwind CSS 4.3 (`@tailwindcss/postcss`; tokens como variáveis CSS
  expostas ao Tailwind via `@theme inline`)
- Zod 4
- Vitest 4 + Testing Library (testes unitários)
- Playwright (e2e e contrato HTTP)
- Lighthouse CI (orçamento de performance e acessibilidade)

## Como rodar localmente

Requer Node 24.x (ver `.nvmrc`).

```
npm install
npm run dev
```

O Next sobe na porta 3000 por padrão; se estiver ocupada, use
`PORT=<porta> npm run dev`. Para e2e, `PW_CHANNEL=chrome` usa o Google
Chrome instalado no sistema em vez do Chromium baixado pelo Playwright.

## Scripts

- `npm run dev` / `build` / `start` — Next.js
- `npm run lint` — ESLint
- `npm run format` / `format:check` — Prettier
- `npm run typecheck` — `tsc --noEmit`
- `npm run test:unit` — Vitest
- `npm run test:e2e` — Playwright (`playwright.config.ts`)
- `npm run test:contract` — Playwright contra `BASE_URL` (`playwright.contract.config.ts`)
- `npm run test` — `typecheck` + `test:unit`

## Camadas de teste

1. **Unitário** (Vitest + Testing Library): `src/**/*.test.ts(x)`, junto
   do código que testam — tokens, contraste, SEO, contato.
2. **E2E** (Playwright, projetos chromium/webkit/firefox/mobile):
   `e2e/*.spec.ts` sobe a app numa porta livre; cobre privacidade (zero
   terceiros, zero cookies) e acessibilidade (axe na home).
3. **Contrato HTTP** (Playwright, `e2e/contract/`): roda contra um
   servidor já no ar, apontado por `BASE_URL` — headers de segurança, 404
   em rota inexistente e, conforme a Fase 8 avança, as rotas preservadas.
4. **Lighthouse** (CI, `lighthouserc.json`): orçamentos de performance
   (LCP, CLS, TBT), peso de script/CSS/fonte/total e zero terceiros.

## Segurança

CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`
e `Permissions-Policy` ficam em `next.config.ts` (`headers()`). A home não
deve fazer nenhuma requisição para fora do próprio host nem gravar
cookies (`e2e/sem-rastreamento-sem-consentimento.spec.ts`).

## Tokens e documentos de design

Os tokens de cor, tipografia, espaçamento e movimento vivem em
`src/styles/tokens.json` (fonte, aprovada no G3) e
`src/styles/tokens.ts` (tipos e resolução para hex), sincronizados com
`src/app/globals.css` e testados em `src/styles/tokens.test.ts`. Os
documentos de design (estratégia visual, arquitetura técnica, arquitetura
de informação, conteúdo dos casos) que originaram esses tokens ficam fora
deste repositório, no diretório de trabalho do projeto.

## CI

`.github/workflows/ci.yml` roda três jobs a cada push/PR: `quality`
(format, lint, typecheck, testes unitários, `npm audit`), `e2e`
(Playwright contra build local + contrato HTTP) e `lighthouse` (LHCI). O
hook de pré-commit (`.husky/pre-commit`) roda `format:check`, `lint` e
`typecheck` antes de cada commit.
