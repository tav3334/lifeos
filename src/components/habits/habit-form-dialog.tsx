"use client"

import { useActionState } from "react"
import { toast } from "sonner"

import { createHabit, updateHabit, type HabitFormState } from "@/actions/habits.actions"
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
import { Textarea } from "@/components/ui/textarea"
import type { Habit } from "@/generated/prisma/client"

const initialState: HabitFormState = {}

type HabitFormDialogProps = {
  habit?: Habit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HabitFormDialog({ habit, open, onOpenChange }: HabitFormDialogProps) {
  const baseAction = habit ? updateHabit.bind(null, habit.id) : createHabit

  async function action(
    prevState: HabitFormState,
    formData: FormData
  ): Promise<HabitFormState> {
    const result = await baseAction(prevState, formData)
    if (result.success) {
      onOpenChange(false)
      toast.success(habit ? "Habitude mise à jour." : "Habitude créée.")
    }
    return result
  }

  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "Modifier l'habitude" : "Nouvelle habitude"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" defaultValue={habit?.name} required />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={habit?.description ?? ""}
              rows={3}
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="targetPerWeek">Objectif par semaine</Label>
            <Input
              id="targetPerWeek"
              name="targetPerWeek"
              type="number"
              min={1}
              max={7}
              defaultValue={habit?.targetPerWeek ?? 7}
              required
            />
            {state.errors?.targetPerWeek && (
              <p className="text-sm text-destructive">{state.errors.targetPerWeek[0]}</p>
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
