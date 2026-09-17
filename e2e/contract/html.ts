function attribute(tag: string, name: string): string | undefined {
  const match = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i").exec(tag)
  return match?.[1]
}

export function findLinkHref(html: string, rel: string): string | undefined {
  const tags = html.match(/<link\b[^>]*>/gi) ?? []
  const tag = tags.find((t) => attribute(t, "rel") === rel)
  return tag ? attribute(tag, "href") : undefined
}

export function findMetaContent(html: string, key: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  const tag = tags.find(
    (t) => attribute(t, "name") === key || attribute(t, "property") === key,
  )
  return tag ? attribute(tag, "content") : undefined
}

export function jsonLdBlocks(html: string): unknown[] {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  return scripts
    .filter((m) => attribute(m[1], "type") === "application/ld+json")
    .map((m) => JSON.parse(m[2]))
}

export function visibleText(html: string): string {
  const withoutNonVisible = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    // Comentários HTML viram string vazia (não espaço): o React insere
    // <!-- --> entre nós de texto contíguos, e tratá-los como espaço
    // introduziria um espaço que não existe na renderização visual.
    .replace(/<!--[\s\S]*?-->/g, "")
  const withoutTags = withoutNonVisible.replace(/<[^>]+>/g, " ")
  const decoded = withoutTags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
  return decoded
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim()
}
