import Link from "next/link"
import { HeaderContainer, NavArea, NavItem } from "./styles"
import { Button } from "../Button"
import { useEffect, useState } from "react"
import { BurgerMenu } from "../BurgerMenu"

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)

  // header diminuindo junto com a tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 855) {
        setShowBurgerMenu(true)
      } else {
        setShowBurgerMenu(false)
      }
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
        <img src="/logoByte.png" alt="Logo" />
      </Link>
      {showBurgerMenu ? (
        <BurgerMenu />
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
              <NavItem href="/#team">Equipe</NavItem>
            </li>
            <li>
              <NavItem href="/#FAQ">FAQ</NavItem>
            </li>
          </NavArea>
          <Button href="mailto:oi@bytecriativo.com">Entre em contato</Button>
        </>
      )}
    </HeaderContainer>
  )
}
