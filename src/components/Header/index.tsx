import Link from "next/link"
import {
  BurgerMenu,
  BurgerMenuButton,
  HeaderContainer,
  NavArea,
  NavItem,
} from "./styles"
import { Button } from "../Button"
import { useEffect, useState } from "react"
import { List } from "@phosphor-icons/react"

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false)

  function handleToggleBurgerMenu() {
    setBurgerMenuOpen(!burgerMenuOpen)
  }

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
        <>
          <BurgerMenuButton onClick={handleToggleBurgerMenu}>
            <List size={42} />
          </BurgerMenuButton>
          {burgerMenuOpen && (
            <BurgerMenu>
              <li>
                <NavItem href="/cases">Cases</NavItem>
              </li>
              <li>
                <NavItem href="/services">Serviços</NavItem>
              </li>
              <li>
                <NavItem href="/team">Equipe</NavItem>
              </li>
              <li>
                <NavItem href="/FAQ">FAQ</NavItem>
              </li>
            </BurgerMenu>
          )}
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
              <NavItem href="/#team">Equipe</NavItem>
            </li>
            <li>
              <NavItem href="/#FAQ">FAQ</NavItem>
            </li>
          </NavArea>
          <Button>Contate-nos</Button>
        </>
      )}
    </HeaderContainer>
  )
}
