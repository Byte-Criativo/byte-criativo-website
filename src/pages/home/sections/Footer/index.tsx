import Image from "next/image";
import { FooterCompany, FooterContainer, FooterContent, FooterMain, FooterMenu, FooterNetwork, MenuItem } from "./styles";
import MiniLogo from "@/src/assets/MiniLogo.png"
import { Link } from "@/src/components/Link";
import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

export function FooterSection() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterMain>
          <FooterCompany>
            <Image src={MiniLogo} alt="" width={80} />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</p>
          </FooterCompany>
          <FooterMenu>
            <li>
              <MenuItem href="">CASE</MenuItem>
            </li>
            <li>
             <MenuItem href="">SERVIÇOS</MenuItem>
            </li>
            <li>
              <MenuItem href="">QUEM SOMOS</MenuItem>
            </li>
            <li>
              <MenuItem href="">DÚVIDAS</MenuItem>
            </li>
          </FooterMenu>
        </FooterMain>
        <FooterNetwork>
          <p>Siga-nos</p>
          <div className="links">
            <Link href="https://instagram.com/bytecriativo" icon={<InstagramLogo size={24} weight="bold" />} />
            <Link href="https://www.linkedin.com/company/byte-criativo/" icon={<LinkedinLogo size={24} weight="bold" />} />
          </div>
        </FooterNetwork>
      </FooterContent>
    </FooterContainer>
  )
}