import Link from "next/link"
import styled, { css } from "styled-components"

export const ServicePageContainer = styled.div`
  width: 100%;
  background-image: url("/background.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

export const ServiceMain = styled.main`
  display: grid;
  gap: 6rem;
  padding: 13.5rem 9rem 2rem;

  @media (max-width: 1027px) {
    padding: 12.5rem 2rem 2rem;
  }

  @media (max-width: 450px) {
    gap: 4rem;
    padding: 7.75rem 1rem 2rem;
  }
`

export const ServiceHero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 3rem;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const ServiceIntro = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 54rem;

  > span {
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
  }

  h1 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.HEADING};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}

    line-height: 1.08;
  }

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    line-height: 1.7;
  }

  @media (max-width: 770px) {
    h1 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }
`

export const ServiceHeroActions = styled.div`
  display: flex;
  align-items: center;
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

export const ServiceHeroMedia = styled.div`
  display: flex;
  gap: 1rem;

  img {
    opacity: 0.78;
    filter: drop-shadow(0 18px 34px rgba(246, 86, 6, 0.18));
  }

  @media (max-width: 760px) {
    display: none;
  }
`

export const ServiceSection = styled.section`
  display: grid;
  gap: 1.5rem;

  h2 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.SECTION_HEADING};
      font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
    `}

    line-height: 1.12;
  }

  > p {
    max-width: 52rem;
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    line-height: 1.7;
  }

  @media (max-width: 770px) {
    h2 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }
`

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

export const ServiceCard = styled.article`
  display: grid;
  gap: 0.75rem;
  min-height: 8rem;
  padding: 1.25rem;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 8px;
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
  `}

  line-height: 1.65;

  strong {
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG};
    line-height: 1.35;
  }

  small {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    line-height: 1.65;
  }
`

export const ServiceProcessList = styled.ol`
  display: grid;
  gap: 1rem;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: start;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};
  }

  span {
    ${({ theme }) => css`
      color: ${theme.COLORS.ORANGE_DARK};
      font-size: ${theme.FONT_SIZE.SM};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    line-height: 1.65;
  }
`

export const ServiceCta = styled.section`
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  padding: 4rem 2rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  background:
    linear-gradient(135deg, rgba(246, 86, 6, 0.12), rgba(6, 178, 246, 0.1)),
    ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 24px 60px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  text-align: center;

  h2 {
    max-width: 42rem;
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.SECTION_HEADING};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}

    line-height: 1.12;
  }

  p {
    max-width: 34rem;
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.LG};
    `}

    line-height: 1.7;
  }

  > a {
    margin-top: 0.5rem;
  }

  @media (max-width: 770px) {
    padding: 3rem 1.25rem;

    h2 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }
`

export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const RelatedLink = styled(Link)`
  display: grid;
  gap: 0.75rem;
  min-height: 11rem;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  strong {
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG};
  }

  span {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    line-height: 1.65;
  }

  &:hover {
    border-color: ${({ theme }) => theme.COLORS.ORANGE};
    transform: translateY(-3px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
  }
`
