import styled from "styled-components"

export const CasesContainer = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 55%) 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.space.x3};

  padding-top: ${({ theme }) => theme.space.x4};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space.xl};
    padding-top: ${({ theme }) => theme.space.x3};
  }
`

export const CaseImage = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 8 / 5;

  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  box-shadow: ${({ theme }) => theme.shadow.lift};

  transition: transform ${({ theme }) => theme.motion.base}
    ${({ theme }) => theme.motion.ease};

  img {
    object-fit: cover;
  }

  &:hover {
    transform: translateY(-4px);
  }
`

export const CaseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

export const CaseDescription = styled.p`
  color: ${({ theme }) => theme.color.muted};
  font-size: ${({ theme }) => theme.text.body};
  line-height: 1.75;
`

export const CaseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};

  span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: ${({ theme }) => theme.text.caption};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.muted};

    background: ${({ theme }) => theme.color.surface2};
    border-radius: ${({ theme }) => theme.radius.pill};
    padding: 0.4rem 0.85rem;
  }
`

export const CaseHighlights = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  list-style: none;

  li {
    display: grid;
    gap: 0.25rem;
    padding-left: ${({ theme }) => theme.space.md};
    border-left: 2px solid ${({ theme }) => theme.color.accent};
  }

  strong {
    font-size: ${({ theme }) => theme.text.small};
    font-weight: ${({ theme }) => theme.weight.semibold};
    color: ${({ theme }) => theme.color.ink};
  }

  span {
    font-size: ${({ theme }) => theme.text.small};
    color: ${({ theme }) => theme.color.muted};
    line-height: 1.65;
  }
`
