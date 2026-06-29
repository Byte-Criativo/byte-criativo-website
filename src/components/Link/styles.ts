import Link from "next/link"
import styled, { css } from "styled-components"

export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;

  gap: 0.25rem;

  width: fit-content;

  text-decoration: none;

  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE_DARK};
    font-size: ${theme.FONT_SIZE.LG};
    font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
  `}

  svg {
    transition: transform 0.2s ease;
  }

  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.COLORS.BLUE};
  }

  &:hover svg {
    transform: translate(3px, -3px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 8px;
  }
`
