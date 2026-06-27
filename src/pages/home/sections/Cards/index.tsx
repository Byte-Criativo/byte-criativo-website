import { HighlightCard } from "@/src/components/HighlightCard"
import { CardsContainer } from "./styles"
import { Lifebuoy, Shapes, Sparkle } from "@phosphor-icons/react"

export function CardsSection() {
  return (
    <CardsContainer>
      <HighlightCard
        icon={<Shapes size={26} weight="duotone" />}
        title="Estratégia Multidisciplinar"
        description="Contamos com especialistas em programação, design, UI/UX e copywriting."
      />
      <HighlightCard
        icon={<Sparkle size={26} weight="duotone" />}
        title="Soluções Sob Medida"
        description="Nosso compromisso é encontrar a solução perfeita para o seu desafio."
      />
      <HighlightCard
        icon={<Lifebuoy size={26} weight="duotone" />}
        title="Suporte Evolutivo"
        description="Após a entrega do seu projeto, desfrute da tranquilidade com nosso suporte contínuo."
      />
    </CardsContainer>
  )
}
