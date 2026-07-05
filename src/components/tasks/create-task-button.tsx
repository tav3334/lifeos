"use client"

import { Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { Button } from "@/components/ui/button"
import type { Project } from "@/generated/prisma/client"

export function CreateTaskButton({
  projects,
  defaultProjectId,
  size = "default",
}: {
  projects: Project[]
  defaultProjectId?: string
  size?: "default" | "sm"
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(
    () => pathname === "/tasks" && searchParams.get("new") === "1"
  )
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/tasks" && searchParams.get("new") === "1") {
      router.replace("/tasks")
    }
  }, [pathname, searchParams, router])

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <Plus />
        Nouvelle tâche
      </Button>
      <TaskFormDialog
        projects={projects}
        defaultProjectId={defaultProjectId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
