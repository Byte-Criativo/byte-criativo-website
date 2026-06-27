# Byte Criativo Website

Site institucional da Byte Criativo, desenvolvido com Next.js, React, styled-components e TypeScript. A página apresenta a empresa, diferenciais, case autoral, serviços, FAQ, CTA para WhatsApp e rodapé com canais oficiais.

O projeto foi organizado para ser simples de manter: os textos principais ficam centralizados em arquivos de conteúdo, os metadados de SEO ficam em um módulo próprio, os contatos ficam em uma única fonte de verdade e há testes automatizados para proteger SEO, segurança e arquivos públicos.

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

- Next.js 16
- React 19
- TypeScript
- styled-components
- next-seo
- Phosphor Icons
- Radix UI Dialog
- ESLint e Prettier
- Node Test Runner
- Tailwind/PostCSS configurados no projeto

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

Executa ESLint e Prettier.

```bash
npm test
```

Executa `npm run build` e depois roda os testes automatizados em `tests/`.

## Estrutura de Pastas

```text
public/
  MiniLogo.png
  logoByte.png
  og-image.png
  robots.txt
  sitemap.xml

src/
  components/
  content/
  lib/
  pages/
  styles/

tests/
```

### `public/`

Arquivos públicos servidos diretamente pelo site.

- `MiniLogo.png`: ícone/fav icon e logo reduzida.
- `logoByte.png`: logo principal.
- `og-image.png`: imagem usada em compartilhamentos sociais.
- `robots.txt`: orientação de indexação para crawlers.
- `sitemap.xml`: mapa do site enviado ao Google.

### `src/components/`

Componentes reutilizáveis, como:

- `Header`
- `BurgerMenu`
- `Button`
- `Link`
- `CardContent`
- `HighlightCard`
- `QuestionAnswer`
- `SectionTitle`

### `src/content/`

Conteúdo editável do site.

- `home.ts`: textos da home, navegação, serviços, case, CTA e IDs de seção.
- `faq.ts`: perguntas e respostas do FAQ.

### `src/lib/`

Configurações e utilitários compartilhados.

- `contact.ts`: e-mail, telefone, WhatsApp e redes sociais.
- `seo.ts`: title, description, canonical, Open Graph e JSON-LD.
- `link-security.ts`: garante `noopener noreferrer` em links externos.
- `registry.tsx`: registry de styled-components para SSR.

### `src/pages/`

Páginas do Next.js usando Pages Router.

- `_app.page.tsx`: configura providers, estilos globais e SEO padrão.
- `_document.page.tsx`: configura HTML base, fonte, favicon e styled-components.
- `index.page.tsx`: aponta para a home.
- `home/`: página principal e suas seções.

### `tests/`

Testes automatizados com Node Test Runner.

- `seo.test.mjs`
- `security.test.mjs`
- `public-assets.test.mjs`

## Como o Site Funciona, Seção Por Seção

### 1. Header

Arquivo principal:

```text
src/components/Header/index.tsx
```

O header exibe:

- Logo da Byte Criativo.
- Links de navegação para Cases, Serviços e FAQ.
- Botão "Entre em contato", que abre o WhatsApp.
- Menu mobile quando a largura da tela é menor que o limite definido no componente.

A navegação vem de:

```text
src/content/home.ts
```

Constante:

```ts
navigationItems
```

### 2. Hero

Arquivo principal:

```text
src/pages/home/sections/Hero/index.tsx
```

É a primeira área da página. Ela mostra:

- Título principal.
- Destaque visual no trecho "crescer com tecnologia".
- Texto de apoio.
- Botão para iniciar conversa via WhatsApp.

O conteúdo vem de:

```ts
heroContent
```

em:

```text
src/content/home.ts
```

### 3. Cards de Destaque

Arquivo principal:

```text
src/pages/home/sections/Cards/index.tsx
```

Mostra três diferenciais:

- Estratégia Multidisciplinar.
- Soluções Sob Medida.
- Suporte Evolutivo.

O conteúdo vem de:

```ts
highlightCards
```

em:

```text
src/content/home.ts
```

### 4. Cases

Arquivo principal:

```text
src/pages/home/sections/Cases/index.tsx
```

Mostra o case autoral Underground PB, com:

- Imagem de preview.
- Título.
- Tags.
- Descrição.
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
src/assets/case-undergroundpb.png
```

### 5. Serviços

Arquivo principal:

```text
src/pages/home/sections/Services/index.tsx
```

Lista os serviços oferecidos:

- Front-end.
- Back-end.
- UI/UX Design.
- Design Gráfico.
- Design de Produto.
- Copywriting.

O conteúdo vem de:

```ts
services
servicesSectionTitle
```

em:

```text
src/content/home.ts
```

### 6. FAQ

Arquivo principal:

```text
src/pages/home/sections/FAQ/index.tsx
```

Renderiza perguntas e respostas com abertura/fechamento por interação.

As perguntas ficam em:

```text
src/content/faq.ts
```

Esse mesmo conteúdo também alimenta o JSON-LD de FAQ em:

```text
src/lib/seo.ts
```

Isso evita divergência entre o que aparece na tela e o que o Google lê como dado estruturado.

### 7. CTA Final

Arquivo principal:

```text
src/pages/home/sections/CTA/index.tsx
```

Mostra a chamada final:

- Título.
- Texto curto.
- Botão para WhatsApp.

O conteúdo vem de:

```ts
ctaContent
```

em:

```text
src/content/home.ts
```

### 8. Footer

Arquivo principal:

```text
src/pages/home/sections/Footer/index.tsx
```

Exibe:

- Logo reduzida.
- CNPJ.
- E-mail.
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

## Como Alterar Textos, Links e Conteúdos

### Alterar textos da home

Edite:

```text
src/content/home.ts
```

Esse arquivo controla:

- Links da navbar.
- Links do footer.
- Texto do hero.
- Cards de destaque.
- Case principal.
- Lista de serviços.
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
- `sitemap.xml`.

Após o deploy, envie este sitemap no Google Search Console:

```text
https://www.bytecriativotech.com.br/sitemap.xml
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

Os testes ficam em:

```text
tests/
```

### `tests/seo.test.mjs`

Valida:

- Idioma `pt-BR`.
- Title.
- Description.
- Canonical.
- Robots.
- Open Graph.
- Twitter Card.
- JSON-LD.
- Ausência de sinais ruins como `noindex`, `nofollow`, `mailto` antigo e referências à seção Equipe removida.

### `tests/public-assets.test.mjs`

Valida:

- `robots.txt`.
- `sitemap.xml`.
- Dimensões da imagem Open Graph.

### `tests/security.test.mjs`

Valida:

- Headers de segurança no Next.js.
- Proteção `noopener noreferrer` em links com `target="_blank"`.

Para executar:

```bash
npm test
```

Esse comando faz build de produção antes de rodar os testes.

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
- Se o domínio em `src/lib/seo.ts` está correto.
- Se `public/sitemap.xml` aponta para o domínio certo.
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
