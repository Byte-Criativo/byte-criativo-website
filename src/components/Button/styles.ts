import Link from "next/link"
import styled, { css } from "styled-components"

export const ButtonContainer = styled(Link)<{ $variant: "primary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.875rem 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  font-family: ${({ theme }) => theme.font.body};
  font-size: ${({ theme }) => theme.text.body};
  font-weight: ${({ theme }) => theme.weight.semibold};

  transition:
    background-color ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  &::after {
    content: "→";
    margin-left: 0.5rem;
    transition: transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};
  }

  &:hover::after {
    transform: translateX(4px);
  }

  &:active {
    transform: translateY(1px);
  }

  ${({ theme, $variant }) =>
    $variant === "primary"
      ? css`
          background: ${theme.color.accent};
          color: ${theme.color.surface};
          box-shadow: ${theme.shadow.soft};

          &:hover {
            background: ${theme.color.accentStrong};
            box-shadow: ${theme.shadow.lift};
          }
        `
      : css`
          background: transparent;
          color: ${theme.color.ink};
          box-shadow: inset 0 0 0 1.5px ${theme.color.border};

          &:hover {
            box-shadow: inset 0 0 0 1.5px ${theme.color.ink};
          }
        `}
`
