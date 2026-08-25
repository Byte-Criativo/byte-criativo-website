import styled, { css } from "styled-components"

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  width: 100%;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};

  label {
    ${({ theme }) => css`
      font-size: ${theme.text.small};
      color: ${theme.color.dark.muted};
    `}
  }

  input,
  textarea {
    ${({ theme }) => css`
      background: ${theme.color.dark.surface};
      border: 1px solid ${theme.color.dark.border};
      color: ${theme.color.dark.text};
      border-radius: ${theme.radius.sm};
      font-family: ${theme.font.body};
      font-size: ${theme.text.body};
    `}

    padding: 0.75rem 1rem;
    resize: vertical;

    &:focus-visible {
      outline: 3px solid ${({ theme }) => theme.color.accent};
      outline-offset: 2px;
    }
  }
`

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.875rem 1.75rem;
  border: none;
  cursor: pointer;
  white-space: nowrap;

  ${({ theme }) => css`
    background: ${theme.color.accent};
    color: ${theme.color.surface};
    border-radius: ${theme.radius.sm};
    font-family: ${theme.font.body};
    font-size: ${theme.text.body};
    font-weight: ${theme.weight.semibold};
    box-shadow: ${theme.shadow.soft};

    transition:
      background-color ${theme.motion.base} ${theme.motion.ease},
      box-shadow ${theme.motion.base} ${theme.motion.ease},
      transform ${theme.motion.fast} ${theme.motion.ease};

    &:hover {
      background: ${theme.color.accentStrong};
      box-shadow: ${theme.shadow.lift};
    }
  `}

  &:active {
    transform: translateY(1px);
  }
`
