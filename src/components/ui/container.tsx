import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "header" | "footer" | "nav"
  className?: string
  children: ReactNode
}): ReactElement {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-(--grid-container-max) px-(--grid-margin)",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
