"use client"

import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { deleteTask } from "@/actions/tasks.actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteTaskButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTask(taskId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Tâche supprimée.")
      }
    })
  }

  return (
    <DropdownMenuItem variant="destructive" disabled={isPending} onClick={handleDelete}>
      <Trash2 />
      Supprimer
    </DropdownMenuItem>
  )
}
