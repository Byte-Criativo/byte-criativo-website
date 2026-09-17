import type { NextConfig } from "next"

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "frame-src 'none'",
  "media-src 'self'",
  "manifest-src 'self'",
  // Sem "upgrade-insecure-requests": o WebKit aplica essa diretiva também a
  // http://localhost/http://127.0.0.1, derrubando todo JS/CSS/fonte no e2e
  // do CI (projeto webkit). Em produção ela é redundante — o HSTS abaixo
  // (max-age=63072000; includeSubDomains; preload) já força HTTPS na
  // origem, e todas as fontes desta CSP são 'self', data: ou blob: (nenhuma
  // origem http:). Ver R46.
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async redirects() {
    return [
      {
        source: "/sites-profissionais",
        destination: "/servicos/desenvolvimento-de-sites",
        permanent: true,
      },
      {
        source: "/sistemas-web",
        destination: "/servicos/sistemas-web-sob-medida",
        permanent: true,
      },
      {
        source: "/landing-pages",
        destination: "/servicos/landing-pages",
        permanent: true,
      },
      {
        source: "/automacao-e-integracoes",
        destination: "/servicos/automacao-e-integracoes",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
