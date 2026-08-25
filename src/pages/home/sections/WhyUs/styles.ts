import styled from "styled-components"

export const WhyUsContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.x2};

  padding-top: ${({ theme }) => theme.space.x4};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    padding-top: ${({ theme }) => theme.space.x3};
  }
`

export const WhyUsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    grid-template-columns: 1fr;
  }
`

export const WhyUsItem = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};

  padding-top: ${({ theme }) => theme.space.lg};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  h3 {
    font-family: ${({ theme }) => theme.font.display};
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.h3};
    font-weight: ${({ theme }) => theme.weight.semibold};
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.body};
    line-height: 1.65;
  }
`
