import { CardDescription, CardTitle, ContentContainer } from "./styles";
import Image from "next/image"
import Icon from '../../assets/icons/LogoIcon.svg'

export interface CardContentProps {
  title: string
  description: string
}

export function CardContent({ title, description }: CardContentProps) {
  return (
    <ContentContainer>
      <Image src={Icon} alt="" width={42} height={42} />
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </ContentContainer>
  )
}