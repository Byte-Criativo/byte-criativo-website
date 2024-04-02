import styled from "styled-components"

export const ServicesContainer = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6rem;

  padding: 3.75rem 4rem;

  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 3px solid ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 12px;
  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  @media (max-width: 855px) {
    padding: 3.75rem 2rem;
    flex-direction: column;
  }
`

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 2.5rem;
  column-gap: 4rem;

  @media (max-width: 855px) {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
  }
`
