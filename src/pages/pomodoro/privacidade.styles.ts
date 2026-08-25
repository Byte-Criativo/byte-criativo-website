import Link from "next/link"
import styled, { css } from "styled-components"

export const PageContainer = styled.div`
  min-height: 100vh;
  background-image: url("/background.svg");
  background-position: center;
  background-size: cover;
`

export const PrivacyMain = styled.main`
  padding: 12rem 2rem 5rem;

  @media (max-width: 640px) {
    padding: 7.5rem 1rem 3.5rem;
  }
`

export const PrivacyArticle = styled.article`
  display: grid;
  gap: 2rem;
  max-width: 52rem;
  margin: 0 auto;
  padding: 3rem;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 12px;
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  box-shadow: 0 24px 60px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  @media (max-width: 640px) {
    gap: 1.75rem;
    padding: 1.5rem;
  }
`

export const PrivacyHeader = styled.header`
  display: grid;
  gap: 1rem;

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
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.HEADING};
    line-height: 1.1;

    @media (max-width: 640px) {
      font-size: ${({ theme }) => theme.FONT_SIZE.HEADING_MOBILE};
    }
  }

  p {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
    line-height: 1.6;
  }
`

export const PrivacySection = styled.section`
  display: grid;
  gap: 0.75rem;

  h2 {
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    font-size: ${({ theme }) => theme.FONT_SIZE.XL};
    line-height: 1.3;
  }

  p {
    color: ${({ theme }) => theme.COLORS.GRAY_500};
    font-size: ${({ theme }) => theme.FONT_SIZE.MD};
    line-height: 1.75;
  }
`

export const ContactLink = styled(Link)`
  color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.BOLD};

  &:hover {
    color: ${({ theme }) => theme.COLORS.BLUE};
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 3px;
  }
`
