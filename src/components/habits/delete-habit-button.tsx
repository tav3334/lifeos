"use client"

import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { deleteHabit } from "@/actions/habits.actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function DeleteHabitButton({ habitId }: { habitId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteHabit(habitId)
      if (result.message) {
        toast.error(result.message)
      } else {
        toast.success("Habitude supprimée.")
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
