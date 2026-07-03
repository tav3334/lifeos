"use client"

import { useActionState } from "react"
import { toast } from "sonner"

import { createTask, updateTask, type TaskFormState } from "@/actions/tasks.actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Project, Task } from "@/generated/prisma/client"

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
}

const STATUS_LABELS: Record<Task["status"], string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
}

const initialState: TaskFormState = {}

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return ""
  return date.toISOString().slice(0, 10)
}

type TaskFormDialogProps = {
  task?: Task
  projects: Project[]
  defaultProjectId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskFormDialog({
  task,
  projects,
  defaultProjectId,
  open,
  onOpenChange,
}: TaskFormDialogProps) {
  const baseAction = task ? updateTask.bind(null, task.id) : createTask

  async function action(
    prevState: TaskFormState,
    formData: FormData
  ): Promise<TaskFormState> {
    const result = await baseAction(prevState, formData)
    if (result.success) {
      onOpenChange(false)
      toast.success(task ? "Tâche mise à jour." : "Tâche créée.")
    }
    return result
  }

  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" defaultValue={task?.title} required />
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={task?.description ?? ""}
              rows={3}
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select name="status" defaultValue={task?.status ?? "TODO"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dueDate">Échéance</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={toDateInputValue(task?.dueDate)}
            />
            {state.errors?.dueDate && (
              <p className="text-sm text-destructive">{state.errors.dueDate[0]}</p>
            )}
          </div>

          {projects.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="projectId">Projet</Label>
              <Select
                name="projectId"
                defaultValue={task?.projectId ?? defaultProjectId ?? ""}
              >
                <SelectTrigger id="projectId" className="w-full">
                  <SelectValue placeholder="Aucun projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun projet</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.projectId && (
                <p className="text-sm text-destructive">{state.errors.projectId[0]}</p>
              )}
            </div>
          )}

          {state.message && <p className="text-sm text-destructive">{state.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
