import Link from "next/link"
import styled, { css } from "styled-components"

export const TeamCardContainer = styled(Link)`
  width: 288px;
  height: 400px;

  flex-shrink: 0;

  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1rem 1.5rem;
  justify-content: flex-end;

  position: relative;
  overflow: hidden;

  cursor: pointer;

  text-decoration: none;

  > img {
    position: absolute;
    right: 0;
    top: 0;
    transition: all 0.5s ease;

    &:hover {
      transform: scale(1.1);
      cursor: grab;
    }
  }

  /* mobile screen */
  @media (max-width: 1300px) {
    flex-shrink: 1;
  }
`

export const TeamCardGradient = styled.div`
  width: 100%;
  height: 10rem;

  position: absolute;
  bottom: 0;
  right: 0;

  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 0.7) 100%
  );
`

export const TeamCardName = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.WHITE};
    font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
    font-size: ${theme.FONT_SIZE.MD};
  `}

  text-transform: capitalize;
  z-index: 2;
`

export const TeamCardOccupation = styled.span`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_300};
    font-size: ${theme.FONT_SIZE.SM};
  `}

  text-transform: uppercase;
  z-index: 2;
`
