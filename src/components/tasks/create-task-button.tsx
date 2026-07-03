"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { Button } from "@/components/ui/button"
import type { Project } from "@/generated/prisma/client"

export function CreateTaskButton({
  projects,
  defaultProjectId,
  size = "default",
}: {
  projects: Project[]
  defaultProjectId?: string
  size?: "default" | "sm"
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <Plus />
        Nouvelle tâche
      </Button>
      <TaskFormDialog
        projects={projects}
        defaultProjectId={defaultProjectId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
