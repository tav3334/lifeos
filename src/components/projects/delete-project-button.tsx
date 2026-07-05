"use client"

import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteProject } from "@/actions/projects.actions"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Projet supprimé.")
        setConfirmOpen(false)
      }
    })
  }

  return (
    <>
      <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
        <Trash2 />
        Supprimer
      </DropdownMenuItem>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce projet ?"
        description="Cette action est irréversible. Les tâches liées à ce projet ne seront pas supprimées, mais elles n'appartiendront plus à aucun projet."
        onConfirm={handleDelete}
        pending={isPending}
      />
    </>
  )
}
