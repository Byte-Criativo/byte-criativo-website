import { ThemeProvider } from "styled-components"
import StyledComponentsRegistry from "../lib/registry"
import theme from "../styles/theme"
import { GlobalStyles } from "../styles/global"
import { AppProps } from "next/app"
import { DefaultSeo } from "next-seo"

export default function App({ Component, ...pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "pt_BR",
          url: "https://www.bytecriativotech.com.br//",
          siteName: "Byte Criativo",
        }}
      />
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
