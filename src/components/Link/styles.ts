import Link from "next/link";
import styled, { css } from "styled-components";

export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;

  gap: 0.25rem;

  width: fit-content;

  text-decoration: none;

  ${({ theme }) => css`
    color: ${theme.COLORS.ORANGE};
    font-size: ${theme.FONT_SIZE.LG};
    font-weight: ${theme.FONT_WEIGHT.SEMI_BOLD};
  `}

  transition: color .3s;

  &:hover {
    color: ${({ theme }) => theme.COLORS.BLUE} // ícone não está mudando pq é svg, decidir se vai usar biblioteca de ícones
  }
`