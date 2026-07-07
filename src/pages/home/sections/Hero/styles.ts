import styled, { css } from "styled-components"

export const HeroContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;

  > p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    text-align: center;
    line-height: 1.7;
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

export const HeroEyebrow = styled.span`
  align-self: center;
  width: fit-content;
  padding: 0.5rem 0.8rem;
  border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 999px;
  background: ${({ theme }) => theme.COLORS.BLUE_SOFT};

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_700};
    font-size: ${theme.FONT_SIZE.SM};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}
`

export const HeroHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.87rem;

  > img {
    opacity: 0.78;
    filter: drop-shadow(0 18px 34px rgba(246, 86, 6, 0.18));
  }

  > h1 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.HEADING};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}

    text-align: center;
    line-height: 1.08;

    span {
      color: transparent;
      background: linear-gradient(
        90deg,
        ${({ theme }) => theme.COLORS.ORANGE} 0%,
        ${({ theme }) => theme.COLORS.BLUE} 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
    }
  }

  /* mobile screen */
  @media (max-width: 770px) {
    gap: 0.25rem;

    img {
      width: 2.5rem;
    }

    > h1 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }

  /* opção para hero - fonte quebrando */
  @media (max-width: 398px) {
    img {
      display: none;
    }
  }
`

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;

  > a:last-child {
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
    text-decoration: none;
    padding: 0.75rem 0.5rem;

    &:hover {
      color: ${({ theme }) => theme.COLORS.BLUE};
    }

    &:focus-visible {
      outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
      outline-offset: 4px;
      border-radius: 4px;
    }
  }
`
