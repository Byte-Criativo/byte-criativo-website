import styled, { css } from "styled-components"

export const HeaderContainer = styled.header`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  width: min(72rem, calc(100% - 2rem));
  padding: 0.875rem 1.5rem;

  display: grid;
  grid-template-columns: 1fr minmax(min-content, 1fr) 1fr;
  align-items: center;
  gap: 1rem;

  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.glass.border};
  background: ${({ theme }) => theme.glass.fallbackBg};
  box-shadow:
    ${({ theme }) => theme.glass.shadow},
    ${({ theme }) => theme.glass.highlight};

  @supports (backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.bg};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  }

  .logo {
    grid-column: 1;
    display: inline-flex;
    align-items: center;
  }

  .logo-mini {
    display: none;
  }

  /* swap wordmark for icon on very small screens */
  @media (max-width: ${({ theme }) => theme.bp.sm}) {
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

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
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

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
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
    color: ${theme.color.ink};
    font-family: ${theme.font.body};
    font-size: ${theme.text.body};
    font-weight: ${theme.weight.regular};
  `}

  transition: color ${({ theme }) => theme.motion.base}
    ${({ theme }) => theme.motion.ease};
  position: relative;

  &::after {
    content: "";
    height: 2px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -0.4rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.color.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};
  }

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 6px;
    border-radius: 4px;
  }
`
