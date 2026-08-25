import Link from "next/link"
import styled from "styled-components"

export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.bg};
`

export const PrivacyMain = styled.main`
  padding: 12rem 2rem 5rem;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    padding: 7.5rem 1rem 3.5rem;
  }
`

export const PrivacyArticle = styled.article`
  display: grid;
  gap: 2rem;
  max-width: 52rem;
  margin: 0 auto;
  padding: 3rem;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.lift};

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    gap: 1.75rem;
    padding: 1.5rem;
  }
`

export const PrivacyHeader = styled.header`
  display: grid;
  gap: 1rem;

  > span {
    width: fit-content;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: ${({ theme }) => theme.text.caption};
    font-weight: ${({ theme }) => theme.weight.medium};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.color.muted};
  }

  h1 {
    color: ${({ theme }) => theme.color.ink};
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.text.h1};
    line-height: 1.1;
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.small};
    line-height: 1.6;
  }
`

export const PrivacySection = styled.section`
  display: grid;
  gap: 0.75rem;

  h2 {
    color: ${({ theme }) => theme.color.ink};
    font-family: ${({ theme }) => theme.font.display};
    font-size: ${({ theme }) => theme.text.h3};
    line-height: 1.3;
  }

  p {
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.text.body};
    line-height: 1.75;
  }
`

export const ContactLink = styled(Link)`
  color: ${({ theme }) => theme.color.accentStrong};
  font-weight: ${({ theme }) => theme.weight.semibold};

  &:hover {
    color: ${({ theme }) => theme.color.ink};
  }
`
