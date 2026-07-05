"use client"

import { Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { Button } from "@/components/ui/button"

export function CreateProjectButton() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(() => searchParams.get("new") === "1")
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace("/projects")
    }
  }, [searchParams, router])

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
