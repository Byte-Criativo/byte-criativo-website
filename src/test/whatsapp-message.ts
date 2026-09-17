/**
 * Helper compartilhado pelos testes de conteúdo (`src/content/pages.test.ts`,
 * `src/content/services.test.ts`) que validam mensagens fixas de WhatsApp.
 */
export function hasConsecutiveRepeatedWords(message: string) {
  const words = message.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  return words.some((word, index) => index > 0 && word === words[index - 1])
}
