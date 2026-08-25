import { SectionTitle } from "@/src/components/SectionTitle"
import { whyUs, whyUsSectionTitle } from "@/src/content/home"
import { WhyUsContainer, WhyUsGrid, WhyUsItem } from "./styles"

export function WhyUsSection() {
  return (
    <WhyUsContainer>
      <SectionTitle
        span={whyUsSectionTitle.eyebrow}
        heading={whyUsSectionTitle.heading}
      />
      <WhyUsGrid>
        {whyUs.map((item) => (
          <WhyUsItem key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </WhyUsItem>
        ))}
      </WhyUsGrid>
    </WhyUsContainer>
  )
}
