"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { HabitFormDialog } from "@/components/habits/habit-form-dialog"
import { Button } from "@/components/ui/button"

export function CreateHabitButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Nouvelle habitude
      </Button>
      <HabitFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
