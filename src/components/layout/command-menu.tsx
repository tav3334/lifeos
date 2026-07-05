"use client"

import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Plus,
  Repeat,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export const OPEN_COMMAND_MENU_EVENT = "lifeos:open-command-menu"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    function handleOpenEvent() {
      setOpen(true)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener(OPEN_COMMAND_MENU_EVENT, handleOpenEvent)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener(OPEN_COMMAND_MENU_EVENT, handleOpenEvent)
    }
  }, [])

  function go(path: string) {
    router.push(path)
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Rechercher une page ou une action..." />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/projects")}>
            <FolderKanban />
            Projets
          </CommandItem>
          <CommandItem onSelect={() => go("/tasks")}>
            <ListTodo />
            Tâches
          </CommandItem>
          <CommandItem onSelect={() => go("/habits")}>
            <Repeat />
            Habitudes
          </CommandItem>
          <CommandItem onSelect={() => go("/profile")}>
            <User />
            Profil
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Créer">
          <CommandItem onSelect={() => go("/projects?new=1")}>
            <Plus />
            Nouveau projet
          </CommandItem>
          <CommandItem onSelect={() => go("/tasks?new=1")}>
            <CheckSquare />
            Nouvelle tâche
          </CommandItem>
          <CommandItem onSelect={() => go("/habits?new=1")}>
            <Plus />
            Nouvelle habitude
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-end border-t px-3 py-2">
        <CommandShortcut>Échap pour fermer</CommandShortcut>
      </div>
    </CommandDialog>
  )
}
