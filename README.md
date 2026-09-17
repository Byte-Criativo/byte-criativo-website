# Byte Criativo Website

Site institucional da Byte Criativo, desenvolvido com Next.js, React, styled-components e TypeScript. Além da home, o site tem páginas próprias de Sobre, Serviços (hub e páginas individuais por serviço), Portfólio e Contato — todas com navegação, SEO, segurança e testes cobrindo o conjunto.

O projeto foi organizado para ser simples de manter: os textos principais ficam centralizados em arquivos de conteúdo, os metadados de SEO ficam em um módulo próprio, os contatos ficam em uma única fonte de verdade e há testes automatizados (unitários, de integração e end-to-end) para proteger SEO, segurança, redirecionamentos e arquivos públicos.

## Sumário

- [Tecnologias](#tecnologias)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como o site funciona, seção por seção](#como-o-site-funciona-seção-por-seção)
- [Como alterar textos, links e conteúdos](#como-alterar-textos-links-e-conteúdos)
- [SEO](#seo)
- [Segurança](#segurança)
- [Testes](#testes)
- [Deploy na Vercel](#deploy-na-vercel)
- [Checklist antes de publicar](#checklist-antes-de-publicar)

## Tecnologias

- Next.js 16 (Pages Router)
- React 19
- TypeScript
- styled-components
- next/font (Google Fonts self-hospedadas: Bricolage Grotesque no display, Instrument Sans no corpo, JetBrains Mono nos rótulos/monoespaçado)
- next-seo
- Phosphor Icons
- Radix UI Dialog (menu mobile)
- ESLint e Prettier
- Husky (hook de pre-commit)
- Node Test Runner + Vitest (Testing Library) para testes unitários/integração
- Playwright para testes end-to-end
- PostCSS com autoprefixer

## Como Rodar o Projeto

1. Use a versão de Node definida no projeto:

```bash
nvm use
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o servidor local:

```bash
npm run dev
```

4. Abra o endereço exibido no terminal. Normalmente será:

```text
http://localhost:3000
```

Se a porta `3000` estiver ocupada, o Next pode sugerir outra porta.

## Scripts Disponíveis

```bash
npm run dev
```

Inicia o servidor local de desenvolvimento.

```bash
npm run build
```

Gera o build de produção e valida TypeScript/compilação.

```bash
npm run start
```

Roda a versão de produção depois de um build.

```bash
npm run lint
```

Executa o ESLint (alias de `check-lint`).

```bash
npm run check-format
```

Verifica a formatação com Prettier sem alterar arquivos.

```bash
npm run format
```

Formata o código com Prettier.

```bash
npm run check-lint
```

Roda o ESLint.

```bash
npm run check-types
```

Verifica a tipagem com TypeScript (`tsc --noEmit`).

```bash
npm run test:unit
```

Roda os testes unitários/integração com Vitest (componentes React e módulos de `src/lib/`).

```bash
npm run test:e2e
```

Roda os testes end-to-end com Playwright (`e2e/`). Exige um Chrome instalado; use `--channel chrome` se necessário.

```bash
npm run test:contract
```

Roda o contrato HTTP (`e2e/contract/`) contra `BASE_URL` (padrão: produção, `https://www.bcriativo.com`). Não abre navegador; usa apenas requisições HTTP para checar rotas, redirecionamentos, headers e conteúdo preservado.

```bash
npm test
```

Executa `npm run build`, depois os testes de `tests/*.test.mjs` (Node Test Runner) e por fim `vitest run`. É o comando usado no checklist de publicação; não inclui os testes end-to-end do Playwright.

```bash
node scripts/portfolio/capture.mjs <slug> <url...>
```

Gera capturas de tela (viewport e página inteira) de uma ou mais URLs, salvas em `docs/research/captures/<ano>-<mês>-<slug>/` junto com um `manifest.json`. Usado para registrar o estado de referências externas de portfólio.

### Hook de Pré-commit

O projeto usa Husky. A cada commit, um hook roda automaticamente `check-format`, `check-lint` e `check-types`. Se algum falhar, o commit é bloqueado até a correção. O build de produção não roda no commit (a Vercel o executa no deploy).

## Estrutura de Pastas

```text
public/
  logoByte.png
  MiniLogo.png
  og-image.png
  robots.txt
  sitemap.xml

src/
  assets/
  components/
  content/
  lib/
  pages/
  styles/

tests/
e2e/
```

### `public/`

Arquivos públicos servidos diretamente pelo site.

- `logoByte.png`: logo principal.
- `MiniLogo.png`: ícone/favicon e logo reduzida.
- `og-image.png`: imagem usada em compartilhamentos sociais.
- `robots.txt`: orientação de indexação para crawlers.
- `sitemap.xml`: mapa do site enviado ao Google.

### `src/assets/`

Imagens e ícones importados diretamente pelo código (otimizados pelo `next/image`).

- `case-undergroundpb-screenshot.png`: preview do case autoral exibido na Cases.
- `icons/`: ícones SVG próprios (ex.: `LogoIcon.svg`, usado como fallback nos cards).

### `src/components/`

Componentes reutilizáveis, como:

- `Header`: navegação principal e CTA de contato.
- `BurgerMenu`: menu mobile (Radix UI Dialog).
- `Button`: botão de link com variantes `primary`/`ghost`.
- `Link`: link com proteção `noopener noreferrer` automática.
- `CardContent`: card de ícone + título + descrição usado em Serviços e nas páginas de marketing.
- `LeadForm`: formulário da seção CTA da home (nome, empresa, necessidade) que monta a mensagem e abre o WhatsApp.
- `MarketingPage`: template compartilhado pelas páginas `/sobre`, `/servicos`, `/portfolio` e `/contato`.
- `QuestionAnswer`: item de pergunta/resposta usado no FAQ.
- `SectionTitle`: cabeçalho padrão (eyebrow + heading) usado em todas as seções.

### `src/content/`

Conteúdo editável do site.

- `home.ts`: textos da home — navegação, footer, hero, case, serviços, processo, diferenciais ("por que a Byte Criativo"), FAQ (títulos) e CTA.
- `faq.ts`: perguntas e respostas do FAQ.
- `services.ts`: conteúdo das páginas individuais de serviço (`/servicos/[slug]`).
- `pages.ts`: conteúdo das páginas de marketing renderizadas pelo `MarketingPage` (`/sobre`, `/servicos`, `/portfolio`, `/contato`).

### `src/lib/`

Configurações e utilitários compartilhados.

- `contact.ts`: e-mail, telefone, WhatsApp e redes sociais.
- `seo.ts`: domínio, title, description, canonical, Open Graph e JSON-LD.
- `link-security.ts`: garante `noopener noreferrer` em links externos.
- `lead.ts`: monta a mensagem de WhatsApp a partir dos campos do `LeadForm`.
- `analytics.ts`: eventos para o `dataLayer` (ex.: clique em CTA de WhatsApp).

### `src/pages/`

Páginas do Next.js usando Pages Router.

- `_app.page.tsx`: providers, fontes (`next/font`), estilos globais e SEO padrão.
- `_document.page.tsx`: HTML base, favicon e coleta de estilos do styled-components para SSR.
- `index.page.tsx`: aponta para a home.
- `home/`: página principal e suas seções (ver abaixo).
- `sobre.page.tsx`, `contato.page.tsx`, `portfolio.page.tsx`: páginas de marketing renderizadas via `MarketingPage`.
- `servicos.page.tsx`: hub de serviços (também via `MarketingPage`).
- `servicos/[slug].page.tsx`: página individual de cada serviço, gerada estaticamente a partir de `services.ts`.

### `src/pages/home/sections/`

Cada seção da home tem sua própria pasta com `index.tsx` e `styles.ts`:

- `Hero`
- `Cases`
- `Services`
- `Process`
- `WhyUs`
- `FAQ`
- `CTA`
- `Footer`

### `tests/`

Testes de integração com Node Test Runner (rodam contra o build de produção).

- `seo.test.mjs`
- `security.test.mjs`
- `public-assets.test.mjs`
- `redirects.test.mjs`
- `service-pages.test.mjs`
- `ssr-styles.test.mjs`

### `e2e/`

Testes end-to-end com Playwright, rodando contra o servidor de desenvolvimento.

- `home.spec.ts`: navegação principal, menu mobile, FAQ e CTA de WhatsApp.

## Como o Site Funciona, Seção Por Seção

A home (`src/pages/home/index.tsx`) compõe as seções nesta ordem: Header, Hero, Cases, Serviços, Processo, Por que a Byte Criativo, FAQ, CTA (com formulário) e Footer.

### 1. Header

Arquivo principal:

```text
src/components/Header/index.tsx
```

O header exibe:

- Logo da Byte Criativo.
- Navegação para Início, Sobre, Serviços, Portfólio e Contato.
- Botão "Falar sobre um projeto", que abre o WhatsApp.
- Menu mobile (`BurgerMenu`) abaixo do breakpoint definido no componente.

A navegação vem de:

```text
src/content/home.ts
```

Constantes:

```ts
navigationItems
footerNavigationItems
```

### 2. Hero

Arquivo principal:

```text
src/pages/home/sections/Hero/index.tsx
```

É a primeira área da página. Ela mostra:

- Eyebrow ("software house · design e engenharia").
- Título principal.
- Texto de apoio.
- Botões para iniciar conversa via WhatsApp e para ver os projetos (Cases).

O conteúdo vem de:

```ts
heroContent
```

em:

```text
src/content/home.ts
```

### 3. Cases

Arquivo principal:

```text
src/pages/home/sections/Cases/index.tsx
```

Mostra o case autoral Underground PB, com:

- Imagem de preview.
- Título.
- Tags.
- Desafio, solução e resultado.
- Link para acessar o site.

O conteúdo vem de:

```ts
featuredCase
```

em:

```text
src/content/home.ts
```

A imagem usada fica em:

```text
src/assets/case-undergroundpb-screenshot.png
```

### 4. Serviços

Arquivo principal:

```text
src/pages/home/sections/Services/index.tsx
```

Lista os serviços oferecidos como cards (ícone, título, descrição e link "Saiba mais" para a página individual em `/servicos/[slug]`):

- Desenvolvimento de sites.
- Sistemas web sob medida.
- UI/UX Design.
- Landing pages.
- Design de Produto.
- Copywriting para web.
- Automação e integrações.

O conteúdo vem de:

```ts
services
servicesSectionTitle
```

em:

```text
src/content/home.ts
```

### 5. Processo

Arquivo principal:

```text
src/pages/home/sections/Process/index.tsx
```

Mostra as etapas numeradas do processo de trabalho (diagnóstico, proposta e escopo, design e desenvolvimento, entrega e evolução).

O conteúdo vem de:

```ts
processSteps
processSectionTitle
```

em:

```text
src/content/home.ts
```

### 6. Por Que a Byte Criativo

Arquivo principal:

```text
src/pages/home/sections/WhyUs/index.tsx
```

Lista os diferenciais (diagnóstico antes do código, SEO/performance/segurança desde a base, contato direto).

O conteúdo vem de:

```ts
whyUs
whyUsSectionTitle
```

em:

```text
src/content/home.ts
```

### 7. FAQ

Arquivo principal:

```text
src/pages/home/sections/FAQ/index.tsx
```

Renderiza perguntas e respostas com abertura/fechamento por interação (`QuestionAnswer`).

As perguntas ficam em:

```text
src/content/faq.ts
```

Esse mesmo conteúdo também alimenta o JSON-LD de FAQ em:

```text
src/lib/seo.ts
```

Isso evita divergência entre o que aparece na tela e o que o Google lê como dado estruturado.

### 8. CTA Final (com formulário)

Arquivo principal:

```text
src/pages/home/sections/CTA/index.tsx
```

Mostra a chamada final com título, texto curto e o `LeadForm`: um formulário (nome, empresa opcional, necessidade) que monta a mensagem e abre o WhatsApp já preenchido.

O conteúdo vem de:

```ts
ctaContent
```

em:

```text
src/content/home.ts
```

O formulário em si vive em:

```text
src/components/LeadForm
```

### 9. Footer

Arquivo principal:

```text
src/pages/home/sections/Footer/index.tsx
```

Exibe:

- Logo reduzida.
- CNPJ.
- E-mail (com botão de copiar).
- WhatsApp.
- Links de navegação.
- Instagram.
- LinkedIn.
- Ano atual.

Os dados de contato vêm de:

```text
src/lib/contact.ts
```

Os links de navegação vêm de:

```ts
footerNavigationItems
```

em:

```text
src/content/home.ts
```

### Outras páginas

Além da home, quatro páginas de marketing compartilham o mesmo template (`MarketingPage`) e só variam pelo conteúdo em `src/content/pages.ts`:

- `/sobre` — apresentação da empresa, princípios de trabalho e diferenciais.
- `/servicos` — hub com as frentes de atuação e link para cada página de serviço.
- `/portfolio` — projetos em destaque (case Underground PB) e espaço preparado para novos cases.
- `/contato` — canais de contato e o que enviar no primeiro contato.

Cada serviço também tem uma página própria, gerada estaticamente a partir de `src/content/services.ts`:

```text
src/pages/servicos/[slug].page.tsx
```

## Como Alterar Textos, Links e Conteúdos

### Alterar textos da home

Edite:

```text
src/content/home.ts
```

Esse arquivo controla:

- Links da navbar e do footer.
- Texto do hero.
- Case principal.
- Lista de serviços (cards da home).
- Etapas do processo.
- Diferenciais ("por que a Byte Criativo").
- Título do FAQ.
- CTA final.

### Alterar perguntas do FAQ

Edite:

```text
src/content/faq.ts
```

Cada item tem:

```ts
{
  id: number
  question: string
  answer: string
}
```

### Alterar as páginas de Sobre, Serviços (hub), Portfólio e Contato

Edite:

```text
src/content/pages.ts
```

Cada página é um objeto `MarketingPageContent` com eyebrow, hero, seções de cards/listas e CTA final — a estrutura visual é a mesma para as quatro; só o conteúdo muda.

### Alterar as páginas individuais de serviço

Edite:

```text
src/content/services.ts
```

Cada serviço é um objeto `ServicePage` com slug, hero, seções de conteúdo e FAQ próprio, renderizado em `/servicos/[slug]`.

### Alterar WhatsApp, e-mail ou redes sociais

Edite:

```text
src/lib/contact.ts
```

Esse arquivo controla:

- `CONTACT_EMAIL`
- `CONTACT_PHONE_E164`
- `WHATSAPP_NUMBER`
- `WHATSAPP_DISPLAY`
- `WHATSAPP_MESSAGE`
- `INSTAGRAM_URL`
- `LINKEDIN_URL`

O link final do WhatsApp é gerado pela função:

```ts
buildWhatsAppUrl()
```

### Alterar SEO

Edite:

```text
src/lib/seo.ts
```

Esse arquivo controla:

- Domínio principal.
- Title.
- Description.
- Canonical.
- Open Graph.
- Imagem social.
- Dados estruturados JSON-LD.

### Alterar cores, fontes e tokens visuais

Edite:

```text
src/styles/theme.ts
```

As fontes (Bricolage Grotesque, Instrument Sans, JetBrains Mono) são carregadas via `next/font/google` em:

```text
src/pages/_app.page.tsx
```

e disponibilizadas como variáveis CSS (`--font-display`, `--font-body`, `--font-mono`) consumidas pelo tema.

### Alterar estilos globais

Edite:

```text
src/styles/global.ts
```

### Alterar layout de uma seção

Cada seção tem dois arquivos:

```text
index.tsx
styles.ts
```

Exemplo:

```text
src/pages/home/sections/Services/index.tsx
src/pages/home/sections/Services/styles.ts
```

Use `index.tsx` para estrutura e `styles.ts` para CSS com styled-components.

## SEO

O projeto já possui uma base de SEO técnico configurada.

Arquivos importantes:

```text
src/lib/seo.ts
src/pages/_app.page.tsx
src/pages/home/index.tsx
src/pages/servicos/[slug].page.tsx
public/robots.txt
public/sitemap.xml
public/og-image.png
```

O site configura:

- `title`.
- `description`.
- `canonical`.
- `robots`.
- Open Graph.
- Twitter Card.
- Imagem social `1200x630`.
- JSON-LD com `Organization`, `WebSite`, `WebPage` e `FAQPage`.
- `robots.txt`.
- `sitemap.xml`, cobrindo a home, `/sobre`, `/servicos`, `/portfolio`, `/contato` e todas as páginas individuais de `/servicos/[slug]`.

URLs antigas de serviço (`/sites-profissionais`, `/sistemas-web`, `/landing-pages`, `/automacao-e-integracoes`) e o antigo blog vazio foram removidos; todas as quatro têm redirecionamento 301 configurado em `next.config.mjs` para a página de serviço correspondente em `/servicos/[slug]` (testado em `tests/redirects.test.mjs`). O blog não chegou a publicar conteúdo, então foi removido sem necessidade de redirect.

Após o deploy, envie este sitemap no Google Search Console:

```text
https://www.bcriativo.com/sitemap.xml
```

## Segurança

O projeto possui headers de segurança configurados em:

```text
next.config.mjs
```

Headers configurados:

- `Content-Security-Policy`.
- `Referrer-Policy`.
- `X-Content-Type-Options`.
- `X-Frame-Options`.
- `Permissions-Policy`.
- `Strict-Transport-Security`.

Links externos abertos em nova aba recebem proteção por padrão com:

```text
src/lib/link-security.ts
```

Isso evita tabnabbing usando:

```text
noopener noreferrer
```

## Testes

Há quatro camadas de teste automatizado: unitários/integração com Vitest, integração de build com Node Test Runner, end-to-end com Playwright e contrato HTTP com Playwright (contra `BASE_URL`).

### `src/**/*.test.ts(x)` (Vitest)

Testes unitários de componentes React e módulos de `src/lib/` (ex.: `LeadForm`, `analytics.ts`, `contact.ts`, `lead.ts`, `link-security.ts`). Rodam com:

```bash
npm run test:unit
```

### `tests/` (Node Test Runner, contra o build de produção)

- `seo.test.mjs`: idioma `pt-BR`, title, description, canonical, robots, Open Graph, Twitter Card, JSON-LD e ausência de sinais ruins (`noindex`, `nofollow`, seções antigas removidas).
- `public-assets.test.mjs`: `robots.txt`, `sitemap.xml` e dimensões da imagem Open Graph.
- `security.test.mjs`: headers de segurança no Next.js e proteção `noopener noreferrer` em links com `target="_blank"`.
- `redirects.test.mjs`: redirecionamento 301 das URLs antigas de serviço.
- `service-pages.test.mjs`: conteúdo e SEO das páginas individuais de `/servicos/[slug]`.
- `ssr-styles.test.mjs`: estilos do styled-components presentes no HTML renderizado no servidor.

Para executar:

```bash
npm test
```

Esse comando faz build de produção, roda os testes de `tests/` e depois `vitest run`.

### `e2e/` (Playwright, contra o servidor de desenvolvimento)

- `home.spec.ts`: navegação principal, menu mobile, abertura do FAQ e CTA de WhatsApp com proteção anti-tabnabbing.

```bash
npm run test:e2e
```

### `e2e/contract/` (Playwright, requisições HTTP contra `BASE_URL`)

Contrato que protege o comportamento observável do site (rotas preservadas, redirecionamentos legados, headers de segurança, sitemap/robots e a política de privacidade do Pomodoro) independentemente da implementação interna. Roda contra `BASE_URL` (padrão: produção).

```bash
npm run test:contract
```

## Deploy na Vercel

Fluxo recomendado:

1. Faça commit das alterações.
2. Envie para a branch `main`.
3. A Vercel deve detectar o push e iniciar o deploy automaticamente, caso o projeto esteja conectado ao repositório.

Comandos:

```bash
git status
git add .
git commit -m "mensagem do commit"
git push origin main
```

Se o repositório estiver em uma organização privada e a Vercel Hobby bloquear o deploy automático, existem alternativas gratuitas:

- Tornar o repositório público.
- Mover/espelhar o projeto para um repositório privado em conta pessoal.
- Fazer deploy manual pela Vercel CLI.

## Checklist Antes de Publicar

Antes de subir para produção, rode:

```bash
npm run lint
npm test
npm audit --audit-level=moderate
```

Confira também:

- Se o WhatsApp em `src/lib/contact.ts` está correto.
- Se o domínio em `src/lib/seo.ts` está correto (`https://www.bcriativo.com`).
- Se `public/sitemap.xml` aponta para o domínio certo e inclui todas as páginas atuais.
- Se `public/robots.txt` aponta para o sitemap certo.
- Se a imagem `public/og-image.png` está atualizada.
- Se o deploy da Vercel concluiu sem erro.

## Observações de Manutenção

- Prefira alterar conteúdo em `src/content/` antes de editar diretamente os componentes.
- Prefira alterar contato em `src/lib/contact.ts`.
- Prefira alterar metadados em `src/lib/seo.ts`.
- Ao adicionar links externos, use os componentes `Link` ou `Button` para manter a proteção de segurança.
- Ao mudar FAQ, rode `npm test` para garantir que o JSON-LD continua válido.
- Ao mudar SEO, rode `npm test` para garantir que title, canonical, robots e Open Graph continuam corretos.
- Ao mudar navegação, layout ou textos visíveis, rode `npm run test:e2e` para garantir que os fluxos principais (menu mobile, FAQ, CTA de WhatsApp) continuam funcionando.
