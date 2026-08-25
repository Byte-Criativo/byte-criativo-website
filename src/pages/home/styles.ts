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

/**
 * Padding-bottom de HomeContent (mesmo valor nos breakpoints tablet e
 * mobile — só muda uma vez, em HOME_BP.tablet). Fonte única de verdade
 * consumida também pelo Footer (src/pages/home/sections/Footer/styles.ts),
 * que precisa cancelar exatamente essa faixa com uma margem negativa para
 * ficar contínuo com a banda escura do CTA, sem costura visível.
 */
export const HOME_PADDING_BOTTOM = {
  base: "5.5rem",
  mobile: "3.75rem",
} as const

export const HOME_BP = {
  tablet: "1027px",
  mobile: "450px",
} as const

export const HomeContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.bg};
`
export const HomeContent = styled.main`
  padding: 13.5rem ${HOME_PADDING_X.base} ${HOME_PADDING_BOTTOM.base};

  /* web small screen */
  @media (max-width: ${HOME_BP.tablet}) {
    padding: 12.5rem ${HOME_PADDING_X.tablet} ${HOME_PADDING_BOTTOM.mobile};
  }

  /* mobile screen */
  @media (max-width: ${HOME_BP.mobile}) {
    padding: 7.75rem ${HOME_PADDING_X.mobile} ${HOME_PADDING_BOTTOM.mobile};
  }
`
export const HeroSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > p {
    ${({ theme }) => css`
      color: ${theme.color.ink};
      font-size: ${theme.text.bodyLg};
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
      color: ${theme.color.ink};
      font-size: ${theme.text.h1};
      font-weight: ${theme.weight.bold};
    `}

    text-align: center;

    span {
      color: ${({ theme }) => theme.color.accent};
    }
  }
`
