import styled, { css } from "styled-components"

export const SectionTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const SectionTitleSpan = styled.span`
  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE_DARK};
    font-size: ${theme.FONT_SIZE.LG};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}

  /* mobile screen */
    @media (max-width: 445px) {
    font-size: ${({ theme }) => theme.FONT_SIZE.MD};
  }
`

export const SectionTitleHeading = styled.h2`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_700};
    font-size: ${theme.FONT_SIZE.SECTION_HEADING};
    font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
  `}

  /* mobile screen */
  @media (max-width: 445px) {
    font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
  }
`
