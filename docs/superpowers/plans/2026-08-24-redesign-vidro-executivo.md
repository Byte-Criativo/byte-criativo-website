# Redesign Vidro Executivo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o redesign visual e comercial "Vidro Executivo" do site da Byte Criativo, incluindo as correções críticas de SEO (domínio) e SSR de CSS.

**Architecture:** Next.js 16 Pages Router com styled-components (SSR via `ServerStyleSheet` no `_document`), conteúdo centralizado em `src/content/*.ts`, SEO em `src/lib/seo.ts`, tokens de design em `src/styles/theme.ts`. O redesign troca tokens/fontes/componentes e consolida as páginas de serviço na família `/servicos/[slug]`, preservando a arquitetura existente.

**Tech Stack:** Next.js 16, React 19, TypeScript, styled-components 6, next-seo 7, next/font (Google Fonts), Phosphor Icons, Radix Dialog, Vitest + Testing Library, Playwright, Node Test Runner.

**Spec:** `docs/superpowers/specs/2026-08-24-redesign-vidro-executivo-design.md`

## Global Constraints

- Domínio canônico: `https://www.bcriativo.com` (o `.com.br` foi perdido; zero referências a ele ao final).
- Toda copy em pt-BR natural; **nenhum** conteúdo comercial inventado (sem depoimentos, logos de clientes, métricas fabricadas).
- Acento único: laranja `#F65606` / `#C24405`. O azul `#06B2F6` não pode sobrar em nenhum estilo ao final.
- Apenas 4 níveis de radius: `8px`, `14px`, `22px`, `999px`.
- `backdrop-filter` restrito a: header, menu mobile, painéis da banda escura. Sempre com fallback `@supports not (backdrop-filter: blur(1px))`.
- `prefers-reduced-motion: reduce` desliga todas as transições/animações (regra global).
- WCAG AA: foco visível em tudo que é interativo; contraste mínimo 4.5:1 (texto normal) / 3:1 (texto grande).
- Os arquivos com modificações pré-existentes do usuário (`docs/superpowers/plans/2026-07-06-rastreamento-conversao-whatsapp.md`, `docs/superpowers/specs/2026-07-06-rastreamento-conversao-whatsapp-design.md`, `package.json`, `package-lock.json`) **não** entram em nenhum commit deste plano.
- Rastreamento GTM + Consent Mode v2 fica **fora** deste plano — tem plano próprio em `docs/superpowers/plans/2026-07-06-rastreamento-conversao-whatsapp.md`, a executar depois.
- Comandos de verificação por task: `npm run check-format && npm run check-lint && npm run check-types` (o hook de pre-commit roda os três; `npm run format` corrige formatação).
- `npm test` = build de produção + testes node em `tests/` + vitest. Os testes node leem o HTML de `.next/server/pages/*.html`, então **sempre** rodam após `npm run build`.

---

### Task 1: Branch e baseline verde

**Files:** nenhum (só git/ambiente).

- [ ] **Step 1: Criar branch a partir de main**

```bash
git checkout main && git checkout -b redesign/vidro-executivo
```

- [ ] **Step 2: Instalar dependências e rodar baseline**

```bash
npm install
npm test
```

Expected: build OK e todos os testes passam (baseline). Se algo falhar aqui, PARE e reporte — o plano assume baseline verde.

---

### Task 2: Domínio canônico `bcriativo.com` (TDD)

**Files:**

- Modify: `tests/seo.test.mjs`, `tests/public-assets.test.mjs`, `tests/service-pages.test.mjs`
- Modify: `src/lib/seo.ts:9`, `public/sitemap.xml`, `public/robots.txt`

**Interfaces:**

- Produces: `SITE_URL = "https://www.bcriativo.com"` (todas as tasks seguintes assumem esse valor).

- [ ] **Step 1: Atualizar os testes para o domínio novo**

Em `tests/seo.test.mjs`, `tests/public-assets.test.mjs` e `tests/service-pages.test.mjs`, substituir todas as ocorrências:

- `https://www.bytecriativotech.com.br` → `https://www.bcriativo.com`
- `www\.bytecriativotech\.com\.br` (em regex) → `www\.bcriativo\.com`
- `bytecriativotech\.com\.br\/\/` (teste de barra dupla em seo.test.mjs linha 103) → `bcriativo\.com\/\/`

```bash
grep -rn "bytecriativotech" tests/
```

Expected após edição: nenhuma ocorrência.

- [ ] **Step 2: Rodar testes para ver falhar**

```bash
npm test
```

Expected: FAIL — canonical/OG/sitemap ainda apontam para o domínio antigo.

- [ ] **Step 3: Trocar o domínio no código e assets**

`src/lib/seo.ts` linha 9:

```ts
export const SITE_URL = "https://www.bcriativo.com"
```

`public/robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://www.bcriativo.com/sitemap.xml
```

`public/sitemap.xml`: substituir todas as `<loc>` de `https://www.bytecriativotech.com.br/...` para `https://www.bcriativo.com/...` (o conteúdo/rotas do sitemap muda só na Task 16; aqui é só o domínio) e atualizar todos os `<lastmod>` para `2026-08-24`.

- [ ] **Step 4: Rodar testes para ver passar**

```bash
npm test && grep -rn "bytecriativotech" src/ public/ tests/
```

Expected: testes PASS; grep vazio.

- [ ] **Step 5: Commit**

```bash
git add tests/ src/lib/seo.ts public/sitemap.xml public/robots.txt
git commit -m "fix(seo): troca domínio canônico para bcriativo.com"
```

---

### Task 3: Consertar SSR de CSS (FOUC) (TDD)

**Root cause já diagnosticada:** `src/lib/registry.tsx` usa `useServerInsertedHTML` de `next/navigation` (padrão App Router). Em Pages Router esse hook nunca dispara, e o `<StyleSheetManager sheet={...}>` que ele monta desvia todos os estilos SSR para uma sheet que nunca é escrita no HTML — anulando inclusive a coleta do `ServerStyleSheet` do `_document`. Resultado: HTML de produção sem nenhuma tag `<style>`.

**Files:**

- Create: `tests/ssr-styles.test.mjs`
- Modify: `src/pages/_app.page.tsx`
- Delete: `src/lib/registry.tsx`

- [ ] **Step 1: Escrever teste que exige estilos SSR no HTML**

`tests/ssr-styles.test.mjs`:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const pages = [
  ".next/server/pages/index.html",
  ".next/server/pages/portfolio.html",
  ".next/server/pages/servicos/desenvolvimento-de-sites.html",
]

