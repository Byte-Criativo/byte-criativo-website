import styled from "styled-components"

export const ServicesWrapper = styled.div`
  padding-top: 7.5rem;
`

export const ServicesContainer = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6rem;

  padding: 3.75rem 4rem;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.42),
      rgba(255, 255, 255, 0.18)
    ),
    ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 12px;
  box-shadow: 0 24px 60px ${({ theme }) => theme.COLORS.SHADOW_SOFT};

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
  row-gap: 2rem;
  column-gap: 3rem;

  @media (max-width: 855px) {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(156px, 1fr));
  }
`
