import { Link } from "@/src/components/Link"
import { SectionTitle } from "@/src/components/SectionTitle"
import Image from "next/image"
import { CaseContent, CaseDescription, CasesContainer } from "./styles"

import MockupMaternite from "@/src/assets/Mockup.png"
import { ArrowUpRight } from "@phosphor-icons/react"

export function CasesSection() {
  return (
    <CasesContainer>
      <Image src={MockupMaternite} alt="" width={400} />
      <CaseContent>
        <SectionTitle span="Nosso case" heading="Maternité" />
        <CaseDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet t amet,
          consectetur adipis ing elit, sed do eiusmod tempor Lorem ipsum dolor
          sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore Lorem ipsum dolor sit amet.
        </CaseDescription>
        <Link href="#" icon={<ArrowUpRight size={24} />}>
          Ver mais
        </Link>
      </CaseContent>
    </CasesContainer>
  )
}
