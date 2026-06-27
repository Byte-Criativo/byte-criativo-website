import { ThemeProvider } from "styled-components"
import StyledComponentsRegistry from "../lib/registry"
import theme from "../styles/theme"
import { GlobalStyles } from "../styles/global"
import { AppProps } from "next/app"
import Head from "next/head"
import { generateDefaultSeo } from "next-seo/pages"

export default function App({ Component, ...pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <Head>
        {generateDefaultSeo({
          openGraph: {
            type: "website",
            locale: "pt_BR",
            url: "https://www.bytecriativotech.com.br//",
            siteName: "Byte Criativo",
          },
        })}
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
