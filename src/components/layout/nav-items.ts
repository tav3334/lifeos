import type { LucideIcon } from "lucide-react"
import { CheckSquare, LayoutDashboard, ListTodo, Repeat, User } from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projets", icon: ListTodo },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/habits", label: "Habitudes", icon: Repeat },
  { href: "/profile", label: "Profil", icon: User },
]
