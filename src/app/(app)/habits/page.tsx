import { redirect } from "next/navigation"

import { CreateHabitButton } from "@/components/habits/create-habit-button"
import { HabitCard } from "@/components/habits/habit-card"
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
        <p className="text-sm text-muted-foreground">
          Aucune habitude pour l&apos;instant. Créez-en une pour commencer.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => (
            <HabitCard key={summary.habit.id} summary={summary} />
          ))}
        </div>
      )}
    </div>
  )
}
