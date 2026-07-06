import { Link } from "@/src/components/Link"
import { SectionTitle } from "@/src/components/SectionTitle"
import { featuredCase, sectionIds } from "@/src/content/home"
import Image from "next/image"
import {
  CaseContent,
  CaseDescription,
  CasesContainer,
  CaseTags,
} from "./styles"

// @ts-expect-error Image import not typed
import CaseUndergroundPB from "@/src/assets/case-undergroundpb.png"
import { ArrowUpRight } from "@phosphor-icons/react"

export function CasesSection() {
  return (
    <CasesContainer id={sectionIds.cases}>
      <Image
        src={CaseUndergroundPB}
        alt={featuredCase.imageAlt}
        width={590}
        height={310}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <CaseContent>
        <SectionTitle
          span={featuredCase.eyebrow}
          heading={featuredCase.title}
        />
        <CaseTags>
          {featuredCase.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </CaseTags>
        <CaseDescription>{featuredCase.description}</CaseDescription>
        <Link href={featuredCase.href} icon={<ArrowUpRight size={24} />}>
          {featuredCase.linkLabel}
        </Link>
      </CaseContent>
    </CasesContainer>
  )
}
