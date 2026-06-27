import { SectionTitle } from "@/src/components/SectionTitle"
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

export function ServicesSection() {
  return (
    <ServicesWrapper id="services">
      <ServicesContainer>
        <SectionTitle span="Nossos Serviços" heading="O que oferecemos?" />
        <ServicesGrid>
          <CardContent
            icon={<Code size={26} weight="duotone" />}
            title="Front-end"
            description="Garanta um site deslumbrante e eficiente que cativa à primeira vista."
          />
          <CardContent
            icon={<Database size={26} weight="duotone" />}
            title="Back-end"
            description="Integrações estáveis, dados bem estruturados e bases técnicas prontas para crescer."
          />
          <CardContent
            icon={<Browser size={26} weight="duotone" />}
            title="UI/UX Design"
            description="Interfaces claras, bonitas e desenhadas para reduzir fricção em cada jornada."
          />
          <CardContent
            icon={<Shapes size={26} weight="duotone" />}
            title="Design Gráfico"
            description="Crie uma identidade visual que ressoa perfeitamente com a essência da sua marca."
          />
          <CardContent
            icon={<Strategy size={26} weight="duotone" />}
            title="Design de Produto"
            description="Desenvolvemos produtos com coesão impecável, cada um refletindo harmonia e propósito."
          />
          <CardContent
            icon={<PenNib size={26} weight="duotone" />}
            title="Copywriting"
            description="Textos diretos e estratégicos para comunicar valor e conduzir à ação."
          />
        </ServicesGrid>
      </ServicesContainer>
    </ServicesWrapper>
  )
}
