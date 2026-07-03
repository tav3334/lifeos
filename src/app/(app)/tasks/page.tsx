import { redirect } from "next/navigation"

import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { TaskRow } from "@/components/tasks/task-row"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TasksPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tâches</h1>
          <p className="text-sm text-muted-foreground">
            Toutes vos tâches, tous projets confondus.
          </p>
        </div>

        <CreateTaskButton projects={projects} />
      </div>

      <Card>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune tâche pour l&apos;instant. Créez-en une pour commencer.
            </p>
          ) : (
            <div>
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} projects={projects} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