test("HTML estático contém estilos SSR do styled-components", () => {
  for (const page of pages) {
    const html = readFileSync(page, "utf8")
    assert.match(
      html,
      /<style[^>]*data-styled/,
      `${page} deve conter <style data-styled> (sem isso o site renderiza sem CSS)`,
    )
  }
})
```

- [ ] **Step 2: Rodar para ver falhar**

```bash
npm run build && node --test tests/ssr-styles.test.mjs
```

Expected: FAIL — nenhum `<style data-styled>` no HTML.

- [ ] **Step 3: Remover o registry do `_app`**

Em `src/pages/_app.page.tsx`: remover o import `StyledComponentsRegistry from "../lib/registry"` e o elemento `<StyledComponentsRegistry>...</StyledComponentsRegistry>` (mantendo os filhos no lugar). Aproveitar e **remover a linha `canonical: HOME_URL`** do `generateDefaultSeo` (cada página define o próprio canonical; o default apontando para a home é perigoso para páginas futuras — o import `HOME_URL` sai se ficar órfão). O componente vira:

```tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>{/* generateDefaultSeo — inalterado nesta task */}</Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div
          className={montserrat.variable}
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  )
}
```

Apagar o arquivo:

```bash
rm src/lib/registry.tsx
```

O `_document.page.tsx` já tem o `ServerStyleSheet` correto — não mexer.

- [ ] **Step 4: Rodar para ver passar**

```bash
npm run build && node --test tests/ssr-styles.test.mjs && npm test
```

Expected: PASS em tudo.

- [ ] **Step 5: Verificar o botão pálido (efeito colateral esperado do bug)**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000/portfolio | grep -c "data-styled"
```

Expected: contagem > 0. Depois abrir `http://localhost:3000/portfolio` e conferir visualmente que o botão primário renderiza laranja `#F65606` sólido. Se continuar pálido, inspecionar `getComputedStyle` no browser e corrigir na Task 6 (redesign do Button) — registrar o achado no commit.

- [ ] **Step 6: Commit**

```bash
git add tests/ssr-styles.test.mjs src/pages/_app.page.tsx
git rm src/lib/registry.tsx
git commit -m "fix(styles): remove registry App Router que quebrava SSR do styled-components"
```

---

### Task 4: Redirects 301 das páginas duplicadas (TDD)

**Files:**

- Create: `tests/redirects.test.mjs`
- Modify: `next.config.mjs`

**Interfaces:**

- Produces: 4 redirects permanentes; a Task 16 remove as páginas de origem.

- [ ] **Step 1: Escrever teste dos redirects**

`tests/redirects.test.mjs`:

```js
import assert from "node:assert/strict"
import test from "node:test"
import nextConfig from "../next.config.mjs"

const expected = [
  ["/sites-profissionais", "/servicos/desenvolvimento-de-sites"],
  ["/sistemas-web", "/servicos/sistemas-web-sob-medida"],
  ["/landing-pages", "/servicos/landing-pages"],
  ["/automacao-e-integracoes", "/servicos/automacao-e-integracoes"],
]

test("redireciona páginas de serviço antigas com 301", async () => {
  const redirects = await nextConfig.redirects()

  for (const [source, destination] of expected) {
    const rule = redirects.find((r) => r.source === source)
    assert.ok(rule, `redirect de ${source} deve existir`)
    assert.equal(rule.destination, destination)
    assert.equal(rule.permanent, true)
  }
})
```

- [ ] **Step 2: Rodar para ver falhar**

```bash
node --test tests/redirects.test.mjs
```

Expected: FAIL — `nextConfig.redirects is not a function`.

- [ ] **Step 3: Adicionar redirects ao `next.config.mjs`**

Dentro do objeto `nextConfig`, junto do `headers()`:

```js
  async redirects() {
    return [
      {
        source: "/sites-profissionais",
        destination: "/servicos/desenvolvimento-de-sites",
        permanent: true,
      },
      {
        source: "/sistemas-web",
        destination: "/servicos/sistemas-web-sob-medida",
        permanent: true,
      },
      {
        source: "/landing-pages",
        destination: "/servicos/landing-pages",
        permanent: true,
      },
      {
        source: "/automacao-e-integracoes",
        destination: "/servicos/automacao-e-integracoes",
        permanent: true,
      },
    ]
  },
```

Nota: as rotas de destino `/servicos/automacao-e-integracoes` só passam a existir na Task 10; o redirect pode entrar antes porque o Next não valida destino. As páginas de origem continuam existindo até a Task 16 — **redirects têm precedência sobre páginas** no Next, então a partir daqui as URLs antigas já respondem 308/301.

- [ ] **Step 4: Rodar para ver passar**

```bash
node --test tests/redirects.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/redirects.test.mjs next.config.mjs
git commit -m "feat(seo): redirects 301 das páginas de serviço duplicadas"
```

---

### Task 5: Fundação — fontes e tokens do design system

**Files:**

- Modify: `src/styles/theme.ts`, `src/styles/global.ts`, `src/pages/_app.page.tsx`

**Interfaces:**

- Produces (todas as tasks seguintes consomem): `theme.color.*`, `theme.glass.*`, `theme.font.{display,body,mono}`, `theme.text.*`, `theme.weight.*`, `theme.space.*`, `theme.radius.*`, `theme.shadow.*`, `theme.motion.*`, `theme.bp.*`. Os namespaces legados (`COLORS`, `FONT_FAMILY`, `FONT_SIZE`, `FONT_WEIGHT`) permanecem até a Task 18.

- [ ] **Step 1: Trocar as fontes no `_app`**

Em `src/pages/_app.page.tsx`, substituir o bloco da Montserrat por:

```tsx
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display",
})

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
})
```

E no JSX:

```tsx
<div
  className={`${display.variable} ${body.variable} ${mono.variable}`}
  style={{ fontFamily: "var(--font-body), sans-serif" }}
>
  <Component {...pageProps} />
</div>
```

- [ ] **Step 2: Reescrever `src/styles/theme.ts` com os tokens novos + legado**

