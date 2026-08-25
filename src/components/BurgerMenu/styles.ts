import styled, { css } from "styled-components"
import * as Dialog from "@radix-ui/react-dialog"

export const BurgerMenuContainer = styled.div`
  justify-self: flex-end;
  max-height: 100vh;
`

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const HiddenTitle = styled(Dialog.Title)`
  ${visuallyHidden}
`

export const HiddenDescription = styled(Dialog.Description)`
  ${visuallyHidden}
`

export const DialogContent = styled(Dialog.Content)`
  width: 100vw;

  position: absolute;
  top: 0;
  height: 100vh;
  z-index: 100;

  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  background: ${({ theme }) => theme.glass.fallbackBg};
  box-shadow:
    ${({ theme }) => theme.glass.shadow},
    ${({ theme }) => theme.glass.highlight};

  @supports (backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.bg};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  }

  &[data-state="open"] {
    animation: slideDown 0.4s ease-in;
  }

  &[data-state="closed"] {
    animation: slideUp 0.3s ease-out;
  }

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

  @keyframes slideUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0.3;
    }
  }
`

export const DialogBody = styled.div`
  position: relative;
  height: 100vh;
  padding: 0 2rem;
`

export const DialogTrigger = styled(Dialog.Trigger)`
  all: unset;
  color: ${({ theme }) => theme.color.accent};
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 4px;
    border-radius: 8px;
  }
`

export const DialogClose = styled(Dialog.Close)`
  all: unset;
  color: ${({ theme }) => theme.color.accent};
  align-self: flex-end;
  padding: 3rem 2rem 0 0;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 4px;
    border-radius: 8px;
  }
`

export const MenuItem = styled("a")`
  text-decoration: none;
  text-transform: uppercase;

  ${({ theme }) => css`
    color: ${theme.color.ink};
    font-family: ${theme.font.display};
    font-size: ${theme.text.h3};
    font-weight: ${theme.weight.bold};
  `}

  transition: color ${({ theme }) => theme.motion.base}
    ${({ theme }) => theme.motion.ease};

  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
    outline-offset: 4px;
    border-radius: 8px;
  }
`

export const Menu = styled("div")`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const DialogFooter = styled.div`
  width: 100%;
  position: absolute;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;

  border-top: 1px solid ${({ theme }) => theme.glass.border};
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.xl}
    ${({ theme }) => theme.space.x2};

  > a {
    width: 100%;
  }
`
