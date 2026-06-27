import Image from "next/image"
import {
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

export function FooterSection() {
  const year = new Date().getFullYear()

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
              <strong>Byte Criativo;</strong>
            </p>
            <p>CNPJ: 52.652.130/0001-02</p>
            <span className="contact">
              <p>{CONTACT_EMAIL}</p>
              {/* <div className="divisor" /> */}
              <div className="whatsapp">
                <p>{WHATSAPP_DISPLAY}</p>
                <Link href={WHATSAPP_URL} icon={<WhatsappLogo size={20} />} />
              </div>
            </span>
          </FooterCompany>
          <FooterMenu>
            <li>
              <MenuItem href="#cases">CASES</MenuItem>
            </li>
            <li>
              <MenuItem href="#services">SERVIÇOS</MenuItem>
            </li>
            <li>
              <MenuItem href="#FAQ">DÚVIDAS</MenuItem>
            </li>
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
              />
              <Link
                href={LINKEDIN_URL}
                icon={<LinkedinLogo size={24} weight="bold" />}
              />
            </div>
          </div>
        </FooterNetwork>
      </FooterContent>
    </FooterContainer>
  )
}
