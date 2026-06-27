import { HighlightCard } from "@/src/components/HighlightCard"
import { highlightCards } from "@/src/content/home"
import { CardsContainer } from "./styles"
import { Lifebuoy, Shapes, Sparkle } from "@phosphor-icons/react"

const highlightIcons = {
  lifebuoy: <Lifebuoy size={26} weight="duotone" />,
  shapes: <Shapes size={26} weight="duotone" />,
  sparkle: <Sparkle size={26} weight="duotone" />,
} as const

export function CardsSection() {
  return (
    <CardsContainer>
      {highlightCards.map((card) => (
        <HighlightCard
          key={card.title}
          icon={highlightIcons[card.icon]}
          title={card.title}
          description={card.description}
        />
      ))}
    </CardsContainer>
  )
}
