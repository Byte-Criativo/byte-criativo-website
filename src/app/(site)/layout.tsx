import type { ReactNode } from "react"
import { SkipLink } from "@/components/ui/skip-link"
import { BrandLogo } from "@/components/patterns/brand-logo"
import {
  SiteHeader,
  type ItemNavegacao,
} from "@/components/patterns/site-header"
import { MobileNav } from "@/components/patterns/mobile-nav"
import {
  SiteFooter,
  type ColunaRodape,
} from "@/components/patterns/site-footer"
import { getPublishedCases, getSiteConfig } from "@/content"

const WORDMARK = <BrandLogo />

export default function SiteLayout({ children }: { children: ReactNode }) {
  const site = getSiteConfig()
  const casesPublicados = new Set(
    getPublishedCases().map((estudo) => `/portfolio/${estudo.slug}`),
  )

  const navegacaoHeader: ItemNavegacao[] = site.navigation.main.map((item) => ({
    rotulo: item.label,
    href: item.href,
    secao: item.href,
  }))

  const navegacaoMobile: ItemNavegacao[] = site.navigation.mobile.map(
    (item) => ({
      rotulo: item.label,
      href: item.href,
      secao: item.href,
    }),
  )

  const colunasRodape: ColunaRodape[] = site.footer.columns
    .filter((col) => "links" in col && Array.isArray(col.links))
    .map((col) => ({
      titulo: col.title,
      itens: (col.links ?? [])
        .filter(
          (link) =>
            !link.href.startsWith("/portfolio/") ||
            casesPublicados.has(link.href),
        )
        .map((link) => ({
          rotulo: link.label,
          href: link.href,
        })),
    }))

  return (
    <>
      <SkipLink />
      <SiteHeader
        navegacao={navegacaoHeader}
        ctaHref={site.navigation.primaryCta.href}
        ctaRotulo={site.navigation.primaryCta.label}
        wordmark={WORDMARK}
        menu={
          <MobileNav
            navegacao={navegacaoMobile}
            ctaHref={site.navigation.primaryCta.href}
            ctaRotulo={site.navigation.primaryCta.label}
            whatsapp={{
              rotulo: "Chamar no WhatsApp",
              mensagem: site.contact.defaultWhatsappMessage,
            }}
            emailHref={`mailto:${site.contact.email}`}
            wordmark={WORDMARK}
            rodapeNavId="navegacao-rodape"
          />
        }
      />
      <main id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter
        tagline={site.tagline}
        razaoSocial={site.footer.columns[0]?.lines?.[0] ?? site.name}
        cnpj={`CNPJ ${site.taxId}`}
        colunas={colunasRodape}
        email={site.contact.email}
        whatsapp={{
          rotulo: `WhatsApp ${site.contact.whatsappDisplay}`,
          mensagem: site.contact.defaultWhatsappMessage,
        }}
        copyright={site.footer.copyright}
        navId="navegacao-rodape"
      />
    </>
  )
}
