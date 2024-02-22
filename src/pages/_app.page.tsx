import { ThemeProvider } from "styled-components"
import StyledComponentsRegistry from "../lib/registry"
import theme from "../styles/theme"
import { GlobalStyles } from "../styles/global"
import { AppProps } from "next/app"

export default function App({ Component, ...pageProps }: AppProps) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledComponentsRegistry>
  )
}
