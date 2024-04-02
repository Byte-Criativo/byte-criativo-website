import Image, { StaticImageData } from "next/image"
import {
  TeamCardContainer,
  TeamCardGradient,
  TeamCardName,
  TeamCardOccupation,
} from "./styles"

interface TeamCardProps {
  name: string
  occupation: string
  image: StaticImageData
  url?: string
}

export function TeamCard({
  name,
  occupation,
  image,
  url = "#",
}: TeamCardProps) {
  return (
    <TeamCardContainer href={url} target="_blank">
      <Image src={image} alt="" width={320} height={320} />
      <TeamCardName>{name}</TeamCardName>
      <TeamCardOccupation>{occupation}</TeamCardOccupation>
      <TeamCardGradient />
    </TeamCardContainer>
  )
}
