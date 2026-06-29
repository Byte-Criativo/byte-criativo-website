import styled, { css } from "styled-components"

export const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  width: calc(100% - 5rem);

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  box-shadow: 0 18px 44px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  position: fixed;

  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  z-index: 99;

  display: grid;
  grid-template-columns: 1fr minmax(min-content, 1fr) 1fr;
  align-items: center;
  gap: 1rem;

  .logo {
    grid-column: 1;
    display: inline-flex;
    align-items: center;
  }

  .logo-mini {
    display: none;
  }

  /* tablet screen */
  @media (max-width: 895px) {
    width: calc(100% - 2rem);
  }

  /* mobile screen */
  @media (max-width: 665px) {
    padding: 1rem;
    width: calc(100% - 5rem);
  }

  /* mobile small screen */
  @media (max-width: 430px) {
    width: calc(100% - 2rem);
  }

  /* swap wordmark for icon on very small screens */
  @media (max-width: 400px) {
    .logo-full {
      display: none;
    }
    .logo-mini {
      display: block;
    }
  }
`

export const NavArea = styled.ul`
  grid-column: 2;
  list-style: none;
  display: flex;
  gap: 1.75rem;

  justify-self: center;

  @media (max-width: 855px) {
    display: none;
  }
`

export const HeaderActions = styled.div`
  grid-column: 3;
  justify-self: end;

  display: flex;
  align-items: center;

  /* burger hidden on desktop */
  > div {
    display: none;
  }

  @media (max-width: 855px) {
    .button {
      display: none;
    }

    > div {
      display: block;
    }
  }
`

export const NavItem = styled.a`
  text-decoration: none;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
    font-weight: ${theme.FONT_WEIGHT.REGULAR};
  `}

  transition: color 0.2s ease;
  position: relative;

  &::after {
    content: "";
    height: 2px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -0.4rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.COLORS.ORANGE};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 6px;
    border-radius: 4px;
  }
`
