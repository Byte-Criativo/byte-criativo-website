import Link from "next/link"
import { HeaderContainer, NavArea, NavItem } from "./styles"
import { Button } from "../Button"
import { useEffect, useState } from "react"
import { BurgerMenu } from "../BurgerMenu"
import Image from "next/image"
import { WHATSAPP_URL } from "@/src/lib/contact"

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [resizeLogo, setResizeLogo] = useState(false)

  // header diminuindo junto com a tela
  useEffect(() => {
    const handleResize = () => {
      setShowBurgerMenu(window.innerWidth < 855)

      setResizeLogo(window.innerWidth < 400)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <HeaderContainer>
      <Link href="/" aria-label="Página inicial da Byte Criativo">
        {resizeLogo ? (
          <Image
            src="/MiniLogo.png"
            alt="Byte Criativo"
            width={40}
            height={40}
            priority
          />
        ) : (
          <Image
            src="/logoByte.png"
            alt="Byte Criativo"
            width={216}
            height={39}
            priority
          />
        )}
      </Link>
      {showBurgerMenu ? (
        <>
          <div />
          <BurgerMenu />
        </>
      ) : (
        <>
          <NavArea>
            <li>
              <NavItem href="/#cases">Cases</NavItem>
            </li>
            <li>
              <NavItem href="/#services">Serviços</NavItem>
            </li>
            <li>
              <NavItem href="/#FAQ">FAQ</NavItem>
            </li>
          </NavArea>
          <Button
            href={WHATSAPP_URL}
            className="button"
            target="_blank"
            rel="noreferrer"
          >
            Entre em contato
          </Button>
        </>
      )}
    </HeaderContainer>
  )
}
