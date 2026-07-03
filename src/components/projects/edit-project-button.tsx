"use client"

import { Pencil } from "lucide-react"
import { useState } from "react"

import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { Button } from "@/components/ui/button"
import type { Project } from "@/generated/prisma/client"

export function EditProjectButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil />
        Modifier
      </Button>
      <ProjectFormDialog project={project} open={open} onOpenChange={setOpen} />
    </>
  )
}