```ts
const theme = {
  color: {
    bg: "#FAFAF7",
    surface: "#FFFFFF",
    surface2: "#F1F1EC",
    ink: "#121216",
    muted: "#55555E",
    border: "#E4E4DE",
    accent: "#F65606",
    accentStrong: "#C24405",
    accentSoft: "rgba(246, 86, 6, 0.10)",
    success: "#1E8F5A",
    destructive: "#C43B3B",
    dark: {
      bg: "#121216",
      surface: "#1C1C21",
      text: "#FAFAF7",
      muted: "#A8A8B3",
      border: "#2A2A31",
    },
  },

  glass: {
    bg: "rgba(255, 255, 255, 0.55)",
    border: "rgba(255, 255, 255, 0.65)",
    highlight: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    blur: "16px",
    shadow: "0 18px 44px rgba(18, 18, 22, 0.08)",
    fallbackBg: "rgba(255, 255, 255, 0.95)",
    darkBg: "rgba(28, 28, 33, 0.55)",
    darkBorder: "rgba(255, 255, 255, 0.12)",
    darkFallbackBg: "rgba(28, 28, 33, 0.95)",
  },

  font: {
    display: "var(--font-display), sans-serif",
    body: "var(--font-body), sans-serif",
    mono: "var(--font-mono), monospace",
  },

  text: {
    display: "clamp(2.5rem, 5vw + 1rem, 4.25rem)",
    h1: "clamp(2.25rem, 4vw + 0.75rem, 3.5rem)",
    h2: "clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)",
    h3: "1.375rem",
    bodyLg: "1.125rem",
    body: "1rem",
    small: "0.875rem",
    caption: "0.75rem",
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  space: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    x2: "3rem",
    x3: "4rem",
    x4: "6rem",
    x5: "8rem",
  },

  radius: {
    sm: "8px",
    md: "14px",
    lg: "22px",
    pill: "999px",
  },

  shadow: {
    soft: "0 1px 2px rgba(18, 18, 22, 0.06)",
    lift: "0 12px 32px -12px rgba(18, 18, 22, 0.16)",
  },

  motion: {
    fast: "120ms",
    base: "200ms",
    slow: "320ms",
    ease: "cubic-bezier(0.32, 0.72, 0, 1)",
  },

  bp: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  // ===== LEGADO — remover na Task 18 (não usar em código novo) =====
  COLORS: {
    WHITE: "#FFFFFF",
    GRAY_700: "#121216",
    GRAY_500: "#55555E",
    GRAY_300: "#E4E4DE",
    GRAY_100: "#FAFAF7",
    GRAY_LOW_OPACITY: "rgba(255, 255, 255, 0.55)",
    GLASS_BORDER: "rgba(255, 255, 255, 0.65)",
    SHADOW_SOFT: "rgba(18, 18, 22, 0.08)",
    ORANGE: "#F65606",
    ORANGE_DARK: "#C24405",
    ORANGE_SOFT: "rgba(246, 86, 6, 0.10)",
    BLUE: "#C24405",
    BLUE_SOFT: "rgba(246, 86, 6, 0.10)",
  },
  FONT_FAMILY: {
    MONTSERRAT: "var(--font-body), sans-serif",
  },
  FONT_SIZE: {
    XS: "0.75rem",
    SM: "0.875rem",
    MD: "1rem",
    LG: "1.125rem",
    XL: "1.375rem",
    XXL: "1.75rem",
    SECTION_HEADING: "clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)",
    HEADING: "clamp(2.25rem, 4vw + 0.75rem, 3.5rem)",
    HEADING_MOBILE: "2.25rem",
  },
  FONT_WEIGHT: {
    REGULAR: "400",
    SEMI_BOLD: "500",
    BOLD: "700",
  },
}

export default theme
```

Os valores legados foram **remapeados para a paleta nova** (inclusive `BLUE` → laranja escuro), então componentes ainda não migrados já mudam para a paleta certa. `src/@types/styled.d.ts` deriva o tipo de `typeof theme` — confirmar que segue compilando.

- [ ] **Step 3: Reescrever `src/styles/global.ts`**

```ts
import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 7rem;
  }

  body {
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.ink};
    font-family: ${({ theme }) => theme.font.body};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.font.display};
  }

  input, button, textarea {
    font-family: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 3px;
    border-radius: 4px;
  }

  ::selection {
    background: ${({ theme }) => theme.color.accentSoft};
    color: ${({ theme }) => theme.color.accentStrong};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
```

- [ ] **Step 4: Build + testes + conferência visual**

```bash
npm test
```

Expected: PASS (testes de SEO não dependem de fonte/cor). Abrir `http://localhost:3000` e confirmar: tipografia nova aplicada, azul sumiu (tudo que era azul agora é laranja/neutro).

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/pages/_app.page.tsx
git commit -m "feat(design): tokens Vidro Executivo + fontes Bricolage/Instrument/JetBrains"
```

---

### Task 6: Button e Link redesenhados

**Files:**

- Modify: `src/components/Button/styles.ts`, `src/components/Button/index.tsx`, `src/components/Link/styles.ts`

**Interfaces:**

- Consumes: tokens da Task 5.
- Produces: `Button` aceita prop opcional `variant?: "primary" | "ghost"` (default `"primary"`). Assinatura existente (`href`, `target`, `onClick`, `children`) inalterada — nenhum call site quebra.

- [ ] **Step 1: Reescrever `src/components/Button/styles.ts`**

```ts
import Link from "next/link"
import styled, { css } from "styled-components"

export const ButtonContainer = styled(Link)<{ $variant: "primary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.875rem 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  font-family: ${({ theme }) => theme.font.body};
  font-size: ${({ theme }) => theme.text.body};
  font-weight: ${({ theme }) => theme.weight.semibold};

  transition:
    background-color ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  &::after {
    content: "→";
    margin-left: 0.5rem;
    transition: transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};
  }

  &:hover::after {
    transform: translateX(4px);
  }

  &:active {
    transform: translateY(1px);
  }

  ${({ theme, $variant }) =>
    $variant === "primary"
      ? css`
          background: ${theme.color.accent};
          color: ${theme.color.surface};
          box-shadow: ${theme.shadow.soft};

          &:hover {
            background: ${theme.color.accentStrong};
            box-shadow: ${theme.shadow.lift};
          }
        `
      : css`
          background: transparent;
          color: ${theme.color.ink};
          box-shadow: inset 0 0 0 1.5px ${theme.color.border};

          &:hover {
            box-shadow: inset 0 0 0 1.5px ${theme.color.ink};
          }
        `}
`
```

- [ ] **Step 2: Atualizar `src/components/Button/index.tsx`**

```tsx
import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { getSafeRel } from "@/src/lib/link-security"
import { ButtonContainer } from "./styles"

type ButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode
    variant?: "primary" | "ghost"
  }

export function Button({
  children,
  href,
  rel,
  target,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <ButtonContainer
      href={href}
      rel={getSafeRel(target, rel)}
      target={target}
      $variant={variant}
      {...props}
    >
      {children}
    </ButtonContainer>
  )
}
```

- [ ] **Step 3: Atualizar `src/components/Link/styles.ts`** — trocar cores para tokens novos: cor base `theme.color.ink`, hover `theme.color.accent`, focus herdado do global (remover outline azul local se houver).

- [ ] **Step 4: Verificar**

```bash
npm test
```

Expected: PASS. No dev server, conferir botão laranja sólido na home, `/servicos` e `/portfolio` (fecha a verificação da Task 3 Step 5), hover escurece, foco visível, variante ghost onde usada.

- [ ] **Step 5: Commit**

```bash
git add src/components/Button/ src/components/Link/
git commit -m "feat(design): Button primary/ghost com tokens e estados corrigidos"
```

---

### Task 7: Header e menu mobile em vidro

**Files:**

- Modify: `src/components/Header/index.tsx`, `src/components/Header/styles.ts`, `src/components/BurgerMenu/index.tsx`, `src/components/BurgerMenu/styles.ts`
- Modify: `src/content/home.ts` (label do CTA), `e2e/home.spec.ts:44`

**Interfaces:**

- Consumes: `Button` (Task 6), tokens (Task 5).
- Produces: CTA do header com label **"Falar sobre um projeto"** (o e2e passa a depender desse texto).

- [ ] **Step 1: Atualizar label do CTA**

No `src/components/Header/index.tsx` e `src/components/BurgerMenu/index.tsx`, o texto do botão de contato vira `Falar sobre um projeto` (se o label vier de `src/content/home.ts`, alterar lá).

Em `e2e/home.spec.ts` linha 44, trocar `/Agendar diagnóstico/` por `/Falar sobre um projeto/`.

- [ ] **Step 2: Restyle do `HeaderContainer`**

