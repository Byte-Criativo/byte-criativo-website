import styled from "styled-components"

export const CardContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  padding: 1rem 1.75rem;

  width: 22rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.COLORS.WHITE};

  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);
  backdrop-filter: blur(20px);

  /* Mobile screen: cards section column */
  @media (max-width: 665px) {
    width: 100%;
  }
`
