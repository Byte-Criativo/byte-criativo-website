import styled, { css } from "styled-components"

export const CardContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  padding: 1rem 1.75rem;

  width: 22rem; // Espaço entre os cards muito grande quando tela cheia
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.COLORS.WHITE};

  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.20);
  backdrop-filter: blur(20px);
`