Em `src/components/Header/styles.ts`, aplicar tokens de glass:

```ts
export const HeaderContainer = styled.header`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  width: min(72rem, calc(100% - 2rem));
  padding: 0.875rem 1.5rem;

  display: grid;
  grid-template-columns: 1fr minmax(min-content, 1fr) 1fr;
  align-items: center;
  gap: 1rem;

  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  background: ${({ theme }) => theme.glass.fallbackBg};
  box-shadow:
    ${({ theme }) => theme.glass.shadow},
    ${({ theme }) => theme.glass.highlight};

  @supports (backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.bg};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  }
`
```

Manter as regras existentes de `.logo`, `.logo-mini` e breakpoints, trocando os valores de media query para `theme.bp` (`855px` → `${({ theme }) => theme.bp.md}` etc. — o burger passa a aparecer abaixo de `1024px` para acomodar 5 itens + CTA).

- [ ] **Step 3: Restyle de `NavItem`** — fonte `theme.font.body`, cor `theme.color.ink`, hover `theme.color.accent`, sublinhado animado existente mantido com `background: theme.color.accent`.

- [ ] **Step 4: Menu mobile (BurgerMenu)** — painel do Radix Dialog com o mesmo tratamento de vidro (mesmo bloco `@supports` do header), fundo fallback sólido, links com `theme.text.h3`, CTA `Button` no rodapé do painel.

- [ ] **Step 5: Verificar**

```bash
npm test && npx playwright test e2e/home.spec.ts
```

Expected: PASS (o teste de menu mobile e o de CTA já validam o comportamento). Conferir visualmente vidro no header e no menu mobile (dev server, viewport 390px).

- [ ] **Step 6: Commit**

```bash
git add src/components/Header/ src/components/BurgerMenu/ src/content/home.ts e2e/home.spec.ts
git commit -m "feat(design): header e menu mobile em liquid glass"
```

---

### Task 8: Hero novo com assinatura `;`

**Files:**

- Modify: `src/content/home.ts` (heroContent), `src/pages/home/sections/Hero/index.tsx`, `src/pages/home/sections/Hero/styles.ts`

**Interfaces:**

- Consumes: `Button` (Task 6), tokens (Task 5).
- Produces: `heroContent` com as chaves `{ eyebrow, heading, description, ctaLabel, secondaryCtaLabel, secondaryCtaHref }` (a chave `highlight` deixa de existir).

- [ ] **Step 1: Nova copy em `src/content/home.ts`**

```ts
export const heroContent = {
  eyebrow: "software house · design e engenharia",
  heading: "Sites e sistemas sob medida para vender mais e operar melhor",
  description:
    "A Byte Criativo planeja, desenha e desenvolve o projeto inteiro com o mesmo time. Você conversa direto com quem decide e escreve o código.",
  ctaLabel: "Falar sobre meu projeto",
  secondaryCtaLabel: "Ver projetos",
  secondaryCtaHref: "/portfolio",
} as const
```

- [ ] **Step 2: Novo `Hero/index.tsx`**

```tsx
import { Button } from "@/src/components/Button"
import { heroContent } from "@/src/content/home"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import {
  HeroActions,
  HeroBackdrop,
  HeroContainer,
  HeroEyebrow,
  HeroHeading,
} from "./styles"

export function HeroSection() {
  return (
    <HeroContainer>
      <HeroBackdrop aria-hidden="true">;</HeroBackdrop>
      <HeroEyebrow>{heroContent.eyebrow}</HeroEyebrow>
      <HeroHeading>
        {heroContent.heading}
        <span>;</span>
      </HeroHeading>
      <p>{heroContent.description}</p>
      <HeroActions>
        <Button
          href={WHATSAPP_URL}
          target="_blank"
          onClick={() => trackWhatsAppClick("hero")}
        >
          {heroContent.ctaLabel}
        </Button>
        <Button href={heroContent.secondaryCtaHref} variant="ghost">
          {heroContent.secondaryCtaLabel}
        </Button>
      </HeroActions>
    </HeroContainer>
  )
}
```

Os SVGs `byteSymbolLeft/Right` saem do Hero (ficam em `public/` — ainda são referenciados por outros styles até as tasks 16–17).

- [ ] **Step 3: Novo `Hero/styles.ts`**

```ts
import styled from "styled-components"

export const HeroContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.x4} 0 ${({ theme }) => theme.space.x3};
  text-align: center;

  > p {
    max-width: 44rem;
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.6;
  }
`

export const HeroBackdrop = styled.div`
  position: absolute;
  top: 50%;
  right: -2rem;
  transform: translateY(-55%);
  z-index: -1;
  font-family: ${({ theme }) => theme.font.display};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: clamp(18rem, 34vw, 30rem);
  line-height: 1;
  color: ${({ theme }) => theme.color.surface2};
  user-select: none;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    display: none;
  }
`

export const HeroEyebrow = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.caption};
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.muted};
`

export const HeroHeading = styled.h1`
  max-width: 56rem;
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.text.display};
  font-weight: ${({ theme }) => theme.weight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.ink};

  > span {
    color: ${({ theme }) => theme.color.accent};
  }
`

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.space.xs};
`
```

- [ ] **Step 4: Verificar**

O teste de SEO valida o H1 implicitamente via title/description — o H1 novo não quebra os testes, mas **conferir**: `tests/seo.test.mjs` não referencia o texto antigo do hero. Rodar:

```bash
npm test && npx playwright test e2e/home.spec.ts
```

Expected: PASS. Visual: headline com `;` laranja, glifo gigante ao fundo à direita, dois CTAs.

- [ ] **Step 5: Commit**

```bash
git add src/content/home.ts src/pages/home/sections/Hero/
git commit -m "feat(home): hero novo com assinatura de ponto e vírgula"
```

---

### Task 9: Case Underground PB com screenshot real

**Files:**

- Create: `src/assets/case-undergroundpb-screenshot.png`
- Modify: `src/pages/home/sections/Cases/index.tsx`, `src/pages/home/sections/Cases/styles.ts`, `src/content/pages.ts` (imagem do card de portfólio)

- [ ] **Step 1: Capturar screenshot real da interface do UPB**

```bash
npx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=5000 \
  https://www.undergroundpb.com.br/ src/assets/case-undergroundpb-screenshot.png
