export const CONTACT_EMAIL = "contato@bcriativo.com"
export const CONTACT_PHONE_E164 = "+5583991253377"
export const WHATSAPP_NUMBER = "5583991253377"
export const WHATSAPP_DISPLAY = "+55 (83) 99125-3377"
export const INSTAGRAM_URL = "https://instagram.com/bytecriativo"
export const LINKEDIN_URL = "https://www.linkedin.com/company/byte-criativo/"

export const WHATSAPP_MESSAGE =
  "Olá! Gostaria de conversar sobre um projeto com a Byte Criativo."

export function buildWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_URL = buildWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE)
