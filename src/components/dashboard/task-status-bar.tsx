import { ListChecks } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskStatusBreakdown } from "@/types"

const STATUS_LABELS: Record<TaskStatusBreakdown["status"], string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminées",
  CANCELLED: "Annulées",
}

const STATUS_COLORS: Record<TaskStatusBreakdown["status"], string> = {
  TODO: "var(--muted-foreground)",
  IN_PROGRESS: "var(--info)",
  DONE: "var(--success)",
  CANCELLED: "var(--destructive)",
}

export function TaskStatusBar({ breakdown }: { breakdown: TaskStatusBreakdown[] }) {
  const total = breakdown.reduce((sum, item) => sum + item.count, 0)

  if (total === 0) {
    return null
  }

  const gapPercent = 0.6
  const segments = breakdown.filter((item) => item.count > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-info/10 text-info">
            <ListChecks className="size-4" />
          </span>
          Répartition des tâches
        </CardTitle>
        <CardDescription>{total} tâche{total > 1 ? "s" : ""} au total.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-6 w-full overflow-hidden rounded-full" style={{ gap: `${gapPercent}%` }}>
          {segments.map((item) => {
            const widthPercent = (item.count / total) * 100
            return (
              <div
                key={item.status}
                className="h-full rounded-full"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: STATUS_COLORS[item.status],
                }}
                title={`${STATUS_LABELS[item.status]}: ${item.count}`}
              />
            )
          })}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {breakdown.map((item) => (
            <li key={item.status} className="flex items-center gap-1.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[item.status] }}
              />
              <span className="text-muted-foreground">{STATUS_LABELS[item.status]}</span>
              <span className="font-medium tabular-nums">{item.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
