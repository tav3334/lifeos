"use client"

import { MoreVertical, Pencil } from "lucide-react"
import { useState, useTransition } from "react"

import { toggleTaskStatus } from "@/actions/tasks.actions"
import { DeleteTaskButton } from "@/components/tasks/delete-task-button"
import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Project, Task } from "@/generated/prisma/client"

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${date.getFullYear()}`
}

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

const PRIORITY_CLASSES: Record<Task["priority"], string> = {
  LOW: "bg-info/15 text-info",
  MEDIUM: "bg-warning/15 text-warning",
  HIGH: "bg-chart-4/20 text-chart-4",
  URGENT: "bg-destructive/15 text-destructive",
}

type TaskWithProject = Task & { project: Project | null }

export function TaskRow({
  task,
  projects,
}: {
  task: TaskWithProject
  projects: Project[]
}) {
  const [isPending, startTransition] = useTransition()
  const [editOpen, setEditOpen] = useState(false)
  const isDone = task.status === "DONE"

  function handleToggle() {
    startTransition(() => {
      toggleTaskStatus(task.id, isDone ? "TODO" : "DONE")
    })
  }

  return (
    <div className="-mx-2 flex items-start gap-3 rounded-lg border-b px-2 py-3 transition-colors last:border-b-0 hover:bg-muted/50">
      <Checkbox
        checked={isDone}
        onCheckedChange={handleToggle}
        disabled={isPending}
        className="mt-1"
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium transition-colors duration-200",
            isDone && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge className={PRIORITY_CLASSES[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
          {task.project && <Badge variant="outline">{task.project.name}</Badge>}
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil />
            Modifier
          </DropdownMenuItem>
          <DeleteTaskButton taskId={task.id} />
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskFormDialog
        task={task}
        projects={projects}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
