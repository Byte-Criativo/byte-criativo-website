import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { getSafeRel } from "@/src/lib/link-security"
import { ButtonContainer } from "./styles"

type ButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode
    variant?: "primary" | "ghost"
  }

export function Button({
  children,
  href,
  rel,
  target,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <ButtonContainer
      href={href}
      rel={getSafeRel(target, rel)}
      target={target}
      $variant={variant}
      {...props}
    >
      {children}
    </ButtonContainer>
  )
}
