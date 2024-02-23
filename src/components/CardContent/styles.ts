import styled, { css } from "styled-components";

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
`

export const CardTitle = styled.h2`
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
`