import styled, { css } from "styled-components"

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  .icon {
    width: 3rem;
    height: 3rem;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ theme }) => theme.COLORS.ORANGE};
    background: ${({ theme }) => theme.COLORS.ORANGE_SOFT};
    border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  }
`

export const CardTitle = styled.h2`
  min-width: 158px;
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_700};
    font-size: ${theme.FONT_SIZE.LG};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}
`

export const CardDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.SM};
  `}

  line-height: 1.6;
`
