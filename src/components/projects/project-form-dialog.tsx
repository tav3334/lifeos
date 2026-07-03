"use client"

import { useActionState } from "react"
import { toast } from "sonner"

import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/actions/projects.actions"
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
import type { Project } from "@/generated/prisma/client"

const STATUS_LABELS: Record<Project["status"], string> = {
  ACTIVE: "Actif",
  ON_HOLD: "En pause",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé",
}

const initialState: ProjectFormState = {}

type ProjectFormDialogProps = {
  project?: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectFormDialog({ project, open, onOpenChange }: ProjectFormDialogProps) {
  const baseAction = project ? updateProject.bind(null, project.id) : createProject

  async function action(
    prevState: ProjectFormState,
    formData: FormData
  ): Promise<ProjectFormState> {
    const result = await baseAction(prevState, formData)
    if (result.success) {
      onOpenChange(false)
      toast.success(project ? "Projet mis à jour." : "Projet créé.")
    }
    return result
  }

  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={project?.name} required />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description ?? ""}
              rows={3}
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={project?.status ?? "ACTIVE"}>
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
            {state.errors?.status && (
              <p className="text-sm text-destructive">{state.errors.status[0]}</p>
            )}
          </div>

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
