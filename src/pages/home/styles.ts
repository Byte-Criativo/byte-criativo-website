import styled, { css } from "styled-components"

export const HomeContainer = styled.div`
  width: 100%;
  background: url("/background-temp.svg");
  background-size: cover;
`
export const HomeContent = styled.div`
  padding: 12.5rem 9rem 5.5rem;

  /* web small screen */
  @media (max-width: 1027px) {
    padding: 12.5rem 2rem 3.75rem;
  }

  /* mobile screen */
  @media (max-width: 450px) {
    padding: 7.75rem 1rem 3.75rem;
  }
`
export const HeroSection = styled.section`
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
    padding: 0 11.5rem;
    margin-bottom: 0.5rem;
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
