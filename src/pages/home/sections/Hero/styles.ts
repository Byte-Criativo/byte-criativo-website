import styled, { css } from "styled-components"

export const HeroContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    text-align: center;
    margin: 0 6rem 0.5rem;

    @media (max-width: 1027px) {
      margin: 0 5.5rem 0.5rem;
    }
  }
`

export const HeroHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.87rem;

  > h1 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.HEADING};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}

    text-align: center;

    span {
      color: ${({ theme }) => theme.COLORS.ORANGE};
    }
  }
`
