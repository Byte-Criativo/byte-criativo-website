import styled from "styled-components"

export const HeroContainer = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.x4} 0 ${({ theme }) => theme.space.x3};
  text-align: center;

  > p {
    max-width: 44rem;
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.6;
  }
`

export const HeroBackdrop = styled.div`
  position: absolute;
  top: 50%;
  right: -2rem;
  transform: translateY(-55%);
  z-index: -1;
  font-family: ${({ theme }) => theme.font.display};
  font-weight: ${({ theme }) => theme.weight.bold};
  font-size: clamp(18rem, 34vw, 30rem);
  line-height: 1;
  color: ${({ theme }) => theme.color.surface2};
  user-select: none;
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    display: none;
  }
`

export const HeroEyebrow = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.caption};
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.muted};
`

export const HeroHeading = styled.h1`
  max-width: 56rem;
  font-family: ${({ theme }) => theme.font.display};
  font-size: ${({ theme }) => theme.text.display};
  font-weight: ${({ theme }) => theme.weight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.ink};

  > span {
    color: ${({ theme }) => theme.color.accent};
  }
`

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.space.xs};
`
