import styled, { css } from "styled-components"

export const CTAWrapper = styled.div`
  padding-top: 7.5rem;
`

export const CTAContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  padding: 4.5rem 2rem;
  margin-bottom: 5.5rem;

  background:
    linear-gradient(135deg, rgba(246, 86, 6, 0.12), rgba(6, 178, 246, 0.1)),
    ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 8px;

  box-shadow: 0 24px 60px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  > a {
    margin-top: 1rem;
  }
`

export const CTATitle = styled.h2`
  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-weight: ${theme.FONT_WEIGHT.BOLD};
    font-size: 2.5rem;
  `}

  text-align: center;
`

export const CTADescription = styled.p`
  max-width: 36rem;
  text-align: center;
  line-height: 1.7;

  ${({ theme }) => css`
    color: ${theme.COLORS.GRAY_500};
    font-size: ${theme.FONT_SIZE.LG};
  `}
`
