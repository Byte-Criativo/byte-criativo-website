import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { LinkContainer } from "./styles"

type LinkComponentProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: string
    icon?: ReactNode
  }

export function Link({
  icon,
  children,
  target = "_blank",
  rel,
  ...props
}: LinkComponentProps) {
  const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel

  return (
    <LinkContainer target={target} rel={safeRel} {...props}>
      {children}
      {icon}
    </LinkContainer>
  )
}
