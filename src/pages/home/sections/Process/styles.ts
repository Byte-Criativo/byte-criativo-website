import styled from "styled-components"

export const ProcessContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.x2};

  padding-top: ${({ theme }) => theme.space.x4};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    padding-top: ${({ theme }) => theme.space.x3};
  }
`

export const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    grid-template-columns: 1fr;
  }
`

export const ProcessStep = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};

  padding-top: ${({ theme }) => theme.space.lg};
  border-top: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.bg};

  span {
    font-family: ${({ theme }) => theme.font.mono};
    color: ${({ theme }) => theme.color.accent};
    font-size: ${({ theme }) => theme.text.small};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.06em;
  }

  h2 {
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
