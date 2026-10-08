import type { Metadata } from "next"
import { Schibsted_Grotesk } from "next/font/google"
import type { ReactNode } from "react"
import { MarcadorHidratacao } from "@/components/patterns/marcador-hidratacao"
import { SCRIPT_MARCADOR_JS } from "@/lib/marcador-js"
import { SITE_URL } from "@/lib/seo/metadata"
import "./globals.css"

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/MiniLogo.png" },
  title: { default: "Byte Criativo", template: "%s | Byte Criativo" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // `data-scroll-behavior="smooth"`: o Next 16 só desliga o
    // `scroll-behavior: smooth` do CSS durante a troca de rota com este
    // atributo; sem ele a rota nova chegaria ao topo deslizando.
    <html
      lang="pt-BR"
      className={sans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* RC9: antes da primeira pintura, para o estado com JS não dar
            salto de layout. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_MARCADOR_JS }} />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">
        {children}
        <MarcadorHidratacao />
      </body>
    </html>
  )
}
