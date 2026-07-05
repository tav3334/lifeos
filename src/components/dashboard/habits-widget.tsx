import Link from "next/link"
import { Check, Repeat } from "lucide-react"

import { WeeklySparkline } from "@/components/dashboard/weekly-sparkline"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { getWeeklyHabitSummary } from "@/services/stats.service"

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"]

export async function HabitsWidget({ userId }: { userId: string }) {
  const summary = await getWeeklyHabitSummary(userId)

  const dailyTotals = Array.from({ length: 7 }, (_, dayIndex) =>
    summary.reduce((total, { days }) => total + (days[dayIndex]?.done ? 1 : 0), 0)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-success/10 text-success">
            <Repeat className="size-4" />
          </span>
          Suivi des habitudes
        </CardTitle>
        <CardDescription>Votre progression cette semaine.</CardDescription>
      </CardHeader>
      <CardContent>
        {summary.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="Aucune habitude suivie"
            description="Créez votre première habitude pour la suivre ici."
            className="border-none py-6"
          />
        ) : (
          <>
            <div className="mb-4">
              <WeeklySparkline values={dailyTotals} />
            </div>

            <ul className="flex flex-col gap-4">
              {summary.map(({ habit, days, completedCount }) => (
                <li key={habit.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{habit.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {completedCount}/{habit.targetPerWeek}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {days.map((day, index) => (
                      <div
                        key={day.date}
                        title={day.date}
                        className={cn(
                          "flex size-7 flex-1 items-center justify-center rounded-md border text-[10px] font-medium",
                          day.done
                            ? "border-transparent bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground",
                          day.isToday && !day.done && "border-ring"
                        )}
                      >
                        {day.done ? <Check className="size-3.5" /> : DAY_LABELS[index]}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <Link
          href="/habits"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
        >
          Voir toutes les habitudes
        </Link>
      </CardContent>
    </Card>
  )
}
