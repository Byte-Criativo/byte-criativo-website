import Link from "next/link"
import styled, { css } from "styled-components"
import { Link as ContactLink } from "@/src/components/Link"
import { HOME_BP, HOME_PADDING_BOTTOM } from "@/src/pages/home/styles"

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 4.5rem 10rem;

  /*
   * HomeContent (src/pages/home/styles.ts) fecha com padding-bottom de
   * HOME_PADDING_BOTTOM — sem cancelar essa faixa aqui, o fundo claro da
   * página apareceria entre a banda do CTA e o Footer. A margem negativa
   * importa a mesma constante (fonte única de verdade) para que os dois
   * fundos escuros fiquem contínuos mesmo que o valor mude no futuro.
   */
  margin-top: -${HOME_PADDING_BOTTOM.base};

  border-top: 1px solid ${({ theme }) => theme.color.dark.border};
  background: ${({ theme }) => theme.color.dark.bg};

  @media (max-width: ${HOME_BP.tablet}) {
    margin-top: -${HOME_PADDING_BOTTOM.mobile};
  }

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
  border-bottom: 1px solid ${({ theme }) => theme.color.dark.border};

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
    color: ${({ theme }) => theme.color.dark.muted};
  }

  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    color: ${({ theme }) => theme.color.dark.muted};
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
    color: ${theme.color.dark.text};
    font-size: ${theme.text.bodyLg};
  `}

  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 4px;
    border-radius: 6px;
  }
`

export const FooterNetwork = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  color: ${({ theme }) => theme.color.dark.muted};

  .followUs {
    display: flex;
    flex-direction: column;

    gap: 0.75rem;

    > p {
      font-size: ${({ theme }) => theme.text.small};
      color: ${({ theme }) => theme.color.dark.muted};
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

export const FooterIconLink = styled(ContactLink)`
  color: ${({ theme }) => theme.color.dark.text};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 4px;
    border-radius: 6px;
  }
`

export const CopyEmailButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.color.dark.text};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 4px;
    border-radius: 6px;
  }
`
