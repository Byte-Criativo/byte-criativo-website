"use client"

import { usePathname } from "next/navigation"
import type { ReactElement, ReactNode } from "react"
import { TextLink } from "./text-link"

/**
 * Folha Client do TextLink `navegacao`. Existe só porque o layout do App
 * Router não recebe a rota atual: `usePathname` resolve `aria-current` no
 * SiteHeader e no MobileNav. Sem JS nada muda — o SSR de cada rota já
 * entrega o atributo certo no HTML.
 */
export function NavLink({
  href,
  secao,
  className,
  children,
}: {
  href: string
  secao?: string
  className?: string
  children: ReactNode
}): ReactElement {
  const rota = usePathname()
  const atual: "page" | "true" | undefined =
    rota === href
      ? "page"
      : secao && rota.startsWith(`${secao}/`)
        ? "true"
        : undefined

  return (
    <TextLink
      href={href}
      variante="navegacao"
      aria-current={atual}
      className={className}
    >
      {children}
    </TextLink>
  )
}
