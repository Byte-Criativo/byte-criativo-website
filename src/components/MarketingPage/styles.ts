import Link from "next/link"
import styled, { css } from "styled-components"

export const PageContainer = styled.div`
  width: 100%;
  background-image: url("/background.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

export const PageMain = styled.main`
  display: grid;
  gap: 5.5rem;
  padding: 13.5rem 9rem 5.5rem;

  @media (max-width: 1027px) {
    padding: 12.5rem 2rem 4rem;
  }

  @media (max-width: 450px) {
    gap: 4rem;
    padding: 7.75rem 1rem 3.75rem;
  }
`

export const PageHero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(17rem, 0.42fr);
  gap: 3rem;
  align-items: center;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

export const HeroContent = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 58rem;

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
    max-width: 52rem;
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

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  > a {
    white-space: normal;
  }
`

export const SecondaryLink = styled(Link)`
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
`

export const HeroPanel = styled.aside`
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 8px;
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 24px 60px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.MD};
    `}

    line-height: 1.65;
  }

  strong {
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.XL};
    line-height: 1.3;
  }
`

export const PageSection = styled.section`
  display: grid;
  gap: 1.5rem;

  > span {
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
    text-transform: uppercase;
  }

  h2 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.SECTION_HEADING};
      font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
    `}

    line-height: 1.12;
  }

  > p {
    max-width: 54rem;
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

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const PageCard = styled.article`
  display: grid;
  gap: 0.8rem;
  min-height: 12rem;
  padding: 1.25rem;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 8px;
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  h3 {
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG};
    line-height: 1.35;
  }

  p {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.MD};
    line-height: 1.65;
  }

  small {
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
    line-height: 1.4;
  }
`

export const CardImage = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};

  img {
    object-fit: cover;
  }
`

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;

  li {
    padding: 0.35rem 0.55rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.COLORS.BLUE_SOFT};
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.XS};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  }
`

export const CardLink = styled(Link)`
  width: fit-content;
  color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.COLORS.BLUE};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 4px;
  }
`

export const OrderedList = styled.ol`
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
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
  }

  p {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG};
    line-height: 1.65;
  }
`

export const FinalCta = styled.section`
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
    max-width: 44rem;
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.SECTION_HEADING};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};
    line-height: 1.12;
  }

  p {
    max-width: 38rem;
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.LG};
    line-height: 1.7;
  }

  > a {
    margin-top: 0.5rem;
    white-space: normal;
  }

  @media (max-width: 770px) {
    padding: 3rem 1.25rem;

    h2 {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }
`
