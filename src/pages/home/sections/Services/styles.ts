import styled from "styled-components"

export const ServicesWrapper = styled.div`
  padding-top: ${({ theme }) => theme.space.x4};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    padding-top: ${({ theme }) => theme.space.x3};
  }
`

export const ServicesContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.x2};
`

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space.xl};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    grid-template-columns: 1fr;
  }
`

export const ServiceCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space.xl};

  transition:
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lift};
    transform: translateY(-2px);
  }

  /* CardContent's ContentContainer is a block child by default and
     won't fill ServiceCard's stretched height on its own — grow it so
     CardAction's margin-top: auto can still pin "Saiba mais" to the
     card bottom across rows with uneven description lengths. */
  > * {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`
