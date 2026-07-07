import styled, { css } from "styled-components"

export const ProcessContainer = styled.section`
  display: grid;
  gap: 2.5rem;
  padding-top: 7.5rem;

  @media (max-width: 855px) {
    padding-top: 4.5rem;
  }
`

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1030px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

export const ProcessStep = styled.article`
  display: grid;
  gap: 0.85rem;
  min-height: 15rem;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  span {
    ${({ theme }) => css`
      color: ${theme.COLORS.ORANGE_DARK};
      font-size: ${theme.FONT_SIZE.SM};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  h2 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.LG};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.SM};
    `}

    line-height: 1.65;
  }
`
