import { LinkProps } from "next/link"
import { ButtonContainer } from "./styles"

interface ButtonProps extends LinkProps {
  href: string
  children: string
  className?: string
}

export function Button({ children, href, ...props }: ButtonProps) {
  return (
    <ButtonContainer href={href} {...props}>
      {children}
    </ButtonContainer>
  )
}
