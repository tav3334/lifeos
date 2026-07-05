import Link from "next/link"
import { Flame, PartyPopper } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { getPrioritizedTasks } from "@/services/priority-engine"
import type { PrioritizedTask, PriorityReason } from "@/types"

const REASON_LABELS: Record<PriorityReason, string> = {
  OVERDUE: "En retard",
  DUE_TODAY: "Aujourd'hui",
  DUE_SOON: "Bientôt",
  URGENT_PRIORITY: "Urgent",
  HIGH_PRIORITY: "Priorité haute",
}

const REASON_CLASSES: Record<PriorityReason, string> = {
  OVERDUE: "bg-destructive text-primary-foreground",
  URGENT_PRIORITY: "bg-destructive text-primary-foreground",
  DUE_TODAY: "bg-warning/25 text-warning",
  DUE_SOON: "bg-info/20 text-info",
  HIGH_PRIORITY: "bg-chart-4/25 text-chart-4",
}

function ReasonBadge({ reason }: { reason: PriorityReason }) {
  return <Badge className={REASON_CLASSES[reason]}>{REASON_LABELS[reason]}</Badge>
}

function TaskRow({ item }: { item: PrioritizedTask }) {
  const { task, reasons } = item

  return (
    <li className="flex items-start justify-between gap-3 border-b py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{task.title}</p>
        {task.project && (
          <p className="truncate text-xs text-muted-foreground">{task.project.name}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        {reasons.map((reason) => (
          <ReasonBadge key={reason} reason={reason} />
        ))}
      </div>
    </li>
  )
}

export async function PriorityWidget({ userId }: { userId: string }) {
  const prioritizedTasks = await getPrioritizedTasks(userId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Flame className="size-4" />
          </span>
          Que faire maintenant ?
        </CardTitle>
        <CardDescription>
          Vos tâches les plus urgentes, triées automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {prioritizedTasks.length === 0 ? (
          <EmptyState
            icon={PartyPopper}
            title="Tout est à jour"
            description="Aucune tâche en attente. Profitez-en !"
            className="border-none py-6"
          />
        ) : (
          <ul>
            {prioritizedTasks.map((item) => (
              <TaskRow key={item.task.id} item={item} />
            ))}
          </ul>
        )}

        <Link
          href="/tasks"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
        >
          Voir toutes les tâches
        </Link>
      </CardContent>
    </Card>
  )
}
