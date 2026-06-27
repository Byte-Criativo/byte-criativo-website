import { Link } from "@/src/components/Link"
import { SectionTitle } from "@/src/components/SectionTitle"
import Image from "next/image"
import {
  CaseContent,
  CaseDescription,
  CasesContainer,
  CaseTags,
} from "./styles"

import CaseUndergroundPB from "@/src/assets/case-undergroundpb.png"
import { ArrowUpRight } from "@phosphor-icons/react"

export function CasesSection() {
  return (
    <CasesContainer id="cases">
      <Image
        src={CaseUndergroundPB}
        alt="Preview do site Underground PB"
        width={590}
        height={310}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <CaseContent>
        <SectionTitle span="Case autoral" heading="Underground PB" />
        <CaseTags>
          <span>Plataforma cultural</span>
          <span>Agenda & bandas</span>
          <span>PWA</span>
        </CaseTags>
        <CaseDescription>
          Desenvolvido por mim, o Underground PB reúne a cena alternativa e
          independente da Paraíba em uma plataforma viva: catálogo de bandas,
          agenda de shows, notícias, memória da cena, playlist integrada,
          cadastro de artistas e contribuição para manter o projeto ativo. Um
          produto cultural pensado para descoberta, participação e
          fortalecimento da comunidade underground paraibana.
        </CaseDescription>
        <Link
          href="https://www.undergroundpb.com.br/"
          icon={<ArrowUpRight size={24} />}
        >
          Acessar site
        </Link>
      </CaseContent>
    </CasesContainer>
  )
}
