import { HighlightCard } from "@/src/components/HighlightCard";
import { CardsContainer } from "./styles";

export function CardsSection() {
  return (
    <CardsContainer>
      <HighlightCard
        title="Equipe Multidisciplinar"
        description="Contamos com desenvolvedores de software, designers, especialistas em UI/UX e em Copywriting, todos prontos para transformar suas ideias em realidade."
      />
      <HighlightCard
        title="Produtos Personalizados"
        description="Nosso compromisso? Encontrar a solução perfeita para o seu desafio."
      />
      <HighlightCard
        title="Assistência Contínua"
        description="Após a entrega, desfrute da tranquilidade com nosso suporte contínuo."
      />
    </CardsContainer>
  );
}
