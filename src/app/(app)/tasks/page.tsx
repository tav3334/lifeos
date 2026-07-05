import { ListTodo } from "lucide-react"
import { redirect } from "next/navigation"

import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskRow } from "@/components/tasks/task-row"
import { AnimateIn } from "@/components/ui/animate-in"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import type { Prisma } from "@/generated/prisma/client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseEnumParam } from "@/lib/utils"
import { taskPriorityValues, taskStatusValues } from "@/lib/validations/task.schema"

export default async function TasksPage(props: PageProps<"/tasks">) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const status = parseEnumParam(searchParams.status, taskStatusValues)
  const priority = parseEnumParam(searchParams.priority, taskPriorityValues)
  const projectId = typeof searchParams.projectId === "string" ? searchParams.projectId : undefined

  const where: Prisma.TaskWhereInput = {
    userId: session.user.id,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(projectId && { projectId }),
  }

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ])

  const hasFilters = Boolean(status || priority || projectId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tâches</h1>
          <p className="text-sm text-muted-foreground">
            Toutes vos tâches, tous projets confondus.
          </p>
        </div>

        <CreateTaskButton projects={projects} />
      </div>

      <TaskFilters projects={projects} />

      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title={hasFilters ? "Aucune tâche ne correspond" : "Aucune tâche pour l'instant"}
              description={
                hasFilters
                  ? "Essayez d'ajuster vos filtres."
                  : "Créez votre première tâche pour commencer à avancer."
              }
              action={!hasFilters && <CreateTaskButton projects={projects} />}
              className="border-none py-8"
            />
          ) : (
            <div>
              {tasks.map((task, index) => (
                <AnimateIn key={task.id} index={index}>
                  <TaskRow task={task} projects={projects} />
                </AnimateIn>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
