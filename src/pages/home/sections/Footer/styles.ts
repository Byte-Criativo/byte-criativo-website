import Link from "next/link"
import styled, { css } from "styled-components"

export const FooterContainer = styled.footer`
  width: 100%;

  right: 0;
  padding: 4.5rem 10rem;

  border-top: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};

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
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};

  padding-bottom: 3rem;
`

export const FooterCompany = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 18.75rem;
  align-items: flex-start;
  gap: 1rem;

  > p {
    align-self: stretch;

    color: ${({ theme }) => theme.COLORS.GRAY_500};
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

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.LG};
  `}

  transition: color .2s;

  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }
`

export const FooterNetwork = styled.div`
  display: flex;
  align-self: flex-end;
  flex-direction: column;

  gap: 0.75rem;

  > p {
    font-size: ${({ theme }) => theme.FONT_SIZE.SM};
  }

  > .links {
    display: flex;
    justify-content: space-between;
  }
`
