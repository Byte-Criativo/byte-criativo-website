import { List, X } from "@phosphor-icons/react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  DialogClose,
  DialogContent,
  DialogTrigger,
  Menu,
  MenuItem,
} from "./styles"
import { useState } from "react"

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
          <Dialog.Description>
            <Menu>
              <MenuItem href="/#cases" onClick={handleToggleMenu}>
                Cases
              </MenuItem>
              <MenuItem href="/#services" onClick={handleToggleMenu}>
                Serviços
              </MenuItem>
              <MenuItem href="/#team" onClick={handleToggleMenu}>
                Equipe
              </MenuItem>
              <MenuItem href="/#FAQ" onClick={handleToggleMenu}>
                FAQ
              </MenuItem>
            </Menu>
          </Dialog.Description>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