```

Conferir a imagem manualmente: deve mostrar a interface do site (não uma tela de carregamento). Se a captura vier ruim, repetir com `--full-page` e recortar o topo.

- [ ] **Step 2: Usar a imagem nova na seção Cases e no portfólio**

Em `src/pages/home/sections/Cases/index.tsx`, trocar o import de `case-undergroundpb.png` por `case-undergroundpb-screenshot.png`. Em `src/content/pages.ts`, atualizar o import `CaseUndergroundPB` para o mesmo arquivo novo. O arquivo antigo `src/assets/case-undergroundpb.png` é removido com `git rm` **somente após** confirmar que nenhum outro arquivo o importa (`grep -rn "case-undergroundpb.png" src/`).

- [ ] **Step 3: Restyle da seção Cases**

Em `Cases/styles.ts`: imagem em painel com `border-radius: ${theme.radius.lg}`, `border: 1px solid ${theme.color.border}`, `box-shadow: ${theme.shadow.lift}`; tags em `theme.font.mono` caixa alta com `background: ${theme.color.surface2}` e `border-radius: ${theme.radius.pill}`; blocos Desafio/Solução/Resultado mantidos com barra lateral `2px solid ${theme.color.accent}`. Layout: imagem à esquerda (55%), conteúdo à direita; empilha abaixo de `theme.bp.lg`. Eyebrow da seção em mono (`prova de trabalho`).

- [ ] **Step 4: Verificar e commit**

```bash
npm test
git add src/assets/ src/pages/home/sections/Cases/ src/content/pages.ts
git commit -m "feat(home): case UPB com screenshot real da interface"
```

---

### Task 10: Sétimo serviço (automação) + grid de serviços

**Files:**

- Modify: `src/content/services.ts`, `src/content/home.ts` (lista `services`), `src/pages/home/sections/Services/index.tsx`, `src/pages/home/sections/Services/styles.ts`, `tests/service-pages.test.mjs`

**Interfaces:**

- Produces: rota `/servicos/automacao-e-integracoes` gerada pelo `getStaticPaths` existente (deriva de `servicePages`); card de automação na home.

- [ ] **Step 1: Teste primeiro — adicionar automação a `tests/service-pages.test.mjs`**

No array `servicePages` do teste, adicionar:

```js
  {
    slug: "automacao-e-integracoes",
    title: "Automação de Processos e Integração de Sistemas | Byte Criativo",
    h1: "Automação e integrações",
  },
```

Rodar `npm test` → Expected: FAIL (`.next/server/pages/servicos/automacao-e-integracoes.html` não existe).

- [ ] **Step 2: Adicionar o serviço em `src/content/services.ts`**

Acrescentar ao array `servicePages`:

```ts
  {
    slug: "automacao-e-integracoes",
    title: "Automação e integrações",
    seoTitle: "Automação de Processos e Integração de Sistemas",
    eyebrow: "Processos mais conectados",
    description:
      "Conectamos ferramentas, automatizamos tarefas repetitivas e criamos fluxos previsíveis entre formulários, sistemas, planilhas, e-mails, agendas, CRMs e APIs.",
    promise:
      "Quando a rotina depende de copiar e colar entre ferramentas, automatizar costuma ser o caminho mais barato para ganhar tempo e reduzir erros.",
    bestFor: [
      "Empresas com etapas manuais repetitivas entre sistemas",
      "Times que dependem de várias ferramentas desconectadas",
      "Operações que perdem tempo com digitação duplicada",
    ],
    outcomes: [
      "Fluxos automáticos entre as ferramentas que você já usa",
      "Menos erros de digitação e retrabalho",
      "Dados centralizados para decidir com mais segurança",
    ],
    deliverables: [
      "Mapeamento do fluxo atual e dos pontos de fricção",
      "Integrações com APIs, planilhas, e-mails e CRMs",
      "Automação de notificações e rotinas operacionais",
      "Documentação essencial de uso",
    ],
    process: [
      "Entendimento do processo e das ferramentas atuais",
      "Priorização do fluxo com maior ganho de tempo",
      "Implementação incremental com validações",
      "Acompanhamento e ajustes após a entrega",
    ],
    faqs: [
      {
        question: "Preciso trocar as ferramentas que já uso?",
        answer:
          "Na maioria dos casos, não. A automação aproveita o que já funciona e conecta as pontas, desde que as ferramentas tenham APIs ou formatos de exportação utilizáveis.",
      },
      {
        question: "Automação serve para empresas pequenas?",
        answer:
          "Sim. Quanto menor o time, mais caro é o tempo gasto com tarefas repetitivas. Fluxos simples já trazem ganho perceptível.",
      },
    ],
  },
```

- [ ] **Step 3: Card na home** — em `src/content/home.ts`, adicionar ao array `services`:

```ts
  {
    icon: "plugs",
    title: "Automação e integrações",
    description:
      "Conexões entre ferramentas, APIs e planilhas para reduzir tarefas manuais.",
    href: "/servicos/automacao-e-integracoes",
  },
```

Em `src/pages/home/sections/Services/index.tsx`, registrar o ícone `plugs` no mapa de ícones Phosphor (import `Plugs` de `@phosphor-icons/react`), seguindo o padrão dos ícones existentes.

- [ ] **Step 4: Restyle do grid** — `Services/styles.ts`: grid `repeat(3, 1fr)` (2 col em `bp.lg`, 1 em `bp.md`); cards com `background: ${theme.color.surface}`, `border: 1px solid ${theme.color.border}`, `border-radius: ${theme.radius.md}`, hover com `box-shadow: ${theme.shadow.lift}` e `transform: translateY(-2px)`; ícone em `theme.color.accent` sem caixa de fundo pastel; link "Saiba mais" → label do card inteiro clicável mantendo o padrão atual de link. A coluna de título lateral morre: `SectionTitle` fica acima do grid, largura total.

- [ ] **Step 5: Verificar e commit**

```bash
npm test
git add src/content/ src/pages/home/sections/Services/ tests/service-pages.test.mjs
git commit -m "feat(servicos): adiciona automação e integrações à família /servicos"
```

---

### Task 11: Seção Processo

**Files:**

- Modify: `src/pages/home/sections/Process/index.tsx`, `src/pages/home/sections/Process/styles.ts`

- [ ] **Step 1: Restyle** — os 4 passos são uma sequência real, então numeração `01–04` em `theme.font.mono` cor `theme.color.accent`; layout horizontal (4 colunas em desktop, 2 em `bp.lg`, 1 em `bp.sm`) com régua `1px ${theme.color.border}` conectando; título `theme.text.h3` em display; sem cards com sombra — superfície plana `theme.color.bg` (a seção respira sem virar grade de caixas). Copy inalterada.

- [ ] **Step 2: Verificar e commit**

```bash
npm test
git add src/pages/home/sections/Process/
git commit -m "feat(home): seção processo com numeração mono"
```

---

### Task 12: Seção "Por que a Byte Criativo" + nova ordem da home

**Files:**

- Create: `src/pages/home/sections/WhyUs/index.tsx`, `src/pages/home/sections/WhyUs/styles.ts`
- Modify: `src/content/home.ts`, `src/pages/home/index.tsx`
- Delete: `src/pages/home/sections/Cards/`, `src/pages/home/sections/Audience/`, `src/pages/home/sections/Trust/`

**Interfaces:**

- Produces: `whyUsSectionTitle` e `whyUs` em `src/content/home.ts`; home com ordem Hero → Cases → Services → Process → WhyUs → FAQ → CTA.

- [ ] **Step 1: Conteúdo novo em `src/content/home.ts`**

Remover `highlightCards`, `audiences`, `audienceSectionTitle`, `trustSignals`, `trustSectionTitle`. Adicionar:

```ts
export const whyUsSectionTitle = {
  eyebrow: "diferenciais",
  heading: "Por que a Byte Criativo",
} as const

