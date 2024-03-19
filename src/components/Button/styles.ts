import Link from "next/link"
import styled, { css } from "styled-components"

export const ButtonContainer = styled(Link)`
  all: unset;
  padding: 1rem 2rem;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;

  width: fit-content;

  white-space: nowrap;

  ${({ theme }) => css`
    background: ${theme.COLORS.ORANGE};
    color: ${theme.COLORS.WHITE};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}

  cursor: pointer;

  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  }
`
