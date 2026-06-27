import { CardDescription, CardTitle, ContentContainer } from "./styles"
import Image from "next/image"
import Icon from "../../assets/icons/LogoIcon.svg"
import { ReactNode } from "react"

export interface CardContentProps {
  title: string
  description: string
  icon?: ReactNode
}

export function CardContent({ title, description, icon }: CardContentProps) {
  return (
    <ContentContainer>
      <span className="icon">
        {icon ?? <Image src={Icon} alt="" width={42} height={42} />}
      </span>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </ContentContainer>
  )
}
