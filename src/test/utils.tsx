import { type ReactElement } from "react"
import { render } from "@testing-library/react"
import { ThemeProvider } from "styled-components"
import theme from "@/src/styles/theme"

/** Renderiza um componente com o ThemeProvider de styled-components. */
export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}
