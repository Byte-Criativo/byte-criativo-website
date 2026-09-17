import tokensData from "./tokens.json"

type ThemeName = "light" | "verso"

type RoomTokens = {
  surface: string
  surfaceAlt: string
  ink: string
  inkMuted: string
  accent: string
  accent2: string
  ctaBg: string
  ctaInk: string
  easel: string
}

type RoomEntry = {
  base: ThemeName
  tokens: RoomTokens
}

type PairSpec = {
  name: string
  scope: string
  fg: string
  bg: string
  use: string
  min: number
}

type TokensJson = {
  color: {
    primitive: Record<string, string>
    themes: Record<ThemeName, Record<string, string>>
    rooms: Record<string, RoomEntry>
  }
  pairs: PairSpec[]
}

// `tokens.json` (Tarefa 6.2, aprovado no G3) é a fonte única: este módulo só
// resolve variável -> primitiva -> hex, nunca redeclara uma cor.
const tokens = tokensData as unknown as TokensJson

function resolvePrimitive(name: string): string {
  const hex = tokens.color.primitive[name]
  if (!hex) throw new Error(`primitivo ausente em tokens.json: ${name}`)
  return hex
}

function resolveThemeVar(themeName: ThemeName, varName: string): string {
  const theme = tokens.color.themes[themeName]
  const primitiveName = theme[varName]
  if (!primitiveName) {
    throw new Error(
      `variável ${varName} ausente no tema ${themeName} de tokens.json`,
    )
  }
  return resolvePrimitive(primitiveName)
}

function resolveTheme(themeName: ThemeName): Record<string, string> {
  const theme = tokens.color.themes[themeName]
  const resolved: Record<string, string> = {}
  for (const varName of Object.keys(theme)) {
    resolved[varName] = resolveThemeVar(themeName, varName)
  }
  return resolved
}

function resolveRoomColor(slug: string, key: string): string {
  const room = tokens.color.rooms[slug]
  if (!room) throw new Error(`sala ausente em tokens.json: ${slug}`)
  const direct = (room.tokens as Record<string, string>)[key]
  if (direct) return direct
  // Chave não publicada pela sala: cai para a variável equivalente do tema
  // `base` da sala (R34 — "room tokens first, then the room's base theme").
  return resolveThemeVar(room.base, `--${key}`)
}

function resolveColor(scope: string, key: string): string {
  if (scope.startsWith("room:")) {
    return resolveRoomColor(scope.slice("room:".length), key)
  }
  return resolveThemeVar(scope as ThemeName, key)
}

/** Primitivas de cor (`color.primitive` do JSON), hex resolvido. */
export const palette: Record<string, string> = { ...tokens.color.primitive }

/** `:root` — as 19 vars do tema claro, var -> hex resolvido. */
export const lightTheme: Record<string, string> = resolveTheme("light")

/** `[data-surface="verso"]` — as 19 vars do tema do verso, var -> hex resolvido. */
export const versoTheme: Record<string, string> = resolveTheme("verso")

/** `color.rooms` do JSON: slug da sala -> chave -> hex, sem alteração. */
export const rooms: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(tokens.color.rooms).map(([slug, room]) => [
    slug,
    { ...room.tokens } as Record<string, string>,
  ]),
)

export type ContrastPair = {
  name: string
  fg: string
  bg: string
  min: 3 | 4.5
}

/**
 * Todos os pares de `pairs` do JSON, com `fg`/`bg` resolvidos para hex no
 * escopo do par (tema -> primitiva; `room:<slug>` -> tokens da sala e, na
 * falta de uma chave, o tema `base` da sala).
 */
export const requiredPairs: ContrastPair[] = tokens.pairs.map((pair) => ({
  name: pair.name,
  fg: resolveColor(pair.scope, pair.fg),
  bg: resolveColor(pair.scope, pair.bg),
  min: pair.min as 3 | 4.5,
}))
