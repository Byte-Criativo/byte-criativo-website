import styled, { css } from "styled-components"

export const QuestionAnswerContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 0 0.75rem;

  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

export const Question = styled.button<{ $isOpen: boolean }>`
  all: unset;
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 0.25rem 0;

  color: ${({ theme }) => theme.color.accent};

  p {
    ${({ theme }) => css`
      font-family: ${theme.font.body};
      color: ${theme.color.ink};
      font-weight: ${theme.weight.semibold};
    `}
    flex: 1;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.accent};
    transition: transform 0.2s ease;
    transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
  }

  cursor: pointer;
  transition: color 0.2s ease;

  &:hover p {
    color: ${({ theme }) => theme.color.accentStrong};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accentStrong};
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
    color: ${theme.color.muted};
    font-size: ${theme.text.body};
  `}

  min-height: 0;
  overflow: hidden;
  line-height: 1.7;
  padding-top: 1rem;
`
