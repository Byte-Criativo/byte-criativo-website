import styled, { css } from "styled-components"

export const FAQContainer = styled.div`
  padding-top: 7.5rem;

  display: flex;
  justify-content: space-between;
  gap: 4rem;

  .left-side {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    flex: 1;
  }

  @media (max-width: 855px) {
    flex-direction: column;
  }
`

export const FAQQuestionsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`

export const FAQForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  padding: 3.75rem 2rem;

  background: ${({ theme }) => theme.COLORS.GRAY_LOW_OPACITY};
  border-radius: 8px;
  border: 3px solid ${({ theme }) => theme.COLORS.WHITE};
  box-shadow: 0px 4px 20px 10px rgba(227, 227, 227, 0.2);
  backdrop-filter: blur(20px);

  width: 26rem;

  h3 {
    ${({ theme }) => css`
      color: ${theme.COLORS.ORANGE};
      font-size: 2rem;
      font-weight: ${theme.FONT_WEIGHT.BOLD};
    `}
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  input,
  textarea {
    background: none;
    border: none;

    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.COLORS.GRAY_500};
  }

  textarea {
    resize: none;
    height: 6rem;
    width: 100%;
  }

  input:focus,
  textarea:focus {
    outline: none; //Confirmar se não vai ter nada quando estiver focus
  }

  .button {
    align-self: flex-end;
  }

  /* web small screen */
  @media (max-width: 1055px) {
    width: 50%;
  }

  /* tablet screen */
  @media (max-width: 855px) {
    width: 100%;
  }
`
