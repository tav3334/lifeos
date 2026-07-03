"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { Button } from "@/components/ui/button"

export function CreateProjectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Nouveau projet
      </Button>
      <ProjectFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
