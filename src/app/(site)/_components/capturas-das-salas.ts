import type { StaticImageData } from "next/image"
import CaseUndergroundPB from "@/assets/case-undergroundpb-screenshot.webp"
import CaseUndergroundPBCelular780 from "@/assets/case-undergroundpb-celular-780.webp"
import CaseUndergroundPBCelular1170 from "@/assets/case-undergroundpb-celular-1170.webp"
import CaseFestivalAlumio from "@/assets/case-festival-alumio-screenshot.webp"
import CaseFestivalAlumioCelular780 from "@/assets/case-festival-alumio-celular-780.webp"
import CaseFestivalAlumioCelular1170 from "@/assets/case-festival-alumio-celular-1170.webp"
import CaseGoromax from "@/assets/case-goromax-screenshot.webp"
import CaseGoromaxCelular780 from "@/assets/case-goromax-celular-780.webp"
import CaseGoromaxCelular1170 from "@/assets/case-goromax-celular-1170.webp"
import CaseCarlosFerrer from "@/assets/case-carlos-ferrer-screenshot.webp"
import CaseCarlosFerrerCelular780 from "@/assets/case-carlos-ferrer-celular-780.webp"
import CaseCarlosFerrerCelular1170 from "@/assets/case-carlos-ferrer-celular-1170.webp"

/** Só o que o `<img>`/`<source>` usam de um import estático. */
export type ImagemEstatica = Pick<StaticImageData, "src" | "width" | "height">

/**
 * A Frente de uma sala: a captura desktop (1440 × 900) e o recorte do topo
 * da home no celular (390 px CSS de largura, DPR 3) em duas larguras. As
 * duas versões são capturas reais revisadas; origem, data, bytes e SHA-256
 * ficam em `scripts/portfolio/<slug>.md` e nos inventários de seleção.
 */
export type CapturaDaSalaDados = {
  dominio: string
  desktop: ImagemEstatica
  celular780: ImagemEstatica
  celular1170: ImagemEstatica
}

/**
 * Capturas por slug da sala, compartilhadas pela home e pelo portfólio.
 * Módulo só de servidor: os imports estáticos viram URLs e dimensões no
 * build, sem JS no cliente.
 */
export const CAPTURAS_DAS_SALAS: Partial<Record<string, CapturaDaSalaDados>> = {
  "underground-pb": {
    dominio: "undergroundpb.com.br",
    desktop: CaseUndergroundPB,
    celular780: CaseUndergroundPBCelular780,
    celular1170: CaseUndergroundPBCelular1170,
  },
  "festival-alumio": {
    dominio: "festivalalumio.com.br",
    desktop: CaseFestivalAlumio,
    celular780: CaseFestivalAlumioCelular780,
    celular1170: CaseFestivalAlumioCelular1170,
  },
  goromax: {
    dominio: "goromax.com.br",
    desktop: CaseGoromax,
    celular780: CaseGoromaxCelular780,
    celular1170: CaseGoromaxCelular1170,
  },
  "carlos-ferrer": {
    dominio: "carlosferrer.online",
    desktop: CaseCarlosFerrer,
    celular780: CaseCarlosFerrerCelular780,
    celular1170: CaseCarlosFerrerCelular1170,
  },
}
