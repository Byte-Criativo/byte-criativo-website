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

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ theme }) => theme.color.accent};
  }
`

export const CardTitle = styled.h2`
  min-width: 158px;
  ${({ theme }) => css`
    color: ${theme.color.ink};
    font-size: ${theme.text.bodyLg};
    font-weight: ${theme.weight.bold};
  `}
`

export const CardDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.color.muted};
    font-size: ${theme.text.small};
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
    color: ${theme.color.accentStrong};
    font-size: ${theme.text.small};
    font-weight: ${theme.weight.bold};
  `}

  &::after {
    content: "→";
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(3px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 4px;
    border-radius: 4px;
  }
`
