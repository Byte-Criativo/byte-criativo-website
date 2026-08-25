import Link from "next/link"
import styled from "styled-components"

export const PageContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.bg};
`

export const PageMain = styled.main`
  display: grid;
  gap: 5.5rem;
  padding: 13.5rem 9rem 5.5rem;

  @media (max-width: 1027px) {
    padding: 12.5rem 2rem 4rem;
  }

  @media (max-width: 450px) {
    gap: 4rem;
    padding: 7.75rem 1rem 3.75rem;
  }
`

export const PageHero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};
`

export const HeroContent = styled.div`
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

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  flex-wrap: wrap;

  > a {
    white-space: normal;
  }
`

export const PageSection = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space.lg};

  > span {
    font-family: ${({ theme }) => theme.font.mono};
    color: ${({ theme }) => theme.color.accent};
    font-size: ${({ theme }) => theme.text.small};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

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

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space.lg};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const PageCard = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space.sm};
  min-height: 12rem;
  padding: ${({ theme }) => theme.space.xl};

  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};

  transition:
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lift};
    transform: translateY(-2px);
  }

  h3 {
    font-family: ${({ theme }) => theme.font.display};
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.h3};
    font-weight: ${({ theme }) => theme.weight.semibold};
    line-height: 1.35;
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.body};
    line-height: 1.65;
  }

  small {
    font-family: ${({ theme }) => theme.font.mono};
    color: ${({ theme }) => theme.color.accent};
    font-size: ${({ theme }) => theme.text.small};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.04em;
    line-height: 1.4;
  }
`

export const CardImage = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.color.border};

  img {
    object-fit: cover;
  }
`

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-self: start;
  gap: ${({ theme }) => theme.space.xs};
  list-style: none;

  li {
    width: fit-content;
    padding: 0.35rem 0.55rem;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.color.accentSoft};
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.caption};
    font-weight: ${({ theme }) => theme.weight.medium};
  }
`

export const CardLink = styled(Link)`
  width: fit-content;
  color: ${({ theme }) => theme.color.accentStrong};
  font-size: ${({ theme }) => theme.text.small};
  font-weight: ${({ theme }) => theme.weight.semibold};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.ink};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.accent};
    outline-offset: 4px;
    border-radius: 4px;
  }
`

export const OrderedList = styled.ol`
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
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.bodyLg};
    line-height: 1.65;
  }
`

export const FinalCta = styled.section`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.x3} ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.accentSoft};
  text-align: center;

  h2 {
    max-width: 44rem;
    font-family: ${({ theme }) => theme.font.display};
    color: ${({ theme }) => theme.color.ink};
    font-size: ${({ theme }) => theme.text.h2};
    font-weight: ${({ theme }) => theme.weight.bold};
    line-height: 1.12;
  }

  p {
    max-width: 38rem;
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
