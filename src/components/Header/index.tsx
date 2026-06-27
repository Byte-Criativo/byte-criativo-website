import Link from "next/link"
import { HeaderContainer, NavArea, NavItem } from "./styles"
import { Button } from "../Button"
import { useEffect, useState } from "react"
import { BurgerMenu } from "../BurgerMenu"
import Image from "next/image"

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
      <Link href="#">
        {resizeLogo ? (
          <Image src="/MiniLogo.png" alt="Logo" width={40} height={40} />
        ) : (
          <Image src="/logoByte.png" alt="Logo" width={216} height={39} />
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
          <Button href="mailto:contato@bcriativo.com" className="button">
            Entre em contato
          </Button>
        </>
      )}
    </HeaderContainer>
  )
}
