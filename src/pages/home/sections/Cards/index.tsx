import { HighlightCard } from "@/src/components/HighlightCard";
import { CardsContainer } from "./styles";

export function CardsSection() {
  return (
    <CardsContainer>
      <HighlightCard title="Title" description="Description" />
      <HighlightCard title="Title" description="Description" />
      <HighlightCard title="Title" description="Description" />
    </CardsContainer>
  )
}