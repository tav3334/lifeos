"use client"

import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { deleteProject } from "@/actions/projects.actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Projet supprimé.")
      }
    })
  }

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 />
      Supprimer
    </DropdownMenuItem>
  )
}
