"use client"

import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteTask } from "@/actions/tasks.actions"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteTaskButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTask(taskId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Tâche supprimée.")
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
        title="Supprimer cette tâche ?"
        description="Cette action est irréversible."
        onConfirm={handleDelete}
        pending={isPending}
      />
    </>
  )
}
