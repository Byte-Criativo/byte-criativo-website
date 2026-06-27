import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { ButtonContainer } from "./styles"

type ButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode
  }

export function Button({ children, href, ...props }: ButtonProps) {
  return (
    <ButtonContainer href={href} {...props}>
      {children}
    </ButtonContainer>
  )
}
