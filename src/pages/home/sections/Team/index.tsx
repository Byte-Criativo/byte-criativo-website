import { SectionTitle } from "@/src/components/SectionTitle"
import { TeamContainer } from "./styles"
import { Slider } from "@/src/components/Slider"

export function TeamSection() {
  return (
    <TeamContainer id="team">
      <SectionTitle span="Equipe" heading="Nosso Time" />
      <Slider />
    </TeamContainer>
  )
}
