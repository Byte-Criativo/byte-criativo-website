import { SectionTitle } from "@/src/components/SectionTitle";
import { ServicesContainer, ServicesGrid } from "./styles";
import { CardContent } from "@/src/components/CardContent";

export function ServicesSection() {
  return (
    <div style={{ paddingTop: "7.5rem" }} id="services">
      <ServicesContainer>
        <SectionTitle span="Nossos Serviços" heading="O que oferecemos?" />
        <ServicesGrid>
          <CardContent
            title="Front-end"
            description="Garanta um site deslumbrante e eficiente que cativa à primeira vista."
          />
          <CardContent
            title="Back-end"
            description="Garanta uma integração perfeita das informações, sem falhas, com nosso desenvolvimento back-end de elite"
          />
          <CardContent
            title="UI/UX Design"
            description="Desfrute de um layout encantador, meticulosamente desenhado para quem o navega."
          />
          <CardContent
            title="Design Gráfico"
            description="Crie uma identidade visual que ressoa perfeitamente com a essência da sua marca."
          />
          <CardContent
            title="Design de Produto"
            description="Desenvolvemos produtos com coesão impecável, cada um refletindo harmonia e propósito."
          />
          <CardContent
            title="Copywrite"
            description="Textos criados para catapultar o desempenho do seu site, elevando resultados."
          />
        </ServicesGrid>
      </ServicesContainer>
    </div>
  );
}