export const whyUs = [
  {
    title: "Diagnóstico antes do código",
    description:
      "Entendemos objetivo, público e operação antes de propor qualquer solução.",
  },
  {
    title: "SEO, performance e segurança desde a base",
    description:
      "Não são extras: entram na estrutura do projeto no primeiro dia.",
  },
  {
    title: "Contato direto",
    description:
      "Quem responde sua mensagem é quem projeta e desenvolve, então nada se perde no caminho.",
  },
] as const
```

- [ ] **Step 2: Componente `WhyUs`**

`src/pages/home/sections/WhyUs/index.tsx`:

```tsx
import { SectionTitle } from "@/src/components/SectionTitle"
import { whyUs, whyUsSectionTitle } from "@/src/content/home"
import { WhyUsContainer, WhyUsGrid, WhyUsItem } from "./styles"

export function WhyUsSection() {
  return (
    <WhyUsContainer>
      <SectionTitle
        eyebrow={whyUsSectionTitle.eyebrow}
        heading={whyUsSectionTitle.heading}
      />
      <WhyUsGrid>
        {whyUs.map((item) => (
          <WhyUsItem key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </WhyUsItem>
        ))}
      </WhyUsGrid>
    </WhyUsContainer>
  )
}
```

Conferir a assinatura real do `SectionTitle` antes (em `src/components/SectionTitle/index.tsx`) e adaptar as props se divergirem. `styles.ts`: grid de 3 colunas (1 em `bp.md`), itens separados por régua superior `1px ${theme.color.border}`, título `theme.text.h3`, texto `theme.color.muted`.

- [ ] **Step 3: Nova ordem em `src/pages/home/index.tsx`**

```tsx
<HomeContent>
  <HeroSection />
  <CasesSection />
  <ServicesSection />
  <ProcessSection />
  <WhyUsSection />
  <FAQSection />
  <CTASection />
</HomeContent>
```

Remover imports/uso de `CardsSection`, `AudienceSection`, `TrustSection` e apagar os diretórios:

```bash
git rm -r src/pages/home/sections/Cards src/pages/home/sections/Audience src/pages/home/sections/Trust
```

Remover também a chave `audience` de `sectionIds` se nada mais a referencia (`grep -rn "sectionIds.audience" src/`).

- [ ] **Step 4: Verificar e commit**

```bash
npm test && npx playwright test e2e/home.spec.ts
git add -A src/pages/home/ src/content/home.ts
git commit -m "feat(home): funde diferenciais em WhyUs e reordena seções"
```

---

### Task 13: FAQ reescrita

**Files:**

- Modify: `src/content/faq.ts`, `src/components/QuestionAnswer/styles.ts`, `e2e/home.spec.ts:18-23`, `src/components/QuestionAnswer/QuestionAnswer.test.tsx` (se referenciar copy antiga)

- [ ] **Step 1: Substituir o conteúdo de `src/content/faq.ts`**

```ts
export type QuestionAnswer = {
  id: number
  question: string
  answer: string
}

export const questionsAndAnswers: QuestionAnswer[] = [
  {
    id: 1,
    question: "O que a Byte Criativo desenvolve?",
    answer:
      "Sites institucionais, sistemas web sob medida, landing pages, automações e produtos digitais. Também cuidamos de UI/UX e dos textos, para o projeto sair completo.",
  },
  {
    id: 2,
    question: "Como funciona o processo?",
    answer:
      "Começamos entendendo seu objetivo e sua operação. Com isso definimos escopo, prazo e investimento antes de escrever código. Durante o desenvolvimento você acompanha as decisões, e depois da entrega seguimos disponíveis para evolução.",
  },
  {
    id: 3,
    question: "Quanto custa e quanto tempo leva?",
    answer:
      "Depende do escopo. Um site institucional e um sistema com login e painéis são projetos muito diferentes. Depois da primeira conversa, você recebe uma proposta com valores, etapas e prazo.",
  },
  {
    id: 4,
    question: "Preciso ter tudo definido antes de falar com vocês?",
    answer:
      "Não. Pode chegar com uma ideia solta ou um problema de operação. Organizar isso em escopo é parte do nosso trabalho.",
  },
]
```

- [ ] **Step 2: Atualizar testes que citam a copy antiga**

`e2e/home.spec.ts` linhas 18–23: trocar `/Quais os trabalhos/` por `/O que a Byte Criativo desenvolve/` e `/web apps/i` por `/sistemas web sob medida/i`. Verificar `QuestionAnswer.test.tsx` (`grep -n "Quais os trabalhos\|web apps" src/components/QuestionAnswer/QuestionAnswer.test.tsx`) e atualizar da mesma forma se citar o conteúdo.

- [ ] **Step 3: Restyle leve do `QuestionAnswer`** — pergunta em `theme.font.body` semibold, régua `theme.color.border`, ícone de seta em `theme.color.accent`, foco visível herdado do global.

- [ ] **Step 4: Verificar e commit**

O JSON-LD FAQPage deriva de `questionsAndAnswers` — `tests/seo.test.mjs` exige `faq.mainEntity.length >= 4` (segue passando com 4).

```bash
npm test && npx playwright test e2e/home.spec.ts
git add src/content/faq.ts src/components/QuestionAnswer/ e2e/home.spec.ts
git commit -m "feat(conteudo): reescreve FAQ e remove promessa de formulário inexistente"
```

---

### Task 14: LeadForm + CTA final em banda escura (TDD)

**Files:**

- Create: `src/lib/lead.ts`, `src/lib/lead.test.ts`, `src/components/LeadForm/index.tsx`, `src/components/LeadForm/styles.ts`, `src/components/LeadForm/LeadForm.test.tsx`
- Modify: `src/content/home.ts` (ctaContent), `src/pages/home/sections/CTA/index.tsx`, `src/pages/home/sections/CTA/styles.ts`

**Interfaces:**

- Consumes: `buildWhatsAppUrl(number, message)` e `WHATSAPP_NUMBER` de `src/lib/contact.ts`; `trackWhatsAppClick` de `src/lib/analytics.ts`.
- Produces: `buildLeadMessage({ name, company, need }): string`; componente `<LeadForm />` sem props.

- [ ] **Step 1: Teste da mensagem (`src/lib/lead.test.ts`)**

```ts
import { describe, expect, it } from "vitest"
import { buildLeadMessage } from "./lead"

describe("buildLeadMessage", () => {
  it("monta mensagem com nome, empresa e necessidade", () => {
    expect(
      buildLeadMessage({
        name: "Ana",
        company: "Padaria Real",
        need: "um site novo",
      }),
    ).toBe("Olá! Sou Ana, da empresa Padaria Real. Preciso de: um site novo")
  })

  it("omite a empresa quando vazia", () => {
    expect(
      buildLeadMessage({ name: "Ana", company: "  ", need: "um site novo" }),
    ).toBe("Olá! Sou Ana. Preciso de: um site novo")
  })
})
```

- [ ] **Step 2: Rodar para ver falhar**

```bash
npx vitest run src/lib/lead.test.ts
```

Expected: FAIL — módulo não existe.

- [ ] **Step 3: Implementar `src/lib/lead.ts`**

```ts
export type LeadFields = {
  name: string
  company: string
  need: string
}

