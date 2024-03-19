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
import MiniLogo from "@/src/assets/MiniLogo.png"
import { Link } from "@/src/components/Link"
import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react"

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <FooterContainer>
      <FooterContent>
        <FooterMain>
          <FooterCompany>
            <Image src={MiniLogo} alt="" width={80} />
            <p>
              ❤️ <strong>Byte Criativo;</strong>
            </p>
            <p>© {year}. Todos os direitos reservados.</p>
            <p>CNPJ: 52.652.130/0001-02</p>
          </FooterCompany>
          <FooterMenu>
            <li>
              <MenuItem href="#cases">CASES</MenuItem>
            </li>
            <li>
              <MenuItem href="#services">SERVIÇOS</MenuItem>
            </li>
            <li>
              <MenuItem href="#team">QUEM SOMOS</MenuItem>
            </li>
            <li>
              <MenuItem href="#FAQ">DÚVIDAS</MenuItem>
            </li>
          </FooterMenu>
        </FooterMain>
        <FooterNetwork>
          <p>Siga-nos</p>
          <div className="links">
            <Link
              href="https://instagram.com/bytecriativo"
              icon={<InstagramLogo size={24} weight="bold" />}
            />
            <Link
              href="https://www.linkedin.com/company/byte-criativo/"
              icon={<LinkedinLogo size={24} weight="bold" />}
            />
          </div>
        </FooterNetwork>
      </FooterContent>
    </FooterContainer>
  )
}
