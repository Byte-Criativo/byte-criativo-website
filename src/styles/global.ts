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
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.ink};
    font-family: ${({ theme }) => theme.font.body};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.font.display};
  }

  input, button, textarea {
    font-family: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 3px;
    border-radius: 4px;
  }

  ::selection {
    background: ${({ theme }) => theme.color.accentSoft};
    color: ${({ theme }) => theme.color.accentStrong};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
