import Link from "next/link"
import { HeaderActions, HeaderContainer, NavArea, NavItem } from "./styles"
import { Button } from "../Button"
import { BurgerMenu } from "../BurgerMenu"
import Image from "next/image"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { navigationItems } from "@/src/content/home"
import { trackWhatsAppClick } from "@/src/lib/analytics"

export function Header() {
  return (
    <HeaderContainer>
      <Link
        className="logo"
        href="/"
        aria-label="Página inicial da Byte Criativo"
      >
        <Image
          className="logo-full"
          src="/logoByte.png"
          alt="Byte Criativo"
          width={216}
          height={39}
          priority
        />
        <Image
          className="logo-mini"
          src="/MiniLogo.png"
          alt="Byte Criativo"
          width={40}
          height={40}
        />
      </Link>

      <NavArea>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <NavItem href={item.href}>{item.label}</NavItem>
          </li>
        ))}
      </NavArea>

      <HeaderActions>
        <Button
          href={WHATSAPP_URL}
          className="button"
          target="_blank"
          onClick={() => trackWhatsAppClick("header")}
        >
          Agendar diagnóstico
        </Button>
        <BurgerMenu />
      </HeaderActions>
    </HeaderContainer>
  )
}
