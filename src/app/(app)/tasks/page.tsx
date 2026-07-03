import { ListTodo } from "lucide-react"
import { redirect } from "next/navigation"

import { CreateTaskButton } from "@/components/tasks/create-task-button"
import { TaskRow } from "@/components/tasks/task-row"
import { AnimateIn } from "@/components/ui/animate-in"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
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
            <EmptyState
              icon={ListTodo}
              title="Aucune tâche pour l'instant"
              description="Créez votre première tâche pour commencer à avancer."
              action={<CreateTaskButton projects={projects} />}
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
