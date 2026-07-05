"use client"

import { Search } from "lucide-react"

import { OPEN_COMMAND_MENU_EVENT } from "@/components/layout/command-menu"
import { Button } from "@/components/ui/button"

export function CommandMenuTrigger() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden text-muted-foreground sm:flex"
      onClick={() => document.dispatchEvent(new CustomEvent(OPEN_COMMAND_MENU_EVENT))}
    >
      <Search />
      Rechercher
      <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
        ⌘K
      </kbd>
    </Button>
  )
}
