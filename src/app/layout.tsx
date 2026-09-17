import type { Metadata } from "next"
import { Schibsted_Grotesk } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--ff-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bcriativo.com"),
  title: { default: "Byte Criativo", template: "%s | Byte Criativo" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={sans.variable}>
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
