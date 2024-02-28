import styled, { css } from "styled-components"

export const CasesContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 7.5rem;

  /* Mobile screen */
  @media (max-width: 665px) {
    flex-direction: column;

    img {
      max-width: 100%;
      height: auto;
    }
  }
`

export const CaseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export const CaseDescription = styled.p`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.MD};
  `}
`
