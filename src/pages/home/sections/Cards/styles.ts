import styled from "styled-components"

export const CardsContainer = styled.section`
  margin: 6.25rem 0;

  display: flex;
  align-items: center;
  gap: 2rem;

  justify-content: center;

  @media (max-width: 1027px) {
    gap: 0.5rem;
  }

  /* mobile screen */
  @media (max-width: 665px) {
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
  }
`
