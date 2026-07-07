import styled, { css } from "styled-components"

export const TrustContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding-top: 7.5rem;

  @media (max-width: 855px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-top: 4.5rem;
  }
`

export const TrustContent = styled.div`
  display: grid;
  gap: 1.25rem;

  > p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    line-height: 1.7;
  }
`

export const TrustGrid = styled.div`
  display: grid;
  gap: 1rem;
`

export const TrustSignal = styled.article`
  display: grid;
  gap: 0.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};

  strong {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.XL};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  span {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.MD};
    `}

    line-height: 1.65;
  }
`
