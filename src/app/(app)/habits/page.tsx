import { Repeat } from "lucide-react"
import { redirect } from "next/navigation"

import { CreateHabitButton } from "@/components/habits/create-habit-button"
import { HabitCard } from "@/components/habits/habit-card"
import { AnimateIn } from "@/components/ui/animate-in"
import { EmptyState } from "@/components/ui/empty-state"
import { auth } from "@/lib/auth"
import { getWeeklyHabitSummary } from "@/services/stats.service"

export default async function HabitsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const summaries = await getWeeklyHabitSummary(session.user.id)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Habitudes</h1>
          <p className="text-sm text-muted-foreground">
            Suivez votre régularité au quotidien.
          </p>
        </div>

        <CreateHabitButton />
      </div>

      {summaries.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="Aucune habitude suivie"
          description="Créez votre première habitude pour commencer à suivre votre régularité."
          action={<CreateHabitButton />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary, index) => (
            <AnimateIn key={summary.habit.id} index={index}>
              <HabitCard summary={summary} />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}
