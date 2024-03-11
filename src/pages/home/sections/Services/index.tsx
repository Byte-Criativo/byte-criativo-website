import { SectionTitle } from "@/src/components/SectionTitle"
import { ServicesContainer, ServicesGrid } from "./styles"
import { CardContent } from "@/src/components/CardContent"

export function ServicesSection() {
  return (
    <div style={{ paddingTop: "7.5rem" }} id="services">
      <ServicesContainer>
        <SectionTitle span="Nossos Serviços" heading="O que oferecemos?" />
        <ServicesGrid>
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
          <CardContent
            title="Serviço"
            description="Lorem Ipsum dolor sit amet elit consectetur elit adispicing adipis amet ipsum"
          />
        </ServicesGrid>
      </ServicesContainer>
    </div>
  )
}
