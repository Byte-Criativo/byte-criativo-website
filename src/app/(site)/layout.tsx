import type { ReactNode } from "react"
import { PageFrame } from "@/app/_shared/page-frame"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <PageFrame>{children}</PageFrame>
}
