import Link from "next/link"
import { HeaderContainer, NavArea, NavItem } from "./styles"

export function Header() {
  return (
    <HeaderContainer>
      <Link href="#">
        <img src="/logoByte.png" alt="Logo" />
      </Link>
      <NavArea>
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
      </NavArea>
      <button>Contate-nos</button>
    </HeaderContainer>
  )
}
