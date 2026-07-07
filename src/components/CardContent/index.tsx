import {
  CardAction,
  CardDescription,
  CardTitle,
  ContentContainer,
} from "./styles"
import Image from "next/image"
import Icon from "../../assets/icons/LogoIcon.svg"
import { ReactNode } from "react"

export interface CardContentProps {
  title: string
  description: string
  icon?: ReactNode
  headingLevel?: "h2" | "h3"
  href?: string
  actionLabel?: string
}

export function CardContent({
  title,
  description,
  icon,
  headingLevel = "h3",
  href,
  actionLabel = "Saiba mais",
}: CardContentProps) {
  return (
    <ContentContainer>
      <span className="icon">
        {icon ?? <Image src={Icon} alt="" width={42} height={42} />}
      </span>
      <CardTitle as={headingLevel}>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {href ? <CardAction href={href}>{actionLabel}</CardAction> : null}
    </ContentContainer>
  )
}
