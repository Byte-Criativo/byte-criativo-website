import styled from "styled-components"

export const FAQContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.x2};

  padding-top: ${({ theme }) => theme.space.x4};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    padding-top: ${({ theme }) => theme.space.x3};
  }
`

export const FAQQuestionsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`
