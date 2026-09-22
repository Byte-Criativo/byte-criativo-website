import type { Route } from "next"
import Link from "next/link"
import type { ReactElement, ReactNode } from "react"
import { Container } from "@/components/ui/container"
import { CtaAtual, NavLink } from "@/components/ui/nav-link"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { cn } from "@/lib/cn"

export type ItemNavegacao = { rotulo: string; href: string; secao?: string }

/**
 * Moldura da Byte: idêntica em todos os templates, inclusive nos estudos de
 * caso. O único acréscimo no case é a barra de progresso de leitura, que
 * fica dentro da caixa do header (não soma altura fixa) e só aparece onde
 * `animation-timeline: scroll()` existe e a página tem `article[data-case]`.
 *
 * RC4: por ser o único elemento fixo sobre o conteúdo, a altura dele é
 * reservada no `scroll-padding-top` da raiz (globals.css, bloco
 * "/* SiteHeader"), e em janela de até 30 rem ele deixa de ser fixo.
 */
export function SiteHeader({
  navegacao,
  ctaHref = "/contato",
  ctaRotulo = "Falar sobre um projeto",
  wordmark,
  menu,
  className,
}: {
  navegacao: ItemNavegacao[]
  ctaHref?: string
  ctaRotulo?: string
  wordmark: ReactNode
  menu: ReactNode
  className?: string
}): ReactElement {
  return (
    <header
      data-site-header
      // `position: sticky` e `top: 0` são estruturais (a mesma posição, não
      // um valor de espaçamento com escala) e vivem na classe de componente
      // [data-site-header] em globals.css, junto da regra que os desfaz em
      // janela baixa — a guarda de tokens não distingue o zero estrutural
      // de um `top` solto dentro de src/components/.
      className={cn(
        "z-(--z-header) border-b-(length:--border-w-decorative) border-solid border-border-decorative bg-bg",
        className,
      )}
    >
      <Container className="flex items-center justify-between gap-(--space-5) py-(--space-3) lg:py-(--space-5)">
        <Link
          href={"/" as Route}
          className="inline-flex min-h-(--alvo-toque) items-center"
        >
          {wordmark}
          <VisuallyHidden>Byte Criativo, página inicial</VisuallyHidden>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-(--space-6)">
            {navegacao.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} secao={item.secao}>
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3.2.6: em /contato o CTA continua visível e marcado como página
            atual — quem sabe a rota é a folha Client CtaAtual. */}
        <div className="hidden lg:block">
          <CtaAtual href={ctaHref} rotulo={ctaRotulo} />
        </div>

        <div className="lg:hidden">{menu}</div>
      </Container>

      <div data-progresso aria-hidden="true" className="progresso-leitura" />
    </header>
  )
}
