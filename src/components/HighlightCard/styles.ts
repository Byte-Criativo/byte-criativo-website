import styled from "styled-components"

export const CardContainer = styled.div`
  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  padding: 1.25rem 1.75rem;

  width: 22rem;
  border-radius: 8px;
  min-height: 13.5rem;
  border: 1.5px solid ${({ theme }) => theme.COLORS.GLASS_BORDER};

  box-shadow: 0 16px 42px ${({ theme }) => theme.COLORS.SHADOW_SOFT};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  display: flex;
  align-items: center;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.COLORS.WHITE};
    box-shadow: 0 22px 50px rgba(20, 20, 20, 0.12);
    transform: translateY(-4px);
  }

  /* Mobile screen: cards section column */
  @media (max-width: 665px) {
    width: 100%;
    min-height: auto;
  }
`
