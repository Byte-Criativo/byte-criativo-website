import { List, X } from "@phosphor-icons/react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  BurgerMenuContainer,
  ContactButton,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  HiddenTitle,
  Menu,
  MenuItem,
} from "./styles"
import { useState } from "react"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { navigationItems } from "@/src/content/home"
import { getSafeRel } from "@/src/lib/link-security"

export function BurgerMenu() {
  const [open, setOpen] = useState(false)

  function handleToggleMenu() {
    if (open === false) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  return (
    <BurgerMenuContainer>
      <Dialog.Root open={open} onOpenChange={handleToggleMenu}>
        <DialogTrigger aria-label="Abrir menu">
          <List size={32} weight="bold" aria-hidden />
        </DialogTrigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <DialogContent>
            <HiddenTitle>Menu de navegação</HiddenTitle>
            <DialogClose aria-label="Fechar menu">
              <X size={32} weight="bold" aria-hidden />
            </DialogClose>
            <DialogDescription>
              <Menu>
                {navigationItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    href={item.href}
                    onClick={handleToggleMenu}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ContactButton
                href={WHATSAPP_URL}
                target="_blank"
                rel={getSafeRel("_blank")}
              >
                Entre em contato
              </ContactButton>
            </DialogDescription>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    </BurgerMenuContainer>
  )
}
