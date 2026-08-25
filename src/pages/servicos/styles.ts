import Link from "next/link"
import styled from "styled-components"

export const ServicePageContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.bg};
`

export const ServiceMain = styled.main`
  display: grid;
  gap: ${({ theme }) => theme.space.x4};
  padding: 13.5rem 9rem 5.5rem;

  @media (max-width: 1027px) {
    padding: 12.5rem 2rem 4rem;
  }

  @media (max-width: 450px) {
    gap: ${({ theme }) => theme.space.x3};
    padding: 7.75rem 1rem 3.75rem;
  }
`

export const ServiceHero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
`

export const ServiceIntro = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
  max-width: 58rem;

  > span {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: ${({ theme }) => theme.text.caption};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.muted};
  }

  h1 {
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.text.h1};
    font-weight: ${({ theme }) => theme.weight.bold};
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.color.ink};
  }

  p {
    max-width: 52rem;
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.7;
  }
`

export const ServiceHeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  flex-wrap: wrap;

  > a:last-child {
    color: ${({ theme }) => theme.color.accent};
    font-weight: ${({ theme }) => theme.weight.semibold};
    text-decoration: none;
    padding: 0.75rem 0.5rem;

    &:hover {
      color: ${({ theme }) => theme.color.accentStrong};
    }

    &:focus-visible {
      outline: 3px solid ${({ theme }) => theme.color.accent};
      outline-offset: 4px;
      border-radius: 4px;
    }
  }
`

export const ServiceSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};

  h2 {
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.text.h2};
    font-weight: ${({ theme }) => theme.weight.semibold};
    line-height: 1.12;
    color: ${({ theme }) => theme.color.ink};
  }

  > p {
    max-width: 54rem;
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.7;
  }
`

export const ServiceList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  list-style: none;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }

  li {
    position: relative;
    padding-left: 1.5rem;
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.65;

    &::before {
      content: ";";
      position: absolute;
      left: 0;
      font-family: ${({ theme }) => theme.font.mono};
      font-weight: ${({ theme }) => theme.weight.semibold};
      color: ${({ theme }) => theme.color.accent};
    }
  }
`

export const ServiceProcessList = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
  list-style: none;

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: ${({ theme }) => theme.space.md};
    align-items: start;
    padding-bottom: ${({ theme }) => theme.space.md};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
  }

  span {
    font-family: ${({ theme }) => theme.font.mono};
    color: ${({ theme }) => theme.color.accent};
    font-size: ${({ theme }) => theme.text.small};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.06em;
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.65;
  }
`

export const ServiceFaqList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
`

export const ServiceCta = styled.section`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.x3} ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.accentSoft};
  text-align: center;

  h2 {
    max-width: 42rem;
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.text.h2};
    font-weight: ${({ theme }) => theme.weight.bold};
    line-height: 1.12;
    color: ${({ theme }) => theme.color.ink};
  }

  p {
    max-width: 34rem;
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.7;
  }

  > a {
    margin-top: ${({ theme }) => theme.space.xs};
    white-space: normal;
  }

  @media (max-width: 770px) {
    padding: ${({ theme }) => theme.space.x2} ${({ theme }) => theme.space.lg};
  }
`

export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.lg};

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const RelatedLink = styled(Link)`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  min-height: 11rem;
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  text-decoration: none;
  transition:
    border-color ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  strong {
    font-family: ${({ theme }) => theme.font.display};
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.h3};
    font-weight: ${({ theme }) => theme.weight.semibold};
  }

  span {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.small};
    line-height: 1.65;
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
    box-shadow: ${({ theme }) => theme.shadow.lift};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 4px;
  }
`
