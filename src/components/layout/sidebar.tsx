"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"

import { navItems } from "@/components/layout/nav-items"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <Link href="/dashboard" className="text-lg font-semibold">
          LifeOS
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("size-4", isActive && "text-primary")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
