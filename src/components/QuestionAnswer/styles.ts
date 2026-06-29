import styled, { css } from "styled-components"

export const QuestionAnswerContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 0 0.75rem;

  border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};
`

export const Question = styled.button<{ $isOpen: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 0.25rem 0;

  color: ${({ theme }) => theme.COLORS.ORANGE};

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
    `}
    flex: 1;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
    transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
  }

  cursor: pointer;
  transition: color 0.2s ease;

  &:hover p {
    color: ${({ theme }) => theme.COLORS.ORANGE_DARK};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.COLORS.BLUE};
    outline-offset: 4px;
    border-radius: 8px;
  }
`

export const AnswerWrapper = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.2s ease;
`

export const Answer = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
  `}

  min-height: 0;
  overflow: hidden;
  line-height: 1.7;
  padding-top: 1rem;
`
