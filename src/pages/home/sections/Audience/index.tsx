import { SectionTitle } from "@/src/components/SectionTitle"
import { audiences, audienceSectionTitle, sectionIds } from "@/src/content/home"
import {
  AudienceCard,
  AudienceContainer,
  AudienceGrid,
  AudienceIntro,
} from "./styles"
import { Buildings, GearSix, RocketLaunch } from "@phosphor-icons/react"

const icons = [
  <Buildings size={28} weight="duotone" key="buildings" />,
  <RocketLaunch size={28} weight="duotone" key="rocket" />,
  <GearSix size={28} weight="duotone" key="gear" />,
]

export function AudienceSection() {
  return (
    <AudienceContainer id={sectionIds.audience}>
      <AudienceIntro>
        <SectionTitle
          span={audienceSectionTitle.eyebrow}
          heading={audienceSectionTitle.heading}
        />
      </AudienceIntro>
      <AudienceGrid>
        {audiences.map((audience, index) => (
          <AudienceCard key={audience.title}>
            <span className="icon">{icons[index]}</span>
            <h2>{audience.title}</h2>
            <p>{audience.description}</p>
          </AudienceCard>
        ))}
      </AudienceGrid>
    </AudienceContainer>
  )
}
