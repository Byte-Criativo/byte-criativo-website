# Rastreamento de conversão de WhatsApp — Plano de Implementação

> **Para workers agênticos:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar este plano tarefa a tarefa. Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Objetivo:** Medir cliques no WhatsApp como conversão do Google Ads, carregando o Google Tag Manager com Consent Mode v2 (LGPD) e um banner de consentimento próprio, sem colocar nenhum ID do Google Ads no repositório.

**Arquitetura:** O código do site só empurra um evento limpo (`whatsapp_click`) para o `window.dataLayer`; o mapeamento para a tag de conversão do Google Ads é feito na interface do GTM. Uma variável `NEXT_PUBLIC_GTM_ID` liga/desliga todo o carregamento de tags e do banner — sem ela, o site se comporta exatamente como hoje. Um script inline de *consent default* roda antes do GTM para garantir a ordem correta do consentimento.

**Tech Stack:** Next.js 16 (Pages Router), TypeScript, styled-components, `@next/third-parties/google` (GTM), Vitest + Testing Library, node:test, Playwright.

## Global Constraints

- **Framework:** Next.js 16, Pages Router (`*.page.tsx`), TypeScript, styled-components. Seguir os padrões existentes.
- **Sem IDs do Google Ads no repositório.** A única variável é `NEXT_PUBLIC_GTM_ID` (ex.: `GTM-XXXXXXX`).
- **Degradação segura:** sem `NEXT_PUBLIC_GTM_ID`, nenhum script/banner é renderizado e todos os helpers de tracking são no-op. O site permanece idêntico ao atual.
- **Única conversão rastreada:** `whatsapp_click`, com `location` do tipo `"hero" | "header" | "cta" | "menu" | "footer"`.
- **Consentimento:** Consent Mode v2, padrão `denied` para `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`. Banner próprio (sem CMP de terceiros).
- **Idioma:** todo texto de UI, comentários de código e mensagens de commit em português brasileiro.
- **Segurança:** manter as diretivas de CSP já testadas (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`) e a proteção anti-tabnabbing (`rel="noopener noreferrer"` via `getSafeRel`).
- **Imports:** usar o alias `@/src/...` como no restante do código.
- **Testes:** unit/componente com `vitest` (`npx vitest run <arquivo>`); testes `.mjs` com `node --test` (exigem `npm run build` antes); e2e com Playwright (exige Chrome — em macOS: `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`).

---

## Estrutura de arquivos

**Criar:**
- `src/lib/analytics.ts` — `pushToDataLayer`, `trackWhatsAppClick`, tipo `WhatsAppLocation`, augmentation de `window.dataLayer`.
- `src/lib/analytics.test.ts`
- `src/lib/consent.ts` — cookie de consentimento + `applyConsent` + `consentDefaultScript`.
- `src/lib/consent.test.ts`
- `src/content/consent.ts` — textos do banner.
- `src/components/WhatsAppButton/index.tsx`
- `src/components/WhatsAppButton/WhatsAppButton.test.tsx`
- `src/components/CookieConsent/index.tsx`
- `src/components/CookieConsent/styles.ts`
- `src/components/CookieConsent/CookieConsent.test.tsx`
- `.env.example`

**Modificar:**
- `next.config.mjs` — ampliar CSP para GTM/Google Ads.
- `tests/security.test.mjs` — travar os domínios do GTM na CSP.
- `src/pages/_document.page.tsx` — script inline de consent default.
- `src/pages/_app.page.tsx` — `<GoogleTagManager>` + `<CookieConsent>`.
- `src/pages/home/sections/Hero/index.tsx`, `src/components/Header/index.tsx`, `src/pages/home/sections/CTA/index.tsx` — trocar `Button` por `WhatsAppButton`.
- `src/components/BurgerMenu/index.tsx`, `src/pages/home/sections/Footer/index.tsx` — `onClick` de tracking.
- `e2e/home.spec.ts` — asserção do evento no `dataLayer`.
- `README.md` — documentar a variável de ambiente.
- `package.json` — dependência `@next/third-parties` (via `npm install`).

---

## Task 1: Camada de analytics (`dataLayer` + evento de WhatsApp)

**Files:**
- Create: `src/lib/analytics.ts`
- Test: `src/lib/analytics.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type WhatsAppLocation = "hero" | "header" | "cta" | "menu" | "footer"`
  - `function pushToDataLayer(event: Record<string, unknown>): void`
  - `function trackWhatsAppClick(location: WhatsAppLocation): void`
  - Augmentation global: `Window.dataLayer?: unknown[]`

- [ ] **Step 1: Escrever o teste que falha**

Criar `src/lib/analytics.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest"
import { pushToDataLayer, trackWhatsAppClick } from "./analytics"

describe("analytics", () => {
  beforeEach(() => {
    window.dataLayer = []
  })

  it("pushToDataLayer cria o dataLayer e empurra o evento", () => {
    delete (window as { dataLayer?: unknown[] }).dataLayer
    pushToDataLayer({ event: "teste" })
    expect(window.dataLayer).toEqual([{ event: "teste" }])
  })

  it("trackWhatsAppClick empurra whatsapp_click com o location", () => {
    trackWhatsAppClick("hero")
    expect(window.dataLayer).toContainEqual({
      event: "whatsapp_click",
      location: "hero",
    })
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `npx vitest run src/lib/analytics.test.ts`
Expected: FAIL — `Failed to resolve import "./analytics"`.

- [ ] **Step 3: Implementar o mínimo**

Criar `src/lib/analytics.ts`:

```ts
declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export type WhatsAppLocation = "hero" | "header" | "cta" | "menu" | "footer"

/** Empurra um evento para o dataLayer do GTM. No-op seguro em SSR. */
export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

/** Registra um clique em um CTA de WhatsApp (conversão do Google Ads). */
export function trackWhatsAppClick(location: WhatsAppLocation): void {
  pushToDataLayer({ event: "whatsapp_click", location })
}
```

- [ ] **Step 4: Rodar o teste e confirmar sucesso**

Run: `npx vitest run src/lib/analytics.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics.test.ts
git commit -m "feat: adiciona camada de analytics para eventos do dataLayer"
```

---

## Task 2: Estado de consentimento (cookie + Consent Mode v2)

**Files:**
- Create: `src/lib/consent.ts`
- Test: `src/lib/consent.test.ts`

**Interfaces:**
- Consumes: augmentation `Window.dataLayer` (Task 1).
- Produces:
  - `type ConsentValue = "granted" | "denied"`
  - `const CONSENT_COOKIE = "bc_consent"`
  - `function readStoredConsent(): ConsentValue | null`
  - `function writeStoredConsent(value: ConsentValue): void`
  - `function applyConsent(granted: boolean): void`
  - `function consentDefaultScript(): string`

- [ ] **Step 1: Escrever o teste que falha**

Criar `src/lib/consent.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest"
import {
  CONSENT_COOKIE,
  readStoredConsent,
  writeStoredConsent,
  applyConsent,
  consentDefaultScript,
} from "./consent"

function clearCookie() {
  document.cookie = `${CONSENT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

describe("consent", () => {
  beforeEach(() => {
    clearCookie()
    window.dataLayer = []
  })

  it("readStoredConsent retorna null sem cookie", () => {
    expect(readStoredConsent()).toBeNull()
  })

  it("writeStoredConsent persiste e readStoredConsent lê de volta", () => {
    writeStoredConsent("granted")
    expect(readStoredConsent()).toBe("granted")
    writeStoredConsent("denied")
    expect(readStoredConsent()).toBe("denied")
  })

  it("applyConsent(true) empurra consent update com tudo granted", () => {
    applyConsent(true)
    const last = window.dataLayer!.at(-1) as IArguments
    expect(last[0]).toBe("consent")
    expect(last[1]).toBe("update")
    const state = last[2] as Record<string, string>
    expect(state.ad_storage).toBe("granted")
    expect(state.analytics_storage).toBe("granted")
    expect(state.ad_user_data).toBe("granted")
    expect(state.ad_personalization).toBe("granted")
  })

  it("applyConsent(false) empurra consent update com tudo denied", () => {
    applyConsent(false)
    const state = (window.dataLayer!.at(-1) as IArguments)[2] as Record<
      string,
      string
    >
    expect(state.analytics_storage).toBe("denied")
  })

  it("consentDefaultScript define default e lê o cookie", () => {
    const script = consentDefaultScript()
    expect(script).toContain("'consent','default'")
    expect(script).toContain(CONSENT_COOKIE)
    expect(script).toContain("wait_for_update")
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `npx vitest run src/lib/consent.test.ts`
Expected: FAIL — `Failed to resolve import "./consent"`.

- [ ] **Step 3: Implementar o mínimo**

Criar `src/lib/consent.ts`:

```ts
export type ConsentValue = "granted" | "denied"

export const CONSENT_COOKIE = "bc_consent"
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

const CONSENT_KEYS = [
  "ad_storage",
  "analytics_storage",
  "ad_user_data",
  "ad_personalization",
] as const

/** Lê a escolha de consentimento salva no cookie. */
export function readStoredConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]+)`),
  )
  if (match?.[1] === "granted") return "granted"
  if (match?.[1] === "denied") return "denied"
  return null
}

/** Persiste a escolha de consentimento por 1 ano. */
export function writeStoredConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`
}

/** Atualiza o Consent Mode v2 conforme a escolha do usuário. */
export function applyConsent(granted: boolean): void {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  const value: ConsentValue = granted ? "granted" : "denied"
  const state = Object.fromEntries(CONSENT_KEYS.map((key) => [key, value]))
  // Replica o gtag(): o Consent Mode exige o objeto `arguments`, não um array.
  function gtag(...args: unknown[]) {
    void args
    window.dataLayer!.push(arguments)
  }
  gtag("consent", "update", state)
}

/**
 * JS inline que roda ANTES do GTM: define o consent default (denied para
 * visitante novo; a escolha salva para quem retorna).
 */
export function consentDefaultScript(): string {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    `var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]+)/);`,
    "var g=m&&m[1]==='granted'?'granted':'denied';",
    "gtag('consent','default',{ad_storage:g,analytics_storage:g,ad_user_data:g,ad_personalization:g,wait_for_update:500});",
  ].join("")
}
```

- [ ] **Step 4: Rodar o teste e confirmar sucesso**

Run: `npx vitest run src/lib/consent.test.ts`
Expected: PASS (5 testes).

- [ ] **Step 5: Checar tipos e lint**

Run: `npm run check-types && npm run check-lint`
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/lib/consent.ts src/lib/consent.test.ts
git commit -m "feat: adiciona estado de consentimento com Consent Mode v2"
```

---

## Task 3: Componente `WhatsAppButton`

**Files:**
- Create: `src/components/WhatsAppButton/index.tsx`
- Test: `src/components/WhatsAppButton/WhatsAppButton.test.tsx`

**Interfaces:**
- Consumes: `trackWhatsAppClick`, `WhatsAppLocation` (Task 1); `Button` (`@/src/components/Button`); `WHATSAPP_URL` (`@/src/lib/contact`).
- Produces: `WhatsAppButton({ location, children, href?, ...props })` — renderiza o `Button` com `href={WHATSAPP_URL}` (default), `target="_blank"` e `onClick` de tracking.

- [ ] **Step 1: Escrever o teste que falha**

Criar `src/components/WhatsAppButton/WhatsAppButton.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithTheme } from "@/src/test/utils"
import { WhatsAppButton } from "./index"
import { WHATSAPP_URL } from "@/src/lib/contact"

describe("WhatsAppButton", () => {
  beforeEach(() => {
    window.dataLayer = []
  })

  it("renderiza âncora do WhatsApp em nova aba", () => {
    renderWithTheme(<WhatsAppButton location="hero">Fale conosco</WhatsAppButton>)
    const link = screen.getByRole("link", { name: "Fale conosco" })
    expect(link).toHaveAttribute("href", WHATSAPP_URL)
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("empurra whatsapp_click com o location ao clicar", async () => {
    renderWithTheme(<WhatsAppButton location="cta">Fale conosco</WhatsAppButton>)
    await userEvent.click(screen.getByRole("link", { name: "Fale conosco" }))
    expect(window.dataLayer).toContainEqual({
      event: "whatsapp_click",
      location: "cta",
    })
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `npx vitest run src/components/WhatsAppButton/WhatsAppButton.test.tsx`
Expected: FAIL — `Failed to resolve import "./index"`.

- [ ] **Step 3: Implementar o mínimo**

Criar `src/components/WhatsAppButton/index.tsx`:

```tsx
import type { ReactNode } from "react"
import { Button } from "@/src/components/Button"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { trackWhatsAppClick, type WhatsAppLocation } from "@/src/lib/analytics"

type WhatsAppButtonProps = {
  location: WhatsAppLocation
  children: ReactNode
  href?: string
  className?: string
}

/** CTA de WhatsApp que registra a conversão antes de abrir a conversa. */
export function WhatsAppButton({
  location,
  children,
  href = WHATSAPP_URL,
  ...props
}: WhatsAppButtonProps) {
  return (
    <Button
      href={href}
      target="_blank"
      onClick={() => trackWhatsAppClick(location)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

- [ ] **Step 4: Rodar o teste e confirmar sucesso**

Run: `npx vitest run src/components/WhatsAppButton/WhatsAppButton.test.tsx`
Expected: PASS (2 testes). (Um aviso do jsdom sobre navegação é esperado e inofensivo.)

- [ ] **Step 5: Commit**

```bash
git add src/components/WhatsAppButton/
git commit -m "feat: adiciona WhatsAppButton com rastreamento de conversão"
```

---

## Task 4: Banner de consentimento (`CookieConsent`)

**Files:**
- Create: `src/content/consent.ts`
- Create: `src/components/CookieConsent/index.tsx`
- Create: `src/components/CookieConsent/styles.ts`
- Test: `src/components/CookieConsent/CookieConsent.test.tsx`

**Interfaces:**
- Consumes: `readStoredConsent`, `writeStoredConsent`, `applyConsent`, `CONSENT_COOKIE` (Task 2).
- Produces: `CookieConsent()` — banner client-side que aparece só quando não há escolha salva.

- [ ] **Step 1: Escrever o teste que falha**

Criar `src/components/CookieConsent/CookieConsent.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithTheme } from "@/src/test/utils"
import { CookieConsent } from "./index"
import { CONSENT_COOKIE } from "@/src/lib/consent"

describe("CookieConsent", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    window.dataLayer = []
  })

  it("aparece quando não há escolha salva", async () => {
    renderWithTheme(<CookieConsent />)
    expect(
      await screen.findByRole("region", { name: "Aviso de cookies" }),
    ).toBeInTheDocument()
  })

  it("não aparece quando já há escolha salva", () => {
    document.cookie = `${CONSENT_COOKIE}=denied; path=/`
    renderWithTheme(<CookieConsent />)
    expect(
      screen.queryByRole("region", { name: "Aviso de cookies" }),
    ).not.toBeInTheDocument()
  })

  it("Aceitar persiste granted, concede consentimento e some", async () => {
    renderWithTheme(<CookieConsent />)
    await userEvent.click(await screen.findByRole("button", { name: "Aceitar" }))
    expect(document.cookie).toContain(`${CONSENT_COOKIE}=granted`)
    const last = window.dataLayer!.at(-1) as IArguments
    expect(last[0]).toBe("consent")
    expect((last[2] as Record<string, string>).ad_storage).toBe("granted")
    expect(
      screen.queryByRole("region", { name: "Aviso de cookies" }),
    ).not.toBeInTheDocument()
  })

  it("Recusar persiste denied e some", async () => {
    renderWithTheme(<CookieConsent />)
    await userEvent.click(await screen.findByRole("button", { name: "Recusar" }))
    expect(document.cookie).toContain(`${CONSENT_COOKIE}=denied`)
    expect(
      screen.queryByRole("region", { name: "Aviso de cookies" }),
    ).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `npx vitest run src/components/CookieConsent/CookieConsent.test.tsx`
Expected: FAIL — `Failed to resolve import "./index"`.

- [ ] **Step 3: Criar os textos do banner**

Criar `src/content/consent.ts`:

```ts
export const consentContent = {
  ariaLabel: "Aviso de cookies",
  message:
    "Usamos cookies para medir a eficácia dos nossos anúncios e melhorar sua experiência. Você pode aceitar ou recusar.",
  accept: "Aceitar",
  reject: "Recusar",
} as const
```

- [ ] **Step 4: Criar os estilos**

Criar `src/components/CookieConsent/styles.ts`:

```ts
import styled, { css } from "styled-components"

export const Banner = styled.div`
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 1000;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  max-width: 720px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  border-radius: 12px;

  ${({ theme }) => css`
    background: ${theme.COLORS.GRAY_700};
    color: ${theme.COLORS.WHITE};
    border: 1px solid ${theme.COLORS.GRAY_LOW_OPACITY};
    box-shadow: 0 18px 38px ${theme.COLORS.SHADOW_SOFT};
    font-size: ${theme.FONT_SIZE.SM};
  `}
`

export const BannerText = styled.p`
  flex: 1 1 260px;
  margin: 0;
  line-height: 1.4;
`

export const BannerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const buttonBase = css`
  all: unset;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 2px;
  }
`

export const AcceptButton = styled.button`
  ${buttonBase}
  ${({ theme }) => css`
    background: ${theme.COLORS.ORANGE};
    color: ${theme.COLORS.WHITE};
  `}

  &:hover {
    background: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  }
`

export const RejectButton = styled.button`
  ${buttonBase}
  ${({ theme }) => css`
    background: transparent;
    color: ${theme.COLORS.GRAY_300};
    border: 1px solid ${theme.COLORS.GRAY_LOW_OPACITY};
  `}

  &:hover {
    color: ${({ theme }) => theme.COLORS.WHITE};
  }
`
```

- [ ] **Step 5: Criar o componente**

Criar `src/components/CookieConsent/index.tsx`:

```tsx
import { useEffect, useRef, useState } from "react"
import {
  readStoredConsent,
  writeStoredConsent,
  applyConsent,
} from "@/src/lib/consent"
import { consentContent } from "@/src/content/consent"
import {
  Banner,
  BannerText,
  BannerActions,
  AcceptButton,
  RejectButton,
} from "./styles"

/** Banner de consentimento (LGPD). Só aparece se não houver escolha salva. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)

  // Client-only: evita divergência de hidratação (server sempre renderiza null).
  useEffect(() => {
    if (readStoredConsent() === null) setVisible(true)
  }, [])

  useEffect(() => {
    if (visible) acceptRef.current?.focus()
  }, [visible])

  function handleChoice(granted: boolean) {
    writeStoredConsent(granted ? "granted" : "denied")
    applyConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Banner role="region" aria-label={consentContent.ariaLabel}>
      <BannerText>{consentContent.message}</BannerText>
      <BannerActions>
        <RejectButton type="button" onClick={() => handleChoice(false)}>
          {consentContent.reject}
        </RejectButton>
        <AcceptButton
          ref={acceptRef}
          type="button"
          onClick={() => handleChoice(true)}
        >
          {consentContent.accept}
        </AcceptButton>
      </BannerActions>
    </Banner>
  )
}
```

- [ ] **Step 6: Rodar o teste e confirmar sucesso**

Run: `npx vitest run src/components/CookieConsent/CookieConsent.test.tsx`
Expected: PASS (4 testes).

- [ ] **Step 7: Checar tipos e lint**

Run: `npm run check-types && npm run check-lint`
Expected: sem erros.

- [ ] **Step 8: Commit**

```bash
git add src/content/consent.ts src/components/CookieConsent/
git commit -m "feat: adiciona banner de consentimento de cookies"
```

---

## Task 5: Ampliar a CSP para GTM/Google Ads

**Files:**
- Modify: `next.config.mjs` (bloco `contentSecurityPolicy`)
- Modify: `tests/security.test.mjs` (adicionar asserções)

**Interfaces:**
- Consumes: nada.
- Produces: CSP que permite `www.googletagmanager.com`, `www.googleadservices.com`, `www.google.com`, `googleads.g.doubleclick.net`, `td.doubleclick.net`.

- [ ] **Step 1: Atualizar a CSP**

Em `next.config.mjs`, substituir o template `contentSecurityPolicy` por:

```js
const contentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
  form-action 'self';
  img-src 'self' data: https:;
  font-src 'self' data:;
  style-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com;
  connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googleadservices.com https://www.google.com https://googleads.g.doubleclick.net;
  frame-src https://td.doubleclick.net https://www.googletagmanager.com;
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim()
```

- [ ] **Step 2: Adicionar asserções ao teste de segurança**

Em `tests/security.test.mjs`, dentro do teste `"configura headers de seguranca para todas as rotas"`, logo após a asserção de `upgrade-insecure-requests`, adicionar:

```js
  assert.match(
    headers["Content-Security-Policy"],
    /script-src[^;]*www\.googletagmanager\.com/,
  )
  assert.match(
    headers["Content-Security-Policy"],
    /connect-src[^;]*www\.googletagmanager\.com/,
  )
```

- [ ] **Step 3: Verificar a CSP diretamente (sem build)**

Run:
```bash
node -e "import('./next.config.mjs').then(async (m) => { const h = (await m.default.headers())[0].headers.find(x => x.key === 'Content-Security-Policy').value; if (!/script-src[^;]*googletagmanager/.test(h) || !/connect-src[^;]*googletagmanager/.test(h)) { throw new Error('CSP sem GTM'); } console.log('CSP OK'); })"
```
Expected: imprime `CSP OK`.

- [ ] **Step 4: Confirmar que as diretivas travadas continuam presentes**

Run:
```bash
node -e "import('./next.config.mjs').then(async (m) => { const h = (await m.default.headers())[0].headers.find(x => x.key === 'Content-Security-Policy').value; for (const d of [\"default-src 'self'\", \"object-src 'none'\", \"frame-ancestors 'none'\", 'upgrade-insecure-requests']) { if (!h.includes(d)) throw new Error('faltou ' + d); } console.log('diretivas OK'); })"
```
Expected: imprime `diretivas OK`. (As asserções de `security.test.mjs` só rodam de verdade na Task 9, após o build.)

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs tests/security.test.mjs
git commit -m "feat: amplia CSP para permitir GTM e Google Ads"
```

---

## Task 6: Carregar GTM + consent default no `_app` e `_document`

**Files:**
- Modify: `src/pages/_document.page.tsx`
- Modify: `src/pages/_app.page.tsx`
- Modify: `package.json` (via `npm install`)

**Interfaces:**
- Consumes: `consentDefaultScript` (Task 2); `CookieConsent` (Task 4); `GoogleTagManager` (`@next/third-parties/google`).
- Produces: carregamento condicional (só com `NEXT_PUBLIC_GTM_ID`) do script de consent default, do container GTM e do banner.

- [ ] **Step 1: Instalar a dependência**

Run: `npm install @next/third-parties@^16`
Expected: `@next/third-parties` aparece em `dependencies` no `package.json`.

- [ ] **Step 2: Adicionar o consent default ao `_document`**

Em `src/pages/_document.page.tsx`, importar o helper no topo:

```tsx
import { consentDefaultScript } from "../lib/consent"
```

E dentro de `render()`, no início do `<Head>` (antes das tags `<link>`), inserir:

```tsx
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <script
              // Consent default DEVE rodar antes do GTM (ordem do Consent Mode v2).
              dangerouslySetInnerHTML={{ __html: consentDefaultScript() }}
            />
          )}
```

- [ ] **Step 3: Carregar GTM + banner no `_app`**

Em `src/pages/_app.page.tsx`, adicionar os imports:

```tsx
import { GoogleTagManager } from "@next/third-parties/google"
import { CookieConsent } from "../components/CookieConsent"
```

Dentro de `App`, antes do `return`, ler a variável:

```tsx
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
```

No JSX, dentro do `<div className={montserrat.variable} ...>`, logo após `<Component {...pageProps} />`, adicionar o banner; e logo após esse `</div>`, ainda dentro do `<ThemeProvider>`, adicionar o container:

```tsx
          <Component {...pageProps} />
          {gtmId && <CookieConsent />}
        </div>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
```

- [ ] **Step 4: Checar tipos**

Run: `npm run check-types`
Expected: sem erros.

- [ ] **Step 5: Buildar para garantir SSR sem erros**

Run: `npm run build`
Expected: build conclui com sucesso (sem `NEXT_PUBLIC_GTM_ID` definido, o script/banner não são renderizados).

- [ ] **Step 6: Verificação manual com o GTM ligado**

Run:
```bash
NEXT_PUBLIC_GTM_ID=GTM-TESTE npm run dev
```
Abrir `http://localhost:3000`, confirmar que o banner de cookies aparece; no DevTools, confirmar a requisição a `googletagmanager.com/gtm.js?id=GTM-TESTE` e, no console, `window.dataLayer[0]` contendo o `consent`/`default`. Encerrar o servidor depois.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/pages/_app.page.tsx src/pages/_document.page.tsx
git commit -m "feat: carrega GTM e banner de consentimento condicionalmente"
```

---

## Task 7: Instrumentar os 5 CTAs de WhatsApp

**Files:**
- Modify: `src/pages/home/sections/Hero/index.tsx`
- Modify: `src/components/Header/index.tsx`
- Modify: `src/pages/home/sections/CTA/index.tsx`
- Modify: `src/components/BurgerMenu/index.tsx`
- Modify: `src/pages/home/sections/Footer/index.tsx`

**Interfaces:**
- Consumes: `WhatsAppButton` (Task 3); `trackWhatsAppClick` (Task 1).
- Produces: os 5 CTAs empurrando `whatsapp_click` com o `location` correto.

- [ ] **Step 1: Hero → WhatsAppButton (`location="hero"`)**

Em `src/pages/home/sections/Hero/index.tsx`: remover o import `Button` e o import `WHATSAPP_URL`; adicionar `import { WhatsAppButton } from "@/src/components/WhatsAppButton"`. Trocar o botão:

```tsx
      <WhatsAppButton location="hero">{heroContent.ctaLabel}</WhatsAppButton>
```

- [ ] **Step 2: Header → WhatsAppButton (`location="header"`, mantém `className`)**

Em `src/components/Header/index.tsx`: remover o import `Button` e o import `WHATSAPP_URL`; adicionar `import { WhatsAppButton } from "@/src/components/WhatsAppButton"`. Trocar o botão:

```tsx
        <WhatsAppButton location="header" className="button">
          Entre em contato
        </WhatsAppButton>
```

- [ ] **Step 3: CTA → WhatsAppButton (`location="cta"`)**

Em `src/pages/home/sections/CTA/index.tsx`: remover o import `Button` e o import `WHATSAPP_URL`; adicionar `import { WhatsAppButton } from "@/src/components/WhatsAppButton"`. Trocar o botão:

```tsx
        <WhatsAppButton location="cta">{ctaContent.buttonLabel}</WhatsAppButton>
```

- [ ] **Step 4: BurgerMenu → onClick (`location="menu"`)**

Em `src/components/BurgerMenu/index.tsx`: adicionar `import { trackWhatsAppClick } from "@/src/lib/analytics"`. No `ContactButton`, adicionar o `onClick` (manter `href`, `target`, `rel`):

```tsx
              <ContactButton
                href={WHATSAPP_URL}
                target="_blank"
                rel={getSafeRel("_blank")}
                onClick={() => trackWhatsAppClick("menu")}
              >
                Entre em contato
              </ContactButton>
```

- [ ] **Step 5: Footer → onClick (`location="footer"`)**

Em `src/pages/home/sections/Footer/index.tsx`: adicionar `import { trackWhatsAppClick } from "@/src/lib/analytics"`. No `Link` de WhatsApp, adicionar o `onClick`:

```tsx
                <Link
                  href={WHATSAPP_URL}
                  icon={<WhatsappLogo size={20} />}
                  onClick={() => trackWhatsAppClick("footer")}
                />
```

- [ ] **Step 6: Checar tipos, lint e testes de componente**

Run: `npm run check-types && npm run check-lint && npx vitest run`
Expected: sem erros; todos os testes de unidade/componente passam.

- [ ] **Step 7: Commit**

```bash
git add src/pages/home/sections/Hero/index.tsx src/components/Header/index.tsx src/pages/home/sections/CTA/index.tsx src/components/BurgerMenu/index.tsx src/pages/home/sections/Footer/index.tsx
git commit -m "feat: instrumenta os CTAs de WhatsApp com evento de conversão"
```

---

## Task 8: Teste E2E do evento `whatsapp_click`

**Files:**
- Modify: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: instrumentação da Task 7.
- Produces: cobertura E2E de que o clique no CTA do header empurra `whatsapp_click` para o `dataLayer`.

- [ ] **Step 1: Adicionar o teste**

Em `e2e/home.spec.ts`, dentro do `test.describe("Home", ...)`, adicionar:

```ts
  test("clique no WhatsApp registra whatsapp_click no dataLayer", async ({
    page,
    context,
  }) => {
    await page.goto("/")
    const cta = page
      .locator("header")
      .getByRole("link", { name: /Entre em contato/ })

    // O WhatsApp abre em nova aba: captura e fecha o popup.
    const popupPromise = context.waitForEvent("page")
    await cta.click()
    await (await popupPromise).close()

    const events = await page.evaluate(
      () =>
        (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [],
    )
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ event: "whatsapp_click", location: "header" }),
      ]),
    )
  })
```

- [ ] **Step 2: Rodar o E2E**

Run (macOS): `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e`
Expected: todos os testes de `home.spec.ts` passam, incluindo o novo. (Funciona sem `NEXT_PUBLIC_GTM_ID`, pois o `onClick` cria o `dataLayer` mesmo sem GTM.)

- [ ] **Step 3: Commit**

```bash
git add e2e/home.spec.ts
git commit -m "test: cobre o evento whatsapp_click no dataLayer (E2E)"
```

---

## Task 9: Documentação e verificação final da suíte

**Files:**
- Create: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: tudo acima.
- Produces: variável de ambiente documentada e suíte completa verde.

- [ ] **Step 1: Criar `.env.example`**

```
# ID do container do Google Tag Manager (ex.: GTM-XXXXXXX).
# Sem esta variável, nenhuma tag de rastreamento nem o banner de consentimento
# são carregados, e o site se comporta como sem analytics.
NEXT_PUBLIC_GTM_ID=
```

- [ ] **Step 2: Documentar no README**

Em `README.md`, adicionar uma seção (ex.: após a seção de scripts):

```markdown
## Rastreamento e consentimento (Google Ads via GTM)

O site mede cliques no WhatsApp como conversão usando o Google Tag Manager.

1. Crie um container no GTM e defina `NEXT_PUBLIC_GTM_ID` (ex.: `GTM-XXXXXXX`)
   nas variáveis de ambiente (local em `.env.local`, produção na Vercel).
2. No GTM, crie um gatilho no evento `whatsapp_click` e uma tag de conversão do
   Google Ads acionada por ele.
3. O consentimento (LGPD) usa Consent Mode v2 com padrão `denied`; um banner
   próprio permite aceitar/recusar. Sem `NEXT_PUBLIC_GTM_ID`, nada é carregado.

O código nunca contém IDs do Google Ads — toda a configuração de tags vive no GTM.
```

- [ ] **Step 3: Rodar a suíte completa**

Run: `npm test`
Expected: `npm run build` conclui, os testes `node --test tests/*.test.mjs` passam (incluindo as novas asserções de CSP em `security.test.mjs`) e `vitest run` passa.

- [ ] **Step 4: Rodar lint e format**

Run: `npm run check-lint && npm run check-format`
Expected: sem erros. (Se `check-format` acusar, rodar `npm run format` e commitar.)

- [ ] **Step 5: Commit**

```bash
git add .env.example README.md
git commit -m "docs: documenta NEXT_PUBLIC_GTM_ID e rastreamento de conversão"
```

---

## Verificação de cobertura (self-review)

- **Carregamento via GTM** → Task 6 (`GoogleTagManager` condicional).
- **`NEXT_PUBLIC_GTM_ID` liga/desliga tudo** → Tasks 6 (`_app`/`_document`), 9 (docs).
- **Consent Mode v2 default denied** → Task 2 (`consentDefaultScript`), Task 6 (`_document`).
- **Banner próprio** → Task 4.
- **Evento `whatsapp_click` + `location`** → Task 1 (helper), Task 3 (`WhatsAppButton`), Task 7 (5 CTAs).
- **Instrumentação híbrida (A+B)** → Task 3 + Task 7 (WhatsAppButton no Hero/Header/CTA; onClick no Menu/Footer).
- **CSP para GTM/Ads** → Task 5.
- **Degradação segura em SSR/sem env/ad-blocker** → Tasks 1 e 2 (no-ops), 6 (render condicional).
- **Testes (unit/componente/E2E) verdes** → Tasks 1–4, 7, 8, 9.
- **Pré-requisitos no GTM/Ads (fora do código)** → documentados na Task 9.
