import Link from "next/link"
import styled, { css } from "styled-components"

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  .icon {
    width: 3rem;
    height: 3rem;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ theme }) => theme.COLORS.ORANGE};
    background: ${({ theme }) => theme.COLORS.ORANGE_SOFT};
    border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  }
`

export const CardTitle = styled.h2`
  min-width: 158px;
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_700};
    font-size: ${theme.FONT_SIZE.LG};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}
`

export const CardDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.SM};
  `}

  line-height: 1.6;
`

export const CardAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;

  text-decoration: none;

  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE_DARK};
    font-size: ${theme.FONT_SIZE.SM};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}

  &::after {
    content: "→";
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 4px;
  }
`
