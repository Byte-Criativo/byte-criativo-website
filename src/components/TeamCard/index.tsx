import {
  TeamCardContainer,
  TeamCardGradient,
  TeamCardName,
  TeamCardOccupation,
} from "./styles"

interface TeamCardProps {
  name: string
  occupation: string
  image: string
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
      <img src={image} alt="" />
      <TeamCardName>{name}</TeamCardName>
      <TeamCardOccupation>{occupation}</TeamCardOccupation>
      <TeamCardGradient />
    </TeamCardContainer>
  )
}
