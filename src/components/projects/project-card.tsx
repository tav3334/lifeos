"use client"

import Link from "next/link"
import { MoreVertical, Pencil } from "lucide-react"
import { useState } from "react"

import { DeleteProjectButton } from "@/components/projects/delete-project-button"
import { ProjectFormDialog } from "@/components/projects/project-form-dialog"
import { PROJECT_STATUS_CLASSES, PROJECT_STATUS_LABELS } from "@/components/projects/project-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Project } from "@/generated/prisma/client"
import { cn } from "@/lib/utils"

type ProjectWithTaskCount = Project & {
  _count: { tasks: number }
}

export function ProjectCard({ project }: { project: ProjectWithTaskCount }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div className="min-w-0">
          <CardTitle className="truncate">
            <Link href={`/projects/${project.id}`} className="hover:underline">
              {project.name}
            </Link>
          </CardTitle>
          <Badge className={cn("mt-2", PROJECT_STATUS_CLASSES[project.status])}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil />
              Modifier
            </DropdownMenuItem>
            <DeleteProjectButton projectId={project.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          {project._count.tasks} tâche{project._count.tasks > 1 ? "s" : ""}
        </p>
      </CardContent>

      <ProjectFormDialog project={project} open={editOpen} onOpenChange={setEditOpen} />
    </Card>
  )
}
