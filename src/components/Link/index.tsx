import type { AnchorHTMLAttributes, ReactNode } from "react"
import type { LinkProps } from "next/link"
import { getSafeRel } from "@/src/lib/link-security"
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
  return (
    <LinkContainer target={target} rel={getSafeRel(target, rel)} {...props}>
      {children}
      {icon}
    </LinkContainer>
  )
}
