import Link from "next/link"
import styled, { css } from "styled-components"

export const FooterContainer = styled.footer`
  width: 100%;

  right: 0;
  padding: 4.5rem 10rem;

  border-top: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  background: rgba(255, 255, 255, 0.16);

  @media (max-width: 855px) {
    padding: 4.5rem 2rem;
  }
`

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 855px) {
    width: 100%;
    justify-content: space-between;
  }
`

export const FooterMain = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};

  padding-bottom: 3rem;

  /* mobile screen */
  @media (max-width: 990px) {
    flex-direction: column;
    gap: 2rem;
  }
`

export const FooterCompany = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  > p {
    align-self: stretch;
    color: ${({ theme }) => theme.COLORS.GRAY_500};
  }

  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    color: ${({ theme }) => theme.COLORS.GRAY_500};
  }

  .email,
  .whatsapp {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* mobile screen */
  @media (max-width: 855px) {
    align-items: center;
    text-align: center;
    align-self: center;
  }
`

export const FooterMenu = styled.ul`
  list-style: none;

  display: flex;
  align-items: flex-start;
  gap: 1.75rem;

  @media (max-width: 855px) {
    flex-direction: column;
    align-items: flex-end;
  }
`

export const MenuItem = styled(Link)`
  text-decoration: none;
  white-space: nowrap;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.LG};
  `}

  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 6px;
  }
`

export const FooterNetwork = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .followUs {
    display: flex;
    flex-direction: column;

    gap: 0.75rem;

    > p {
      font-size: ${({ theme }) => theme.FONT_SIZE.SM};
      color: ${({ theme }) => theme.COLORS.GRAY_700};
    }

    > .links {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
    }
  }

  @media (max-width: 655px) {
    flex-direction: column;
    text-align: center;
  }
`

export const CopyEmailButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 6px;
  }
`
