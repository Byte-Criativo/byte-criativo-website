import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  // Teste - aqui vamos colocar os estilos globais da aplicação
  body {
    background: ${({ theme }) => theme.COLORS.GRAY_700};
    padding: 25px;
  }
`