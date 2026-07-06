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
