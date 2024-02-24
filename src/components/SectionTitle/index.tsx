import {
  SectionTitleContainer,
  SectionTitleHeading,
  SectionTitleSpan,
} from "./styles"

interface SectionTitleProps {
  heading: string
  span: string
}

export function SectionTitle({ heading, span }: SectionTitleProps) {
  return (
    <SectionTitleContainer>
      <SectionTitleSpan>{span}</SectionTitleSpan>
      <SectionTitleHeading>{heading}</SectionTitleHeading>
    </SectionTitleContainer>
  )
}
