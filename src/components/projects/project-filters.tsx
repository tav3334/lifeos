"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { PROJECT_STATUS_LABELS } from "@/components/projects/project-status"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projectStatusValues } from "@/lib/validations/project.schema"

export function ProjectFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setStatus(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete("status")
    } else {
      params.set("status", value)
    }
    router.push(`/projects?${params.toString()}`)
  }

  return (
    <Select value={searchParams.get("status") ?? "all"} onValueChange={setStatus}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les statuts</SelectItem>
        {projectStatusValues.map((status) => (
          <SelectItem key={status} value={status}>
            {PROJECT_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
