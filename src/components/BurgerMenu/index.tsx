import { List, X } from "@phosphor-icons/react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  BurgerMenuContainer,
  ContactButton,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  Menu,
  MenuItem,
} from "./styles"
import { useState } from "react"
import { WHATSAPP_URL } from "@/src/lib/contact"

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
        <DialogTrigger>
          <List size={32} weight="bold" />
        </DialogTrigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <DialogContent>
            <DialogClose>
              <X size={32} weight="bold" />
            </DialogClose>
            <DialogDescription>
              <Menu>
                <MenuItem href="/#cases" onClick={handleToggleMenu}>
                  Cases
                </MenuItem>
                <MenuItem href="/#services" onClick={handleToggleMenu}>
                  Serviços
                </MenuItem>
                <MenuItem href="/#FAQ" onClick={handleToggleMenu}>
                  FAQ
                </MenuItem>
              </Menu>
              <ContactButton
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
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
