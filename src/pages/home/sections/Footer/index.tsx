import { useState } from "react"
import Image from "next/image"
import { footerNavigationItems } from "@/src/content/home"
import {
  CopyEmailButton,
  FooterCompany,
  FooterContainer,
  FooterContent,
  FooterMain,
  FooterMenu,
  FooterNetwork,
  MenuItem,
} from "./styles"
import { Link } from "@/src/components/Link"
import {
  Check,
  Copy,
  InstagramLogo,
  LinkedinLogo,
  WhatsappLogo,
} from "@phosphor-icons/react"
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"

export function FooterSection() {
  const year = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Área de transferência indisponível — ignora silenciosamente.
    }
  }

  return (
    <FooterContainer>
      <FooterContent>
        <FooterMain>
          <FooterCompany>
            <Image
              src="/MiniLogo.png"
              alt="Byte Criativo"
              width={80}
              height={80}
            />
            <p>
              <strong>Byte Criativo</strong>
            </p>
            <p>CNPJ: 52.652.130/0001-02</p>
            <span className="contact">
              <div className="email">
                <p>{CONTACT_EMAIL}</p>
                <CopyEmailButton
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "E-mail copiado" : "Copiar e-mail"}
                >
                  {copied ? (
                    <Check size={18} weight="bold" />
                  ) : (
                    <Copy size={18} />
                  )}
                </CopyEmailButton>
              </div>
              <div className="whatsapp">
                <p>{WHATSAPP_DISPLAY}</p>
                <Link
                  href={WHATSAPP_URL}
                  icon={<WhatsappLogo size={20} />}
                  aria-label="Falar com a Byte Criativo pelo WhatsApp"
                  onClick={() => trackWhatsAppClick("footer")}
                />
              </div>
            </span>
          </FooterCompany>
          <FooterMenu>
            {footerNavigationItems.map((item) => (
              <li key={item.href}>
                <MenuItem href={item.href}>{item.label}</MenuItem>
              </li>
            ))}
          </FooterMenu>
        </FooterMain>
        <FooterNetwork>
          <p>© {year}. Todos os direitos reservados.</p>

          <div className="followUs">
            <p>Siga-nos</p>
            <div className="links">
              <Link
                href={INSTAGRAM_URL}
                icon={<InstagramLogo size={24} weight="bold" />}
                aria-label="Acessar Instagram da Byte Criativo"
              />
              <Link
                href={LINKEDIN_URL}
                icon={<LinkedinLogo size={24} weight="bold" />}
                aria-label="Acessar LinkedIn da Byte Criativo"
              />
            </div>
          </div>
        </FooterNetwork>
      </FooterContent>
    </FooterContainer>
  )
}