export function buildLeadMessage({ name, company, need }: LeadFields): string {
  const companyPart = company.trim() ? `, da empresa ${company.trim()}` : ""
  return `Olá! Sou ${name.trim()}${companyPart}. Preciso de: ${need.trim()}`
}
```

- [ ] **Step 4: Rodar para ver passar**

```bash
npx vitest run src/lib/lead.test.ts
```

Expected: PASS.

- [ ] **Step 5: Teste do componente (`src/components/LeadForm/LeadForm.test.tsx`)**

Seguir o padrão de render de `src/test/utils.tsx` (tem provider de tema — conferir a assinatura antes de usar):

```tsx
import { describe, expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import { renderWithTheme } from "@/src/test/utils"
import { LeadForm } from "./index"

describe("LeadForm", () => {
  it("abre o WhatsApp com a mensagem montada", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null)
    renderWithTheme(<LeadForm />)

    await userEvent.type(screen.getByLabelText(/nome/i), "Ana")
    await userEvent.type(screen.getByLabelText(/empresa/i), "Padaria Real")
    await userEvent.type(
      screen.getByLabelText(/o que você precisa/i),
      "um site novo",
    )
    await userEvent.click(
      screen.getByRole("button", { name: /enviar e abrir conversa/i }),
    )

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("wa.me"),
      "_blank",
      "noopener,noreferrer",
    )
    expect(open.mock.calls[0][0]).toContain(encodeURIComponent("Padaria Real"))
    open.mockRestore()
  })
})
```

Se `src/test/utils.tsx` exportar outro nome (ex.: `render`), usar o nome real.

- [ ] **Step 6: Implementar `src/components/LeadForm/index.tsx`**

```tsx
import { FormEvent, useState } from "react"
import { buildLeadMessage } from "@/src/lib/lead"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import { Field, FormContainer, SubmitButton } from "./styles"

export function LeadForm() {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [need, setNeed] = useState("")

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const message = buildLeadMessage({ name, company, need })
    trackWhatsAppClick("cta")
    window.open(
      buildWhatsAppUrl(WHATSAPP_NUMBER, message),
      "_blank",
      "noopener,noreferrer",
    )
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Field>
        <label htmlFor="lead-name">Nome</label>
        <input
          id="lead-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </Field>
      <Field>
        <label htmlFor="lead-company">Empresa (opcional)</label>
        <input
          id="lead-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
        />
      </Field>
      <Field>
        <label htmlFor="lead-need">O que você precisa</label>
        <textarea
          id="lead-need"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          required
          rows={3}
        />
      </Field>
      <SubmitButton type="submit">Enviar e abrir conversa</SubmitButton>
    </FormContainer>
  )
}
```

`styles.ts`: inputs com `background: ${theme.color.dark.surface}`, `border: 1px solid ${theme.color.dark.border}`, texto `theme.color.dark.text`, `border-radius: ${theme.radius.sm}`, labels `theme.text.small` em `theme.color.dark.muted`; `SubmitButton` = mesmo visual do Button primary (botão `<button>`, não Link).

- [ ] **Step 7: CTA final vira banda escura com o form**

`src/pages/home/sections/CTA/index.tsx`: título e descrição de `ctaContent` + `<LeadForm />` (o botão antigo sai). `styles.ts`: seção full-bleed com `background: ${theme.color.dark.bg}`, texto `theme.color.dark.text`, painel interno com glass escuro (`theme.glass.darkBg` + blur + fallback `theme.glass.darkFallbackBg`), `border-radius: ${theme.radius.lg}`. Em `src/content/home.ts`, `ctaContent.buttonLabel` deixa de existir (o label mora no LeadForm).

- [ ] **Step 8: Rodar tudo e commit**

```bash
npx vitest run && npm test
git add src/lib/lead.ts src/lib/lead.test.ts src/components/LeadForm/ src/pages/home/sections/CTA/ src/content/home.ts
git commit -m "feat(conversao): formulário curto que abre o WhatsApp na banda final escura"
```

---

### Task 15: Footer escuro

**Files:**

- Modify: `src/pages/home/sections/Footer/index.tsx`, `src/pages/home/sections/Footer/styles.ts`

- [ ] **Step 1: Restyle** — fundo `theme.color.dark.bg` contínuo com a banda do CTA (sem costura visível), texto `theme.color.dark.muted`, links com hover `theme.color.accent`, logo `MiniLogo.png` mantida, CNPJ/e-mail/WhatsApp/redes inalterados. Régua superior `1px solid ${theme.color.dark.border}` separando da banda CTA.

- [ ] **Step 2: Verificar contraste** — texto `#A8A8B3` sobre `#121216` ≈ 7:1 (AA ok); links de navegação em `theme.color.dark.text`.

- [ ] **Step 3: Verificar e commit**

```bash
npm test
git add src/pages/home/sections/Footer/
git commit -m "feat(home): footer escuro contínuo com a banda de conversão"
```

---

### Task 16: Consolidação das páginas internas

**Files:**

- Delete: `src/pages/sites-profissionais.page.tsx`, `src/pages/sistemas-web.page.tsx`, `src/pages/landing-pages.page.tsx`, `src/pages/automacao-e-integracoes.page.tsx`, `src/pages/blog.page.tsx`
- Modify: `src/content/pages.ts`, `src/content/home.ts` (navs), `src/components/MarketingPage/index.tsx`, `src/components/MarketingPage/styles.ts`, `public/sitemap.xml`, `tests/public-assets.test.mjs`

- [ ] **Step 1: Remover páginas duplicadas e blog**

```bash
git rm src/pages/sites-profissionais.page.tsx src/pages/sistemas-web.page.tsx \
  src/pages/landing-pages.page.tsx src/pages/automacao-e-integracoes.page.tsx \
  src/pages/blog.page.tsx
```

(As 4 primeiras já respondem redirect desde a Task 4; o blog sai por decisão da spec — a rota morre até existir conteúdo.)

Em `src/content/pages.ts`: apagar as entradas `sitesProfissionais`, `sistemasWeb`, `landingPages`, `automacaoIntegracoes`, `blog` e o array `pageRoutes` correspondente; na entrada `servicos`, trocar os `href`/`ctaLabel` dos 4 cards com link para os equivalentes da família `/servicos/*` (`/servicos/desenvolvimento-de-sites`, `/servicos/sistemas-web-sob-medida`, `/servicos/landing-pages`, `/servicos/automacao-e-integracoes`) e o `secondaryCtaHref` do hub para `/servicos/desenvolvimento-de-sites`.

- [ ] **Step 2: Navegação sem Blog**

Em `src/content/home.ts`, remover o item Blog de `navigationItems` e `footerNavigationItems`.

- [ ] **Step 3: Restyle do `MarketingPage`**

Em `styles.ts`: remover `background-image: url("/background.svg")` do `PageContainer` (fundo passa a ser `theme.color.bg`); remover o componente `HeroPanel` e seu uso no `index.tsx` (o painel duplicava a meta description); `HeroContent` com `h1` em `theme.font.display`/`theme.text.h1` e eyebrow no padrão mono (mesmo estilo do `HeroEyebrow` da Task 8); cards com o visual da Task 10; `SecondaryLink` substituído por `<Button variant="ghost">`. Se `public/background.svg` não for mais referenciado (`grep -rn "background.svg" src/`), remover com `git rm`.

