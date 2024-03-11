import styled, { css } from "styled-components"

export const QuestionAnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  padding-bottom: 0.5rem;

  border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_300};
`

export const Question = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  color: ${({ theme }) => theme.COLORS.ORANGE};

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
    `}
    flex: 1;
  }

  cursor: pointer;
`

export const Answer = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
  `}
`
