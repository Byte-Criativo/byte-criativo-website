import styled, { css } from "styled-components"

export const CTAContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  padding: 4rem 0.65rem;
  margin-bottom: 5.5rem;

  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 3px solid ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 8px;

  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);
  backdrop-filter: blur(20px);
`

export const CTATitle = styled.h2`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
    font-size: 2.5rem;
  `}
`
