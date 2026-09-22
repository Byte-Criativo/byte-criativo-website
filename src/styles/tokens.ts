import tokensData from "./tokens.json"

type ThemeName = "light" | "verso"

// As chaves reais (surface, ink, ctaBg, ...) são consumidas por nome
// dinâmico em `resolveRoomColor`/`resolveColor`, nunca por acesso direto —
// por isso o tipo fica em `Record<string, string>` em vez de fixar os 9
// nomes, o que também permite testar com fixtures pequenos e parciais.
type RoomTokens = Record<string, string>

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

function resolvePrimitive(data: TokensJson, name: string): string {
  const hex = data.color.primitive[name]
  if (!hex) throw new Error(`primitivo ausente em tokens.json: ${name}`)
  return hex
}

function resolveThemeVar(
  data: TokensJson,
  themeName: ThemeName,
  varName: string,
): string {
  const theme = data.color.themes[themeName]
  const primitiveName = theme[varName]
  if (!primitiveName) {
    throw new Error(
      `variável ${varName} ausente no tema ${themeName} de tokens.json`,
    )
  }
  return resolvePrimitive(data, primitiveName)
}

function resolveTheme(
  data: TokensJson,
  themeName: ThemeName,
): Record<string, string> {
  const theme = data.color.themes[themeName]
  const resolved: Record<string, string> = {}
  for (const varName of Object.keys(theme)) {
    resolved[varName] = resolveThemeVar(data, themeName, varName)
  }
  return resolved
}

/**
 * Resolve uma chave de sala para hex: primeiro nos tokens publicados pela
 * sala, e, na falta de uma chave, na variável equivalente do tema `base` da
 * sala (R34 — "room tokens first, then the room's base theme"). Recebe
 * `data` como parâmetro (em vez de fechar sobre o módulo) para poder ser
 * testada com um fixture pequeno em memória, sem tocar `tokens.json`.
 */
export function resolveRoomColor(
  data: TokensJson,
  slug: string,
  key: string,
): string {
  const room = data.color.rooms[slug]
  if (!room) throw new Error(`sala ausente em tokens.json: ${slug}`)
  const direct = room.tokens[key]
  if (direct) return direct
  return resolveThemeVar(data, room.base, `--${key}`)
}

function resolveColor(data: TokensJson, scope: string, key: string): string {
  if (scope.startsWith("room:")) {
    return resolveRoomColor(data, scope.slice("room:".length), key)
  }
  return resolveThemeVar(data, scope as ThemeName, key)
}

/**
 * Valida `min` de um par de contraste antes de expor `ContrastPair`: só 3 ou
 * 4,5 são mínimos válidos (WCAG texto-grande/não-texto e texto). Um valor
 * fora desses dois enfraqueceria o teste de contraste em silêncio se fosse
 * só um cast — por isso falha alto, na construção de `requiredPairs`.
 */
export function resolveContrastMin(pairName: string, min: number): 3 | 4.5 {
  if (min === 3 || min === 4.5) return min
  throw new Error(`Par "${pairName}": min inválido ${min} (esperado 3 ou 4,5)`)
}

/** Primitivas de cor (`color.primitive` do JSON), hex resolvido. */
export const palette: Record<string, string> = { ...tokens.color.primitive }

/** `:root` — as 19 vars do tema claro, var -> hex resolvido. */
export const lightTheme: Record<string, string> = resolveTheme(tokens, "light")

/** `[data-surface="verso"]` — as 19 vars do tema do verso, var -> hex resolvido. */
export const versoTheme: Record<string, string> = resolveTheme(tokens, "verso")

/** `color.rooms` do JSON: slug da sala -> chave -> hex, sem alteração. */
export const rooms: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(tokens.color.rooms).map(([slug, room]) => [
    slug,
    { ...room.tokens },
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
  fg: resolveColor(tokens, pair.scope, pair.fg),
  bg: resolveColor(tokens, pair.scope, pair.bg),
  min: resolveContrastMin(pair.name, pair.min),
}))
