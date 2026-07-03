import { redirect } from "next/navigation"

import { HabitsWidget } from "@/components/dashboard/habits-widget"
import { PriorityWidget } from "@/components/dashboard/priority-widget"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Voici un aperçu de votre journée.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PriorityWidget userId={session.user.id} />
        <HabitsWidget userId={session.user.id} />
      </div>
    </div>
  )
}
