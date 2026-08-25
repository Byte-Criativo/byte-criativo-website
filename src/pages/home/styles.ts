import styled, { css } from "styled-components"

/**
 * Padding horizontal de HomeContent e os breakpoints em que ele muda.
 * Fonte única de verdade consumida também pela banda full-bleed da CTA
 * (src/pages/home/sections/CTA/styles.ts), que precisa cancelar
 * exatamente esses valores para encostar nas bordas da viewport.
 */
export const HOME_PADDING_X = {
  base: "9rem",
  tablet: "2rem",
  mobile: "1rem",
} as const

export const HOME_BP = {
  tablet: "1027px",
  mobile: "450px",
} as const

export const HomeContainer = styled.div`
  width: 100%;
  background-image: url("/background.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`
export const HomeContent = styled.main`
  padding: 13.5rem ${HOME_PADDING_X.base} 5.5rem;

  /* web small screen */
  @media (max-width: ${HOME_BP.tablet}) {
    padding: 12.5rem ${HOME_PADDING_X.tablet} 3.75rem;
  }

  /* mobile screen */
  @media (max-width: ${HOME_BP.mobile}) {
    padding: 7.75rem ${HOME_PADDING_X.mobile} 3.75rem;
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
