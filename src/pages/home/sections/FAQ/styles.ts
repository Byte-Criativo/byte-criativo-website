import styled from "styled-components"

export const FAQContainer = styled.div`
  padding-top: 7.5rem;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4rem;

  .left-side {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    flex: 1;
  }

  @media (max-width: 855px) {
    flex-direction: column;
  }
`

export const FAQQuestionsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`
