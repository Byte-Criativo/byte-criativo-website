import styled, { css } from "styled-components"
import * as Dialog from "@radix-ui/react-dialog"

export const DialogContent = styled(Dialog.Content)`
  background-color: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  width: 100vw;
  height: 90px;

  position: absolute;
  top: 0;
  height: 100vh;
  z-index: 100;

  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);
  backdrop-filter: blur(20px);

  padding: 3.75rem 2rem 0;

  animation: slideDown 0.5s;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0.3;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

export const DialogTrigger = styled(Dialog.Trigger)`
  all: unset;
  color: ${({ theme }) => theme.COLORS.ORANGE};
`

export const DialogClose = styled(Dialog.Close)`
  all: unset;
  color: ${({ theme }) => theme.COLORS.ORANGE};
  align-self: flex-end;
`

export const MenuItem = styled("a")`
  text-decoration: none;
  text-transform: uppercase;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_700};
    font-size: ${theme.FONT_SIZE.SECTION_HEADING};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
  `}

  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.COLORS.ORANGE};
  }
`

export const Menu = styled("div")`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
