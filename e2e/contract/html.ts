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
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
  return blocks.map((m) => JSON.parse(m[1]))
}
