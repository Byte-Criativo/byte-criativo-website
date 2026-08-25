import { SectionTitle } from "@/src/components/SectionTitle"
import { sectionIds, services, servicesSectionTitle } from "@/src/content/home"
import {
  ServiceCard,
  ServicesContainer,
  ServicesGrid,
  ServicesWrapper,
} from "./styles"
import { CardContent } from "@/src/components/CardContent"
import {
  Browser,
  Code,
  Database,
  PenNib,
  Plugs,
  Shapes,
  Strategy,
} from "@phosphor-icons/react"

const serviceIcons = {
  browser: <Browser size={26} weight="duotone" />,
  code: <Code size={26} weight="duotone" />,
  database: <Database size={26} weight="duotone" />,
  penNib: <PenNib size={26} weight="duotone" />,
  plugs: <Plugs size={26} weight="duotone" />,
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
            <ServiceCard key={service.title}>
              <CardContent
                icon={serviceIcons[service.icon]}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesContainer>
    </ServicesWrapper>
  )
}
