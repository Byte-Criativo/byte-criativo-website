export const SAFE_EXTERNAL_REL = "noopener noreferrer"

export function getSafeRel(target?: string, rel?: string) {
  if (target !== "_blank") {
    return rel
  }

  if (!rel) {
    return SAFE_EXTERNAL_REL
  }

  const relTokens = new Set(rel.split(/\s+/).filter(Boolean))

  SAFE_EXTERNAL_REL.split(" ").forEach((token) => {
    relTokens.add(token)
  })

  return Array.from(relTokens).join(" ")
}
