import { List, X } from "@phosphor-icons/react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  BurgerMenuContainer,
  ContactButton,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogTrigger,
  HiddenDescription,
  HiddenTitle,
  Menu,
  MenuItem,
} from "./styles"
import { useState } from "react"
import { WHATSAPP_URL } from "@/src/lib/contact"
import { navigationItems } from "@/src/content/home"
import { getSafeRel } from "@/src/lib/link-security"
import { trackWhatsAppClick } from "@/src/lib/analytics"

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
            <HiddenDescription>
              Navegue pelas seções do site ou fale com a Byte Criativo pelo
              WhatsApp.
            </HiddenDescription>
            <DialogClose aria-label="Fechar menu">
              <X size={32} weight="bold" aria-hidden />
            </DialogClose>
            <DialogBody>
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
                onClick={() => trackWhatsAppClick("menu")}
              >
                Agendar diagnóstico
              </ContactButton>
            </DialogBody>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    </BurgerMenuContainer>
  )
}
