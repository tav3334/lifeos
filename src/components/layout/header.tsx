import { Bell } from "lucide-react"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { CommandMenuTrigger } from "@/components/layout/command-menu-trigger"
import { UserMenu } from "@/components/layout/user-menu"

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <span className="text-sm font-medium text-muted-foreground md:hidden">LifeOS</span>
      <CommandMenuTrigger />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>

        <UserMenu
          name={session?.user?.name}
          email={session?.user?.email}
          image={session?.user?.image}
        />
      </div>
    </header>
  )
}
