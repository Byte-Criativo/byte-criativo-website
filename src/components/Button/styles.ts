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
    box-shadow: 0 14px 30px ${theme.COLORS.ORANGE_SOFT};
  `}

  cursor: pointer;
  overflow: hidden;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &::after {
    content: "→";
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.COLORS.ORANGE_DARK};
    box-shadow: 0 18px 38px rgba(190, 67, 6, 0.2);
    transform: translateY(-2px);
  }

  &:hover::after {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 3px;
  }
`
