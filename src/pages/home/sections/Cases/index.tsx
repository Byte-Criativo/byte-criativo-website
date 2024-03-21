import { Link } from "@/src/components/Link"
import { SectionTitle } from "@/src/components/SectionTitle"
import Image from "next/image"
import { CaseContent, CaseDescription, CasesContainer } from "./styles"

import MockupMaternite from "@/src/assets/mockup-maternite.png"
import { ArrowUpRight } from "@phosphor-icons/react"

export function CasesSection() {
  return (
    <CasesContainer id="cases">
      <Image src={MockupMaternite} alt="" width={590} />
      <CaseContent>
        <SectionTitle span="Nosso case" heading="Maternité" />
        <CaseDescription>
          Criamos uma identidade visual cativante, um site single-page
          intuitivo, e gerimos o conteúdo para um evento revolucionário. Com uma
          página de compra integrada, simplificamos a experiência do consumidor.
          Descubra agora.
        </CaseDescription>
        <Link href="#" icon={<ArrowUpRight size={24} />}>
          Ver mais
        </Link>
      </CaseContent>
    </CasesContainer>
  )
}
