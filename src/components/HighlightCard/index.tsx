import { CardContent, CardContentProps } from "../CardContent"
import { CardContainer } from "./styles"

export function HighlightCard({ title, description, icon }: CardContentProps) {
  return (
    <CardContainer>
      <CardContent
        title={title}
        description={description}
        icon={icon}
        headingLevel="h2"
      />
    </CardContainer>
  )
}
