import { HighlightCard } from "@/src/components/HighlightCard"
import { CardsContainer } from "./styles"

export function CardsSection() {
  return (
    <CardsContainer>
      <HighlightCard
        title="Atuação Multidisciplinar"
        description="Contamos com especialistas em programação, design, UI/UX e copywriting."
      />
      <HighlightCard
        title="Produtos Personalizados"
        description="Nosso compromisso é encontrar a solução perfeita para o seu desafio."
      />
      <HighlightCard
        title="Assistência Contínua"
        description="Após a entrega do seu projeto, desfrute da tranquilidade com nosso suporte contínuo."
      />
    </CardsContainer>
  )
}
