import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { getSafeRel } from "@/src/lib/link-security"
import { ButtonContainer } from "./styles"

type ButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode
  }

export function Button({ children, href, rel, target, ...props }: ButtonProps) {
  return (
    <ButtonContainer
      href={href}
      rel={getSafeRel(target, rel)}
      target={target}
      {...props}
    >
      {children}
    </ButtonContainer>
  )
}
