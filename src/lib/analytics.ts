declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export type WhatsAppLocation =
  "hero" | "header" | "cta" | "menu" | "footer" | "service-page"

/**
 * Empurra um evento para o dataLayer. Hoje nada consome esses eventos: o
 * gtag foi removido até haver consentimento (decisão pendente). No-op
 * seguro em SSR.
 */
export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
}

/**
 * Registra um clique em um CTA de WhatsApp. Sem consumidor no momento: o
 * gtag foi removido até haver consentimento (decisão pendente).
 */
export function trackWhatsAppClick(location: WhatsAppLocation): void {
  pushToDataLayer({ event: "whatsapp_click", location })
}
