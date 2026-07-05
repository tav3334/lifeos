import { ListTodo } from "lucide-react"
import { notFound, redirect } from "next/navigation"

import { EditProjectButton } from "@/components/projects/edit-project-button"
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_LABELS } from "@/components/projects/project-status"
import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { TaskRow } from "@/components/tasks/task-row"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ProjectDetailPage(props: PageProps<"/projects/[projectId]">) {
  const { projectId } = await props.params

  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [project, projects] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      include: { tasks: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ])

  if (!project) {
    notFound()
  }

  const tasksWithProject = project.tasks.map((task) => ({ ...task, project }))

  const doneCount = project.tasks.filter((task) => task.status === "DONE").length
  const totalCount = project.tasks.length
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2 sm:space-y-0">
          <div className="min-w-0">
            <CardTitle className="text-xl break-words">{project.name}</CardTitle>
            <Badge className={`mt-2 ${PROJECT_STATUS_CLASSES[project.status]}`}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>

          <EditProjectButton project={project} />
        </CardHeader>
        <CardContent>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>
                {doneCount}/{totalCount} tâches
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-base">Tâches</CardTitle>
          <CreateTaskButton projects={projects} defaultProjectId={project.id} size="sm" />
        </CardHeader>
        <CardContent>
          {project.tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="Aucune tâche dans ce projet"
              description="Ajoutez une tâche pour commencer à avancer."
              action={
                <CreateTaskButton projects={projects} defaultProjectId={project.id} />
              }
              className="border-none py-8"
            />
          ) : (
            <div>
              {tasksWithProject.map((task) => (
                <TaskRow key={task.id} task={task} projects={projects} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
