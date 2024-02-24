import styled, { css } from "styled-components"

export const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  width: calc(100% - 10%);
  min-width: 670px;

  border-radius: 8px;
  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);
  backdrop-filter: blur(20px);

  position: fixed;

  top: 1rem;
  margin: 0 5%;
  padding: 1rem 2rem;
  z-index: 99;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 1rem;
`

export const NavArea = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.75rem;
`

export const NavItem = styled.a`
  text-decoration: none;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
    font-weight: ${theme.FONT_WEIGHT.REGULAR};
  `}

  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }
`
