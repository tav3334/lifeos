"use client"

import { Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { HabitFormDialog } from "@/components/habits/habit-form-dialog"
import { Button } from "@/components/ui/button"

export function CreateHabitButton() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(() => searchParams.get("new") === "1")
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace("/habits")
    }
  }, [searchParams, router])

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
