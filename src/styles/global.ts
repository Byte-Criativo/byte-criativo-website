import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 7rem;
  }

  body {
    background: ${({ theme }) => theme.COLORS.GRAY_100};
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  input, button, textarea {
    font-family: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.COLORS.ORANGE_SOFT};
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  }
`
