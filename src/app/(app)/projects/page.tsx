import { FolderKanban } from "lucide-react"
import { redirect } from "next/navigation"

import { CreateProjectButton } from "@/components/projects/create-project-button"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectFilters } from "@/components/projects/project-filters"
import { AnimateIn } from "@/components/ui/animate-in"
import { EmptyState } from "@/components/ui/empty-state"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseEnumParam } from "@/lib/utils"
import { projectStatusValues } from "@/lib/validations/project.schema"

export default async function ProjectsPage(props: PageProps<"/projects">) {
  const searchParams = await props.searchParams
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const status = parseEnumParam(searchParams.status, projectStatusValues)

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
      ...(status && { status }),
    },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projets</h1>
          <p className="text-sm text-muted-foreground">
            Organisez votre travail par projet.
          </p>
        </div>

        <CreateProjectButton />
      </div>

      <ProjectFilters />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={status ? "Aucun projet ne correspond" : "Aucun projet pour l'instant"}
          description={
            status
              ? "Essayez d'ajuster votre filtre."
              : "Créez votre premier projet pour organiser vos tâches."
          }
          action={!status && <CreateProjectButton />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <AnimateIn key={project.id} index={index}>
              <ProjectCard project={project} />
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}
