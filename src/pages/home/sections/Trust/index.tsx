import { SectionTitle } from "@/src/components/SectionTitle"
import { trustSectionTitle, trustSignals } from "@/src/content/home"
import { TrustContainer, TrustContent, TrustGrid, TrustSignal } from "./styles"

export function TrustSection() {
  return (
    <TrustContainer>
      <TrustContent>
        <SectionTitle
          span={trustSectionTitle.eyebrow}
          heading={trustSectionTitle.heading}
        />
        <p>
          Um bom projeto digital precisa convencer o usuário, funcionar bem e
          continuar útil depois do lançamento. A Byte Criativo une essas frentes
          para que cada decisão de design e tecnologia tenha motivo comercial.
        </p>
      </TrustContent>
      <TrustGrid>
        {trustSignals.map((signal) => (
          <TrustSignal key={signal.value}>
            <strong>{signal.value}</strong>
            <span>{signal.label}</span>
          </TrustSignal>
        ))}
      </TrustGrid>
    </TrustContainer>
  )
}
