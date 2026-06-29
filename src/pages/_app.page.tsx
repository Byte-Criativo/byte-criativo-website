import { ThemeProvider } from "styled-components"
import { Montserrat } from "next/font/google"
import StyledComponentsRegistry from "../lib/registry"
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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-montserrat",
})

export default function App({ Component, ...pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <Head>
        {generateDefaultSeo({
          defaultTitle: DEFAULT_SEO_TITLE,
          titleTemplate: `%s | ${SITE_NAME}`,
          description: DEFAULT_SEO_DESCRIPTION,
          canonical: HOME_URL,
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
          className={montserrat.variable}
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
