import { ThemeProvider } from "styled-components"
import StyledComponentsRegistry from "../lib/registry"
import theme from "../styles/theme"
import { GlobalStyles } from "../styles/global"
import { AppProps } from "next/app"
import Head from "next/head"
import { generateDefaultSeo } from "next-seo/pages"
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  HOME_URL,
  OG_IMAGE_URL,
  ROBOTS_PROPS,
  SITE_NAME,
} from "../lib/seo"

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
            images: [
              {
                url: OG_IMAGE_URL,
                width: 1200,
                height: 630,
                alt: "Byte Criativo - software sob medida",
                type: "image/png",
              },
            ],
          },
          twitter: {
            cardType: "summary_large_image",
          },
          robotsProps: ROBOTS_PROPS,
        })}
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
