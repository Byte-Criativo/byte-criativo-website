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

    /* web small screen */
    @media (max-width: 1027px) {
      margin: 0 5.5rem 0.5rem;
    }

    /* mobile screen */
    @media (max-width: 450px) {
      margin: 0 1.75rem 0.5rem;
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

  /* mobile screen */
  @media (max-width: 665px) {
    gap: 0.25rem;

    img {
      width: 2.5rem;
    }

    > h1 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }
`
