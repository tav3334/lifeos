import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { CommandMenu } from "@/components/layout/command-menu"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          {children}
        </main>
        <MobileNav />
      </div>

      <CommandMenu />
    </div>
  )
}
