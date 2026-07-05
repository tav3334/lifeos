import { redirect } from "next/navigation"

import { HabitsWidget } from "@/components/dashboard/habits-widget"
import { OverviewCard } from "@/components/dashboard/overview-card"
import { PriorityWidget } from "@/components/dashboard/priority-widget"
import { TaskStatusBar } from "@/components/dashboard/task-status-bar"
import { auth } from "@/lib/auth"
import { getTaskOverviewStats, getTaskStatusBreakdown } from "@/services/stats.service"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [overviewStats, statusBreakdown] = await Promise.all([
    getTaskOverviewStats(session.user.id),
    getTaskStatusBreakdown(session.user.id),
  ])

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

      <div className="grid gap-4 lg:grid-cols-3">
        <OverviewCard
          pendingCount={overviewStats.pendingCount}
          overdueCount={overviewStats.overdueCount}
          doneTodayCount={overviewStats.doneTodayCount}
        />
        <TaskStatusBar breakdown={statusBreakdown} />
        <HabitsWidget userId={session.user.id} />
      </div>

      <PriorityWidget userId={session.user.id} />
    </div>
  )
}
