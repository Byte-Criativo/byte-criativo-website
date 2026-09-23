# Byte Criativo — Website

Site institucional da Byte Criativo.

## Estado atual

A base publicada em `main` usa Next.js App Router, após a migração
do antigo Pages Router + styled-components. Home, Sobre, Serviços,
Processo, Portfólio, Contato e Privacidade já estão implementados. Os
estudos de caso do Underground PB e Festival Alumiô têm capturas reais e
escopo confirmado em `docs/case-approvals.md`. Links para estudos aparecem
somente quando o respectivo case está publicado.

A evolução local `refine/software-house` restaura a marca oficial e refina
posicionamento, navegação e cores sem trocar o conceito do layout. Inclui
também GOROMAX e Carlos Ferrer Online (projeto próprio), além de capturas
atualizadas dos quatro projetos. Diagnóstico,
evidências, limitações e instruções de revisão estão em
[docs/site-evolution-2026-09.md](docs/site-evolution-2026-09.md).
Publicação depende de aprovação; os testes desta intervenção não enviam leads reais.

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

O formulário envia pelo Resend quando as variáveis estão configuradas e
oferece WhatsApp se o provedor falhar. Para testar o envio localmente, copie
`.env.example` para `.env.local` e preencha `RESEND_API_KEY`,
`LEAD_EMAIL_FROM` (remetente de domínio verificado no Resend),
`LEAD_EMAIL_TO` (caixa privada monitorada), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
e `TURNSTILE_SECRET_KEY` (widget Cloudflare Turnstile). O destinatário dos leads é
configurado apenas no ambiente; o e-mail público do site e o `Reply-To` do
visitante permanecem independentes. Nunca registre a chave ou o endereço
privado no repositório. Sem as chaves de e-mail e do desafio, a Server Action
não envia leads e mantém o caminho alternativo por WhatsApp. O desafio exige
JavaScript; sem ele, a pessoa recebe a opção de contato direto. Os tokens
Turnstile são validados no servidor antes de chamar o Resend.

Em Production e Preview, `RESEND_API_KEY`, `LEAD_EMAIL_FROM`,
`LEAD_EMAIL_TO` e `TURNSTILE_SECRET_KEY` são variáveis do tipo **Secret** na
Vercel. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` é **Config**, pois o widget precisa
expor essa chave pública no navegador. O domínio `bcriativo.com` está
verificado no Resend Free para envio. A caixa pública
`contato@bcriativo.com` recebe pelo MX raiz do Resend; as mensagens aparecem
na aba **Emails → Receiving** da conta Resend e não são encaminhadas
automaticamente ao destinatário privado dos leads. O MX do subdomínio
`send.bcriativo.com` atende apenas o retorno do envio e deve ser mantido.

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

## Atualização das capturas

`node scripts/portfolio/refresh.mjs --dry-run` lista as fontes. Sem `--dry-run`,
gera candidatos datados para revisão. O workflow mensal prepara artefatos, sem
substituir imagens ou publicar automaticamente; só ficará ativo após integração
a `main`. Procedimento e seleção: [docs/portfolio-captures.md](docs/portfolio-captures.md).

## Operação em produção

- O projeto Vercel usa Node.js 24.x, como `.nvmrc`, `package.json` e CI.
- O widget Turnstile Free atende `bcriativo.com`, `www.bcriativo.com` e a URL
  estável de Preview da branch `redesign/v2`. Se um host mudar, atualize a
  lista no Cloudflare antes de testar o formulário.
- A regra WAF da Vercel limita `POST /contato` a cinco requisições por IP a
  cada dez minutos, com resposta 429. Honeypot e carimbo de tempo são
  camadas adicionais.
- Ao trocar qualquer secret, gere novo deploy nos ambientes afetados e faça
  um envio real. Confira sucesso, conteúdo e `Reply-To` na caixa privada.
  A opção WhatsApp permanece disponível em falhas e sem JavaScript.
- Monitore a caixa pública separadamente em **Resend → Emails → Receiving**.
  Uma mensagem enviada ao endereço público não aparece automaticamente na
  caixa privada configurada em `LEAD_EMAIL_TO`.

## CI

`.github/workflows/ci.yml` roda três jobs: `quality` (format, lint,
typecheck, testes unitários, `npm audit`), `e2e` (Playwright contra build
local + contrato HTTP) e `lighthouse` (LHCI). Disparam em qualquer pull
request e em pushes para `main`. O hook de pré-commit (`.husky/pre-commit`) roda `format:check`,
`lint` e `typecheck` antes de cada commit.
