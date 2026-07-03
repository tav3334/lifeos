"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navItems } from "@/components/layout/nav-items"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background md:hidden">
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
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
