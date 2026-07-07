import styled, { css } from "styled-components"

export const AudienceContainer = styled.section`
  display: grid;
  grid-template-columns: minmax(16rem, 0.8fr) 1.2fr;
  gap: 4rem;
  align-items: start;
  padding-top: 7.5rem;

  @media (max-width: 855px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-top: 4.5rem;
  }
`

export const AudienceIntro = styled.div`
  position: sticky;
  top: 8rem;

  @media (max-width: 855px) {
    position: static;
  }
`

export const AudienceGrid = styled.div`
  display: grid;
  gap: 1rem;
`

export const AudienceCard = styled.article`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  align-items: start;
  padding: 1.5rem;

  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};
  border-radius: 8px;
  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  .icon {
    grid-row: span 2;
    width: 3rem;
    height: 3rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.COLORS.BLUE};
    background: ${({ theme }) => theme.COLORS.BLUE_SOFT};
  }

  h2 {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_700};
      font-size: ${theme.FONT_SIZE.LG};
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  p {
    ${({ theme }) => css`
      color: ${theme.COLORS.GRAY_500};
      font-size: ${theme.FONT_SIZE.MD};
    `}

    line-height: 1.65;
  }

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`
