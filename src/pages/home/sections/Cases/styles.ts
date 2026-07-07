import styled, { css } from "styled-components"

export const CasesContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;

  padding-top: 7.5rem;

  img {
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 24px 46px rgba(20, 20, 20, 0.14));
    transition: transform 0.2s ease;
  }

  img:hover {
    transform: translateY(-4px);
  }

  /* Mobile screen */
  @media (max-width: 825px) {
    flex-direction: column;
    padding-top: 3rem;
  }
`

export const CaseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 30rem;
`

export const CaseDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
  `}

  line-height: 1.75;
`

export const CaseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  span {
    ${({ theme }) => css`
      color: ${theme.COLORS.ORANGE_DARK};
      background: ${theme.COLORS.ORANGE_SOFT};
      font-size: ${theme.FONT_SIZE.XS};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}

    border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
    border-radius: 999px;
    padding: 0.45rem 0.75rem;
    text-transform: uppercase;
  }
`

export const CaseHighlights = styled.ul`
  display: grid;
  gap: 0.85rem;
  list-style: none;

  li {
    display: grid;
    gap: 0.25rem;
    padding-left: 1rem;
    border-left: 3px solid ${({ theme }) => theme.COLORS.ORANGE};
  }

  strong {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.SM};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  span {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.SM};
    `}

    line-height: 1.65;
  }
`
