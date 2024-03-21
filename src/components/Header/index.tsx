import Link from "next/link"
import { HeaderContainer, NavArea, NavItem } from "./styles"
import { Button } from "../Button"
import { useEffect, useState } from "react"
import { BurgerMenu } from "../BurgerMenu"

export function Header() {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false)
  const [resizeLogo, setResizeLogo] = useState(false)

  // header diminuindo junto com a tela
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 855
        ? setShowBurgerMenu(true)
        : setShowBurgerMenu(false)

      window.innerWidth < 400 ? setResizeLogo(true) : setResizeLogo(false)
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
          <img src="/MiniLogo.png" alt="Logo" width={40} height={40} />
        ) : (
          <img src="/logoByte.png" alt="Logo" />
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
              <NavItem href="/#team">Equipe</NavItem>
            </li>
            <li>
              <NavItem href="/#FAQ">FAQ</NavItem>
            </li>
          </NavArea>
          <Button href="mailto:oi@bytecriativo.com" className="button">
            Entre em contato
          </Button>
        </>
      )}
    </HeaderContainer>
  )
}