- [ ] **Step 4: Sitemap final**

`public/sitemap.xml` passa a conter exatamente estas URLs (todas `https://www.bcriativo.com`, `lastmod 2026-08-24`): `/`, `/sobre`, `/servicos`, `/portfolio`, `/contato`, `/servicos/desenvolvimento-de-sites`, `/servicos/sistemas-web-sob-medida`, `/servicos/ui-ux-design`, `/servicos/landing-pages`, `/servicos/design-de-produto`, `/servicos/copywriting-para-web`, `/servicos/automacao-e-integracoes`.

Em `tests/public-assets.test.mjs`: atualizar os asserts para as URLs novas e adicionar asserts negativos:

```js
assert.doesNotMatch(
  sitemap,
  /sites-profissionais|\/sistemas-web<|\/landing-pages<|\/automacao-e-integracoes<\/loc>|\/blog/,
)
```

(ajustar a regex ao formato real do arquivo de teste ao editá-lo — a intenção: sitemap não contém as rotas redirecionadas nem blog).

- [ ] **Step 5: Verificar e commit**

```bash
npm test && npx playwright test
git add -A
git status --short   # conferir: nada de package.json/package-lock/docs de WhatsApp no stage
git commit -m "feat(paginas): consolida serviços em /servicos e remove blog vazio"
```

Se `package.json`, `package-lock.json` ou os docs de WhatsApp aparecerem no stage, `git restore --staged <arquivo>` antes do commit.

---

### Task 17: Restyle das páginas `/servicos/[slug]`

**Files:**

- Modify: `src/pages/servicos/[slug].page.tsx`, `src/pages/servicos/styles.ts`

- [ ] **Step 1: Breadcrumb correto** — no JSON-LD do `[slug].page.tsx`, o item 2 do `BreadcrumbList` aponta para `${HOME_URL}#services`; trocar para `${SITE_URL}/servicos`.

- [ ] **Step 2: Restyle** — aplicar tokens: hero com eyebrow mono + `h1` display; blocos `bestFor`/`outcomes`/`deliverables` como listas com marcador `;` em `theme.color.accent` (`li::marker` ou pseudo-elemento); `process` numerado `01–04` como na Task 11; FAQ local no padrão da Task 13; CTA final reutiliza o `Button`. Remover usos de `byteSymbol*.svg` e do gradiente antigo nesses styles.

- [ ] **Step 3: Verificar e commit**

```bash
npm test
git add src/pages/servicos/
git commit -m "feat(servicos): restyle das páginas de serviço com tokens novos"
```

---

### Task 18: Limpeza dos tokens legados

**Files:**

- Modify: `src/styles/theme.ts`, todos os `styles.ts` que ainda usarem chaves legadas, `src/pages/home/styles.ts`, `src/pages/home/sections/FAQ/styles.ts`, `src/components/{SectionTitle,HighlightCard,CardContent}/styles.ts`
- Delete: `src/components/HighlightCard/` e `src/components/CardContent/` **se** órfãos após as tasks 12/16 (`grep -rn "HighlightCard\|CardContent" src/ --include="*.tsx"`).

- [ ] **Step 1: Migrar consumidores restantes**

```bash
grep -rln "COLORS\.\|FONT_SIZE\.\|FONT_WEIGHT\.\|FONT_FAMILY\." src/
```

Para cada arquivo listado, trocar para os tokens novos equivalentes (`COLORS.GRAY_700→color.ink`, `GRAY_500→color.muted`, `GRAY_300→color.border`, `GRAY_100→color.bg`, `WHITE→color.surface`, `ORANGE→color.accent`, `ORANGE_DARK→color.accentStrong`, `ORANGE_SOFT/BLUE_SOFT→color.accentSoft`, `BLUE→color.accentStrong`, `GRAY_LOW_OPACITY→glass.bg`, `GLASS_BORDER→glass.border`, `SHADOW_SOFT→glass.shadow`, `FONT_SIZE.*→text.*`, `FONT_WEIGHT.*→weight.*`, `FONT_FAMILY.MONTSERRAT→font.body`). Inclui `src/pages/home/styles.ts` (remover o wash de fundo antigo — fundo vira `theme.color.bg` limpo).

- [ ] **Step 2: Apagar o bloco legado do `theme.ts`** (tudo abaixo do comentário `LEGADO`) e rodar:

```bash
npm run check-types && grep -rn "COLORS\.\|FONT_SIZE\.\|MONTSERRAT" src/
```

Expected: types OK, grep vazio.

- [ ] **Step 3: Remover componentes órfãos** (se o grep do cabeçalho confirmar) e o tema antigo do `themeColor` do `_app` (`theme.COLORS.ORANGE` → `theme.color.accent` no `generateDefaultSeo`).

- [ ] **Step 4: Verificar e commit**

```bash
npm test
git add -A src/
git commit -m "refactor(design): remove tokens legados e componentes órfãos"
```

---

### Task 19: QA final, README e auditoria

**Files:**

- Modify: `README.md` (seções: fontes, estrutura de seções da home, páginas, sitemap)

- [ ] **Step 1: Suíte completa**

```bash
npm run lint && npm run check-types && npm test && npx playwright test
```

Expected: tudo verde.

- [ ] **Step 2: QA visual por breakpoint** — com `npm run dev`, conferir em 360, 480, 768, 1024, 1280 e 1680px: header/menu mobile, hero (glifo `;` some no mobile), case, grids (3→2→1), banda escura, footer. Procurar: overflow horizontal, texto cortado, radius inconsistente, hover/focus quebrados, formulário com labels visíveis e foco correto.

- [ ] **Step 3: Acessibilidade** — navegação completa por teclado (Tab até o formulário e enviar), foco visível em cada parada, `prefers-reduced-motion` ativado no OS não deixa nada se movendo, contraste dos textos sobre vidro nas duas bandas.

- [ ] **Step 4: Lighthouse** — `npm run build && npm run start` e rodar Lighthouse (Chrome DevTools) na home e em uma página de serviço. Metas: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Se alguma meta falhar, registrar causa exata e corrigir o que for do escopo (imagens, blur em excesso); o que não for, documentar.

- [ ] **Step 5: Atualizar README** — seções "Como o site funciona" (nova ordem de seções: Hero, Cases, Serviços, Processo, Por que, FAQ, CTA com formulário, Footer), fontes (Bricolage Grotesque/Instrument Sans/JetBrains Mono), estrutura de pastas (sem Cards/Audience/Trust, com WhyUs/LeadForm), domínio `bcriativo.com` no trecho do Search Console.

- [ ] **Step 6: Commit final**

```bash
git add README.md
git commit -m "docs: atualiza README para o redesign Vidro Executivo"
```

- [ ] **Step 7: Reportar** — resumo do que mudou, resultados do Lighthouse, e pendências fora de escopo (GTM/Consent Mode com plano próprio; blog; novos cases).
