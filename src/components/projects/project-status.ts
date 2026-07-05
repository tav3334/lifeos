import type { Project } from "@/generated/prisma/client"

export const PROJECT_STATUS_LABELS: Record<Project["status"], string> = {
  ACTIVE: "Actif",
  ON_HOLD: "En pause",
  COMPLETED: "Terminé",
  ARCHIVED: "Archivé",
}

export const PROJECT_STATUS_CLASSES: Record<Project["status"], string> = {
  ACTIVE: "bg-info/20 text-info",
  ON_HOLD: "bg-warning/25 text-warning",
  COMPLETED: "bg-success/20 text-success",
  ARCHIVED: "bg-muted text-muted-foreground",
}
