import styled from "styled-components"

export const SectionTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const SectionTitleSpan = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.text.caption};
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.muted};
`

export const SectionTitleHeading = styled.h2`
  font-family: ${({ theme }) => theme.font.display};
  color: ${({ theme }) => theme.color.ink};
  font-size: ${({ theme }) => theme.text.h2};
  font-weight: ${({ theme }) => theme.weight.semibold};
`
