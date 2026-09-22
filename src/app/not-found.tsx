import type { Metadata } from "next"
import { PageFrame } from "@/app/_shared/page-frame"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Stack } from "@/components/ui/stack"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"

// Copy v1, seção 11 (404). O título completo sai do template do layout raiz:
// "Página não encontrada | Byte Criativo".
export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "Esta página não existe ou mudou de lugar. Veja os trabalhos, os serviços ou fale com a Byte Criativo sobre um projeto de site, plataforma ou sistema.",
}

export default function NotFound() {
  return (
    <PageFrame>
      <Container className="py-(--space-10)">
        <Stack espaco={6}>
          <Heading nivel={1}>Essa página não existe ou mudou de lugar.</Heading>
          {/* Copy v1: a primeira frase vale nas primeiras semanas após o
              lançamento; depois usar só "Estes caminhos levam ao que está no
              site:" (revisar três meses após o lançamento). */}
          <Text papel="lede" medida>
            O site da Byte Criativo mudou de estrutura, e alguns endereços
            antigos deixaram de existir. Estes caminhos continuam aqui:
          </Text>
          <Stack as="ul" espaco={3} rotulo="Caminhos do site">
            <li>
              <TextLink href="/" variante="acao">
                Ir para o início
              </TextLink>
            </li>
            <li>
              <TextLink href="/portfolio" variante="acao">
                Ver trabalhos
              </TextLink>
            </li>
            <li>
              <TextLink href="/servicos" variante="acao">
                Ver todos os serviços
              </TextLink>
            </li>
            <li>
              <Button href="/contato">Falar sobre um projeto</Button>
            </li>
          </Stack>
        </Stack>
      </Container>
    </PageFrame>
  )
}
