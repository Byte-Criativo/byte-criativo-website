export const CANONICAL_ORIGIN = "https://www.bcriativo.com"

export const PRESERVED_ROUTES = [
  "/",
  "/sobre",
  "/servicos",
  "/servicos/desenvolvimento-de-sites",
  "/servicos/sistemas-web-sob-medida",
  "/servicos/ui-ux-design",
  "/servicos/landing-pages",
  "/servicos/design-de-produto",
  "/servicos/copywriting-para-web",
  "/servicos/automacao-e-integracoes",
  "/portfolio",
  "/contato",
  "/pomodoro/privacidade",
] as const

export const LEGACY_REDIRECTS = [
  { from: "/sites-profissionais", to: "/servicos/desenvolvimento-de-sites" },
  { from: "/sistemas-web", to: "/servicos/sistemas-web-sob-medida" },
  { from: "/landing-pages", to: "/servicos/landing-pages" },
  { from: "/automacao-e-integracoes", to: "/servicos/automacao-e-integracoes" },
] as const

export function canonicalFor(path: string): string {
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`
}
