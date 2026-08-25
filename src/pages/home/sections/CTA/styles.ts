import styled, { css } from "styled-components"

/**
 * Banda full-bleed: cancela o padding horizontal de HomeContent
 * (src/pages/home/styles.ts) para que o fundo escuro ocupe a viewport
 * inteira, e reaplica o mesmo valor como padding para manter o
 * conteúdo alinhado com as demais seções. Os breakpoints espelham
 * exatamente os de HomeContent para não deixar sobra/falta de margem.
 */
export const CTAWrapper = styled.section`
  margin-left: -9rem;
  margin-right: -9rem;
  padding: ${({ theme }) => theme.space.x4} 9rem;

  background: ${({ theme }) => theme.color.dark.bg};
  color: ${({ theme }) => theme.color.dark.text};

  @media (max-width: 1027px) {
    margin-left: -2rem;
    margin-right: -2rem;
    padding: ${({ theme }) => theme.space.x3} 2rem;
  }

  @media (max-width: 450px) {
    margin-left: -1rem;
    margin-right: -1rem;
    padding: ${({ theme }) => theme.space.x3} 1rem;
  }
`

export const CTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.lg};

  max-width: 38rem;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.x2} ${({ theme }) => theme.space.xl};

  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.glass.darkBorder};
  background: ${({ theme }) => theme.glass.darkFallbackBg};

  @supports (backdrop-filter: blur(1px)) {
    background: ${({ theme }) => theme.glass.darkBg};
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  }

  > form {
    margin-top: ${({ theme }) => theme.space.sm};
  }

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.lg};
  }
`

export const CTATitle = styled.h2`
  ${({ theme }) => css`
    color: ${theme.color.dark.text};
    font-family: ${theme.font.display};
    font-weight: ${theme.weight.bold};
    font-size: ${theme.text.h2};
  `}

  text-align: center;
`

export const CTADescription = styled.p`
  max-width: 32rem;
  text-align: center;
  line-height: 1.7;

  ${({ theme }) => css`
    color: ${theme.color.dark.muted};
    font-size: ${theme.text.bodyLg};
  `}
`
