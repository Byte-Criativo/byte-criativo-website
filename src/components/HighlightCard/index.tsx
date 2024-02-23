import { CardContent, CardContentProps } from "../CardContent"
import { CardContainer } from "./styles"

export function HighlightCard({ title, description }: CardContentProps) {
  return (
    <CardContainer>
      <CardContent title={title} description={description} />
    </CardContainer>
  )
}
