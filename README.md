# Byte Criativo — Website

Site institucional da Byte Criativo.

## Estado atual

A branch `redesign/v2` contém a reescrita em Next.js App Router, saindo
do antigo Pages Router + styled-components. Home, Sobre, Serviços,
Processo, Portfólio, Contato e Privacidade já estão implementados. Os
estudos de caso do Underground PB e Festival Alumiô têm capturas reais e
escopo confirmado em `docs/case-approvals.md`. Links para estudos aparecem
somente quando o respectivo case está publicado.

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

O formulário mostra um caminho alternativo de contato enquanto o envio por
e-mail não estiver configurado. Para testar o envio localmente, copie
`.env.example` para `.env.local` e preencha `RESEND_API_KEY`,
`LEAD_EMAIL_FROM` (remetente de domínio verificado no Resend),
`LEAD_EMAIL_TO` (caixa privada monitorada), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
e `TURNSTILE_SECRET_KEY` (widget Cloudflare Turnstile). O destinatário dos leads é
configurado apenas no ambiente; o e-mail público do site e o `Reply-To` do
visitante permanecem independentes. Nunca registre a chave ou o endereço
privado no repositório. Sem as chaves de e-mail e do desafio, a Server Action
não envia leads e mantém o caminho alternativo por WhatsApp. O desafio exige
JavaScript; sem ele, a pessoa recebe a opção de contato direto.

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
   `e2e/*.spec.ts` sobe a app com `npm run build && npm run start` na porta
   de `PORT` (3000 por padrão) e, fora do CI, reaproveita um servidor já
   rodando nessa porta (`playwright.config.ts`); localmente, use
   `PORT=3217 PW_CHANNEL=chrome npx playwright test`. Cobre privacidade
   (zero terceiros, zero cookies) e acessibilidade (axe na home).
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
deste repositório, no diretório de trabalho do projeto. O `docs/` deste
repositório inclui os registros das capturas atuais em
`scripts/portfolio/` e artefatos históricos do site anterior em `docs/`.

## Preparação para produção

1. Conferir as páginas publicadas dos dois cases em desktop e celular,
   incluindo a galeria, créditos e links externos.
2. Verificar o domínio remetente no Resend Free e configurar
   `RESEND_API_KEY`, `LEAD_EMAIL_FROM` e `LEAD_EMAIL_TO` como secrets em
   Production e Preview na Vercel.
3. Criar um widget Cloudflare Turnstile Free para os hosts de produção e
   prévia e configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e
   `TURNSTILE_SECRET_KEY` nos mesmos ambientes. A validação do token acontece
   no servidor antes de qualquer envio.
4. Conferir a regra de rate limiting da Vercel para `POST /contato`: por IP,
   cinco requisições a cada dez minutos, resposta 429. O honeypot e o carimbo
   são apenas camadas adicionais.
5. Após novo deploy, fazer um envio real com JavaScript, conferir a chegada
   na caixa monitorada e testar o fallback por WhatsApp, inclusive sem
   JavaScript. Só então promover a branch para `main`.

## CI

`.github/workflows/ci.yml` roda três jobs: `quality` (format, lint,
typecheck, testes unitários, `npm audit`), `e2e` (Playwright contra build
local + contrato HTTP) e `lighthouse` (LHCI). Disparam em qualquer pull
request e em pushes para `main`. O hook de pré-commit (`.husky/pre-commit`) roda `format:check`,
`lint` e `typecheck` antes de cada commit.
