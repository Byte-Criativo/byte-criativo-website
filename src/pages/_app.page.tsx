import { ThemeProvider } from "styled-components"
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google"
import theme from "../styles/theme"
import { GlobalStyles } from "../styles/global"
import { AppProps } from "next/app"
import Head from "next/head"
import { generateDefaultSeo } from "next-seo/pages"
import {
  DEFAULT_OG_IMAGES,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  HOME_URL,
  ROBOTS_PROPS,
  SITE_NAME,
} from "../lib/seo"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display",
})

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {generateDefaultSeo({
          defaultTitle: DEFAULT_SEO_TITLE,
          titleTemplate: `%s | ${SITE_NAME}`,
          description: DEFAULT_SEO_DESCRIPTION,
          themeColor: theme.COLORS.ORANGE,
          openGraph: {
            type: "website",
            locale: "pt_BR",
            url: HOME_URL,
            siteName: SITE_NAME,
            title: DEFAULT_SEO_TITLE,
            description: DEFAULT_SEO_DESCRIPTION,
            images: DEFAULT_OG_IMAGES,
          },
          twitter: {
            cardType: "summary_large_image",
          },
          robotsProps: ROBOTS_PROPS,
        })}
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <div
          className={`${display.variable} ${body.variable} ${mono.variable}`}
          style={{ fontFamily: "var(--font-body), sans-serif" }}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  )
}
