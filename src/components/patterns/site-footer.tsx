import type { ReactElement } from "react"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import { WhatsAppLink } from "./whatsapp-link"

export type ColunaRodape = {
  titulo: string
  itens: Array<{ rotulo: string; href: string }>
}

/**
 * Rodapé em quatro colunas e linha final. Não tem `aria-current`: o lugar
 * de marcar a página atual é o header.
 *
 * O componente **só renderiza o que recebe** — não há prop guardando cidade,
 * perfis sociais, Goromax ou Pomodoro, porque essas decisões do dono ainda
 * estão abertas (D3, D11, D12). Quando chegarem, o trabalho é acrescentar
 * uma coluna na fixture, nunca desfazer código.
 */
export function SiteFooter({
  tagline,
  razaoSocial,
  cnpj,
  colunas,
  email,
  whatsapp,
  copyright,
  navId = "navegacao-rodape",
}: {
  tagline: string
  razaoSocial: string
  cnpj: string
  colunas: ColunaRodape[]
  email: string
  whatsapp: { rotulo: string; mensagem: string }
  copyright: string
  navId?: string
}): ReactElement {
  return (
    <footer className="bg-bg text-ink">
      <Container className="pt-(--space-9)">
        {/* tabIndex -1: recebe o foco quando o link "Menu" sem JS chega
            aqui, sem entrar na ordem de Tab e sem desenhar anel. */}
        <nav
          id={navId}
          tabIndex={-1}
          aria-label="Rodapé"
          className="grid grid-cols-1 gap-(--space-7) md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="flex flex-col gap-(--space-2)">
            <Heading nivel={2} papel="h3" semicolon>
              {tagline}
            </Heading>
            <Text papel="caption" tom="muted">
              {razaoSocial}
            </Text>
            <Text papel="caption" tom="muted">
              {cnpj}
            </Text>
          </div>

          {colunas.map((coluna) => (
            <div key={coluna.titulo} className="flex flex-col gap-(--space-2)">
              <Heading nivel={2} papel="h3" className="text-caption">
                {coluna.titulo}
              </Heading>
              <ul className="flex flex-col gap-(--space-2)">
                {coluna.itens.map((item) => (
                  <li key={item.href}>
                    <TextLink
                      href={item.href}
                      variante="navegacao"
                      className="min-h-(--alvo-toque) lg:min-h-(--alvo-min)"
                    >
                      {item.rotulo}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-(--space-7) flex flex-wrap items-center gap-(--space-5) border-t-(length:--border-w-decorative) border-solid border-ink pt-(--space-5) pb-(--space-7)">
          <TextLink href={`mailto:${email}`} variante="acao">
            {email}
          </TextLink>
          <WhatsAppLink
            aparencia="texto"
            rotulo={whatsapp.rotulo}
            mensagem={whatsapp.mensagem}
            location="footer"
            context="rodape"
          />
          <Text papel="caption" tom="muted">
            {copyright}
          </Text>
        </div>
      </Container>
    </footer>
  )
}
