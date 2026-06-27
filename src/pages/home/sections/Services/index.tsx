import { SectionTitle } from "@/src/components/SectionTitle"
import { sectionIds, services, servicesSectionTitle } from "@/src/content/home"
import { ServicesContainer, ServicesGrid, ServicesWrapper } from "./styles"
import { CardContent } from "@/src/components/CardContent"
import {
  Browser,
  Code,
  Database,
  PenNib,
  Shapes,
  Strategy,
} from "@phosphor-icons/react"

const serviceIcons = {
  browser: <Browser size={26} weight="duotone" />,
  code: <Code size={26} weight="duotone" />,
  database: <Database size={26} weight="duotone" />,
  penNib: <PenNib size={26} weight="duotone" />,
  shapes: <Shapes size={26} weight="duotone" />,
  strategy: <Strategy size={26} weight="duotone" />,
} as const

export function ServicesSection() {
  return (
    <ServicesWrapper id={sectionIds.services}>
      <ServicesContainer>
        <SectionTitle
          span={servicesSectionTitle.eyebrow}
          heading={servicesSectionTitle.heading}
        />
        <ServicesGrid>
          {services.map((service) => (
            <CardContent
              key={service.title}
              icon={serviceIcons[service.icon]}
              title={service.title}
              description={service.description}
            />
          ))}
        </ServicesGrid>
      </ServicesContainer>
    </ServicesWrapper>
  )
}
