import styled from "styled-components"

export const ServicesContainer = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6rem;

  padding: 3.75rem 4rem;
  margin-bottom: 7.5rem;

  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 3px solid ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 12px;
  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);

  backdrop-filter: blur(20px);
`

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 2.5rem;
  column-gap: 4rem;
`
