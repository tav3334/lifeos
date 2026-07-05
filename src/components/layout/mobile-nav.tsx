"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navItems } from "@/components/layout/nav-items"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.15)] backdrop-blur-sm md:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium"
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-colors",
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
