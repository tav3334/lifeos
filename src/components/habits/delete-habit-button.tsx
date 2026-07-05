"use client"

import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteHabit } from "@/actions/habits.actions"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteHabitButton({ habitId }: { habitId: string }) {
  const [isPending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteHabit(habitId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Habitude supprimée.")
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
        title="Supprimer cette habitude ?"
        description="Cette action est irréversible et supprimera aussi tout son historique de suivi."
        onConfirm={handleDelete}
        pending={isPending}
      />
    </>
  )
}
