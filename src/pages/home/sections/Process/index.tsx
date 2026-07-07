import { SectionTitle } from "@/src/components/SectionTitle"
import {
  processSectionTitle,
  processSteps,
  sectionIds,
} from "@/src/content/home"
import { ProcessContainer, ProcessGrid, ProcessStep } from "./styles"

export function ProcessSection() {
  return (
    <ProcessContainer id={sectionIds.process}>
      <SectionTitle
        span={processSectionTitle.eyebrow}
        heading={processSectionTitle.heading}
      />
      <ProcessGrid>
        {processSteps.map((step, index) => (
          <ProcessStep key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </ProcessStep>
        ))}
      </ProcessGrid>
    </ProcessContainer>
  )
}
